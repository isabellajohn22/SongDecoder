/**
 * Audio Feature Estimation from Tags
 *
 * Estimates audio features from Last.fm tags. Since Last.fm doesn't provide
 * actual audio analysis, these are approximations based on tag-to-feature mappings.
 * Good enough for vibe classification and finding similar tracks, but not as
 * precise as real audio analysis (e.g., Spotify's features).
 *
 * Works by:
 * 1. Mapping tags to feature adjustments (e.g., "energetic" → high energy)
 * 2. Averaging adjustments across all matching tags
 * 3. Applying defaults for unmatched tags
 */

/**
 * Estimated audio features
 */
export interface EstimatedFeatures {
  tempo: number; // BPM estimate
  key: number; // 0-11 (C to B), -1 for unknown
  mode: number; // 0 = minor, 1 = major
  time_signature: number; // beats per bar
  loudness: number; // dB
  energy: number; // 0-1
  danceability: number; // 0-1
  valence: number; // 0-1
  acousticness: number; // 0-1
  instrumentalness: number; // 0-1
  liveness: number; // 0-1
  speechiness: number; // 0-1
}

/**
 * Tag feature profile - how a tag affects feature estimates
 */
interface TagProfile {
  patterns: string[]; // Tags that match this profile (case-insensitive)
  features: Partial<EstimatedFeatures>;
}

/**
 * Default features when no tags match
 */
const DEFAULT_FEATURES: EstimatedFeatures = {
  tempo: 120,
  key: -1, // Unknown
  mode: 1, // Major
  time_signature: 4,
  loudness: -8,
  energy: 0.5,
  danceability: 0.5,
  valence: 0.5,
  acousticness: 0.3,
  instrumentalness: 0.1,
  liveness: 0.15,
  speechiness: 0.05,
};

/**
 * Tag profiles for feature estimation
 * Each profile specifies patterns and how they affect audio features
 */
