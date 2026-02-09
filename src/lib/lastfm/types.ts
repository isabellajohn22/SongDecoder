/**
 * Last.fm API Type Definitions
 * ============================================================================
 * Types for Last.fm API responses and internal data structures.
 * ============================================================================
 */

/**
 * Last.fm image in various sizes
 */
export interface LastFmImage {
  '#text': string;
  size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' | '';
}

/**
 * Last.fm tag
 */
export interface LastFmTag {
  name: string;
  url: string;
}

/**
 * Last.fm artist (basic info)
 */
export interface LastFmArtistBasic {
  name: string;
  mbid?: string;
  url: string;
}

/**
 * Last.fm artist with full details
 */
export interface LastFmArtistFull {
  name: string;
  mbid?: string;
  url: string;
  image?: LastFmImage[];
  stats?: {
    listeners: string;
    playcount: string;
  };
  tags?: {
    tag: LastFmTag[];
  };
  bio?: {
    summary: string;
    content: string;
  };
}

/**
 * Last.fm album info
 */
export interface LastFmAlbum {
  '#text'?: string;
  title?: string;
  mbid?: string;
  url?: string;
  image?: LastFmImage[];
}

/**
 * Last.fm track from search results
 */
export interface LastFmTrackSearch {
  name: string;
  artist: string;
  url: string;
  listeners: string;
  image?: LastFmImage[];
  mbid?: string;
}

/**
 * Last.fm track with full info
 */
export interface LastFmTrackFull {
  name: string;
  mbid?: string;
  url: string;
  duration?: string;
  listeners?: string;
  playcount?: string;
  artist: LastFmArtistBasic;
  album?: {
    artist: string;
    title: string;
    mbid?: string;
    url: string;
    image?: LastFmImage[];
  };
  toptags?: {
    tag: LastFmTag[];
  };
  wiki?: {
    summary: string;
    content: string;
  };
}

/**
 * Last.fm similar track
 */
export interface LastFmSimilarTrack {
  name: string;
  playcount: number;
  mbid?: string;
  match: number; // 0.0 to 1.0 similarity score
  url: string;
  duration?: number;
  artist: LastFmArtistBasic;
  image?: LastFmImage[];
}

/**
 * Last.fm track search response
 */
export interface LastFmTrackSearchResponse {
  results: {
    'opensearch:Query': {
      '#text': string;
      searchTerms: string;
    };
    'opensearch:totalResults': string;
    trackmatches: {
      track: LastFmTrackSearch[];
    };
  };
}

/**
 * Last.fm track.getInfo response
 */
export interface LastFmTrackInfoResponse {
  track: LastFmTrackFull;
}

/**
 * Last.fm track.getSimilar response
 */
export interface LastFmSimilarTracksResponse {
  similartracks: {
    track: LastFmSimilarTrack[];
    '@attr': {
      artist: string;
    };
  };
}

/**
 * Last.fm artist.getInfo response
 */
export interface LastFmArtistInfoResponse {
  artist: LastFmArtistFull;
}

/**
 * Last.fm similar artist
 */
export interface LastFmSimilarArtist {
  name: string;
  mbid?: string;
  match: string; // 0.0 to 1.0 as string
  url: string;
  image?: LastFmImage[];
}

/**
 * Last.fm artist.getSimilar response
 */
export interface LastFmSimilarArtistsResponse {
  similarartists: {
    artist: LastFmSimilarArtist[];
    '@attr': {
      artist: string;
    };
  };
}

/**
 * Last.fm artist top track
 */
export interface LastFmArtistTopTrack {
  name: string;
  playcount: string;
  listeners: string;
  mbid?: string;
  url: string;
  artist: LastFmArtistBasic;
  image?: LastFmImage[];
}

/**
 * Last.fm artist.getTopTracks response
 */
export interface LastFmArtistTopTracksResponse {
  toptracks: {
    track: LastFmArtistTopTrack[];
    '@attr': {
      artist: string;
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

/**
 * Last.fm tag.getTopTracks response
 */
export interface LastFmTagTopTracksResponse {
  tracks: {
    track: Array<{
      name: string;
      duration?: string;
      mbid?: string;
      url: string;
      artist: LastFmArtistBasic;
      image?: LastFmImage[];
      '@attr': {
        rank: string;
      };
    }>;
    '@attr': {
      tag: string;
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}

/**
 * Normalized track data for internal use
 */
export interface NormalizedTrack {
  id: string; // Generated from name + artist
  name: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  albumImageUrl: string | null;
  externalUrl: string;
  duration: number; // in seconds
  tags: string[];
  playcount: number;
  listeners: number;
}

/**
 * Normalized similar track
 */
export interface NormalizedSimilarTrack {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  externalUrl: string;
  matchScore: number;
  albumImageUrl: string | null;
}
