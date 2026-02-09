/**
 * Constants Index
 * ============================================================================
 * Central export point for all constants used in the application.
 * ============================================================================
 */

export * from './vibe-tags';
export * from './recommendation-weights';
export * from './explanation-templates';

/**
 * Musical key mapping from numeric key (0-11) to note names.
 * -1 indicates no key was detected.
 */
export const KEY_NAMES: Record<number, string> = {
  [-1]: 'Unknown',
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'D#',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'A#',
  11: 'B',
};

/**
 * Mode mapping from numeric mode (0/1) to names.
 */
export const MODE_NAMES: Record<number, string> = {
  0: 'Minor',
  1: 'Major',
};

/**
 * Number of recommendations to return to the user.
 */
export const RECOMMENDATION_LIMIT = 10;
