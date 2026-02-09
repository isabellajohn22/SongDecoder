/**
 * Database Utilities
 * ============================================================================
 * Utility functions for database operations and data normalization.
 * ============================================================================
 */

/**
 * Normalizes a track key for consistent database lookups.
 * Creates a unique identifier from artist and track names.
 *
 * @param artistName - The artist name
 * @param trackName - The track name
 * @returns Normalized track key in format: "artist::track" (lowercased, trimmed)
 */
export function normalizeTrackKey(artistName: string, trackName: string): string {
  const normalizedArtist = artistName.toLowerCase().trim();
  const normalizedTrack = trackName.toLowerCase().trim();
  return `${normalizedArtist}::${normalizedTrack}`;
}