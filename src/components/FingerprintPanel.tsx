'use client';

/**
 * FingerprintPanel Component
 * ============================================================================
 * Displays "Why it feels like that" section with human-readable explanations
 * derived from vibe tags and audio characteristics.
 * ============================================================================
 */

import type { TrackFingerprint, VibeProfile } from '@/lib/services/types';

interface FingerprintPanelProps {
  fingerprint: TrackFingerprint;
  vibeProfile: VibeProfile;
}

/**
 * Icons for the "why" cards (inline SVG for simplicity)
 */
const Icons = {
  rhythm: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  energy: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  mood: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  ),
  texture: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  vibe: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  genre: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
};

/**
 * AudioDNAPill Component
 * ============================================================================
 * Displays a single Audio DNA attribute as a rounded pill chip.
 * ============================================================================
 */
interface AudioDNAPillProps {
  label: string;
  value: string;
}

function AudioDNAPill({ label, value }: AudioDNAPillProps) {
  return (
    <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors">
      <span className="text-xs font-medium text-white/70 truncate">
        {label}: <span className="text-white/90">{value}</span>
      </span>
    </div>
  );
}

/**
 * Generates "Why it feels like that" explanation cards
 * Provides human-readable insights about the track's characteristics
 */
function generateWhyCards(
  fingerprint: TrackFingerprint,
  vibeProfile: VibeProfile
): Array<{ icon: keyof typeof Icons; title: string; description: string }> {
  const cards: Array<{ icon: keyof typeof Icons; title: string; description: string }> = [];

  // Rhythm explanation
  const tempoDesc = fingerprint.bpm < 90 ? 'slow, relaxed pace' :
    fingerprint.bpm < 120 ? 'moderate, steady rhythm' :
    fingerprint.bpm < 140 ? 'upbeat, driving tempo' : 'fast, high-energy pulse';

  cards.push({
    icon: 'rhythm',
    title: 'The Rhythm',
    description: `At ${fingerprint.bpm} BPM, this track has a ${tempoDesc} that ${
      fingerprint.danceability > 0.6 ? 'makes you want to move' : 'lets you settle in'
    }.`,
  });

  // Energy explanation
  const energyLevel = fingerprint.energy > 0.7 ? 'high-intensity' :
    fingerprint.energy > 0.4 ? 'balanced' : 'mellow';

  cards.push({
    icon: 'energy',
    title: 'The Energy',
    description: `A ${energyLevel} feel with ${
      fingerprint.loudness > -8 ? 'punchy, full dynamics' : 'softer, more intimate dynamics'
    }${fingerprint.liveness > 0.3 ? ' and a live, organic quality' : ''}.`,
  });

  // Mood explanation
  const moodDesc = fingerprint.valence > 0.6 ? 'uplifting and positive' :
    fingerprint.valence > 0.35 ? 'emotionally balanced' : 'introspective and moody';

  cards.push({
    icon: 'mood',
    title: 'The Mood',
    description: `The emotional tone is ${moodDesc}, ${
      fingerprint.mode === 'Major' ? 'with a bright, major key warmth' :
      fingerprint.mode === 'Minor' ? 'with minor key depth and complexity' : 'creating its own emotional space'
    }.`,
  });

  // Texture explanation
  const textureElements: string[] = [];
  if (fingerprint.acousticness > 0.5) textureElements.push('organic acoustic tones');
  if (fingerprint.instrumentalness > 0.5) textureElements.push('instrumental focus');
  if (fingerprint.speechiness > 0.3) textureElements.push('vocal-forward production');
  if (textureElements.length === 0) {
    textureElements.push(fingerprint.acousticness > 0.3 ? 'a blend of acoustic and electronic' : 'polished electronic production');
  }

  cards.push({
    icon: 'texture',
    title: 'The Texture',
    description: `Built around ${textureElements.join(' and ')}, giving it a ${
      fingerprint.acousticness > 0.6 ? 'warm, natural character' : 'modern, crafted sound'
    }.`,
  });

  // Vibe explanation (from vibe profile)
  if (vibeProfile.descriptors.length > 0) {
    const topDescriptors = vibeProfile.descriptors.slice(0, 3);
    cards.push({
      icon: 'vibe',
      title: 'The Vibe',
      description: `It feels ${topDescriptors.join(', ')}—capturing the essence of ${vibeProfile.primaryVibeGenre.toLowerCase()}.`,
    });
  }

  // Genre context
  if (fingerprint.genres.length > 0 || vibeProfile.secondaryVibeGenres.length > 0) {
    const genreContext = fingerprint.genres.slice(0, 2).join(' and ') ||
      vibeProfile.secondaryVibeGenres.slice(0, 2).join(' and ');
    cards.push({
      icon: 'genre',
      title: 'The Context',
      description: `Drawing from ${genreContext} traditions, blending familiar elements with its own identity.`,
    });
  }

  return cards.slice(0, 6); // Max 6 cards
}

/**
 * Converts raw fingerprint values to Audio DNA pill data
 * Returns the exact same data values, only formatted for pill display
 */
function generateAudioDNA(fingerprint: TrackFingerprint) {
  const dna: Array<{ label: string; value: string }> = [];

  // BPM - exact value
  dna.push({
    label: 'Tempo',
    value: `${fingerprint.bpm} BPM`,
  });

  // Key + Mode - exact values
  dna.push({
    label: 'Key',
    value: `${fingerprint.key} ${fingerprint.mode}`,
  });

  // Time signature - exact value
  dna.push({
    label: 'Time',
    value: `${fingerprint.time_signature}/4`,
  });

  // Energy percentage - exact calculation
  dna.push({
    label: 'Energy',
    value: `${Math.round(fingerprint.energy * 100)}%`,
  });

  // Danceability percentage - exact calculation
  dna.push({
    label: 'Danceable',
    value: `${Math.round(fingerprint.danceability * 100)}%`,
  });

  // Valence/Positivity percentage - exact calculation
  dna.push({
    label: 'Positive',
    value: `${Math.round(fingerprint.valence * 100)}%`,
  });

  return dna;
}

export function FingerprintPanel({ fingerprint, vibeProfile }: FingerprintPanelProps) {
  const whyCards = generateWhyCards(fingerprint, vibeProfile);
  const audioDNA = generateAudioDNA(fingerprint);

  return (
    <div className="space-y-8">
      {/* Why it feels like that */}
      <div>
        <h3 className="text-lg font-semibold text-white/90 dark:text-white/90 mb-4">
          Why it feels like that
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyCards.map((card, index) => (
            <div key={index} className="why-card group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                  {Icons[card.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white/90 dark:text-white/90 mb-1">
                    {card.title}
                  </h4>
                  <p className="text-sm text-white/60 dark:text-white/60 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audio DNA */}
      <div>
        <h3 className="text-lg font-semibold text-white/90 dark:text-white/90 mb-4">
          Audio DNA
        </h3>
        <div className="flex flex-wrap gap-2">
          {audioDNA.map((item, index) => (
            <AudioDNAPill key={index} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </div>
  );
}
