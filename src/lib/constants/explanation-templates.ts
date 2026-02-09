/**
 * Explanation Generation Templates
 *
 * Rule-based templates for generating track explanations from audio features.
 * No AI, no LLM—all outputs are deterministic and template-driven.
 */

/**
 * Audio features needed for explanation generation
 */
export interface ExplanationInput {
  bpm: number;
  key: string; // Note name or "Unknown"
  mode: string; // "Major", "Minor", or "Unknown"
  timeSignature: number;
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  loudness: number;
}

/**
 * Structure of the generated explanation
 */
export interface ExplanationOutput {
  tldr: string[];
  sections: {
    rhythm: string[];
    harmony_mood: string[];
    sound_texture: string[];
  };
}

// TL;DR: Groove (based on BPM + danceability)
function getTldrGroove(bpm: number, danceability: number): string {
  // BPM categories
  const isSlow = bpm < 90;
  const isMedium = bpm >= 90 && bpm <= 120;
  const isFast = bpm > 120 && bpm <= 150;
  const isVeryFast = bpm > 150;

  // Danceability categories
  const isLowDance = danceability < 0.4;
  const isMidDance = danceability >= 0.4 && danceability <= 0.75;
  const isHighDance = danceability > 0.75;

  // Slow + Low Dance
  if (isSlow && isLowDance) {
    return 'A slow, contemplative rhythm that invites deep listening.';
  }
  // Slow + Mid Dance
  if (isSlow && isMidDance) {
    return 'A laid-back tempo with a subtle groove that sways gently.';
  }
  // Slow + High Dance
  if (isSlow && isHighDance) {
    return 'A slow burner with surprisingly strong rhythmic pull.';
  }

  // Medium + Low Dance
  if (isMedium && isLowDance) {
    return 'A moderate pace that emphasizes melody over movement.';
  }
  // Medium + Mid Dance
  if (isMedium && isMidDance) {
    return 'A comfortable mid-tempo groove that feels natural and easy.';
  }
  // Medium + High Dance
  if (isMedium && isHighDance) {
    return 'A mid-tempo track with strong dance-floor appeal.';
  }

  // Fast + Low Dance
  if (isFast && isLowDance) {
    return 'A brisk tempo but with restrained rhythmic intensity.';
  }
  // Fast + Mid Dance
  if (isFast && isMidDance) {
    return 'An upbeat tempo with solid rhythmic momentum.';
  }
  // Fast + High Dance
  if (isFast && isHighDance) {
    return 'A driving, dance-ready rhythm that keeps energy high.';
  }

  // Very Fast + any danceability
  if (isVeryFast && isLowDance) {
    return 'A racing tempo that prioritizes intensity over groove.';
  }
  if (isVeryFast && isMidDance) {
    return 'A fast-paced track with steady rhythmic foundation.';
  }
  // Very Fast + High Dance
  return 'A high-speed rhythm built for maximum movement.';
}

/**
 * TL;DR Bullet B: Mood
 * Based on mode (Major/Minor) and valence
 */
function getTldrMood(mode: string, valence: number): string {
  const isMajor = mode === 'Major';
  const isMinor = mode === 'Minor';
  const isUnknownMode = mode === 'Unknown';

  const isLowValence = valence < 0.35;
  const isMidValence = valence >= 0.35 && valence <= 0.7;
  const isHighValence = valence > 0.7;

  // Major mode combinations
  if (isMajor && isLowValence) {
    return 'A major key with unexpectedly dark emotional undertones.';
  }
  if (isMajor && isMidValence) {
    return 'A balanced major-key mood that feels thoughtful and grounded.';
  }
  if (isMajor && isHighValence) {
    return 'A bright, uplifting major-key sound that radiates positivity.';
  }

  // Minor mode combinations
  if (isMinor && isLowValence) {
    return 'A minor key that deepens the introspective, moody atmosphere.';
  }
  if (isMinor && isMidValence) {
    return 'A minor-key foundation with nuanced emotional texture.';
  }
  if (isMinor && isHighValence) {
    return 'A minor key with surprising warmth and emotional lift.';
  }

  // Unknown mode - rely solely on valence
  if (isUnknownMode && isLowValence) {
    return 'A deeply atmospheric, emotionally weighty mood.';
  }
  if (isUnknownMode && isMidValence) {
    return 'A balanced emotional tone with room for interpretation.';
  }
  return 'An emotionally bright and engaging overall feel.';
}

