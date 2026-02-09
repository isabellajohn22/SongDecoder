/**
 * Recommendation Weights Tests
 * ============================================================================
 * Unit tests for distance scoring and reason generation.
 * ============================================================================
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  generateRecommendationReason,
  RERANK_WEIGHTS,
  NORMALIZATION,
} from './recommendation-weights';

describe('calculateDistance', () => {
  const baseSeed = {
    danceability: 0.7,
    energy: 0.8,
    valence: 0.5,
    acousticness: 0.3,
    instrumentalness: 0.1,
    speechiness: 0.1,
    liveness: 0.2,
    tempo: 120,
    loudness: -6,
  };

  it('returns zero distance for identical features', () => {
    const result = calculateDistance(baseSeed, { ...baseSeed });
    expect(result.totalDistance).toBe(0);
    expect(Object.values(result.dimensionDiffs).every((d) => d === 0)).toBe(true);
  });

  it('calculates correct distance for different danceability', () => {
    const candidate = { ...baseSeed, danceability: 0.5 };
    const result = calculateDistance(baseSeed, candidate);
    
    // Danceability diff = |0.5 - 0.7| = 0.2
    expect(result.dimensionDiffs.danceability).toBeCloseTo(0.2);
    
    // Total should include weighted danceability contribution
    const expectedContribution = 0.2 * RERANK_WEIGHTS.danceability;
    expect(result.totalDistance).toBeGreaterThanOrEqual(expectedContribution);
  });

  it('normalizes tempo difference by dividing by 60', () => {
    const candidate = { ...baseSeed, tempo: 180 }; // 60 BPM difference
    const result = calculateDistance(baseSeed, candidate);
    
    // Tempo diff = |180 - 120| / 60 = 1.0
    expect(result.dimensionDiffs.tempo).toBeCloseTo(1.0);
  });

  it('clamps tempo difference to 1.0', () => {
    const candidate = { ...baseSeed, tempo: 240 }; // 120 BPM difference
    const result = calculateDistance(baseSeed, candidate);
    
    // Should be clamped to 1.0
    expect(result.dimensionDiffs.tempo).toBe(1.0);
  });

  it('normalizes loudness difference by dividing by 20', () => {
    const candidate = { ...baseSeed, loudness: -16 }; // 10 dB difference
    const result = calculateDistance(baseSeed, candidate);
    
    // Loudness diff = |(-16) - (-6)| / 20 = 0.5
    expect(result.dimensionDiffs.loudness).toBeCloseTo(0.5);
  });

  it('clamps loudness difference to 1.0', () => {
    const candidate = { ...baseSeed, loudness: -40 }; // 34 dB difference
    const result = calculateDistance(baseSeed, candidate);
    
    // Should be clamped to 1.0
    expect(result.dimensionDiffs.loudness).toBe(1.0);
  });

  it('applies weights correctly to total distance', () => {
    // Only change danceability by 0.1
    const candidate = { ...baseSeed, danceability: baseSeed.danceability + 0.1 };
    const result = calculateDistance(baseSeed, candidate);
    
    const expectedTotal = 0.1 * RERANK_WEIGHTS.danceability;
    expect(result.totalDistance).toBeCloseTo(expectedTotal);
  });

  it('calculates higher distance for more different tracks', () => {
    const similar = { ...baseSeed, energy: 0.75 };
    const different = { ...baseSeed, energy: 0.2 };
    
    const resultSimilar = calculateDistance(baseSeed, similar);
    const resultDifferent = calculateDistance(baseSeed, different);
    
    expect(resultDifferent.totalDistance).toBeGreaterThan(resultSimilar.totalDistance);
  });
});

describe('generateRecommendationReason', () => {
  it('identifies the two closest dimensions', () => {
    const diffs = {
      danceability: 0.05, // Very close
      energy: 0.1,
      valence: 0.3,
      acousticness: 0.4,
      instrumentalness: 0.02, // Very close
      speechiness: 0.5,
      liveness: 0.6,
      tempo: 0.7,
      loudness: 0.8,
    };
    
    const reason = generateRecommendationReason(diffs);
    
    // Should mention instrumentalness (0.02) and danceability (0.05)
    expect(reason).toContain('instrumental balance');
    expect(reason).toContain('groove');
    expect(reason).toContain('Matches closely');
  });

  it('returns a properly formatted sentence', () => {
    const diffs = {
      danceability: 0.1,
      energy: 0.2,
      valence: 0.3,
      acousticness: 0.4,
      instrumentalness: 0.5,
      speechiness: 0.6,
      liveness: 0.7,
      tempo: 0.8,
      loudness: 0.9,
    };
    
    const reason = generateRecommendationReason(diffs);
    
    expect(reason).toMatch(/^Matches closely in .+ and .+\.$/);
  });

  it('uses display-friendly names for features', () => {
    const diffs = {
      danceability: 0.01,
      energy: 0.02,
      valence: 0.5,
      acousticness: 0.5,
      instrumentalness: 0.5,
      speechiness: 0.5,
      liveness: 0.5,
      tempo: 0.5,
      loudness: 0.5,
    };
    
    const reason = generateRecommendationReason(diffs);
    
    // Should use "groove" not "danceability"
    expect(reason).toContain('groove');
    // Should use "energy level" not "energy"
    expect(reason).toContain('energy level');
  });

  it('handles ties correctly (takes first two in sorted order)', () => {
    const diffs = {
      danceability: 0.1,
      energy: 0.1,
      valence: 0.1,
      acousticness: 0.5,
      instrumentalness: 0.5,
      speechiness: 0.5,
      liveness: 0.5,
      tempo: 0.5,
      loudness: 0.5,
    };
    
    const reason = generateRecommendationReason(diffs);
    
    // Should return a valid sentence with two features
    expect(reason).toMatch(/^Matches closely in .+ and .+\.$/);
  });
});
