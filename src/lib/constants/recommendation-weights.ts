/**
 * Recommendation Reranking Weights
 *
 * Defines weights for calculating similarity distance between tracks.
 * Lower distance = more similar. Weights are tuned for music discovery:
 * danceability and energy are strongest indicators of groove match.
 */

/**
 * Feature weights for distance calculation.
 * Higher weight = more influence on similarity.
 */
export const RERANK_WEIGHTS = {
  danceability: 1.2,
  energy: 1.2,
  valence: 1.0,
  acousticness: 0.9,
  instrumentalness: 0.6,
  speechiness: 0.6,
  liveness: 0.3,
  tempo: 0.8,
  loudness: 0.3,
} as const;

/**
 * Feature names in display-friendly format for reason generation.
 * Used when explaining why a track was recommended.
 */
export const FEATURE_DISPLAY_NAMES: Record<keyof typeof RERANK_WEIGHTS, string> = {
  danceability: 'groove',
  energy: 'energy level',
  valence: 'mood',
  acousticness: 'acoustic feel',
  instrumentalness: 'instrumental balance',
  speechiness: 'vocal style',
  liveness: 'live feel',
  tempo: 'tempo',
  loudness: 'loudness',
};

/**
 * Normalization constants for features that aren't already 0-1 scaled.
 * 
 * Tempo normalization:
 * - abs(bpm_diff) / 60, clamped to 1.0
 * - A 60 BPM difference is considered "maximum different"
 * 
 * Loudness normalization:
 * - abs(loudness_diff) / 20, clamped to 1.0
 * - A 20 dB difference is considered "maximum different"
 */
export const NORMALIZATION = {
  TEMPO_DIVISOR: 60, // Divide BPM difference by this
  LOUDNESS_DIVISOR: 20, // Divide dB difference by this
} as const;

/**
 * Type for audio features used in distance calculation
 */
export interface DistanceFeatures {
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  liveness: number;
  tempo: number; // BPM
  loudness: number; // dB
}

/**
 * Result of distance calculation, including individual dimension differences
 */
export interface DistanceResult {
  /** Total weighted distance score (lower = more similar) */
  totalDistance: number;
  /** Individual normalized differences by feature */
  dimensionDiffs: Record<keyof typeof RERANK_WEIGHTS, number>;
}

/**
 * Calculates the weighted distance between two tracks' audio features.
 * Uses the formula: distance = Σ weight_i * normalized_diff_i
 *
 * @param seed - Audio features of the seed track
 * @param candidate - Audio features of the candidate track
 * @returns Distance result with total score and individual dimension differences
 */
export function calculateDistance(seed: DistanceFeatures, candidate: DistanceFeatures): DistanceResult {
  const dimensionDiffs: Record<keyof typeof RERANK_WEIGHTS, number> = {
    danceability: 0,
    energy: 0,
    valence: 0,
    acousticness: 0,
    instrumentalness: 0,
    speechiness: 0,
    liveness: 0,
    tempo: 0,
    loudness: 0,
  };

  // Calculate normalized differences for each dimension
  // For 0-1 scaled features, the absolute difference is already normalized
  dimensionDiffs.danceability = Math.abs(candidate.danceability - seed.danceability);
  dimensionDiffs.energy = Math.abs(candidate.energy - seed.energy);
  dimensionDiffs.valence = Math.abs(candidate.valence - seed.valence);
  dimensionDiffs.acousticness = Math.abs(candidate.acousticness - seed.acousticness);
  dimensionDiffs.instrumentalness = Math.abs(candidate.instrumentalness - seed.instrumentalness);
  dimensionDiffs.speechiness = Math.abs(candidate.speechiness - seed.speechiness);
  dimensionDiffs.liveness = Math.abs(candidate.liveness - seed.liveness);

  // Tempo: normalize by dividing by 60, clamp to 1.0
  const tempoDiff = Math.abs(candidate.tempo - seed.tempo) / NORMALIZATION.TEMPO_DIVISOR;
  dimensionDiffs.tempo = Math.min(tempoDiff, 1.0);

  // Loudness: normalize by dividing by 20, clamp to 1.0
  const loudnessDiff = Math.abs(candidate.loudness - seed.loudness) / NORMALIZATION.LOUDNESS_DIVISOR;
  dimensionDiffs.loudness = Math.min(loudnessDiff, 1.0);

  // Calculate weighted sum
  let totalDistance = 0;
  for (const [feature, weight] of Object.entries(RERANK_WEIGHTS)) {
    const featureKey = feature as keyof typeof RERANK_WEIGHTS;
    totalDistance += weight * dimensionDiffs[featureKey];
  }

  return {
    totalDistance,
    dimensionDiffs,
  };
}

/**
 * Generates a reason string explaining why a track was recommended.
 * Identifies the top 2 closest dimensions (smallest normalized differences)
 * and creates a sentence mentioning them.
 *
 * @param dimensionDiffs - Normalized differences for each dimension
 * @returns A single sentence explaining the recommendation
 */
export function generateRecommendationReason(dimensionDiffs: Record<keyof typeof RERANK_WEIGHTS, number>): string {
  // Sort dimensions by their difference (ascending = most similar first)
  const sortedDimensions = Object.entries(dimensionDiffs)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([key]) => key as keyof typeof RERANK_WEIGHTS);

  const [first, second] = sortedDimensions;
  const firstName = FEATURE_DISPLAY_NAMES[first];
  const secondName = FEATURE_DISPLAY_NAMES[second];

  return `Matches closely in ${firstName} and ${secondName}.`;
}