/**
 * TL;DR Bullet C: Texture
 * Based on acousticness and loudness
 */
function getTldrTexture(acousticness: number, loudness: number): string {
  const isAcoustic = acousticness > 0.6;
  const isMixed = acousticness >= 0.25 && acousticness <= 0.6;
  const isProduced = acousticness < 0.25;

  const isPunchy = loudness > -6;
  const isModerate = loudness >= -12 && loudness <= -6;
  const isSoft = loudness < -12;

  // Acoustic combinations
  if (isAcoustic && isPunchy) {
    return 'Acoustic instrumentation with forward, present sound.';
  }
  if (isAcoustic && isModerate) {
    return 'Warm acoustic textures at comfortable listening levels.';
  }
  if (isAcoustic && isSoft) {
    return 'Gentle acoustic tones that feel intimate and delicate.';
  }

  // Mixed combinations
  if (isMixed && isPunchy) {
    return 'A blend of organic and produced sounds with punchy presence.';
  }
  if (isMixed && isModerate) {
    return 'Balanced production mixing acoustic and electronic elements.';
  }
  if (isMixed && isSoft) {
    return 'Subtle production with restrained, atmospheric layers.';
  }

  // Produced combinations
  if (isProduced && isPunchy) {
    return 'Heavily produced with bold, in-your-face sound design.';
  }
  if (isProduced && isModerate) {
    return 'Polished production with clear, well-balanced mix.';
  }
  return 'Softly produced textures that prioritize atmosphere.';
}

// =============================================================================
// RHYTHM SECTION TEMPLATES
// =============================================================================

/**
 * Generates rhythm section bullets based on BPM, time signature, and danceability
 */
function getRhythmBullets(bpm: number, timeSignature: number, danceability: number): string[] {
  const bullets: string[] = [];

  // BPM bullet
  if (bpm < 80) {
    bullets.push(`At ${bpm} BPM, this track moves at a deliberate, slow pace.`);
  } else if (bpm < 100) {
    bullets.push(`At ${bpm} BPM, this track has a relaxed, laid-back tempo.`);
  } else if (bpm < 120) {
    bullets.push(`At ${bpm} BPM, this track sits in a comfortable mid-tempo zone.`);
  } else if (bpm < 140) {
    bullets.push(`At ${bpm} BPM, this track has an upbeat, energetic tempo.`);
  } else {
    bullets.push(`At ${bpm} BPM, this track races forward with high-speed momentum.`);
  }

  // Time signature bullet
  if (timeSignature === 4) {
    bullets.push('The 4/4 time signature provides a familiar, steady pulse.');
  } else if (timeSignature === 3) {
    bullets.push('The 3/4 time signature creates a waltz-like, flowing feel.');
  } else if (timeSignature === 6) {
    bullets.push('The 6/8 time signature adds a rolling, compound groove.');
  } else if (timeSignature === 5) {
    bullets.push('The unusual 5/4 time signature creates an asymmetric, distinctive rhythm.');
  } else if (timeSignature === 7) {
    bullets.push('The 7/4 time signature brings complexity and unpredictability.');
  } else {
    bullets.push(`The ${timeSignature}/4 time signature shapes the rhythmic foundation.`);
  }

  // Danceability bullet
  if (danceability < 0.3) {
    bullets.push('Rhythmically sparse, this track prioritizes texture over groove.');
  } else if (danceability < 0.5) {
    bullets.push('The rhythm has subtle movement without demanding dance engagement.');
  } else if (danceability < 0.7) {
    bullets.push('A solid rhythmic backbone encourages natural body movement.');
  } else {
    bullets.push('Strong beat patterns create an irresistible urge to move.');
  }

  return bullets;
}

