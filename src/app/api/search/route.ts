/**
 * POST /api/search - Track Search Endpoint
 * ============================================================================
 * Searches for tracks by name and optionally artist.
 * Returns a list of matching tracks for the user to select.
 *
 * Request Body:
 * - query: Search query (required)
 * - artist: Artist filter (optional)
 * ============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { searchRequestSchema } from '@/lib/validation';
import { searchTracks } from '@/lib/services';
import { LastFmApiError } from '@/lib/lastfm/client';

/**
 * Handles POST requests to search for tracks.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request with Zod
    const validated = searchRequestSchema.parse(body);

    // Search for tracks
    const results = await searchTracks(validated.query, validated.artist);

    // Return successful response
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const errorMessage = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      console.warn('[Search API] Validation error:', errorMessage);
      return NextResponse.json(
        {
          error: 'Validation error',
          details: errorMessage,
        },
        { status: 400 }
      );
    }

    // Handle Last.fm API errors
    if (error instanceof LastFmApiError) {
      console.error('[Search API] Last.fm API error:', {
        message: error.message,
        statusCode: error.statusCode,
        errorCode: error.errorCode,
      });
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      console.warn('[Search API] Invalid JSON in request body');
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Log unexpected errors with full context
    console.error('[Search API] Unexpected error:', error instanceof Error ? error.message : String(error), {
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Generic error response
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
