'use client';

/**
 * Home Page - Why Do I Like This Song?
 * ============================================================================
 * Analyze songs to understand their vibe and find similar tracks.
 * Modern dark-first design with animated gradients.
 * ============================================================================
 */

import { useState, useMemo } from 'react';
import {
  SongInput,
  LoadingSkeleton,
  ResultCard,
  FingerprintPanel,
  RecommendationList,
} from '@/components';
import type { AnalysisResponse } from '@/lib/services/types';
import { getVibeGradient, type VibeGenre } from '@/lib/vibeTaxonomy';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  // Get gradient based on vibe profile
  const gradient = useMemo(() => {
    if (!analysis?.vibeProfile) return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    return getVibeGradient(analysis.vibeProfile.primaryVibeGenre as VibeGenre);
  }, [analysis?.vibeProfile]);

  /**
   * Handles form submission by calling the analyze API
   */
  const handleSubmit = async (track: string, artist: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          track,
          artist: artist || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred while analyzing the track.');
        setAnalysis(null);
        return;
      }

      setAnalysis(data);
    } catch {
      setError('Failed to connect to the server. Please try again.');
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative">
      {/* Animated gradient background */}
      <div
        className="vibe-gradient-bg"
        style={{ background: gradient }}
      />

      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-12 pb-14">
          <h1 className="hero-title">
            Why Do I Like This Song?
          </h1>
          <p className="mt-2 text-white/50 dark:text-white/50 max-w-lg">
            Discover why a song hits your brain just right, and find more tracks with the same energy
          </p>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Input section */}
        <section className="mb-12">
          <div className="glass-card p-6">
            <SongInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </section>

        {/* Results section */}
        <section>
          {isLoading && <LoadingSkeleton />}

          {!isLoading && analysis && (
            <div className="space-y-8">
              {/* Hero card with track info and vibe */}
              <ResultCard
                track={analysis.track}
                vibeProfile={analysis.vibeProfile}
              />

              {/* Why it feels like that */}
              <div className="glass-card p-6">
                <FingerprintPanel
                  fingerprint={analysis.fingerprint}
                  vibeProfile={analysis.vibeProfile}
                />
              </div>

              {/* Recommendations */}
              <RecommendationList
                recommendations={analysis.recommendations}
              />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !analysis && !error && (
            <div className="text-center py-20">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white/90 mb-3">
                Enter a song to decode its vibe
              </h2>
              <p className="text-white/50 max-w-md mx-auto mb-8">
                Type a song name and artist above to analyze its rhythm, mood, and texture.
                We&apos;ll explain why it resonates and find similar tracks.
              </p>
              <div className="inline-flex flex-col gap-2 text-sm text-white/40">
                <p className="font-medium text-white/50 mb-1">Try these:</p>
                <span>&quot;Bohemian Rhapsody&quot; by Queen</span>
                <span>&quot;Blinding Lights&quot; by The Weeknd</span>
                <span>&quot;Get Lucky&quot; by Daft Punk</span>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs text-white/30 text-center">
            Powered by Last.fm. Vibe analysis uses tag-based inference.
          </p>
        </div>
      </footer>
    </main>
  );
}
