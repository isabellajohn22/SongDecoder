# Why Do I Like This Song?

A web application that analyzes songs using Last.fm to help you understand what makes them appeal to you. The app generates a structured "fingerprint" of audio attributes, human-readable explanations, and similar track recommendations—all using deterministic, rule-based logic.

## Features

- **Audio Fingerprint**: Displays key musical attributes (tempo, key, mode, loudness, energy, danceability, etc.)
- **Vibe Tags**: Six descriptive tags derived from audio features (Energy, Mood, Groove, Texture, Vocal, Intensity)
- **Genre Crossover**: Normalized genre buckets showing musical influences
- **Deterministic Explanations**: Three-bullet TL;DR and detailed section breakdowns
- **Smart Recommendations**: 10 similar tracks ranked by audio feature similarity

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **API**: Last.fm API
- **Validation**: Zod
- **Testing**: Vitest

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Last.fm API key (get one at https://www.last.fm/api/account/create)

## Getting Started

### 1. Clone and Install

```bash
cd SongRec
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/songrec?schema=public"

# Last.fm API key from https://www.last.fm/api/account/create
LASTFM_API_KEY="your_api_key_here"
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Seed the database
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Endpoints

### POST /api/analyze

Analyzes a track and returns a complete analysis.

**Request Body:**
```json
{
  "track": "Bohemian Rhapsody",
  "artist": "Queen"
}
```

**Response:**
```json
{
  "track": {
    "id": "abc123",
    "name": "Track Name",
    "artists": [{"id": "...", "name": "Artist"}],
    "album": {"id": "...", "name": "Album", "images": [...]},
    "external_url": "https://www.last.fm/music/Artist/_/Track"
  },
  "fingerprint": {
    "bpm": 120,
    "key": "C",
    "mode": "Major",
    "time_signature": 4,
    "loudness": -6.5,
    "energy": 0.75,
    "danceability": 0.68,
    "valence": 0.55,
    "acousticness": 0.12,
    "instrumentalness": 0.01,
    "liveness": 0.15,
    "speechiness": 0.05,
    "genres": ["pop", "dance pop"],
    "genre_crossover": ["Pop", "Dance"],
    "vibe_tags": ["High-Energy", "Bittersweet", "Groovy", "Produced", "Melodic Vocals", "Punchy"]
  },
  "explanation": {
    "tldr": ["...", "...", "..."],
    "sections": {
      "rhythm": ["..."],
      "harmony_mood": ["..."],
      "sound_texture": ["..."]
    }
  },
  "recommendations": [
    {
      "id": "...",
      "name": "Similar Track",
      "artists": ["Artist"],
      "external_url": "https://www.last.fm/music/Artist/_/Track",
      "reason": "Matches closely in energy level and groove."
    }
  ]
}
```

### GET /api/track/:id

Retrieves cached analysis for a previously analyzed track.

**Response:** Same as POST /api/analyze

**Error (404):** Track not analyzed yet

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # POST /api/analyze
│   │   └── track/[id]/route.ts   # GET /api/track/:id
│   ├── globals.css               # Tailwind styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── SongInput.tsx             # Track name/artist input
│   ├── LoadingSkeleton.tsx       # Loading state
│   ├── ResultCard.tsx            # Track header + TL;DR
│   ├── FingerprintPanel.tsx      # Audio metrics + tags
│   └── RecommendationList.tsx    # Similar tracks
└── lib/
    ├── constants/
    │   ├── genre-mapping.ts      # Genre bucket mapping
    │   ├── vibe-tags.ts          # Vibe tag derivation
    │   ├── recommendation-weights.ts # Reranking weights
    │   └── explanation-templates.ts  # Explanation rules
    ├── services/
    │   ├── analysis-lastfm.ts    # Core analysis logic
    │   └── types.ts              # Domain types
    ├── lastfm/
    │   ├── client.ts             # Last.fm API client
    │   ├── feature-estimation.ts # Audio feature estimation from tags
    │   └── types.ts              # Last.fm types
    ├── db.ts                     # Prisma client
    └── validation.ts             # Zod schemas
```

## Caching

- Track data is cached in PostgreSQL for 30 days
- Repeated requests for the same track return cached data
- Recommendations are regenerated with each fresh analysis

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `LASTFM_API_KEY` | Last.fm API key | Yes |

## License

MIT
