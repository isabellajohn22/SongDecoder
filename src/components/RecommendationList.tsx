'use client';

/**
 * RecommendationList Component
 * ============================================================================
 * Displays recommendations in a playlist-style format with album artwork,
 * vibe chips, and subtle hover interactions.
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import type { TrackRecommendation } from '@/lib/services/types';

interface RecommendationListProps {
  recommendations: TrackRecommendation[];
}

/**
 * External link icon
 */
const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

/**
 * Play icon for playlist feel
 */
const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

/**
 * Placeholder icon for missing album art
 */
const MusicNoteIcon = () => (
  <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
  </svg>
);

/**
 * Album art thumbnail with graceful error fallback
 */
function AlbumArt({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  const onError = useCallback(() => setFailed(true), []);

  if (!src || failed) {
    return (
      <div className="w-full h-full bg-white/[0.04] flex items-center justify-center">
        <MusicNoteIcon />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover"
      loading="lazy"
      onError={onError}
    />
  );
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
          <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white/80 mb-2">No Similar Tracks Found</h3>
        <p className="text-sm text-white/50">
          This track doesn&apos;t have enough similarity data yet.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Playlist header */}
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-lg font-semibold text-white/90">
          Vibe Playlist
        </h3>
        <p className="text-sm text-white/40 mt-1">
          {recommendations.length} tracks that match this energy
        </p>
      </div>

      {/* Playlist tracks */}
      <div className="divide-y divide-white/[0.03]">
        {recommendations.map((rec, index) => {
          const vibeTag = rec.vibeProfile?.descriptors?.[0];

          return (
            <a
              key={rec.id}
              href={rec.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-6 py-3
                         hover:bg-white/[0.03] transition-all duration-200 group"
            >
              {/* Track number */}
              <div className="w-8 text-center flex-shrink-0">
                <span className="text-sm text-white/30 group-hover:hidden">
                  {index + 1}
                </span>
                <span className="text-violet-400 hidden group-hover:block">
                  <PlayIcon />
                </span>
              </div>

              {/* Album art */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden
                              border border-white/[0.06]
                              shadow-sm shadow-black/20
                              group-hover:shadow-violet-500/10
                              group-hover:border-white/10
                              group-hover:scale-[1.03]
                              transition-all duration-200">
                <AlbumArt src={rec.albumArt} />
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">
                  {rec.name}
                </h4>
                <p className="text-xs text-white/50 truncate">
                  {rec.artists.join(', ')}
                </p>
                {/* Hover vibe descriptor — fades in on hover */}
                {vibeTag && (
                  <span className="text-[10px] text-white/0 group-hover:text-white/30
                                   transition-colors duration-300 leading-none">
                    {vibeTag}
                  </span>
                )}
              </div>

              {/* Vibe chips */}
              {rec.vibeProfile && rec.vibeProfile.descriptors.length > 0 && (
                <div className="hidden md:flex items-center gap-1.5">
                  {rec.vibeProfile.descriptors.slice(0, 2).map((desc) => (
                    <span key={desc} className="inline-flex px-2 py-0.5 text-[10px] rounded-full
                                               bg-white/5 text-white/40">
                      {desc}
                    </span>
                  ))}
                </div>
              )}

              {/* External link */}
              <div className="flex-shrink-0 text-white/20 group-hover:text-violet-400 transition-colors">
                <ExternalLinkIcon />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
