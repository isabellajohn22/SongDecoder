/**
 * POST /api/analyze - Track Analysis Endpoint
 * ============================================================================
 * Analyzes a track by name and artist using Last.fm data and returns:
 * - Track metadata
 * - Audio fingerprint (estimated from tags)
 * - Deterministic explanation
 * - Similar track recommendations
 *
 * Request Body:
 * - track: Track name (required)
 * - artist: Artist name (recommended for accuracy)
 * ============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { analyzeRequestSchema } from '@/lib/validation';
import { analyzeTrack } from '@/lib/services';
import { LastFmApiError } from '@/lib/lastfm/client';
import { db } from '@/lib/db';
import { normalizeTrackKey } from '@/lib/db-utils';

/**
 * Handles POST requests to analyze a track.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request with Zod
    const validated = analyzeRequestSchema.parse(body);

    // Normalize track key for caching. Different queries produce different keys:
    // "track only" vs "artist::track" hit separate cache entries.
    // This means imprecise searches might re-analyze, but ensures cache accuracy.
    const trackKey = normalizeTrackKey(validated.artist || 'Unknown Artist', validated.track);

    // Check cache if database is available
    if (db) {
      try {
        const cachedAnalysis = await db.trackAnalysisCache.findUnique({
          where: { trackKey },
        });

        // Return cached result if it exists and hasn't expired
        if (cachedAnalysis && cachedAnalysis.expiresAt > new Date()) {
          // Update last accessed timestamp
          await db.trackAnalysisCache.update({
            where: { id: cachedAnalysis.id },
            data: { lastAccessedAt: new Date() },
          });

          return NextResponse.json(cachedAnalysis.analysisJson, { status: 200 });
        }
      } catch (dbError) {
        // Log database errors but continue with analysis
        console.warn('Database cache check failed:', dbError);
      }
    }

    // Perform analysis using Last.fm
    const analysis = await analyzeTrack(validated.track, validated.artist);

    // Cache the result if database is available
    if (db) {
      try {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

        await db.trackAnalysisCache.upsert({
          where: { trackKey },
          update: {
            analysisJson: JSON.parse(JSON.stringify(analysis)),
            expiresAt,
            updatedAt: new Date(),
            lastAccessedAt: new Date(),
          },
          create: {
            trackName: validated.track,
            artistName: validated.artist || 'Unknown Artist',
            trackKey,
            externalUrl: analysis.track.external_url,
            analysisJson: JSON.parse(JSON.stringify(analysis)),
            expiresAt,
          },
        });
      } catch (dbError) {
        // Log database errors but don't fail the request
        console.warn('Database cache write failed:', dbError);
      }
    }

    // Return successful response
    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        },
        { status: 400 }
      );
    }

    // Handle Last.fm API errors
    if (error instanceof LastFmApiError) {
      if (error.statusCode === 404 || error.errorCode === 6) {
        return NextResponse.json(
          { error: 'Track not found. Please check the song name and artist.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Log unexpected errors
    console.error('Unexpected error in /api/analyze:', error);

    // Generic error response
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
