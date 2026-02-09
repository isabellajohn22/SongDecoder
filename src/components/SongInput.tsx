'use client';

/**
 * SongInput Component
 * ============================================================================
 * Input component for entering song name and artist.
 * Features search suggestions and handles submission.
 * ============================================================================
 */

import { useState, FormEvent, useCallback, useEffect, useRef } from 'react';

interface SearchResult {
  id: string;
  name: string;
  artist: string;
  listeners: number;
}

interface SongInputProps {
  onSubmit: (track: string, artist: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function SongInput({ onSubmit, isLoading, error }: SongInputProps) {
  const [track, setTrack] = useState('');
  const [artist, setArtist] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search for suggestions as user types
  const searchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      // Handle non-200 responses explicitly
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[SongInput] Search API error: ${response.status} - ${errorData.error || 'Unknown error'}`
        );
        setSuggestions([]);
        return;
      }

      // Parse successful response
      const data = await response.json();
      
      // Safely handle results array
      if (Array.isArray(data.results)) {
        setSuggestions(data.results);
      } else {
        console.warn('[SongInput] Search API returned unexpected response format:', data);
        setSuggestions([]);
      }
    } catch (error) {
      // Log fetch errors explicitly (network issues, JSON parse errors, etc.)
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[SongInput] Search request failed: ${errorMsg}`);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (track.length >= 2 && !artist) {
      searchTimeoutRef.current = setTimeout(() => {
        searchSuggestions(track);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [track, artist, searchSuggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (track.trim() && !isLoading) {
      onSubmit(track.trim(), artist.trim());
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (result: SearchResult) => {
    setTrack(result.name);
    setArtist(result.artist);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto" ref={containerRef}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Track name input */}
        <div className="relative">
          <label htmlFor="track-input" className="block text-xs uppercase tracking-widest text-white/50 mb-2.5 font-medium">
            Song Name
          </label>
          <input
            id="track-input"
            type="text"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            placeholder="Enter song name (e.g., Bohemian Rhapsody)"
            disabled={isLoading}
            className="w-full px-4 py-3 text-base border border-white/20 rounded-xl
                     bg-black/40 backdrop-blur-md text-white placeholder-white/45
                     focus:outline-none focus:ring-1 focus:ring-purple-400/50 focus:border-white/30 focus:bg-black/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
            aria-describedby={error ? 'input-error' : undefined}
            autoComplete="off"
          />

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-zinc-900/95 border border-white/20 rounded-xl shadow-2xl shadow-black/40 max-h-60 overflow-auto backdrop-blur-sm">
              {suggestions.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(result)}
                  className="w-full px-4 py-3 text-left hover:bg-white/15
                           flex flex-col border-b border-white/10 last:border-0
                           transition-colors duration-150"
                >
                  <span className="font-medium text-white">{result.name}</span>
                  <span className="text-sm text-white/60">{result.artist}</span>
                </button>
              ))}
            </div>
          )}

          {/* Loading indicator for search */}
          {isSearching && (
            <div className="absolute right-4 top-11 text-white/50">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
        </div>

        {/* Artist input */}
        <div>
          <label htmlFor="artist-input" className="block text-xs uppercase tracking-widest text-white/50 mb-2.5 font-medium">
            Artist <span className="text-white/40 font-normal">(recommended)</span>
          </label>
          <input
            id="artist-input"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Enter artist name (e.g., Queen)"
            disabled={isLoading}
            className="w-full px-4 py-3 text-base border border-white/20 rounded-xl
                     bg-black/40 backdrop-blur-md text-white placeholder-white/45
                     focus:outline-none focus:ring-1 focus:ring-purple-400/50 focus:border-white/30 focus:bg-black/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!track.trim() || isLoading}
          className="w-full px-4 py-3 bg-black/40 hover:bg-purple-500/30 active:bg-purple-500/40 text-white font-medium rounded-xl
                   border border-white/20 hover:border-purple-400/40 active:border-purple-400/60
                   focus:outline-none focus:ring-1 focus:ring-purple-400/50
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black/40 disabled:hover:border-white/20
                   transition-all duration-200 backdrop-blur-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze Song'
          )}
        </button>

        {/* Error message */}
        {error && (
          <div
            id="input-error"
            className="text-red-400/90 text-sm px-1 font-medium"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Help text */}
        <p className="text-xs text-white/50 text-center leading-relaxed">
          Enter a song name and we&apos;ll analyze its vibe and recommend similar tracks.
          Adding the artist helps find the exact song you want.
        </p>
      </form>
    </div>
  );
}
