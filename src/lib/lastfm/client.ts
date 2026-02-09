/**
 * Last.fm API Client
 *
 * Provides a clean interface to Last.fm: track search, info with tags,
 * similar tracks, and artist data. Requires LASTFM_API_KEY env var.
 */

import type {
  LastFmTrackSearchResponse,
  LastFmTrackInfoResponse,
  LastFmSimilarTracksResponse,
  LastFmArtistInfoResponse,
  LastFmSimilarArtistsResponse,
  LastFmArtistTopTracksResponse,
  LastFmTrackSearch,
  LastFmTrackFull,
  LastFmSimilarTrack,
  LastFmSimilarArtist,
  LastFmArtistTopTrack,
  LastFmArtistFull,
  NormalizedTrack,
  NormalizedSimilarTrack,
} from './types';

// Configuration and error handling

const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';

export class LastFmApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: number
  ) {
    super(message);
    this.name = 'LastFmApiError';
  }
}

// Helper functions

/**
 * Gets the API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) {
    throw new LastFmApiError(
      'Missing Last.fm API key. Set LASTFM_API_KEY environment variable.',
      500
    );
  }
  return apiKey;
}

/**
 * Generates a deterministic ID from track name and artist
 */
export function generateTrackId(name: string, artist: string): string {
  const normalized = `${name.toLowerCase().trim()}-${artist.toLowerCase().trim()}`;
  // Simple hash function for ID generation
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36).padStart(8, '0');
}

// Last.fm's default placeholder image hash — a gray star, not real album art
const LASTFM_PLACEHOLDER_HASHES = [
  '2a96cbd8b46e442fc41c2b86b821562f', // default star placeholder
  'c6f59c1e5e7240a4c0d427abd71f3dbb', // alternate placeholder
];

/**
 * Returns true if a URL points to Last.fm's generic placeholder image
 */
function isPlaceholderUrl(url: string): boolean {
  return LASTFM_PLACEHOLDER_HASHES.some(hash => url.includes(hash));
}

/**
 * Gets the best quality image URL from Last.fm images array.
 * Filters out empty strings, whitespace-only, and known placeholder images.
 */
export function getBestImageUrl(images?: Array<{ '#text': string; size: string }>): string | null {
  if (!images || images.length === 0) return null;

  // Prefer larger sizes
  const sizePriority = ['mega', 'extralarge', 'large', 'medium', 'small'];
  for (const size of sizePriority) {
    const img = images.find(i => i.size === size && i['#text']?.trim());
    if (img && img['#text']?.trim() && !isPlaceholderUrl(img['#text'])) {
      return img['#text'].trim();
    }
  }

  // Return first non-empty, non-placeholder image
  const firstWithUrl = images.find(i => i['#text']?.trim() && !isPlaceholderUrl(i['#text']));
  return firstWithUrl ? firstWithUrl['#text'].trim() : null;
}

/**
 * Makes a request to the Last.fm API
 */
async function lastfmRequest<T>(params: Record<string, string>): Promise<T> {
  const apiKey = getApiKey();

  const url = new URL(LASTFM_API_BASE);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('format', 'json');

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new LastFmApiError(
      `Last.fm API error: ${response.statusText}`,
      response.status
    );
  }

  const data = await response.json();

  // Check for API-level errors
  if (data.error) {
    throw new LastFmApiError(
      data.message || 'Unknown Last.fm API error',
      400,
      data.error
    );
  }

  return data as T;
}

// =============================================================================
// Public API Methods
// =============================================================================

/**
 * Searches for tracks by name and optionally artist
 */
export async function searchTracks(
  track: string,
  artist?: string,
  limit = 10
): Promise<LastFmTrackSearch[]> {
  const params: Record<string, string> = {
    method: 'track.search',
    track: track,
    limit: limit.toString(),
  };

  if (artist) {
    params.artist = artist;
  }

  const response = await lastfmRequest<LastFmTrackSearchResponse>(params);
  return response.results?.trackmatches?.track || [];
}

/**
 * Gets detailed track info including tags
 */
export async function getTrackInfo(
  track: string,
  artist: string
): Promise<LastFmTrackFull> {
  const response = await lastfmRequest<LastFmTrackInfoResponse>({
    method: 'track.getInfo',
    track: track,
    artist: artist,
    autocorrect: '1',
  });

  if (!response.track) {
    throw new LastFmApiError('Track not found', 404);
  }

  return response.track;
}

