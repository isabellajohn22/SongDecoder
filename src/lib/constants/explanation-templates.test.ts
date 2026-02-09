/**
 * Explanation Templates Tests
 * ============================================================================
 * Unit tests for the deterministic explanation generation.
 * ============================================================================
 */

import { describe, it, expect } from 'vitest';
import { generateExplanation } from './explanation-templates';

describe('generateExplanation', () => {
  const baseInput = {
    bpm: 120,
    key: 'C',
    mode: 'Major',
    timeSignature: 4,
    danceability: 0.5,
    energy: 0.5,
    valence: 0.5,
    acousticness: 0.5,
    instrumentalness: 0.5,
    loudness: -8,
  };

  describe('TL;DR generation', () => {
    it('returns exactly 3 bullets', () => {
      const result = generateExplanation(baseInput);
      expect(result.tldr).toHaveLength(3);
    });

    it('returns non-empty strings for all bullets', () => {
      const result = generateExplanation(baseInput);
      result.tldr.forEach((bullet) => {
        expect(bullet).toBeTruthy();
        expect(typeof bullet).toBe('string');
        expect(bullet.length).toBeGreaterThan(10);
      });
    });

    it('generates groove bullet based on BPM and danceability', () => {
      // Slow with low danceability
      const slow = generateExplanation({ ...baseInput, bpm: 70, danceability: 0.2 });
      expect(slow.tldr[0]).toContain('slow');

      // Fast with high danceability
      const fast = generateExplanation({ ...baseInput, bpm: 140, danceability: 0.9 });
      expect(fast.tldr[0]).toMatch(/upbeat|driv|dance/i);
    });

    it('generates mood bullet based on mode and valence', () => {
      // Major with high valence
      const bright = generateExplanation({ ...baseInput, mode: 'Major', valence: 0.9 });
      expect(bright.tldr[1]).toMatch(/bright|uplifting|positiv/i);

      // Minor with low valence
      const dark = generateExplanation({ ...baseInput, mode: 'Minor', valence: 0.1 });
      expect(dark.tldr[1]).toMatch(/minor|dark|introspective|moody/i);
    });

    it('generates texture bullet based on acousticness and loudness', () => {
      // Acoustic with soft loudness
      const acoustic = generateExplanation({ ...baseInput, acousticness: 0.9, loudness: -15 });
      expect(acoustic.tldr[2]).toMatch(/acoustic|gentle|intimate/i);

      // Produced with punchy loudness
      const produced = generateExplanation({ ...baseInput, acousticness: 0.1, loudness: -4 });
      expect(produced.tldr[2]).toMatch(/produc|bold|punchy/i);
    });
  });

  describe('Rhythm section', () => {
    it('returns 2-4 bullets', () => {
      const result = generateExplanation(baseInput);
      expect(result.sections.rhythm.length).toBeGreaterThanOrEqual(2);
      expect(result.sections.rhythm.length).toBeLessThanOrEqual(4);
    });

    it('includes BPM information', () => {
      const result = generateExplanation(baseInput);
      const hasTempoReference = result.sections.rhythm.some(
        (bullet) => bullet.includes('BPM') || bullet.includes('tempo')
      );
      expect(hasTempoReference).toBe(true);
    });

    it('includes time signature information', () => {
      const result = generateExplanation(baseInput);
      const hasTimeSig = result.sections.rhythm.some(
        (bullet) => bullet.includes('/4') || bullet.includes('time signature')
      );
      expect(hasTimeSig).toBe(true);
    });
  });

  describe('Harmony/Mood section', () => {
    it('returns 2-4 bullets', () => {
      const result = generateExplanation(baseInput);
      expect(result.sections.harmony_mood.length).toBeGreaterThanOrEqual(2);
      expect(result.sections.harmony_mood.length).toBeLessThanOrEqual(4);
    });

    it('includes key and mode when known', () => {
      const result = generateExplanation(baseInput);
      const hasKeyInfo = result.sections.harmony_mood.some(
        (bullet) => bullet.includes('C') || bullet.includes('major')
      );
      expect(hasKeyInfo).toBe(true);
    });

    it('handles unknown key gracefully', () => {
      const result = generateExplanation({ ...baseInput, key: 'Unknown' });
      const hasNeutralMessage = result.sections.harmony_mood.some(
        (bullet) => bullet.includes('unclear') || bullet.includes('mood')
      );
      expect(hasNeutralMessage).toBe(true);
    });
  });

  describe('Sound/Texture section', () => {
    it('returns 2-4 bullets', () => {
      const result = generateExplanation(baseInput);
      expect(result.sections.sound_texture.length).toBeGreaterThanOrEqual(2);
      expect(result.sections.sound_texture.length).toBeLessThanOrEqual(4);
    });

    it('reflects acousticness level', () => {
      const acoustic = generateExplanation({ ...baseInput, acousticness: 0.9 });
      const hasAcousticRef = acoustic.sections.sound_texture.some(
        (bullet) => bullet.toLowerCase().includes('acoustic')
      );
      expect(hasAcousticRef).toBe(true);

      const electronic = generateExplanation({ ...baseInput, acousticness: 0.1 });
      const hasElectronicRef = electronic.sections.sound_texture.some(
        (bullet) => bullet.toLowerCase().includes('electronic') || bullet.toLowerCase().includes('produc')
      );
      expect(hasElectronicRef).toBe(true);
    });

    it('reflects instrumentalness level', () => {
      const instrumental = generateExplanation({ ...baseInput, instrumentalness: 0.9 });
      const hasInstrumentalRef = instrumental.sections.sound_texture.some(
        (bullet) => bullet.toLowerCase().includes('instrumental')
      );
      expect(hasInstrumentalRef).toBe(true);
    });
  });

  describe('Content quality', () => {
    it('never mentions AI, model, guess, or probably', () => {
      // Test with various input combinations
      const testCases = [
        baseInput,
        { ...baseInput, key: 'Unknown', mode: 'Unknown' },
        { ...baseInput, bpm: 60, energy: 0.1, valence: 0.1 },
        { ...baseInput, bpm: 180, energy: 0.9, valence: 0.9 },
      ];

      testCases.forEach((input) => {
        const result = generateExplanation(input);
        const allText = [
          ...result.tldr,
          ...result.sections.rhythm,
          ...result.sections.harmony_mood,
          ...result.sections.sound_texture,
        ].join(' ').toLowerCase();

        expect(allText).not.toContain('ai');
        expect(allText).not.toContain('model');
        expect(allText).not.toContain('guess');
        expect(allText).not.toContain('probably');
      });
    });

    it('produces deterministic output for same input', () => {
      const result1 = generateExplanation(baseInput);
      const result2 = generateExplanation(baseInput);

      expect(result1).toEqual(result2);
    });

    it('produces different output for different input', () => {
      const result1 = generateExplanation(baseInput);
      const result2 = generateExplanation({ ...baseInput, bpm: 60, valence: 0.1 });

      expect(result1.tldr).not.toEqual(result2.tldr);
    });
  });
});