// =============================================================================
// HARMONY/MOOD SECTION TEMPLATES
// =============================================================================

/**
 * Generates harmony/mood section bullets based on key, mode, and valence
 */
function getHarmonyMoodBullets(key: string, mode: string, valence: number): string[] {
  const bullets: string[] = [];

  // Key bullet
  if (key === 'Unknown') {
    bullets.push('The harmonic center is unclear from metadata, but the mood and groove cues remain strong.');
  } else {
    bullets.push(`Rooted in ${key} ${mode.toLowerCase()}, the harmony sets a clear tonal foundation.`);
  }

  // Mode bullet (only if known)
  if (mode === 'Major') {
    bullets.push('The major mode generally conveys openness and resolution.');
  } else if (mode === 'Minor') {
    bullets.push('The minor mode adds depth and a sense of tension or longing.');
  }

  // Valence bullet
  if (valence < 0.25) {
    bullets.push('Emotionally heavy, the track carries a dark, introspective weight.');
  } else if (valence < 0.45) {
    bullets.push('A melancholic undercurrent colors the emotional landscape.');
  } else if (valence < 0.65) {
    bullets.push('The emotional tone sits in a balanced, bittersweet middle ground.');
  } else if (valence < 0.85) {
    bullets.push('Warmth and positivity flow through the harmonic choices.');
  } else {
    bullets.push('Bright and exuberant, the track overflows with joyful energy.');
  }

  return bullets;
}

// =============================================================================
// SOUND/TEXTURE SECTION TEMPLATES
// =============================================================================

/**
 * Generates sound/texture section bullets based on acousticness, instrumentalness, and loudness
 */
function getSoundTextureBullets(
  acousticness: number,
  instrumentalness: number,
  loudness: number
): string[] {
  const bullets: string[] = [];

  // Acousticness bullet
  if (acousticness > 0.75) {
    bullets.push('Predominantly acoustic, natural instrument tones define the sound.');
  } else if (acousticness > 0.5) {
    bullets.push('Acoustic elements play a significant role in the sonic palette.');
  } else if (acousticness > 0.25) {
    bullets.push('Production blends acoustic and electronic elements in balance.');
  } else {
    bullets.push('Electronic production and synthesis dominate the sound design.');
  }

  // Instrumentalness bullet
  if (instrumentalness > 0.7) {
    bullets.push('The track leans heavily instrumental, with minimal vocal presence.');
  } else if (instrumentalness > 0.4) {
    bullets.push('Instruments and vocals share the spotlight in balanced proportion.');
  } else {
    bullets.push('Vocals take center stage as the primary melodic vehicle.');
  }

  // Loudness bullet
  if (loudness > -5) {
    bullets.push('Mastered loud and punchy for maximum impact.');
  } else if (loudness > -8) {
    bullets.push('Solid dynamic range with assertive but controlled loudness.');
  } else if (loudness > -12) {
    bullets.push('Moderate loudness preserves subtle dynamic nuances.');
  } else {
    bullets.push('Quiet and restrained, allowing for intimate listening.');
  }

  return bullets;
}

// =============================================================================
// MAIN GENERATOR FUNCTION
// =============================================================================

/**
 * Generates the complete explanation object from audio features.
 * All output is deterministic based on the input values.
 *
 * @param input - Audio features for explanation generation
 * @returns Complete explanation with TL;DR and sections
 */
export function generateExplanation(input: ExplanationInput): ExplanationOutput {
  const tldr = [
    getTldrGroove(input.bpm, input.danceability),
    getTldrMood(input.mode, input.valence),
    getTldrTexture(input.acousticness, input.loudness),
  ];

  const rhythm = getRhythmBullets(input.bpm, input.timeSignature, input.danceability);
  const harmonyMood = getHarmonyMoodBullets(input.key, input.mode, input.valence);
  const soundTexture = getSoundTextureBullets(
    input.acousticness,
    input.instrumentalness,
    input.loudness
  );

  return {
    tldr,
    sections: {
      rhythm,
      harmony_mood: harmonyMood,
      sound_texture: soundTexture,
    },
  };
}
