/**
 * Track Analysis Service (Last.fm Version)
 *
 * Orchestrates track analysis: searches Last.fm, estimates audio features from tags,
 * generates rule-based explanations, and finds similar tracks.
 */

import * as lastfm from '@/lib/lastfm';
import {
  KEY_NAMES,
  MODE_NAMES,
  RECOMMENDATION_LIMIT,
  deriveVibeTags,
  generateExplanation,
  calculateDistance,
  generateRecommendationReason,
  type DistanceFeatures,
} from '@/lib/constants';
import type {
  AnalysisResponse,
  TrackInfo,
  TrackFingerprint,
  TrackExplanation,
  TrackRecommendation,
  VibeProfile,
} from './types';
import type { EstimatedFeatures } from '@/lib/lastfm';
import { deriveVibeProfile } from '@/lib/vibeTaxonomy';

// Fingerprint derivation: audio features + tags → fingerprint

/**
 * Derives the track fingerprint from estimated audio features and tags.
 */
function deriveFingerprint(
  features: EstimatedFeatures,
  tags: string[]
): TrackFingerprint {
  const keyName = KEY_NAMES[features.key] ?? 'Unknown';
  const modeName = MODE_NAMES[features.mode] ?? 'Unknown';
  const bpm = Math.round(features.tempo);

  // Derive vibe tags from estimated features
  const vibeTags = deriveVibeTags({
    energy: features.energy,
    valence: features.valence,
    danceability: features.danceability,
    acousticness: features.acousticness,
    speechiness: features.speechiness,
    loudness: features.loudness,
  });

  return {
    bpm,
    key: keyName,
    mode: modeName,
    time_signature: features.time_signature,
    loudness: features.loudness,
    energy: features.energy,
    danceability: features.danceability,
    valence: features.valence,
    acousticness: features.acousticness,
    instrumentalness: features.instrumentalness,
    liveness: features.liveness,
    speechiness: features.speechiness,
    genres: tags.slice(0, 10), // Top 10 tags as "genres"
    vibe_tags: vibeTags,
  };
}

// Feature conversion: map to distance calculation format

/**
 * Converts estimated features to the format needed for distance calculation.
 */
function toDistanceFeatures(features: EstimatedFeatures): DistanceFeatures {
  return {
    danceability: features.danceability,
    energy: features.energy,
    valence: features.valence,
    acousticness: features.acousticness,
    instrumentalness: features.instrumentalness,
    speechiness: features.speechiness,
    liveness: features.liveness,
    tempo: features.tempo,
    loudness: features.loudness,
  };
}

// Recommendation processing: find similar tracks and rank them

interface SimilarTrackWithFeatures {
  id: string;
  name: string;
  artist: string;
  externalUrl: string;
  albumImageUrl: string | null;
  matchScore: number;
  estimatedFeatures: EstimatedFeatures;
}

/**
 * Fetches recommendations from similar artists as a fallback.
 * Used when Last.fm doesn't have similar track data.
 */