/**
 * Gets similar tracks (for recommendations)
 */
export async function getSimilarTracks(
  track: string,
  artist: string,
  limit = 30
): Promise<LastFmSimilarTrack[]> {
  try {
    const response = await lastfmRequest<LastFmSimilarTracksResponse>({
      method: 'track.getSimilar',
      track: track,
      artist: artist,
      limit: limit.toString(),
      autocorrect: '1',
    });

    return response.similartracks?.track || [];
  } catch (error) {
    // Some tracks don't have similar tracks, return empty array
    if (error instanceof LastFmApiError && error.errorCode === 6) {
      return [];
    }
    throw error;
  }
}

/**
 * Gets artist info including tags
 */
export async function getArtistInfo(artist: string): Promise<LastFmArtistFull> {
  const response = await lastfmRequest<LastFmArtistInfoResponse>({
    method: 'artist.getInfo',
    artist: artist,
    autocorrect: '1',
  });

  if (!response.artist) {
    throw new LastFmApiError('Artist not found', 404);
  }

  return response.artist;
}

/**
 * Gets similar artists (for fallback recommendations)
 */
export async function getSimilarArtists(
  artist: string,
  limit = 10
): Promise<LastFmSimilarArtist[]> {
  try {
    const response = await lastfmRequest<LastFmSimilarArtistsResponse>({
      method: 'artist.getSimilar',
      artist: artist,
      limit: limit.toString(),
      autocorrect: '1',
    });

    return response.similarartists?.artist || [];
  } catch (error) {
    // Some artists don't have similar artists
    if (error instanceof LastFmApiError && error.errorCode === 6) {
      return [];
    }
    throw error;
  }
}

/**
 * Gets top tracks for an artist (for fallback recommendations)
 */
export async function getArtistTopTracks(
  artist: string,
  limit = 10
): Promise<LastFmArtistTopTrack[]> {
  try {
    const response = await lastfmRequest<LastFmArtistTopTracksResponse>({
      method: 'artist.getTopTracks',
      artist: artist,
      limit: limit.toString(),
      autocorrect: '1',
    });

    return response.toptracks?.track || [];
  } catch (error) {
    // Some artists don't have top tracks
    if (error instanceof LastFmApiError && error.errorCode === 6) {
      return [];
    }
    throw error;
  }
}

// =============================================================================
// Normalized Data Functions
// =============================================================================

/**
 * Fetches and normalizes complete track data
 */
export async function getNormalizedTrack(
  trackName: string,
  artistName: string
): Promise<NormalizedTrack> {
  // Get track info
  const trackInfo = await getTrackInfo(trackName, artistName);

  // Get artist info for additional tags
  let artistTags: string[] = [];
  try {
    const artistInfo = await getArtistInfo(artistName);
    artistTags = artistInfo.tags?.tag?.map(t => t.name) || [];
  } catch {
    // Artist tags are optional
  }

  // Combine track and artist tags
  const trackTags = trackInfo.toptags?.tag?.map(t => t.name) || [];
  const allTags = Array.from(new Set([...trackTags, ...artistTags]));

  // Extract album info
  const albumName = trackInfo.album?.title || 'Unknown Album';
  const albumImageUrl = getBestImageUrl(trackInfo.album?.image);

  return {
    id: generateTrackId(trackInfo.name, trackInfo.artist.name),
    name: trackInfo.name,
    artist: trackInfo.artist.name,
    artistId: generateTrackId('artist', trackInfo.artist.name),
    album: albumName,
    albumId: generateTrackId('album', albumName),
    albumImageUrl,
    externalUrl: trackInfo.url,
    duration: parseInt(trackInfo.duration || '0', 10) / 1000, // ms to seconds
    tags: allTags,
    playcount: parseInt(trackInfo.playcount || '0', 10),
    listeners: parseInt(trackInfo.listeners || '0', 10),
  };
}

/**
 * Fetches and normalizes similar tracks
 */
export async function getNormalizedSimilarTracks(
  trackName: string,
  artistName: string,
  limit = 30
): Promise<NormalizedSimilarTrack[]> {
  const similarTracks = await getSimilarTracks(trackName, artistName, limit);

  return similarTracks.map(track => ({
    id: generateTrackId(track.name, track.artist.name),
    name: track.name,
    artist: track.artist.name,
    artistId: generateTrackId('artist', track.artist.name),
    externalUrl: track.url,
    matchScore: track.match,
    albumImageUrl: getBestImageUrl(track.image),
  }));
}
