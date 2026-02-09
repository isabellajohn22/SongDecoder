/**
 * GET /api/track/[id] - Cached Track Analysis Endpoint
 * ============================================================================
 * Retrieves a cached track analysis by trackKey.
 * Returns 404 if not found or expired, 501 if caching not configured.
 *
 * URL Parameters:
 * - id: Track key in format "artist::track" (normalized)
 * ============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * Handles GET requests to retrieve cached track analysis.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check if database is configured
  if (!db) {
    return NextResponse.json(
      { error: 'Caching not configured' },
      { status: 501 }
    );
  }

  try {
    const trackKey = decodeURIComponent(params.id);

    // Find cached analysis
    const cachedAnalysis = await db.trackAnalysisCache.findUnique({
      where: { trackKey },
    });

    // Check if analysis exists and hasn't expired
    if (!cachedAnalysis || cachedAnalysis.expiresAt <= new Date()) {
      return NextResponse.json(
        { error: 'Analysis not found or expired' },
        { status: 404 }
      );
    }

    // Update last accessed timestamp
    await db.trackAnalysisCache.update({
      where: { id: cachedAnalysis.id },
      data: { lastAccessedAt: new Date() },
    });

    // Return the cached analysis JSON
    return NextResponse.json(cachedAnalysis.analysisJson, { status: 200 });
  } catch (error) {
    console.error('Error retrieving cached analysis:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve cached analysis' },
      { status: 500 }
    );
  }
}