const TAG_PROFILES: TagProfile[] = [
  // === Energy-related tags ===
  {
    patterns: ['energetic', 'powerful', 'intense', 'heavy', 'aggressive', 'hard'],
    features: { energy: 0.85, loudness: -5, valence: 0.55 },
  },
  {
    patterns: ['chill', 'relaxing', 'mellow', 'calm', 'peaceful', 'ambient'],
    features: { energy: 0.25, loudness: -12, valence: 0.45, tempo: 90 },
  },
  {
    patterns: ['upbeat', 'happy', 'feel good', 'fun', 'party'],
    features: { energy: 0.75, valence: 0.8, danceability: 0.7 },
  },

  // === Tempo-related tags ===
  {
    patterns: ['fast', 'uptempo', 'driving'],
    features: { tempo: 140, energy: 0.75 },
  },
  {
    patterns: ['slow', 'ballad', 'downtempo'],
    features: { tempo: 75, energy: 0.35, danceability: 0.35 },
  },

  // === Genre-based estimates ===
  {
    patterns: ['metal', 'death metal', 'black metal', 'thrash', 'hardcore'],
    features: { energy: 0.95, loudness: -4, tempo: 160, valence: 0.35, danceability: 0.3, instrumentalness: 0.2 },
  },
  {
    patterns: ['punk', 'punk rock', 'pop punk'],
    features: { energy: 0.85, tempo: 160, loudness: -5, danceability: 0.5 },
  },
  {
    patterns: ['rock', 'alternative rock', 'indie rock', 'hard rock'],
    features: { energy: 0.7, loudness: -6, tempo: 125, acousticness: 0.15 },
  },
  {
    patterns: ['classic rock', 'soft rock', '70s', '80s rock'],
    features: { energy: 0.6, loudness: -7, tempo: 115, acousticness: 0.25 },
  },
  {
    patterns: ['pop', 'dance pop', 'synthpop', 'electropop'],
    features: { energy: 0.7, danceability: 0.7, valence: 0.65, tempo: 120, loudness: -5 },
  },
  {
    patterns: ['electronic', 'edm', 'electro', 'electronica'],
    features: { energy: 0.75, danceability: 0.7, acousticness: 0.05, instrumentalness: 0.4, tempo: 128 },
  },
  {
    patterns: ['house', 'deep house', 'tech house'],
    features: { energy: 0.7, danceability: 0.8, tempo: 125, acousticness: 0.05, instrumentalness: 0.5 },
  },
  {
    patterns: ['techno', 'minimal techno'],
    features: { energy: 0.8, danceability: 0.75, tempo: 130, acousticness: 0.02, instrumentalness: 0.7 },
  },
  {
    patterns: ['trance', 'progressive trance', 'psytrance'],
    features: { energy: 0.8, danceability: 0.65, tempo: 138, acousticness: 0.02, instrumentalness: 0.6, valence: 0.6 },
  },
  {
    patterns: ['dubstep', 'brostep', 'bass'],
    features: { energy: 0.85, danceability: 0.6, tempo: 140, loudness: -4, acousticness: 0.02 },
  },
  {
    patterns: ['drum and bass', 'dnb', 'jungle'],
    features: { energy: 0.85, danceability: 0.65, tempo: 174, acousticness: 0.02, instrumentalness: 0.4 },
  },
  {
    patterns: ['hip hop', 'hip-hop', 'rap', 'trap'],
    features: { energy: 0.65, danceability: 0.75, speechiness: 0.25, tempo: 95, valence: 0.5, acousticness: 0.1 },
  },
  {
    patterns: ['r&b', 'rnb', 'rhythm and blues', 'neo soul'],
    features: { energy: 0.5, danceability: 0.65, valence: 0.55, tempo: 95, acousticness: 0.3 },
  },
  {
    patterns: ['soul', 'motown', 'funk'],
    features: { energy: 0.65, danceability: 0.7, valence: 0.7, tempo: 110, acousticness: 0.35 },
  },
  {
    patterns: ['jazz', 'smooth jazz', 'bebop', 'swing'],
    features: { energy: 0.45, danceability: 0.5, acousticness: 0.6, instrumentalness: 0.5, valence: 0.55, tempo: 120 },
  },
  {
    patterns: ['blues', 'delta blues', 'chicago blues'],
    features: { energy: 0.5, danceability: 0.45, acousticness: 0.55, valence: 0.4, tempo: 95 },
  },
  {
    patterns: ['classical', 'orchestra', 'symphony', 'baroque', 'romantic'],
    features: { energy: 0.35, danceability: 0.2, acousticness: 0.9, instrumentalness: 0.95, valence: 0.4, tempo: 90, loudness: -15 },
  },
  {
    patterns: ['folk', 'folk rock', 'traditional'],
    features: { energy: 0.45, danceability: 0.45, acousticness: 0.75, valence: 0.5, tempo: 100 },
  },
  {
    patterns: ['country', 'americana', 'bluegrass'],
    features: { energy: 0.55, danceability: 0.55, acousticness: 0.6, valence: 0.6, tempo: 115 },
  },
  {
    patterns: ['acoustic', 'unplugged', 'singer-songwriter'],
    features: { energy: 0.35, danceability: 0.4, acousticness: 0.85, valence: 0.45, tempo: 100, loudness: -12 },
  },
  {
    patterns: ['reggae', 'dub', 'ska'],
    features: { energy: 0.55, danceability: 0.7, valence: 0.7, tempo: 90, acousticness: 0.3 },
  },
  {
    patterns: ['latin', 'salsa', 'merengue', 'cumbia', 'bachata'],
    features: { energy: 0.7, danceability: 0.8, valence: 0.75, tempo: 105, acousticness: 0.25 },
  },
  {
    patterns: ['reggaeton', 'dembow'],
    features: { energy: 0.75, danceability: 0.85, valence: 0.7, tempo: 95, speechiness: 0.15 },
  },
  {
    patterns: ['k-pop', 'kpop', 'j-pop', 'jpop'],
    features: { energy: 0.75, danceability: 0.75, valence: 0.7, tempo: 125, loudness: -5 },
  },
  {
    patterns: ['afrobeats', 'afropop', 'afrofusion', 'afroswing'],
    features: { energy: 0.65, danceability: 0.8, valence: 0.7, tempo: 105, acousticness: 0.2 },
  },
  {
    patterns: ['amapiano', 'afro house'],
    features: { energy: 0.6, danceability: 0.85, valence: 0.65, tempo: 115, acousticness: 0.1, instrumentalness: 0.3 },
  },
  {
    patterns: ['highlife'],
    features: { energy: 0.55, danceability: 0.7, valence: 0.7, tempo: 110, acousticness: 0.4 },
  },
  {
    patterns: ['hyperpop', 'pc music', 'glitch pop', 'bubblegum bass', 'nightcore', 'digicore'],
    features: { energy: 0.85, danceability: 0.65, valence: 0.6, tempo: 150, loudness: -4, acousticness: 0.02 },
  },
  {
    patterns: ['darkwave', 'coldwave'],
    features: { energy: 0.55, danceability: 0.55, valence: 0.3, tempo: 120, acousticness: 0.1 },
  },
  {
    patterns: ['indie', 'indie pop', 'indie folk'],
    features: { energy: 0.5, danceability: 0.5, acousticness: 0.4, valence: 0.45, tempo: 115 },
  },
  {
    patterns: ['shoegaze', 'dream pop', 'ethereal'],
    features: { energy: 0.45, danceability: 0.4, acousticness: 0.2, valence: 0.4, tempo: 100, loudness: -8 },
  },
  {
    patterns: ['post-rock', 'post rock'],
    features: { energy: 0.55, danceability: 0.25, acousticness: 0.25, instrumentalness: 0.7, valence: 0.35, tempo: 100 },
  },
  {
    patterns: ['ambient', 'drone', 'dark ambient'],
    features: { energy: 0.2, danceability: 0.15, acousticness: 0.3, instrumentalness: 0.9, valence: 0.3, tempo: 80, loudness: -18 },
  },
  {
    patterns: ['lofi', 'lo-fi', 'chillhop'],
    features: { energy: 0.35, danceability: 0.55, acousticness: 0.35, instrumentalness: 0.6, valence: 0.45, tempo: 85 },
  },

  // === Mood-based tags ===
  {
    patterns: ['sad', 'melancholic', 'depressing', 'dark'],
    features: { valence: 0.2, energy: 0.35, mode: 0 },
  },
  {
    patterns: ['romantic', 'love', 'sensual'],
    features: { valence: 0.55, energy: 0.45, tempo: 95 },
  },
  {
    patterns: ['angry', 'aggressive', 'rage'],
    features: { energy: 0.9, valence: 0.3, loudness: -4 },
  },

  // === Production style ===
  {
    patterns: ['live', 'concert', 'bootleg'],
    features: { liveness: 0.8, acousticness: 0.4 },
  },
  {
    patterns: ['instrumental', 'no vocals'],
    features: { instrumentalness: 0.9, speechiness: 0.02 },
  },
  {
    patterns: ['vocal', 'vocals', 'a cappella', 'acappella'],
    features: { instrumentalness: 0.05, speechiness: 0.1, acousticness: 0.5 },
  },
  {
    patterns: ['spoken word', 'poetry', 'spoken'],
    features: { speechiness: 0.8, instrumentalness: 0.1, danceability: 0.3 },
  },
];

