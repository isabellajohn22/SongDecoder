/**
 * Service Layer Type Definitions
 * ============================================================================
 * Types for the analysis service responses and internal data structures.
 * These represent the application's domain model, separate from Spotify's API.
 * ============================================================================
 */

/**
 * Artist information for the track response
 */
export interface TrackArtist {
  id: string;
  name: string;
}

/**
 * Album information for the track response
 */
export interface TrackAlbum {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
}

/**
 * Core track information
 */
export interface TrackInfo {
  id: string;
  name: string;
  artists: TrackArtist[];
  album: TrackAlbum;
  external_url: string;
}

/**
 * Track fingerprint containing all derived audio analysis data
 */
export interface TrackFingerprint {
  /** Tempo in beats per minute, rounded to nearest integer */
  bpm: number;
  /** Musical key as note name (C, C#, etc.) or "Unknown" */
  key: string;
  /** Mode: "Major", "Minor", or "Unknown" */
  mode: string;
  /** Time signature (beats per measure) */
  time_signature: number;
  /** Overall loudness in dB */
  loudness: number;
  /** Energy level (0-1) */
  energy: number;
  /** Danceability (0-1) */
  danceability: number;
  /** Valence/happiness (0-1) */
  valence: number;
  /** Acousticness (0-1) */
  acousticness: number;
  /** Instrumentalness (0-1) */
  instrumentalness: number;
  /** Liveness (0-1) */
  liveness: number;
  /** Speechiness (0-1) */
  speechiness: number;
  /** Raw genre strings from primary artist */
  genres: string[];
  /** Derived vibe tags (exactly 6 tags) */
  vibe_tags: string[];
}

/**
 * Generated explanation with TL;DR and detailed sections
 */
export interface TrackExplanation {
  /** Exactly 3 summary bullets */
  tldr: string[];
  /** Detailed section breakdowns */
  sections: {
    /** 2-4 bullets about rhythm (BPM, time signature, danceability) */
    rhythm: string[];
    /** 2-4 bullets about harmony and mood (key, mode, valence) */
    harmony_mood: string[];
    /** 2-4 bullets about sound and texture (acousticness, instrumentalness, loudness) */
    sound_texture: string[];
  };
}

/**
 * Single recommendation with reason
 */
export interface TrackRecommendation {
  id: string;
  name: string;
  artists: string[];
  external_url: string;
  /** Deterministic explanation of similarity */
  reason: string;
  /** Album artwork URL (optional, from Last.fm) */
  albumArt?: string;
  /** Vibe profile for this recommendation (optional) */
  vibeProfile?: VibeProfile;
}

/**
 * Vibe profile derived from tags
 */
export interface VibeProfile {
  primaryVibeGenre: string;
  secondaryVibeGenres: string[];
  descriptors: string[];
}

/**
 * Complete analysis response returned by the API
 */
export interface AnalysisResponse {
  track: TrackInfo;
  fingerprint: TrackFingerprint;
  explanation: TrackExplanation;
  recommendations: TrackRecommendation[];
  vibeProfile: VibeProfile;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: string;
  details?: string;
}
