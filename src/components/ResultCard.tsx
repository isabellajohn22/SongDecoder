'use client';

/**
 * ResultCard Component (Hero Card)
 * ============================================================================
 * Displays the track with primary vibe-genre and descriptor chips.
 * Modern, premium "Why Do I Like This Song?" style.
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import Image from 'next/image';
import type { TrackInfo, VibeProfile } from '@/lib/services/types';
import { getVibeGradient, VIBE_META, type VibeGenre } from '@/lib/vibeTaxonomy';

/**
 * VibeLabel — shows VIBE_META description on hover/tap.
 * Uses a controlled tooltip with a short enter delay to prevent flicker.
 */
function VibeLabel({
  vibe,
  children,
}: {
  vibe: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const description = VIBE_META[vibe as VibeGenre]?.description;

  const handleEnter = useCallback(() => {
    const t = setTimeout(() => setOpen(true), 180);
    setTimer(t);
  }, []);

  const handleLeave = useCallback(() => {
    if (timer) clearTimeout(timer);
    setTimer(null);
    setOpen(false);
  }, [timer]);

  if (!description) return <>{children}</>;

  return (
    <span
      className="relative inline-block cursor-default"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={() => setOpen((v) => !v)}
    >
      {children}
      <span
        className={`absolute left-1/2 -translate-x-1/2 top-full mt-3
          w-72 px-4 py-3 rounded-xl
          bg-[rgba(18,18,22,0.95)] backdrop-blur-md border border-white/10
          shadow-xl shadow-black/40
          text-[13px] font-normal leading-relaxed text-white/70 text-center
          pointer-events-none select-none z-50
          transition-all duration-200
          ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
      >
        {description}
      </span>
    </span>
  );
}

interface ResultCardProps {
  track: TrackInfo;
  vibeProfile: VibeProfile;
}

export function ResultCard({ track, vibeProfile }: ResultCardProps) {
  const albumImageUrl = track.album.images[0]?.url;
  const artistNames = track.artists.map((a) => a.name).join(', ');
  const gradient = getVibeGradient(vibeProfile.primaryVibeGenre as VibeGenre);

  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-30 blur-3xl"
        style={{ background: gradient }}
      />

      <div className="relative glass-card p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Album art */}
          <div className="flex-shrink-0">
            {albumImageUrl ? (
              <div className="relative group">
                <Image
                  src={albumImageUrl}
                  alt={`${track.album.name} album cover`}
                  width={180}
                  height={180}
                  className="rounded-2xl shadow-2xl shadow-black/50 group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{ background: gradient }}
                />
              </div>
            ) : (
              <div className="w-[180px] h-[180px] bg-white/5 rounded-2xl flex items-center justify-center">
                <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Title & Artist */}
            <div>
              <h1 className="hero-title truncate">{track.name}</h1>
              <p className="text-xl text-white/60 dark:text-white/60 mt-2 truncate">{artistNames}</p>
              <p className="text-sm text-white/40 dark:text-white/40 mt-1 truncate">{track.album.name}</p>
            </div>

            {/* Primary Vibe Genre */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-widest text-white/40 dark:text-white/40 mb-2">This track feels like</p>
              <VibeLabel vibe={vibeProfile.primaryVibeGenre}>
                <h2 className="hero-vibe">{vibeProfile.primaryVibeGenre}</h2>
              </VibeLabel>
            </div>

            {/* Secondary Vibes */}
            {vibeProfile.secondaryVibeGenres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {vibeProfile.secondaryVibeGenres.map((vibe) => (
                  <VibeLabel key={vibe} vibe={vibe}>
                    <span className="vibe-genre-badge text-xs">
                      {vibe}
                    </span>
                  </VibeLabel>
                ))}
              </div>
            )}

            {/* Descriptor chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {vibeProfile.descriptors.slice(0, 5).map((desc, i) => (
                <span
                  key={desc}
                  className={`descriptor-chip ${i === 0 ? 'descriptor-chip-primary' : ''}`}
                >
                  {desc}
                </span>
              ))}
            </div>

            {/* External link */}
            <a
              href={track.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mt-4"
            >
              View on Last.fm
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
