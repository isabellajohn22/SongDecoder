/**
 * Vibe Tag Derivation Rules
 * ============================================================================
 * Defines the deterministic rules for generating vibe tags from audio features.
 * Each track receives exactly 6 vibe tags, one from each category.
 * 
 * Tag Categories (in order):
 * 1. Energy Tag - based on energy value (0-1)
 * 2. Mood Tag - based on valence value (0-1)
 * 3. Groove Tag - based on danceability value (0-1)
 * 4. Texture Tag - based on acousticness value (0-1)
 * 5. Vocal Tag - based on speechiness value (0-1)
 * 6. Intensity Tag - based on loudness value (dB, typically -60 to 0)
 * ============================================================================
 */

/**
 * Audio features needed for vibe tag derivation
 */
export interface VibeFeaturesInput {
  energy: number; // 0.0 to 1.0
  valence: number; // 0.0 to 1.0
  danceability: number; // 0.0 to 1.0
  acousticness: number; // 0.0 to 1.0
  speechiness: number; // 0.0 to 1.0
  loudness: number; // dB, typically -60 to 0
}

/**
 * Thresholds for energy tag derivation
 * - Below 0.35: Chill
 * - 0.35 to 0.70: Balanced
 * - Above 0.70: High-Energy
 */
export const ENERGY_THRESHOLDS = {
  LOW: 0.35,
  HIGH: 0.7,
} as const;

export const ENERGY_TAGS = {
  LOW: 'Chill',
  MID: 'Balanced',
  HIGH: 'High-Energy',
} as const;

/**
 * Thresholds for mood tag derivation (valence-based)
 * - Below 0.35: Moody
 * - 0.35 to 0.70: Bittersweet
 * - Above 0.70: Bright
 */
export const MOOD_THRESHOLDS = {
  LOW: 0.35,
  HIGH: 0.7,
} as const;

export const MOOD_TAGS = {
  LOW: 'Moody',
  MID: 'Bittersweet',
  HIGH: 'Bright',
} as const;

/**
 * Thresholds for groove tag derivation (danceability-based)
 * - Below 0.40: Loose
 * - 0.40 to 0.75: Groovy
 * - Above 0.75: Dance-Forward
 */
export const GROOVE_THRESHOLDS = {
  LOW: 0.4,
  HIGH: 0.75,
} as const;

export const GROOVE_TAGS = {
  LOW: 'Loose',
  MID: 'Groovy',
  HIGH: 'Dance-Forward',
} as const;

/**
 * Thresholds for texture tag derivation (acousticness-based)
 * - Below 0.25: Produced
 * - 0.25 to 0.60: Mixed
 * - Above 0.60: Acoustic
 */
export const TEXTURE_THRESHOLDS = {
  LOW: 0.25,
  HIGH: 0.6,
} as const;

export const TEXTURE_TAGS = {
  LOW: 'Produced',
  MID: 'Mixed',
  HIGH: 'Acoustic',
} as const;

/**
 * Threshold for vocal tag derivation (speechiness-based)
 * - Above 0.33: Talky/Rap-Adjacent
 * - Below or equal to 0.33: Melodic Vocals
 */
export const VOCAL_THRESHOLD = 0.33;

export const VOCAL_TAGS = {
  HIGH: 'Talky/Rap-Adjacent',
  LOW: 'Melodic Vocals',
} as const;

/**
 * Thresholds for intensity tag derivation (loudness-based)
 * - Above -6 dB: Punchy
 * - -12 to -6 dB: Moderate
 * - Below -12 dB: Soft
 */
export const INTENSITY_THRESHOLDS = {
  LOUD: -6, // Above this = Punchy
  QUIET: -12, // Below this = Soft
} as const;

export const INTENSITY_TAGS = {
  HIGH: 'Punchy',
  MID: 'Moderate',
  LOW: 'Soft',
} as const;

/**
 * Derives the energy tag from the energy audio feature.
 *
 * @param energy - Energy value (0.0 to 1.0)
 * @returns The energy vibe tag
 */
export function deriveEnergyTag(energy: number): string {
  if (energy < ENERGY_THRESHOLDS.LOW) {
    return ENERGY_TAGS.LOW;
  }
  if (energy > ENERGY_THRESHOLDS.HIGH) {
    return ENERGY_TAGS.HIGH;
  }
  return ENERGY_TAGS.MID;
}

/**
 * Derives the mood tag from the valence audio feature.
 *
 * @param valence - Valence value (0.0 to 1.0)
 * @returns The mood vibe tag
 */
export function deriveMoodTag(valence: number): string {
  if (valence < MOOD_THRESHOLDS.LOW) {
    return MOOD_TAGS.LOW;
  }
  if (valence > MOOD_THRESHOLDS.HIGH) {
    return MOOD_TAGS.HIGH;
  }
  return MOOD_TAGS.MID;
}

/**
 * Derives the groove tag from the danceability audio feature.
 *
 * @param danceability - Danceability value (0.0 to 1.0)
 * @returns The groove vibe tag
 */
export function deriveGrooveTag(danceability: number): string {
  if (danceability < GROOVE_THRESHOLDS.LOW) {
    return GROOVE_TAGS.LOW;
  }
  if (danceability > GROOVE_THRESHOLDS.HIGH) {
    return GROOVE_TAGS.HIGH;
  }
  return GROOVE_TAGS.MID;
}

/**
 * Derives the texture tag from the acousticness audio feature.
 *
 * @param acousticness - Acousticness value (0.0 to 1.0)
 * @returns The texture vibe tag
 */
export function deriveTextureTag(acousticness: number): string {
  if (acousticness < TEXTURE_THRESHOLDS.LOW) {
    return TEXTURE_TAGS.LOW;
  }
  if (acousticness > TEXTURE_THRESHOLDS.HIGH) {
    return TEXTURE_TAGS.HIGH;
  }
  return TEXTURE_TAGS.MID;
}

/**
 * Derives the vocal tag from the speechiness audio feature.
 *
 * @param speechiness - Speechiness value (0.0 to 1.0)
 * @returns The vocal vibe tag
 */
export function deriveVocalTag(speechiness: number): string {
  if (speechiness > VOCAL_THRESHOLD) {
    return VOCAL_TAGS.HIGH;
  }
  return VOCAL_TAGS.LOW;
}

/**
 * Derives the intensity tag from the loudness audio feature.
 *
 * @param loudness - Loudness value (dB, typically -60 to 0)
 * @returns The intensity vibe tag
 */
export function deriveIntensityTag(loudness: number): string {
  if (loudness > INTENSITY_THRESHOLDS.LOUD) {
    return INTENSITY_TAGS.HIGH;
  }
  if (loudness < INTENSITY_THRESHOLDS.QUIET) {
    return INTENSITY_TAGS.LOW;
  }
  return INTENSITY_TAGS.MID;
}

/**
 * Derives all 6 vibe tags from the audio features.
 * Tags are returned in a fixed order: Energy, Mood, Groove, Texture, Vocal, Intensity.
 *
 * @param features - Object containing the required audio features
 * @returns Array of exactly 6 vibe tags in the specified order
 */
export function deriveVibeTags(features: VibeFeaturesInput): string[] {
  return [
    deriveEnergyTag(features.energy),
    deriveMoodTag(features.valence),
    deriveGrooveTag(features.danceability),
    deriveTextureTag(features.acousticness),
    deriveVocalTag(features.speechiness),
    deriveIntensityTag(features.loudness),
  ];
}