/**
 * Estimates audio features from a list of tags
 *
 * @param tags - Array of tag strings (from Last.fm)
 * @returns Estimated audio features
 */
export function estimateFeaturesFromTags(tags: string[]): EstimatedFeatures {
  if (tags.length === 0) {
    return { ...DEFAULT_FEATURES };
  }

  // Normalize tags to lowercase for matching
  const normalizedTags = tags.map(t => t.toLowerCase());

  // Track which features have been adjusted and by how much
  const adjustments: Map<keyof EstimatedFeatures, number[]> = new Map();

  // Find matching profiles and collect adjustments
  for (const profile of TAG_PROFILES) {
    const matches = profile.patterns.some(pattern =>
      normalizedTags.some(tag => tag.includes(pattern.toLowerCase()))
    );

    if (matches) {
      for (const [feature, value] of Object.entries(profile.features)) {
        const key = feature as keyof EstimatedFeatures;
        if (!adjustments.has(key)) {
          adjustments.set(key, []);
        }
        adjustments.get(key)!.push(value as number);
      }
    }
  }

  // Build final features by averaging adjustments
  const result: EstimatedFeatures = { ...DEFAULT_FEATURES };

  Array.from(adjustments.entries()).forEach(([feature, values]) => {
    if (values.length > 0) {
      // Average all adjustments for this feature
      const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      result[feature] = avg;
    }
  });

  // Clamp values to valid ranges
  result.energy = clamp(result.energy, 0, 1);
  result.danceability = clamp(result.danceability, 0, 1);
  result.valence = clamp(result.valence, 0, 1);
  result.acousticness = clamp(result.acousticness, 0, 1);
  result.instrumentalness = clamp(result.instrumentalness, 0, 1);
  result.liveness = clamp(result.liveness, 0, 1);
  result.speechiness = clamp(result.speechiness, 0, 1);
  result.tempo = clamp(result.tempo, 40, 220);
  result.loudness = clamp(result.loudness, -60, 0);

  return result;
}

/**
 * Clamps a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Determines if the estimated features have high confidence
 * (based on how many tags matched profiles)
 */
export function getConfidenceLevel(tags: string[]): 'high' | 'medium' | 'low' {
  if (tags.length === 0) return 'low';

  const normalizedTags = tags.map(t => t.toLowerCase());
  let matchCount = 0;

  for (const profile of TAG_PROFILES) {
    const matches = profile.patterns.some(pattern =>
      normalizedTags.some(tag => tag.includes(pattern.toLowerCase()))
    );
    if (matches) matchCount++;
  }

  if (matchCount >= 5) return 'high';
  if (matchCount >= 2) return 'medium';
  return 'low';
}
