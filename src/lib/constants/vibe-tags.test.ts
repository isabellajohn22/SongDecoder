/**
 * Vibe Tags Tests
 * ============================================================================
 * Unit tests for the vibe tag derivation from audio features.
 * ============================================================================
 */

import { describe, it, expect } from 'vitest';
import {
  deriveEnergyTag,
  deriveMoodTag,
  deriveGrooveTag,
  deriveTextureTag,
  deriveVocalTag,
  deriveIntensityTag,
  deriveVibeTags,
  ENERGY_TAGS,
  MOOD_TAGS,
  GROOVE_TAGS,
  TEXTURE_TAGS,
  VOCAL_TAGS,
  INTENSITY_TAGS,
} from './vibe-tags';

describe('deriveEnergyTag', () => {
  it('returns "Chill" for energy < 0.35', () => {
    expect(deriveEnergyTag(0.1)).toBe(ENERGY_TAGS.LOW);
    expect(deriveEnergyTag(0.34)).toBe(ENERGY_TAGS.LOW);
  });

  it('returns "Balanced" for energy 0.35-0.70', () => {
    expect(deriveEnergyTag(0.35)).toBe(ENERGY_TAGS.MID);
    expect(deriveEnergyTag(0.5)).toBe(ENERGY_TAGS.MID);
    expect(deriveEnergyTag(0.7)).toBe(ENERGY_TAGS.MID);
  });

  it('returns "High-Energy" for energy > 0.70', () => {
    expect(deriveEnergyTag(0.71)).toBe(ENERGY_TAGS.HIGH);
    expect(deriveEnergyTag(0.9)).toBe(ENERGY_TAGS.HIGH);
    expect(deriveEnergyTag(1.0)).toBe(ENERGY_TAGS.HIGH);
  });
});

describe('deriveMoodTag', () => {
  it('returns "Moody" for valence < 0.35', () => {
    expect(deriveMoodTag(0.1)).toBe(MOOD_TAGS.LOW);
    expect(deriveMoodTag(0.34)).toBe(MOOD_TAGS.LOW);
  });

  it('returns "Bittersweet" for valence 0.35-0.70', () => {
    expect(deriveMoodTag(0.35)).toBe(MOOD_TAGS.MID);
    expect(deriveMoodTag(0.5)).toBe(MOOD_TAGS.MID);
    expect(deriveMoodTag(0.7)).toBe(MOOD_TAGS.MID);
  });

  it('returns "Bright" for valence > 0.70', () => {
    expect(deriveMoodTag(0.71)).toBe(MOOD_TAGS.HIGH);
    expect(deriveMoodTag(0.9)).toBe(MOOD_TAGS.HIGH);
  });
});

describe('deriveGrooveTag', () => {
  it('returns "Loose" for danceability < 0.40', () => {
    expect(deriveGrooveTag(0.1)).toBe(GROOVE_TAGS.LOW);
    expect(deriveGrooveTag(0.39)).toBe(GROOVE_TAGS.LOW);
  });

  it('returns "Groovy" for danceability 0.40-0.75', () => {
    expect(deriveGrooveTag(0.4)).toBe(GROOVE_TAGS.MID);
    expect(deriveGrooveTag(0.6)).toBe(GROOVE_TAGS.MID);
    expect(deriveGrooveTag(0.75)).toBe(GROOVE_TAGS.MID);
  });

  it('returns "Dance-Forward" for danceability > 0.75', () => {
    expect(deriveGrooveTag(0.76)).toBe(GROOVE_TAGS.HIGH);
    expect(deriveGrooveTag(0.9)).toBe(GROOVE_TAGS.HIGH);
  });
});

describe('deriveTextureTag', () => {
  it('returns "Produced" for acousticness < 0.25', () => {
    expect(deriveTextureTag(0.1)).toBe(TEXTURE_TAGS.LOW);
    expect(deriveTextureTag(0.24)).toBe(TEXTURE_TAGS.LOW);
  });

  it('returns "Mixed" for acousticness 0.25-0.60', () => {
    expect(deriveTextureTag(0.25)).toBe(TEXTURE_TAGS.MID);
    expect(deriveTextureTag(0.4)).toBe(TEXTURE_TAGS.MID);
    expect(deriveTextureTag(0.6)).toBe(TEXTURE_TAGS.MID);
  });

  it('returns "Acoustic" for acousticness > 0.60', () => {
    expect(deriveTextureTag(0.61)).toBe(TEXTURE_TAGS.HIGH);
    expect(deriveTextureTag(0.9)).toBe(TEXTURE_TAGS.HIGH);
  });
});