async function fetchFallbackRecommendations(
  artistName: string,
  seedTrackName: string,
  seedFeatures: EstimatedFeatures
): Promise<TrackRecommendation[]> {
  // Get similar artists
  const similarArtists = await lastfm.getSimilarArtists(artistName, 5);

  if (similarArtists.length === 0) {
    return [];
  }

  // Collect top tracks from similar artists
  const candidateTracks: SimilarTrackWithFeatures[] = [];
  const seenTrackIds = new Set<string>();

  for (const artist of similarArtists) {
    try {
      const topTracks = await lastfm.getArtistTopTracks(artist.name, 5);

      for (const track of topTracks) {
        const trackId = lastfm.generateTrackId(track.name, track.artist.name);

        // Skip duplicates and the original track
        if (seenTrackIds.has(trackId)) continue;
        if (track.name.toLowerCase() === seedTrackName.toLowerCase()) continue;

        seenTrackIds.add(trackId);

        try {
          // Get track info for tags
          const trackInfo = await lastfm.getTrackInfo(track.name, track.artist.name);
          const tags = trackInfo.toptags?.tag?.map(t => t.name) || [];
          const estimatedFeatures = lastfm.estimateFeaturesFromTags(tags);

          // Get album image from track info or artist top track images
          const fallbackAlbumImage = lastfm.getBestImageUrl(trackInfo.album?.image)
            || lastfm.getBestImageUrl(track.image)
            || null;

          candidateTracks.push({
            id: trackId,
            name: track.name,
            artist: track.artist.name,
            externalUrl: track.url,
            albumImageUrl: fallbackAlbumImage,
            matchScore: parseFloat(artist.match) || 0.5,
            estimatedFeatures,
          });
        } catch {
          // Skip tracks we can't get info for
          continue;
        }
      }
    } catch {
      // Skip artists we can't get tracks for
      continue;
    }

    // Stop if we have enough candidates
    if (candidateTracks.length >= 20) break;
  }

  if (candidateTracks.length === 0) {
    return [];
  }

  // Rank by audio feature similarity
  const seedDistanceFeatures = toDistanceFeatures(seedFeatures);
  const rankedCandidates: Array<{
    track: SimilarTrackWithFeatures;
    distance: number;
    reason: string;
  }> = [];

  for (const track of candidateTracks) {
    const candidateDistanceFeatures = toDistanceFeatures(track.estimatedFeatures);
    const { totalDistance, dimensionDiffs } = calculateDistance(
      seedDistanceFeatures,
      candidateDistanceFeatures
    );
    const reason = generateRecommendationReason(dimensionDiffs);

    rankedCandidates.push({
      track,
      distance: totalDistance,
      reason,
    });
  }

  // Sort by distance (ascending = most similar first)
  rankedCandidates.sort((a, b) => a.distance - b.distance);

  // Take top N
  const topCandidates = rankedCandidates.slice(0, RECOMMENDATION_LIMIT);

  // Convert to response format with fallback indicator
  return topCandidates.map(c => ({
    id: c.track.id,
    name: c.track.name,
    artists: [c.track.artist],
    external_url: c.track.externalUrl,
    reason: `From similar artist. ${c.reason}`,
    albumArt: c.track.albumImageUrl || undefined,
  }));
}

/**
 * Fetches similar tracks and reranks them by estimated audio feature similarity.
 * Falls back to similar artists' top tracks if no similar tracks are found.
 */
async function fetchAndRerankRecommendations(
  trackName: string,
  artistName: string,
  seedFeatures: EstimatedFeatures
): Promise<TrackRecommendation[]> {
  // Get similar tracks from Last.fm
  const similarTracks = await lastfm.getNormalizedSimilarTracks(
    trackName,
    artistName,
    30 // Request 30 candidates
  );

  // If no similar tracks found, use fallback strategy
  if (similarTracks.length === 0) {
    return fetchFallbackRecommendations(artistName, trackName, seedFeatures);
  }

  // Get additional info for each similar track to estimate features
  const tracksWithFeatures: SimilarTrackWithFeatures[] = [];

  for (const track of similarTracks.slice(0, 20)) {
    try {
      // Get track info for tags
      const trackInfo = await lastfm.getTrackInfo(track.name, track.artist);
      const tags = trackInfo.toptags?.tag?.map(t => t.name) || [];

      // Estimate features from tags
      const estimatedFeatures = lastfm.estimateFeaturesFromTags(tags);

      // Use album image from similar track data, fall back to track info album image
      const albumImageUrl = track.albumImageUrl
        || lastfm.getBestImageUrl(trackInfo.album?.image)
        || null;

      tracksWithFeatures.push({
        id: track.id,
        name: track.name,
        artist: track.artist,
        externalUrl: track.externalUrl,
        albumImageUrl,
        matchScore: track.matchScore,
        estimatedFeatures,
      });
    } catch {
      // Skip tracks we can't get info for
      continue;
    }
  }

  if (tracksWithFeatures.length === 0) {
    // Fall back to just using Last.fm's match scores
    return similarTracks.slice(0, RECOMMENDATION_LIMIT).map(track => ({
      id: track.id,
      name: track.name,
      artists: [track.artist],
      external_url: track.externalUrl,
      reason: 'Similar artist and style based on listener patterns.',
      albumArt: track.albumImageUrl || undefined,
    }));
  }

  // Calculate distance for each candidate
  const seedDistanceFeatures = toDistanceFeatures(seedFeatures);
  const rankedCandidates: Array<{
    track: SimilarTrackWithFeatures;
    distance: number;
    reason: string;
  }> = [];

  for (const track of tracksWithFeatures) {
    const candidateDistanceFeatures = toDistanceFeatures(track.estimatedFeatures);
    const { totalDistance, dimensionDiffs } = calculateDistance(
      seedDistanceFeatures,
      candidateDistanceFeatures
    );
    const reason = generateRecommendationReason(dimensionDiffs);

    rankedCandidates.push({
      track,
      distance: totalDistance,
      reason,
    });
  }

  // Sort by distance (ascending = most similar first)
  rankedCandidates.sort((a, b) => a.distance - b.distance);

  // Take top N
  const topCandidates = rankedCandidates.slice(0, RECOMMENDATION_LIMIT);

  // Convert to response format
  return topCandidates.map(c => ({
    id: c.track.id,
    name: c.track.name,
    artists: [c.track.artist],
    external_url: c.track.externalUrl,
    reason: c.reason,
    albumArt: c.track.albumImageUrl || undefined,
  }));
}