describe('deriveVocalTag', () => {
  it('returns "Melodic Vocals" for speechiness <= 0.33', () => {
    expect(deriveVocalTag(0.1)).toBe(VOCAL_TAGS.LOW);
    expect(deriveVocalTag(0.33)).toBe(VOCAL_TAGS.LOW);
  });

  it('returns "Talky/Rap-Adjacent" for speechiness > 0.33', () => {
    expect(deriveVocalTag(0.34)).toBe(VOCAL_TAGS.HIGH);
    expect(deriveVocalTag(0.8)).toBe(VOCAL_TAGS.HIGH);
  });
});

describe('deriveIntensityTag', () => {
  it('returns "Soft" for loudness < -12', () => {
    expect(deriveIntensityTag(-20)).toBe(INTENSITY_TAGS.LOW);
    expect(deriveIntensityTag(-13)).toBe(INTENSITY_TAGS.LOW);
  });

  it('returns "Moderate" for loudness -12 to -6', () => {
    expect(deriveIntensityTag(-12)).toBe(INTENSITY_TAGS.MID);
    expect(deriveIntensityTag(-8)).toBe(INTENSITY_TAGS.MID);
    expect(deriveIntensityTag(-6)).toBe(INTENSITY_TAGS.MID);
  });

  it('returns "Punchy" for loudness > -6', () => {
    expect(deriveIntensityTag(-5)).toBe(INTENSITY_TAGS.HIGH);
    expect(deriveIntensityTag(-2)).toBe(INTENSITY_TAGS.HIGH);
    expect(deriveIntensityTag(0)).toBe(INTENSITY_TAGS.HIGH);
  });
});

describe('deriveVibeTags', () => {
  it('returns exactly 6 tags', () => {
    const result = deriveVibeTags({
      energy: 0.5,
      valence: 0.5,
      danceability: 0.5,
      acousticness: 0.5,
      speechiness: 0.2,
      loudness: -8,
    });
    expect(result).toHaveLength(6);
  });

  it('returns tags in correct order: Energy, Mood, Groove, Texture, Vocal, Intensity', () => {
    const result = deriveVibeTags({
      energy: 0.1, // Chill
      valence: 0.1, // Moody
      danceability: 0.1, // Loose
      acousticness: 0.9, // Acoustic
      speechiness: 0.1, // Melodic Vocals
      loudness: -20, // Soft
    });

    expect(result[0]).toBe('Chill');
    expect(result[1]).toBe('Moody');
    expect(result[2]).toBe('Loose');
    expect(result[3]).toBe('Acoustic');
    expect(result[4]).toBe('Melodic Vocals');
    expect(result[5]).toBe('Soft');
  });

  it('handles high-energy dance track profile', () => {
    const result = deriveVibeTags({
      energy: 0.9,
      valence: 0.8,
      danceability: 0.85,
      acousticness: 0.1,
      speechiness: 0.1,
      loudness: -4,
    });

    expect(result[0]).toBe('High-Energy');
    expect(result[1]).toBe('Bright');
    expect(result[2]).toBe('Dance-Forward');
    expect(result[3]).toBe('Produced');
    expect(result[4]).toBe('Melodic Vocals');
    expect(result[5]).toBe('Punchy');
  });

  it('handles acoustic ballad profile', () => {
    const result = deriveVibeTags({
      energy: 0.2,
      valence: 0.3,
      danceability: 0.3,
      acousticness: 0.8,
      speechiness: 0.05,
      loudness: -15,
    });

    expect(result[0]).toBe('Chill');
    expect(result[1]).toBe('Moody');
    expect(result[2]).toBe('Loose');
    expect(result[3]).toBe('Acoustic');
    expect(result[4]).toBe('Melodic Vocals');
    expect(result[5]).toBe('Soft');
  });
});