// =============================================================================
// Search Function
// =============================================================================

/**
 * Searches for tracks by name and optionally artist.
 * Returns top matches for the user to select.
 */
export interface TrackSearchResult {
  id: string;
  name: string;
  artist: string;
  url: string;
  listeners: number;
}

export async function searchTracks(
  query: string,
  artist?: string
): Promise<TrackSearchResult[]> {
  const results = await lastfm.searchTracks(query, artist, 10);

  return results.map(track => ({
    id: lastfm.generateTrackId(track.name, track.artist),
    name: track.name,
    artist: track.artist,
    url: track.url,
    listeners: parseInt(track.listeners || '0', 10),
  }));
}

// =============================================================================
// Main Analysis Function
// =============================================================================

/**
 * Analyzes a track by name and artist using Last.fm data.
 * Returns complete analysis with fingerprint, explanation, and recommendations.
 *
 * @param trackName - Track name to analyze
 * @param artistName - Artist name
 * @returns Complete analysis response
 */
export async function analyzeTrackByName(
  trackName: string,
  artistName: string
): Promise<AnalysisResponse> {
  // Fetch track data from Last.fm
  const normalizedTrack = await lastfm.getNormalizedTrack(trackName, artistName);

  // Estimate audio features from tags
  const estimatedFeatures = lastfm.estimateFeaturesFromTags(normalizedTrack.tags);

  // Derive fingerprint
  const fingerprint = deriveFingerprint(estimatedFeatures, normalizedTrack.tags);

  // Generate explanation
  const explanation: TrackExplanation = generateExplanation({
    bpm: fingerprint.bpm,
    key: fingerprint.key,
    mode: fingerprint.mode,
    timeSignature: fingerprint.time_signature,
    danceability: fingerprint.danceability,
    energy: fingerprint.energy,
    valence: fingerprint.valence,
    acousticness: fingerprint.acousticness,
    instrumentalness: fingerprint.instrumentalness,
    loudness: fingerprint.loudness,
  });

  // Derive vibe profile from tags
  const vibeProfileResult = deriveVibeProfile(normalizedTrack.tags);
  const vibeProfile: VibeProfile = {
    primaryVibeGenre: vibeProfileResult.primaryVibeGenre,
    secondaryVibeGenres: vibeProfileResult.secondaryVibeGenres,
    descriptors: vibeProfileResult.descriptors,
  };

  // Fetch and rerank recommendations
  const recommendations = await fetchAndRerankRecommendations(
    trackName,
    artistName,
    estimatedFeatures
  );

  // Build track info
  const trackInfo: TrackInfo = {
    id: normalizedTrack.id,
    name: normalizedTrack.name,
    artists: [
      {
        id: normalizedTrack.artistId,
        name: normalizedTrack.artist,
      },
    ],
    album: {
      id: normalizedTrack.albumId,
      name: normalizedTrack.album,
      images: normalizedTrack.albumImageUrl
        ? [{ url: normalizedTrack.albumImageUrl, height: 300, width: 300 }]
        : [],
    },
    external_url: normalizedTrack.externalUrl,
  };

  return {
    track: trackInfo,
    fingerprint,
    explanation,
    recommendations,
    vibeProfile,
  };
}

/**
 * Alias for backward compatibility - analyzes by name
 */
export async function analyzeTrack(
  trackName: string,
  artistName?: string
): Promise<AnalysisResponse> {
  if (!artistName) {
    // Try to search and use the top result
    const results = await searchTracks(trackName);
    if (results.length === 0) {
      throw new Error('Track not found. Please provide both song name and artist.');
    }
    const topResult = results[0];
    return analyzeTrackByName(topResult.name, topResult.artist);
  }

  return analyzeTrackByName(trackName, artistName);
}
