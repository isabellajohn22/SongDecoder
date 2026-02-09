/**
 * Vibe Taxonomy System
 * ============================================================================
 * Maps raw music tags → vibe-genres + descriptor chips for music discovery.
 *
 * ARCHITECTURE — Tiered Evidence Scoring
 * Each vibe defines a "signal" with four tag tiers:
 *   core  (+3)  — specific genre/style tags that strongly indicate this vibe
 *   broad (+1)  — generic umbrella tags that weakly support it
 *   boost (+1.5) — mood/context modifiers, only counted when base evidence exists
 *   anti  (-2)  — tags that actively push away from this vibe
 *
 * This prevents generic tags like "pop" or "rock" from dominating while still
 * letting them contribute alongside more specific evidence. Boost tags act as
 * amplifiers — they never create a vibe match alone, only strengthen one.
 *
 * To add a new vibe:
 *   1. Add to VIBE_GENRES, VIBE_META, VIBE_SIGNALS, VIBE_GRADIENTS
 *   2. Run dev assertions (automatic in NODE_ENV=development)
 * ============================================================================
 */

// =============================================================================
// VIBE-GENRE LABELS (canonical)
// =============================================================================

export const VIBE_GENRES = [
  'Star Fishing',
  'Velvet Haze',
  'Cloud Nine',
  'Golden Hour',
  'Festival Buzz',
  'Sunrise Drive',
  'Crowd Control',
  'Heat Check',
  'Low-Light Groovy',
  'Speakeasy',
  'Tumblr Core',
  'White Noise',
  'Soul Kitchen',
  'Honey Glow',
  'Saddle Up',
  'Fireplace Folk',
  'Vintage Warmth',
  'Sunday Morning',
  'Bar for Bar',
  'Soul Train',
  'Afterparty',
  'Mind Palace',
  'Color Theory',
  'Rhythm Therapy',
  'Club Catalyst',
  'Indie Wanderlust',
  'Garage Grunge',
  'Indie Sleaze',
  'Lo-Fi Nostalgia',
  'Feel The Bass',
  'Dad Rock',
  'Full Throttle',
  'Mosh Pit Magic',
  'Windows Down',
  'Hammock Mode',
  'Under A Palm Tree',
  'Rainy Day Replay',
  'Zen Garden',
  'Do Not Disturb',
  'Scenic Route',
  'Heart on Sleeve',
  'Unclassified (Vibe TBD)',
  'Pulso',
  'Palmwine Nights',
  'Side B',
  'Pixelated Pop',
  'Electric Daydream',
  'In Sync',
] as const;

export type VibeGenre = (typeof VIBE_GENRES)[number];

// =============================================================================
// VIBE META (for UI info buttons)
// =============================================================================

export const VIBE_META: Record<VibeGenre, { description: string }> = {
  'Star Fishing': { description: 'Floating, cosmic, slightly untethered... transcendental and expansive. Headphones recommended.' },
  'Velvet Haze': { description: 'Soft-focus indie with rounded edges... peaceful co-existence.' },
  'Cloud Nine': { description: 'Light, effortless, buoyant... undeniably happy.' },
  'Golden Hour': { description: 'Warm tones, gentle euphoria... romantic, cinematic, fleeting core-memory feeling.' },
  'Festival Buzz': { description: 'Made to be felt in a crowd... the rush before the drop and the collective scream.' },
  'Sunrise Drive': { description: 'Quiet momentum... calm but moving forward in early-morning light.' },
  'Crowd Control': { description: 'Controlled chaos for packed rooms... house-leaning, groove-heavy, magnetic.' },
  'Heat Check': { description: 'Hard, sharp, unapologetic... trap/rap that hits with precision.' },
  'Low-Light Groovy': { description: 'Dim lights, slow movement... basslines lead, walking through the city at night.' },
  'Speakeasy': { description: 'Jazz-rooted, smoky, intimate... velvet curtains, low ceilings, a little dangerous.' },
  'Tumblr Core': { description: 'Emotionally online... 2am scrolling, soft sadness with sharp edges.' },
  'White Noise': { description: 'Alt-emo textures... distant but intense, heavy atmosphere.' },
  'Soul Kitchen': { description: 'Warm, intimate, human... family dinner energy, soulful and honest.' },
  'Honey Glow': { description: 'Sweet country warmth... sincere, comforting, golden.' },
  'Saddle Up': { description: 'Classic roots + pop-country ease... built for driving, dancing, singing along.' },
  'Fireplace Folk': { description: 'Cozy indie folk... cold night, cards with friends, warmth filling the room.' },
  'Vintage Warmth': { description: 'Time-worn folk/country... analog warmth, storytelling first.' },
  'Sunday Morning': { description: 'Stillness with intention... coffee, open windows, quietly hopeful.' },
  'Bar for Bar': { description: 'High-energy rap built around rhythm and presence... car speakers or party settings.' },
  'Soul Train': { description: 'Pure groove and joy... classic soul/funk that lifts the room.' },
  'Afterparty': { description: 'Low lights, late hours... chill rap + R&B, 3am conversations.' },
  'Mind Palace': { description: 'Spacious and introspective... clean melodies, quiet clarity.' },
  'Color Theory': { description: 'Rap that plays with contrast... bold, colorful, experimental but undeniable.' },
  'Rhythm Therapy': { description: 'Movement as medicine... groove-forward, danceable, joyful.' },
  'Club Catalyst': { description: 'Instant reaction music... undeniable bangers that flip the room.' },
  'Indie Wanderlust': { description: 'Carefree exploration... classic indie movement and open air.' },
  'Garage Grunge': { description: 'Raw early-2000s alternative... loud guitars, imperfect edges.' },
  'Indie Sleaze': { description: 'Messy, stylish, chaotic... sticky floors, irony over sincerity.' },
  'Lo-Fi Nostalgia': { description: 'Familiar, faded memories... warm throwbacks that comfort.' },
  'Feel The Bass': { description: 'Physical intensity... heavy EDM, hood up, shades on, world off.' },
  'Dad Rock': { description: 'Comfort classics... helping your dad clean the garage on a Saturday.' },
  'Full Throttle': { description: 'Maximum energy... hard rock/metal built for speed and power.' },
  'Mosh Pit Magic': { description: 'Chaotic joy... collision music for crowds.' },
  'Windows Down': { description: 'Sun-soaked freedom... beach day drive home, golden and loud.' },
  'Hammock Mode': { description: 'Peaceful contentment... warm breeze, nothing urgent.' },
  'Under A Palm Tree': { description: 'Laid-back reggae grooves... shade, warmth, unbothered time.' },
  'Rainy Day Replay': { description: 'Soft introspection... rain on windows, thoughts wandering.' },
  'Zen Garden': { description: 'Focused calm... lo-fi / meditative concentration.' },
  'Do Not Disturb': { description: 'Total immersion... nothing else but you and the music.' },
  'Scenic Route': { description: 'Unrushed exploration... back roads, detours, path less traveled.' },
  'Heart on Sleeve': { description: 'Big feelings... belting in the car like no one\'s watching.' },
  'Unclassified (Vibe TBD)': { description: 'No rules yet. Tracks that don\'t fit—but still hit.' },
  'Pulso': { description: 'Latin rhythms at their most physical. Built on percussion, heat, and collective movement. Feels like packed rooms, late hours, and a pulse that travels through the crowd all at once.' },
  'Palmwine Nights': { description: 'Soft glow and effortless rhythm. Afrobeats and Afro-pop that feel relaxed but alive—melodic, warm, and social. Music for night air, slow movement, and conversations that drift as easily as the beat.' },
  'Side B': { description: 'Emotional, loud, and unapologetically felt. Hooks you shout even when your voice cracks. Feels like being in the back seat, windows open, singing every word without caring who hears. Nostalgia, urgency, and release all at once.' },
  'Pixelated Pop': { description: 'Hyper-digital and overstimulating in the best way. Bright melodies, warped vocals, and glitchy energy that feels online, chaotic, and playful. Music that moves fast, breaks rules, and never stays still for long.' },
  'Electric Daydream': { description: 'Synths, movement, and a sense of wonder. Indie electronic that feels cinematic and light—floating between late-night drives and glowing city lights.' },
  'In Sync': { description: 'Polished K-pop where music, movement, and visuals are inseparable. Tight performances, addictive hooks, and the shared ritual of watching everything line up perfectly.' },
};

// =============================================================================
// DESCRIPTOR CHIPS
// =============================================================================

export const DESCRIPTORS = [
  // Emotional qualities
  'euphoric', 'melancholic', 'bittersweet', 'hopeful', 'nostalgic',
  'yearning', 'cathartic', 'tender', 'defiant', 'wistful',
  'triumphant', 'anxious', 'peaceful', 'rebellious', 'romantic',
  'introspective', 'playful', 'somber', 'uplifting', 'haunting',

  // Temporal / Situational
  'late-night', 'early-morning', 'golden-hour', 'midnight', 'sunset',
  'rainy-day', 'road-trip', 'party-starter', 'wind-down', 'workout',
  'study-session', 'coffee-shop', 'bedroom', 'festival', 'commute',

  // Sonic textures
  'shimmering', 'gritty', 'lush', 'sparse', 'layered',
  'crystalline', 'fuzzy', 'crisp', 'warm', 'cold',
  'raw', 'polished', 'lo-fi', 'hi-fi', 'organic',
  'synthetic', 'acoustic', 'electric', 'hazy', 'sharp',
  'smooth',

  // Energy descriptors
  'driving', 'floating', 'pulsing', 'swaying', 'stomping',
  'gliding', 'crashing', 'building', 'releasing', 'simmering',
  'explosive', 'gentle', 'relentless', 'hypnotic', 'kinetic',

  // Vibe qualities
  'dreamy', 'ethereal', 'cinematic', 'intimate', 'anthemic',
  'moody', 'sunny', 'dark', 'bright', 'smoky',
  'spacious', 'claustrophobic', 'expansive', 'minimal', 'maximal',

  // Genre-adjacent feels
  'indie-coded', 'alt-leaning', 'pop-adjacent', 'underground',
  'mainstream-friendly', 'cult-classic', 'timeless', 'futuristic', 'retro',
  'experimental', 'accessible', 'niche', 'crossover', 'genre-fluid',

  // Repeatability / Addiction
  'brain-scratch', 'earworm', 'repeatable', 'grower', 'instant-hit',
  'deep-cut', 'crowd-pleaser', 'hidden-gem', 'sleeper', 'anthem',

  // Production qualities
  'bass-heavy', 'treble-bright', 'mid-focused', 'sub-rattling',
  'vocal-forward', 'instrumental-led', 'beat-driven', 'melody-first',
  'texture-rich', 'groove-locked', 'dynamic', 'compressed', 'breathing',

  // Cultural / Aesthetic
  'city-nights', 'countryside', 'coastal', 'urban', 'suburban',
  'global', 'local', 'DIY', 'authentic',
  'curated', 'effortless', 'intentional', 'spontaneous', 'crafted',
  'storytelling',
] as const;

export type Descriptor = (typeof DESCRIPTORS)[number];

const DESCRIPTOR_SET: ReadonlySet<string> = new Set(DESCRIPTORS);

// =============================================================================
// TAG GROUPS — reusable tag constants to reduce duplication
// =============================================================================

const T = {
  // Rap / Hip-Hop
  TRAP:         ['trap', 'drill', 'dark trap', 'hard trap', 'grime'],
  RAP:          ['rap', 'hip hop'],
  RAP_ALT:      ['alternative hip hop', 'experimental hip hop', 'art rap', 'experimental rap', 'abstract hip hop'],
  RAP_MELODIC:  ['melodic rap', 'melodic hip hop'],

  // R&B / Soul
  RNB:          ['r&b', 'alternative r&b', 'contemporary r&b'],
  SOUL:         ['neo soul', 'soul', 'classic soul'],
  SLOW_RNB:     ['slow jam', '80s r&b', 'quiet storm'],

  // Funk / Disco
  FUNK_CLASSIC: ['motown', 'disco', 'classic funk', 'boogie'],
  FUNK_MODERN:  ['nu disco', 'future funk', 'funky', 'house funk'],

  // Electronic / Club
  HOUSE:        ['house', 'tech house', 'deep house', 'minimal house'],
  TECHNO:       ['techno', 'trance', 'progressive house', 'uplifting trance'],
  BASS:         ['dubstep', 'riddim', 'brostep', 'drum and bass', 'bass music'],
  EDM:          ['edm', 'big room', 'main stage', 'electro house', 'mainstage'],
  SYNTH:        ['synth pop', 'electropop', 'indie electronic', 'chillsynth', 'future pop'],

  // Rock
  ROCK_CLASSIC: ['classic rock', '70s rock', '80s rock', 'arena rock', 'southern rock'],
  ROCK_ALT:     ['alternative rock', 'grunge', 'post grunge', 'garage rock', 'noise pop'],
  METAL:        ['hard rock', 'heavy metal', 'thrash', 'speed metal', 'death metal'],
  METAL_CORE:   ['metalcore', 'hardcore punk', 'beatdown', 'deathcore'],

  // Indie
  INDIE:        ['indie rock', 'indie pop'],
  INDIE_SLEAZE: ['indie sleaze', 'electroclash', 'bloghouse', 'new rave', 'dance punk'],

  // Emo / Post
  EMO:          ['emo', 'midwest emo', 'screamo'],
  EMO_HEAVY:    ['alternative metal', 'nu metal', 'post hardcore', 'shoegaze metal', 'noise rock'],
  POP_PUNK:     ['pop punk', 'pop rock', 'emo pop', 'warped tour'],

  // Dream / Ambient
  DREAM:        ['dream pop', 'shoegaze', 'slowcore', 'ethereal pop'],
  AMBIENT:      ['space ambient', 'soundscape', 'drone', 'dark ambient'],
  COSMIC:       ['cosmic', 'space', 'astral', 'celestial'],

  // Lo-fi
  LOFI:         ['lo fi', 'chillwave', 'bedroom pop', 'lofi beats'],

  // Folk / Country
  FOLK:         ['indie folk', 'folk', 'chamber folk'],
  COUNTRY_CLASSIC: ['classic country', 'outlaw country', 'bluegrass', 'honky tonk', 'country rock'],
  COUNTRY_MOD:  ['modern country', 'country pop', 'contemporary country'],
  AMERICANA:    ['americana', 'roots', 'traditional folk', 'old time', 'folk blues'],

  // Jazz
  JAZZ:         ['jazz', 'bebop', 'swing', 'jazz fusion', 'bossa nova', 'cool jazz'],

  // Latin
  LATIN_URBAN:  ['reggaeton', 'latin trap', 'dembow', 'perreo', 'latin urban', 'urbano'],
  LATIN_TRAD:   ['salsa', 'bachata', 'cumbia', 'merengue', 'banda', 'regional mexican', 'corrido', 'norteno', 'vallenato'],

  // African
  AFRO:         ['afrobeats', 'afropop', 'afrofusion', 'afroswing'],
  AFRO_DANCE:   ['amapiano', 'highlife', 'afro house'],

  // Reggae
  REGGAE:       ['reggae', 'dub', 'ska', 'dancehall', 'roots reggae'],

  // K-pop / J-pop
  KPOP:         ['k pop', 'korean pop', 'korean'],
  JPOP:         ['j pop', 'japanese pop', 'city pop'],

  // Hyperpop / Glitch
  HYPERPOP:     ['hyperpop', 'pc music', 'glitch pop', 'bubblegum bass', 'nightcore', 'digicore'],
  GLITCH:       ['glitch', 'breakcore', 'idm', 'wonky', 'deconstructed club'],

  // Ballad / Vocal
  BALLAD:       ['ballad', 'power ballad', 'big vocal', 'diva', 'belting'],

  // Mood
  HAPPY:        ['happy', 'feel good', 'joyful', 'upbeat'],
  SAD:          ['sad', 'melancholic', 'heartbreak'],
  CHILL:        ['chill', 'relaxing', 'mellow', 'calm', 'peaceful'],
  AGGRESSIVE:   ['aggressive', 'hard', 'intense'],

  // Context
  MORNING:      ['early morning', 'morning', 'dawn', 'sunrise'],
  NIGHT:        ['late night', 'midnight', 'night'],
  SUMMER:       ['summer', 'beach', 'coastal', 'sunny', 'vacation'],
  STUDY:        ['study', 'focus', 'meditation', 'concentration'],
  CINEMATIC:    ['cinematic', 'soundtrack', 'score', 'immersive', 'headphones'],
  LIVE:         ['live', 'concert', 'bootleg'],
  FESTIVAL:     ['festival', 'arena', 'stadium'],
};

// =============================================================================
// VIBE SIGNAL DEFINITIONS
// =============================================================================
//
// Each vibe gets ONE cohesive definition instead of scattered rules.
//   core:   specific tags → +3 points each
//   broad:  generic tags → +1 point each
//   boost:  context/mood → +1.5 points each (only if ≥1 core or broad matched)
//   anti:   wrong-fit tags → -2 points each
//   descriptors: chips to surface when this vibe scores (must be in DESCRIPTORS)
// =============================================================================

interface VibeSignal {
  core: readonly string[];
  broad?: readonly string[];
  boost?: readonly string[];
  anti?: readonly string[];
  descriptors: readonly Descriptor[];
}

const CORE_W  = 3;
const BROAD_W = 1;
const BOOST_W = 1.5;
const ANTI_W  = -2;

const VIBE_SIGNALS: Record<VibeGenre, VibeSignal> = {
  // ── Cosmic / Atmospheric ──────────────────────────────────────────────
  'Star Fishing': {
    core: [...T.COSMIC, ...T.AMBIENT, 'space rock', 'post rock'],
    broad: ['ambient', 'atmospheric', 'ethereal'],
    boost: ['transcendental', 'expansive', 'psychedelic'],
    anti: [...T.STUDY, 'chill', 'relaxing'],
    descriptors: ['ethereal', 'expansive', 'floating', 'spacious', 'shimmering', 'cinematic', 'hypnotic'],
  },

  'Velvet Haze': {
    core: [...T.DREAM, 'slowdive', 'cocteau twins'],
    broad: ['indie', 'dreamy'],
    boost: ['hazy', 'reverb', 'lush'],
    anti: ['metal', 'aggressive', 'trap', 'drill'],
    descriptors: ['dreamy', 'hazy', 'shimmering', 'floating', 'lush', 'introspective'],
  },

  'Mind Palace': {
    core: ['art pop', 'chamber pop', 'indietronica', 'art rock'],
    broad: ['introspective', 'experimental'],
    boost: ['cerebral', 'minimal', 'clean'],
    anti: ['party', 'banger', 'anthem', 'mosh'],
    descriptors: ['introspective', 'spacious', 'crafted', 'cinematic', 'layered', 'crystalline'],
  },

  // ── Happy / Warm / Cinematic ──────────────────────────────────────────
  'Cloud Nine': {
    core: [...T.HAPPY, 'bubblegum pop'],
    broad: ['pop', 'uplifting'],
    boost: ['bright', 'sunny', 'dance'],
    anti: ['dark', 'sad', 'melancholic', 'aggressive'],
    descriptors: ['uplifting', 'bright', 'euphoric', 'sunny', 'playful', 'instant-hit'],
  },

  'Golden Hour': {
    core: ['golden hour', 'sunset', 'cinematic pop'],
    broad: ['warm', 'nostalgic', 'cinematic'],
    boost: ['romantic', 'dreamy', 'bittersweet'],
    anti: ['aggressive', 'hard', 'dark', 'trap'],
    descriptors: ['golden-hour', 'nostalgic', 'cinematic', 'warm', 'bittersweet', 'romantic'],
  },

  'Sunday Morning': {
    core: ['sunday morning', 'coffee shop', 'acoustic chill'],
    broad: ['peaceful', 'gentle', ...T.MORNING],
    boost: ['acoustic', 'warm', 'light'],
    anti: ['aggressive', 'loud', 'metal', 'trap', 'party'],
    descriptors: ['peaceful', 'early-morning', 'coffee-shop', 'gentle', 'warm', 'hopeful'],
  },

  // ── Festival / Crowd / Club ───────────────────────────────────────────
  'Festival Buzz': {
    core: [...T.FESTIVAL, 'big chorus', ...T.EDM],
    broad: ['anthem', 'edm'],
    boost: [...T.LIVE, 'crowd', 'drop'],
    anti: ['acoustic', 'mellow', 'lo fi', 'folk'],
    descriptors: ['anthemic', 'crowd-pleaser', 'explosive', 'building', 'festival', 'euphoric'],
  },

  'Crowd Control': {
    core: [...T.HOUSE],
    broad: ['electronic', 'club'],
    boost: ['groove', 'pulsing', '4 on the floor'],
    anti: ['rock', 'metal', 'acoustic', 'folk'],
    descriptors: ['groove-locked', 'pulsing', 'kinetic', 'late-night', 'beat-driven', 'hypnotic'],
  },

  'Club Catalyst': {
    core: ['banger', 'throwback', '2000s party', 'electro house'],
    broad: ['edm', 'dance', 'party'],
    boost: ['anthem', 'crowd', 'hype', 'sing along', 'main stage'],
    anti: ['chill', 'acoustic', 'folk', 'study'],
    descriptors: ['crowd-pleaser', 'instant-hit', 'explosive', 'anthem', 'party-starter', 'earworm'],
  },

  'Feel The Bass': {
    core: [...T.BASS],
    broad: ['bass', 'electronic'],
    boost: ['heavy', 'sub', 'wobble', 'filthy'],
    anti: ['acoustic', 'folk', 'jazz', 'chill'],
    descriptors: ['bass-heavy', 'sub-rattling', 'explosive', 'kinetic', 'gritty', 'relentless'],
  },

  'Rhythm Therapy': {
    core: [...T.FUNK_MODERN, 'dance pop'],
    broad: ['dance', 'funk', 'electronic'],
    boost: ['groove', 'joyful', 'movement'],
    anti: ['sad', 'dark', 'aggressive', 'metal'],
    descriptors: ['groove-locked', 'kinetic', 'pulsing', 'uplifting', 'dynamic', 'party-starter'],
  },

  // ── Rap Lanes ─────────────────────────────────────────────────────────
  'Heat Check': {
    core: [...T.TRAP],
    broad: [...T.AGGRESSIVE],
    boost: ['bass', '808', 'dark'],
    anti: ['melodic', 'chill', 'mellow', 'acoustic'],
    descriptors: ['bass-heavy', 'dark', 'sharp', 'relentless', 'explosive', 'sub-rattling'],
  },

  'Bar for Bar': {
    core: ['party rap', 'hype', 'bounce', 'crunk', 'club rap'],
    broad: [...T.RAP],
    boost: ['party', 'energy', 'bass', 'car'],
    anti: ['chill', 'mellow', 'acoustic', 'sad'],
    descriptors: ['beat-driven', 'kinetic', 'party-starter', 'explosive', 'bass-heavy', 'crowd-pleaser'],
  },

  'Afterparty': {
    core: [...T.RAP_MELODIC, 'alternative r&b', 'moody r&b'],
    broad: ['r&b', 'chill'],
    boost: [...T.NIGHT, 'moody', '3am'],
    anti: [...T.MORNING, 'happy', 'upbeat', ...T.AGGRESSIVE],
    descriptors: ['late-night', 'moody', 'intimate', 'romantic', 'hazy', 'smooth'],
  },

  'Color Theory': {
    core: [...T.RAP_ALT],
    broad: ['hip hop'],
    boost: ['experimental', 'creative', 'unconventional'],
    anti: ['mainstream', 'country', 'folk'],
    descriptors: ['experimental', 'dynamic', 'playful', 'crossover', 'genre-fluid', 'futuristic'],
  },

  // ── R&B / Soul / Groove ───────────────────────────────────────────────
  'Soul Kitchen': {
    core: [...T.SOUL, 'neo soul'],
    broad: ['r&b', 'warm'],
    boost: ['vocal', 'tender', 'intimate', 'gospel'],
    anti: ['trap', 'drill', 'electronic', 'metal'],
    descriptors: ['warm', 'tender', 'vocal-forward', 'intimate', 'organic', 'simmering'],
  },

  'Low-Light Groovy': {
    core: [...T.SLOW_RNB, 'quiet storm'],
    broad: ['funk', 'groove', 'r&b'],
    boost: [...T.NIGHT, 'city', 'bassline'],
    anti: [...T.MORNING, 'acoustic', 'rock', 'metal'],
    descriptors: ['groove-locked', 'warm', 'swaying', 'late-night', 'lush', 'moody'],
  },

  'Soul Train': {
    core: [...T.FUNK_CLASSIC, 'classic soul'],
    broad: ['funk', 'retro', '70s'],
    boost: ['dance', 'groove', 'party'],
    anti: ['metal', 'punk', 'sad', 'melancholic'],
    descriptors: ['groove-locked', 'retro', 'party-starter', 'warm', 'uplifting', 'timeless'],
  },

  'Speakeasy': {
    core: [...T.JAZZ, 'lounge'],
    broad: ['smooth jazz'],
    boost: ['smoky', 'intimate', 'cocktail'],
    anti: ['electronic', 'metal', 'punk', 'trap'],
    descriptors: ['smoky', 'intimate', 'organic', 'instrumental-led', 'timeless', 'warm'],
  },

  // ── Emo / Alt / Dark ──────────────────────────────────────────────────
  'Tumblr Core': {
    core: [...T.EMO, 'emo pop', 'sad indie'],
    broad: ['sad', 'indie'],
    boost: ['emotional', 'bedroom', 'vulnerable'],
    anti: ['happy', 'upbeat', 'country', 'jazz'],
    descriptors: ['cathartic', 'yearning', 'bittersweet', 'raw', 'introspective', 'moody'],
  },

  'White Noise': {
    core: [...T.EMO_HEAVY, 'grungegaze'],
    broad: ['heavy', 'distorted'],
    boost: ['dark', 'atmospheric', 'wall of sound'],
    anti: ['pop', 'happy', 'acoustic', 'jazz'],
    descriptors: ['haunting', 'dark', 'gritty', 'layered', 'relentless', 'claustrophobic'],
  },

  // ── Indie / Alt ───────────────────────────────────────────────────────
  'Indie Wanderlust': {
    core: [...T.INDIE, 'indie anthem'],
    broad: ['indie', 'alternative'],
    boost: ['road trip', 'open road', 'carefree'],
    anti: ['metal', 'trap', 'electronic', 'edm'],
    descriptors: ['indie-coded', 'driving', 'uplifting', 'crafted', 'road-trip', 'effortless'],
  },

  'Garage Grunge': {
    core: [...T.ROCK_ALT],
    broad: ['punk', 'alternative'],
    boost: ['raw', 'distorted', 'loud', '2000s'],
    anti: ['chill', 'r&b', 'jazz', 'electronic'],
    descriptors: ['raw', 'gritty', 'rebellious', 'kinetic', 'defiant', 'driving'],
  },

  'Indie Sleaze': {
    core: [...T.INDIE_SLEAZE],
    broad: ['indie', 'party'],
    boost: ['messy', 'chaotic', 'ironic', '2000s'],
    anti: ['folk', 'country', 'acoustic', 'chill'],
    descriptors: ['retro', 'maximal', 'party-starter', 'gritty', 'dynamic', 'rebellious'],
  },

  'Lo-Fi Nostalgia': {
    core: [...T.LOFI],
    broad: ['indie', 'chill'],
    boost: ['nostalgic', 'hazy', 'tape', 'warm'],
    anti: ['metal', 'loud', 'aggressive', 'hard'],
    descriptors: ['lo-fi', 'nostalgic', 'hazy', 'warm', 'bedroom', 'intimate'],
  },

  // ── Folk / Country ────────────────────────────────────────────────────
  'Fireplace Folk': {
    core: [...T.FOLK],
    broad: ['acoustic', 'singer songwriter'],
    boost: ['cozy', 'intimate', 'campfire', 'warm'],
    anti: ['electronic', 'metal', 'punk', 'trap'],
    descriptors: ['acoustic', 'warm', 'intimate', 'organic', 'peaceful', 'gentle'],
  },

  'Honey Glow': {
    core: [...T.COUNTRY_MOD],
    broad: ['country'],
    boost: ['sweet', 'sunny', 'warm'],
    anti: ['outlaw', 'dark', 'hard', 'metal'],
    descriptors: ['warm', 'sunny', 'bright', 'acoustic', 'gentle', 'earworm'],
  },

  'Saddle Up': {
    core: [...T.COUNTRY_CLASSIC],
    broad: ['country'],
    boost: ['road trip', 'driving', 'sing along'],
    anti: ['pop', 'electronic', 'edm'],
    descriptors: ['countryside', 'timeless', 'authentic', 'road-trip', 'driving', 'storytelling'],
  },

  'Vintage Warmth': {
    core: [...T.AMERICANA, 'delta blues', 'chicago blues', 'blues'],
    broad: ['classic', 'retro', 'traditional'],
    boost: ['analog', 'vinyl', 'timeless'],
    anti: ['electronic', 'modern', 'edm', 'trap'],
    descriptors: ['timeless', 'retro', 'authentic', 'warm', 'nostalgic', 'raw'],
  },

  'Scenic Route': {
    core: ['road trip', 'back roads', 'alt country', 'folk rock'],
    broad: ['americana', 'country', 'folk', 'acoustic'],
    boost: ['countryside', 'rural', 'open road', 'wandering'],
    anti: ['club', 'electronic', 'trap', 'urban'],
    descriptors: ['road-trip', 'countryside', 'expansive', 'authentic', 'wistful', 'driving'],
  },

  // ── Morning / Drive ───────────────────────────────────────────────────
  'Sunrise Drive': {
    core: [...T.MORNING, 'commute'],
    broad: ['driving', 'indie'],
    boost: ['peaceful', 'hopeful', 'gentle', 'moving'],
    anti: ['dark', 'aggressive', 'night', 'late night'],
    descriptors: ['early-morning', 'commute', 'peaceful', 'driving', 'hopeful', 'gentle'],
  },

  // ── Summer / Outdoors ─────────────────────────────────────────────────
  'Windows Down': {
    core: [...T.SUMMER, 'surf rock'],
    broad: ['pop', 'rock'],
    boost: ['driving', 'road trip', 'windows down', 'golden'],
    anti: ['dark', 'sad', 'melancholic', 'winter'],
    descriptors: ['sunny', 'coastal', 'road-trip', 'uplifting', 'bright', 'driving'],
  },

  'Hammock Mode': {
    core: [...T.CHILL],
    broad: ['ambient', 'acoustic'],
    boost: ['breeze', 'lazy', 'sunday', 'warm'],
    anti: ['aggressive', 'loud', 'metal', 'trap', 'party'],
    descriptors: ['peaceful', 'gentle', 'floating', 'wind-down', 'warm', 'effortless'],
  },

  'Under A Palm Tree': {
    core: [...T.REGGAE],
    broad: ['tropical', 'island'],
    boost: ['sunny', 'warm', 'beach'],
    anti: ['metal', 'punk', 'trap'],
    descriptors: ['sunny', 'warm', 'swaying', 'groove-locked', 'coastal', 'effortless'],
  },

  // ── Chill / Immersion ─────────────────────────────────────────────────
  'Rainy Day Replay': {
    core: ['rainy day', 'rain', ...T.SAD],
    broad: ['sad', 'ballad'],
    boost: ['piano', 'acoustic', 'soft', 'solo'],
    anti: ['happy', 'party', 'upbeat', 'summer'],
    descriptors: ['rainy-day', 'melancholic', 'bittersweet', 'introspective', 'wind-down', 'tender'],
  },

  'Zen Garden': {
    core: [...T.STUDY, 'lofi beats'],
    broad: ['instrumental', 'ambient'],
    boost: ['minimal', 'peaceful', 'zen'],
    anti: ['vocal', 'loud', 'aggressive', 'party'],
    descriptors: ['study-session', 'minimal', 'hypnotic', 'spacious', 'peaceful', 'lo-fi'],
  },

  'Do Not Disturb': {
    core: [...T.CINEMATIC, 'post rock'],
    broad: ['atmospheric', 'instrumental'],
    boost: ['epic', 'intense', 'powerful', 'deep'],
    anti: ['pop', 'party', 'dance', 'upbeat'],
    descriptors: ['cinematic', 'spacious', 'introspective', 'expansive', 'haunting', 'layered'],
  },

  // ── Heavy / Metal ─────────────────────────────────────────────────────
  'Full Throttle': {
    core: [...T.METAL],
    broad: ['metal', 'hardcore'],
    boost: ['power', 'speed', 'intense'],
    anti: ['chill', 'acoustic', 'jazz', 'pop'],
    descriptors: ['relentless', 'explosive', 'defiant', 'dark', 'driving', 'raw'],
  },

  'Mosh Pit Magic': {
    core: [...T.METAL_CORE, 'mosh', 'breakdown'],
    broad: ['hardcore', 'punk'],
    boost: ['pit', 'crowd', 'chaos'],
    anti: ['chill', 'mellow', 'acoustic', 'jazz'],
    descriptors: ['cathartic', 'explosive', 'relentless', 'defiant', 'kinetic', 'raw'],
  },

  'Dad Rock': {
    core: [...T.ROCK_CLASSIC],
    broad: ['rock'],
    boost: ['guitar solo', 'anthem', 'stadium'],
    anti: ['trap', 'electronic', 'edm', 'lo fi'],
    descriptors: ['timeless', 'anthemic', 'driving', 'retro', 'crowd-pleaser', 'warm'],
  },

  // ── Vocal / Emotional ─────────────────────────────────────────────────
  'Heart on Sleeve': {
    core: [...T.BALLAD, 'breakup anthem', 'pop ballad'],
    broad: ['pop', 'anthem'],
    boost: ['emotional', 'dramatic', 'vocal', 'sing along'],
    anti: ['instrumental', 'minimal', 'lo fi', 'ambient'],
    descriptors: ['anthemic', 'vocal-forward', 'cathartic', 'romantic', 'uplifting', 'euphoric'],
  },

  'Side B': {
    core: [...T.POP_PUNK],
    broad: ['sing along', 'rock anthem', '2000s'],
    boost: ['nostalgic', 'anthemic', 'car', 'youth'],
    anti: ['jazz', 'classical', 'ambient', 'chill'],
    descriptors: ['anthemic', 'nostalgic', 'cathartic', 'crowd-pleaser', 'driving', 'earworm'],
  },

  // ── Latin / Afro / Global ─────────────────────────────────────────────
  'Pulso': {
    core: [...T.LATIN_URBAN, ...T.LATIN_TRAD],
    broad: ['latin', 'latin pop'],
    boost: ['fiesta', 'bass', 'perreo'],
    anti: ['folk', 'country', 'acoustic', 'jazz'],
    descriptors: ['pulsing', 'kinetic', 'party-starter', 'bass-heavy', 'beat-driven', 'crowd-pleaser'],
  },

  'Palmwine Nights': {
    core: [...T.AFRO, ...T.AFRO_DANCE],
    broad: ['nigerian', 'ghanaian', 'south african', 'african'],
    boost: ['groove', 'warm', 'night', 'melodic'],
    anti: ['metal', 'punk', 'country', 'folk'],
    descriptors: ['groove-locked', 'warm', 'sunny', 'swaying', 'melody-first', 'effortless'],
  },

  // ── Digital / Synth ───────────────────────────────────────────────────
  'Pixelated Pop': {
    core: [...T.HYPERPOP, ...T.GLITCH, 'deconstructed'],
    broad: ['glitch', 'electronic'],
    boost: ['digital', 'chaotic', 'warped', 'futuristic'],
    anti: ['acoustic', 'folk', 'country', 'jazz'],
    descriptors: ['synthetic', 'maximal', 'playful', 'futuristic', 'bright', 'experimental'],
  },

  'Electric Daydream': {
    core: [...T.SYNTH, 'darkwave'],
    broad: ['synth', 'electronic', 'new wave'],
    boost: ['cinematic', 'driving', 'neon', 'city'],
    anti: ['acoustic', 'folk', 'country'],
    descriptors: ['synthetic', 'cinematic', 'dreamy', 'shimmering', 'driving', 'retro'],
  },

  'In Sync': {
    core: [...T.KPOP],
    broad: [...T.JPOP],
    boost: ['choreography', 'polished', 'idol', 'visual'],
    anti: ['folk', 'country', 'jazz', 'metal'],
    descriptors: ['polished', 'earworm', 'bright', 'kinetic', 'maximal', 'crisp'],
  },

  // ── Post-punk / Darkwave / Decades ────────────────────────────────────
  // These don't get their own vibe but influence scoring of existing vibes.
  // Handled via the broad/boost tags of White Noise, Electric Daydream, etc.

  // ── Fallback ──────────────────────────────────────────────────────────
  'Unclassified (Vibe TBD)': {
    core: [],
    descriptors: ['brain-scratch', 'repeatable', 'late-night'],
  },
};

// =============================================================================
// TAG NORMALIZATION
// =============================================================================

const SYNONYM_MAP: Record<string, string> = {
  // Hip-hop variants
  'hiphop': 'hip hop',

  // R&B variants
  'r and b': 'r&b',
  'rhythm and blues': 'r&b',
  'rnb': 'r&b',

  // Electronic variants
  'electronica': 'electronic',

  // Lo-fi variants
  'lofi': 'lo fi',

  // Chill variants
  'chillout': 'chill',
  'downtempo': 'chill',

  // Post-punk variants
  'postpunk': 'post punk',

  // Dream pop variants
  'dreampop': 'dream pop',

  // Indie variants
  'indiepop': 'indie pop',
  'indierock': 'indie rock',
  'indietronic': 'indietronica',

  // Alt rock variants
  'alternativerock': 'alternative rock',
  'alt rock': 'alternative rock',

  // Prog rock
  'progrock': 'progressive rock',
  'prog rock': 'progressive rock',

  // Synth pop variants
  'synthpop': 'synth pop',

  // Electropop variants
  'electro pop': 'electropop',

  // K-pop / J-pop variants
  'kpop': 'k pop',
  'jpop': 'j pop',

  // Pop punk variants
  'poppunk': 'pop punk',

  // Drum and bass variants
  'dnb': 'drum and bass',
  'd&b': 'drum and bass',
  'drum & bass': 'drum and bass',
  'drum n bass': 'drum and bass',

  // Afro variants
  'afro beats': 'afrobeats',
  'afro pop': 'afropop',

  // Latin
  'reggaeton': 'reggaeton',

  // House variants
  'techno house': 'tech house',

  // New wave
  'newwave': 'new wave',

  // Neo soul
  'neosoul': 'neo soul',

  // Nu disco
  'nudisco': 'nu disco',

  // Singer-songwriter
  'singer songwriter': 'singer songwriter',

  // Post-hardcore
  'posthardcore': 'post hardcore',
};

function normalizeTag(tag: string): string {
  let n = tag.toLowerCase().trim();
  // Strip diacritics (ñ → n, é → e, etc.)
  n = n.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Replace hyphens and non-word/non-space/non-& characters with spaces
  n = n.replace(/[^\w\s&]/g, ' ');
  // Collapse whitespace
  n = n.replace(/\s+/g, ' ').trim();
  // Apply synonym map
  return SYNONYM_MAP[n] || n;
}

function normalizeTags(tags: string[]): string[] {
  return Array.from(new Set(tags.map(normalizeTag).filter(Boolean)));
}

// =============================================================================
// PRE-COMPUTED NORMALIZED SIGNAL DATA
// =============================================================================

interface NormalizedSignal {
  core: Set<string>;
  broad: Set<string>;
  boost: Set<string>;
  anti: Set<string>;
  descriptors: readonly Descriptor[];
}

function buildNormalizedSignals(): Map<VibeGenre, NormalizedSignal> {
  const map = new Map<VibeGenre, NormalizedSignal>();
  for (const [vibe, signal] of Object.entries(VIBE_SIGNALS) as [VibeGenre, VibeSignal][]) {
    map.set(vibe, {
      core: new Set((signal.core).map(normalizeTag)),
      broad: new Set((signal.broad ?? []).map(normalizeTag)),
      boost: new Set((signal.boost ?? []).map(normalizeTag)),
      anti: new Set((signal.anti ?? []).map(normalizeTag)),
      descriptors: signal.descriptors,
    });
  }
  return map;
}

const NORMALIZED_SIGNALS = buildNormalizedSignals();

// =============================================================================
// DERIVE VIBE PROFILE
// =============================================================================

export interface VibeProfile {
  primaryVibeGenre: VibeGenre;
  secondaryVibeGenres: VibeGenre[];
  descriptors: string[];
  debug: {
    matchedRules: string[];
    vibeScores: Record<string, number>;
    descScores: Record<string, number>;
  };
}

export function deriveVibeProfile(sourceTags: string[]): VibeProfile {
  const normalizedTags = new Set(normalizeTags(sourceTags));

  const vibeScores: Record<string, number> = {};
  const vibeCoreCounts: Record<string, number> = {};
  const matchedRules: string[] = [];

  // Score each vibe
  const normalizedTagArr = Array.from(normalizedTags);
  const signalEntries = Array.from(NORMALIZED_SIGNALS.entries());

  for (const [vibe, signal] of signalEntries) {
    if (vibe === 'Unclassified (Vibe TBD)') continue;

    let coreHits = 0;
    let broadHits = 0;
    let boostHits = 0;
    let antiHits = 0;

    for (const tag of normalizedTagArr) {
      if (signal.core.has(tag)) coreHits++;
      if (signal.broad.has(tag)) broadHits++;
      if (signal.boost.has(tag)) boostHits++;
      if (signal.anti.has(tag)) antiHits++;
    }

    const hasBaseEvidence = coreHits > 0 || broadHits > 0;
    const score =
      coreHits * CORE_W +
      broadHits * BROAD_W +
      (hasBaseEvidence ? boostHits * BOOST_W : 0) +
      antiHits * ANTI_W;

    if (score > 0) {
      vibeScores[vibe] = score;
      vibeCoreCounts[vibe] = coreHits;
      matchedRules.push(vibe);
    }
  }

  // Sort vibes by score, then core hit count, then alphabetical for determinism
  const sortedVibes = Object.entries(vibeScores)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      const coreA = vibeCoreCounts[a[0]] || 0;
      const coreB = vibeCoreCounts[b[0]] || 0;
      if (coreB !== coreA) return coreB - coreA;
      return a[0].localeCompare(b[0]);
    });

  const primaryVibeGenre: VibeGenre = sortedVibes.length > 0
    ? sortedVibes[0][0] as VibeGenre
    : 'Unclassified (Vibe TBD)';

  const secondaryVibeGenres: VibeGenre[] = sortedVibes
    .slice(1, 4)
    .map(([v]) => v as VibeGenre);

  // Score descriptors — weight by their parent vibe's score
  const descScores: Record<string, number> = {};
  for (const [vibe, score] of sortedVibes) {
    const signal = NORMALIZED_SIGNALS.get(vibe as VibeGenre);
    if (!signal) continue;
    for (let i = 0; i < signal.descriptors.length; i++) {
      const desc = signal.descriptors[i];
      // Earlier descriptors in the list get slightly more weight
      const positionalWeight = Math.max(0.5, 1 - i * 0.08);
      descScores[desc] = (descScores[desc] || 0) + score * positionalWeight;
    }
  }

  // Pick top descriptors with near-duplicate filtering
  const sortedDescs = Object.entries(descScores)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);

  const descriptors: string[] = [];
  const usedRoots = new Set<string>();

  for (const [desc] of sortedDescs) {
    if (descriptors.length >= 7) break;
    // Only emit valid descriptors
    if (!DESCRIPTOR_SET.has(desc)) continue;
    // Near-duplicate filter (first 4 chars)
    const root = desc.slice(0, 4);
    if (!usedRoots.has(root)) {
      descriptors.push(desc);
      usedRoots.add(root);
    }
  }

  if (descriptors.length === 0) {
    descriptors.push('brain-scratch', 'repeatable', 'late-night');
  }

  return {
    primaryVibeGenre,
    secondaryVibeGenres,
    descriptors,
    debug: {
      matchedRules,
      vibeScores,
      descScores,
    },
  };
}

// =============================================================================
// VIBE-GENRE TO GRADIENT MAPPING (for UI) — DO NOT CHANGE COLORS
// =============================================================================

export const VIBE_GRADIENTS: Record<VibeGenre, { from: string; via?: string; to: string }> = {
  'Star Fishing': { from: '#0f172a', via: '#1e3a5f', to: '#0ea5e9' },
  'Velvet Haze': { from: '#1f1626', via: '#3d2451', to: '#c084fc' },
  'Mind Palace': { from: '#1a1625', via: '#2d2347', to: '#a855f7' },
  'Cloud Nine': { from: '#1e1b4b', via: '#3730a3', to: '#818cf8' },
  'Golden Hour': { from: '#1c1917', via: '#451a03', to: '#f59e0b' },
  'Festival Buzz': { from: '#1a0a0a', via: '#7c2d12', to: '#ea580c' },
  'Sunrise Drive': { from: '#1a1a1a', via: '#431407', to: '#fb923c' },
  'Crowd Control': { from: '#0a0a0f', via: '#1e1b4b', to: '#06b6d4' },
  'Heat Check': { from: '#0a0a0a', via: '#450a0a', to: '#f43f5e' },
  'Bar for Bar': { from: '#0f0f0f', via: '#1a1a2e', to: '#7c3aed' },
  'Afterparty': { from: '#0f0a1a', via: '#2e1065', to: '#8b5cf6' },
  'Color Theory': { from: '#0a0a0f', via: '#312e81', to: '#ec4899' },
  'Low-Light Groovy': { from: '#0f0a0a', via: '#1c1917', to: '#57534e' },
  'Speakeasy': { from: '#0a0a0a', via: '#171717', to: '#525252' },
  'Tumblr Core': { from: '#0f0a1a', via: '#1e1b4b', to: '#6366f1' },
  'White Noise': { from: '#0a0a0a', via: '#111827', to: '#9ca3af' },
  'Soul Kitchen': { from: '#1a1410', via: '#422006', to: '#d97706' },
  'Soul Train': { from: '#0a0f0a', via: '#14532d', to: '#22c55e' },
  'Honey Glow': { from: '#1a1610', via: '#451a03', to: '#fbbf24' },
  'Saddle Up': { from: '#1c1917', via: '#292524', to: '#d97706' },
  'Fireplace Folk': { from: '#1a1715', via: '#44403c', to: '#a8a29e' },
  'Vintage Warmth': { from: '#1c1917', via: '#292524', to: '#78716c' },
  'Sunday Morning': { from: '#1a1a1a', via: '#fafaf9', to: '#fef3c7' },
  'Rhythm Therapy': { from: '#0f1a1a', via: '#134e4a', to: '#14b8a6' },
  'Club Catalyst': { from: '#0a0a0f', via: '#1e1b4b', to: '#ec4899' },
  'Indie Wanderlust': { from: '#1a1a1a', via: '#1e3a5f', to: '#3b82f6' },
  'Garage Grunge': { from: '#0f0f0f', via: '#1c1917', to: '#84cc16' },
  'Indie Sleaze': { from: '#1a1a2e', via: '#312e81', to: '#a78bfa' },
  'Lo-Fi Nostalgia': { from: '#1a1715', via: '#292524', to: '#fb7185' },
  'Feel The Bass': { from: '#0a0a0a', via: '#450a0a', to: '#dc2626' },
  'Dad Rock': { from: '#0f0f0f', via: '#1c1917', to: '#737373' },
  'Full Throttle': { from: '#0a0a0a', via: '#1a1a1a', to: '#f43f5e' },
  'Mosh Pit Magic': { from: '#0a0a0a', via: '#0f0f0f', to: '#991b1b' },
  'Windows Down': { from: '#0f1a1a', via: '#164e63', to: '#22d3ee' },
  'Hammock Mode': { from: '#1a1a1a', via: '#365314', to: '#84cc16' },
  'Under A Palm Tree': { from: '#0f1a1a', via: '#14532d', to: '#22c55e' },
  'Rainy Day Replay': { from: '#1a1a2e', via: '#1e3a8a', to: '#60a5fa' },
  'Zen Garden': { from: '#0f1a0f', via: '#14532d', to: '#4ade80' },
  'Do Not Disturb': { from: '#1c1917', via: '#292524', to: '#d6d3d1' },
  'Scenic Route': { from: '#1a1715', via: '#365314', to: '#84cc16' },
  'Heart on Sleeve': { from: '#1a0a1a', via: '#4c1d95', to: '#f472b6' },
  'Pulso': { from: '#1a0a0a', via: '#6b2107', to: '#ef4444' },
  'Palmwine Nights': { from: '#0f1a0f', via: '#365314', to: '#facc15' },
  'Side B': { from: '#1a0a1a', via: '#581c87', to: '#f97316' },
  'Pixelated Pop': { from: '#0f0a1a', via: '#7c3aed', to: '#06ffc3' },
  'Electric Daydream': { from: '#0a0f1a', via: '#1e40af', to: '#38bdf8' },
  'In Sync': { from: '#1a0a1a', via: '#be185d', to: '#f9a8d4' },
  'Unclassified (Vibe TBD)': { from: '#0f0f0f', via: '#1a1a1a', to: '#404040' },
};

export function getVibeGradient(vibeGenre: VibeGenre): string {
  const gradient = VIBE_GRADIENTS[vibeGenre] || VIBE_GRADIENTS['Unclassified (Vibe TBD)'];
  if (gradient.via) {
    return `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.via} 50%, ${gradient.to} 100%)`;
  }
  return `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`;
}

// =============================================================================
// ASSERTIONS & TEST HARNESS
// =============================================================================

export function assertVibeGradientsComplete(): void {
  const missing: string[] = [];
  for (const genre of VIBE_GENRES) {
    if (!(genre in VIBE_GRADIENTS)) missing.push(genre);
  }
  if (missing.length > 0) {
    throw new Error(`Missing VIBE_GRADIENTS for: ${missing.join(', ')}`);
  }
}

export function assertVibeMetaComplete(): void {
  const missing: string[] = [];
  for (const genre of VIBE_GENRES) {
    if (!(genre in VIBE_META) || !VIBE_META[genre].description) {
      missing.push(genre);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing or empty VIBE_META for: ${missing.join(', ')}`);
  }
}

export function assertDescriptorsValid(): void {
  const invalid: string[] = [];
  for (const [, signal] of Object.entries(VIBE_SIGNALS)) {
    for (const d of signal.descriptors) {
      if (!DESCRIPTOR_SET.has(d)) invalid.push(d);
    }
  }
  if (invalid.length > 0) {
    throw new Error(`Invalid descriptors in VIBE_SIGNALS: ${Array.from(new Set(invalid)).join(', ')}`);
  }
}

export function assertDeriveVibeProfileValid(tags: string[]): void {
  const profile = deriveVibeProfile(tags);
  const validVibes: readonly string[] = VIBE_GENRES;
  if (!validVibes.includes(profile.primaryVibeGenre)) {
    throw new Error(`Invalid primaryVibeGenre: ${profile.primaryVibeGenre}`);
  }
}

// ── Test cases: proxy tags for known songs ──────────────────────────────

interface VibeTestCase {
  name: string;
  tags: string[];
  expected: VibeGenre;
  /** Also acceptable as primary */
  acceptable?: VibeGenre[];
}

const VIBE_TEST_CASES: VibeTestCase[] = [
  // Cosmic / Dreamy
  { name: 'ambient-space', tags: ['ambient', 'space', 'cosmic', 'ethereal', 'atmospheric'], expected: 'Star Fishing' },
  { name: 'dream-pop', tags: ['dream pop', 'shoegaze', 'indie', 'dreamy'], expected: 'Velvet Haze' },
  { name: 'art-pop', tags: ['art pop', 'chamber pop', 'experimental'], expected: 'Mind Palace' },

  // Happy / Warm
  { name: 'happy-pop', tags: ['pop', 'happy', 'feel good', 'uplifting'], expected: 'Cloud Nine' },
  { name: 'sunset-cinematic', tags: ['indie pop', 'sunset', 'cinematic', 'nostalgic', 'warm'], expected: 'Golden Hour' },

  // Club / Electronic
  { name: 'house-club', tags: ['house', 'tech house', 'electronic', 'club'], expected: 'Crowd Control' },
  { name: 'festival-edm', tags: ['edm', 'festival', 'big room', 'anthem'], expected: 'Festival Buzz', acceptable: ['Club Catalyst'] },
  { name: 'dubstep-bass', tags: ['dubstep', 'riddim', 'bass', 'electronic'], expected: 'Feel The Bass' },
  { name: 'nu-disco-funk', tags: ['nu-disco', 'future funk', 'dance', 'funky'], expected: 'Rhythm Therapy' },
  { name: 'banger-party', tags: ['banger', 'throwback', '2000s party', 'dance'], expected: 'Club Catalyst' },

  // Rap Lanes
  { name: 'trap-drill', tags: ['trap', 'drill', 'aggressive', 'hip hop'], expected: 'Heat Check' },
  { name: 'party-rap', tags: ['rap', 'hip hop', 'hype', 'party rap', 'bounce'], expected: 'Bar for Bar' },
  { name: 'melodic-rap', tags: ['melodic rap', 'r&b', 'late night', 'moody'], expected: 'Afterparty' },
  { name: 'alt-hip-hop', tags: ['alternative hip hop', 'experimental', 'hip hop'], expected: 'Color Theory' },

  // R&B / Soul
  { name: 'neo-soul', tags: ['neo soul', 'soul', 'r&b', 'warm'], expected: 'Soul Kitchen' },
  { name: 'slow-jam', tags: ['slow jam', 'contemporary r&b', 'funk', 'groove'], expected: 'Low-Light Groovy' },
  { name: 'disco-motown', tags: ['disco', 'motown', 'funk', 'boogie'], expected: 'Soul Train' },
  { name: 'jazz-fusion', tags: ['jazz', 'bebop', 'swing', 'lounge'], expected: 'Speakeasy' },

  // Emo / Alt
  { name: 'midwest-emo', tags: ['emo', 'midwest emo', 'sad', 'indie'], expected: 'Tumblr Core' },
  { name: 'nu-metal', tags: ['nu metal', 'alternative metal', 'post-hardcore'], expected: 'White Noise' },

  // Indie / Alt
  { name: 'indie-rock', tags: ['indie rock', 'indie pop', 'indie'], expected: 'Indie Wanderlust' },
  { name: 'grunge-garage', tags: ['grunge', 'garage rock', 'punk', 'alternative rock'], expected: 'Garage Grunge' },
  { name: 'electroclash', tags: ['indie sleaze', 'electroclash', 'bloghouse'], expected: 'Indie Sleaze' },
  { name: 'bedroom-pop', tags: ['lo-fi', 'bedroom pop', 'chillwave', 'indie'], expected: 'Lo-Fi Nostalgia' },

  // Folk / Country
  { name: 'indie-folk', tags: ['indie folk', 'folk', 'acoustic', 'singer-songwriter'], expected: 'Fireplace Folk' },
  { name: 'country-pop', tags: ['country pop', 'modern country', 'country'], expected: 'Honey Glow' },
  { name: 'outlaw-country', tags: ['classic country', 'outlaw country', 'bluegrass'], expected: 'Saddle Up' },
  { name: 'americana-roots', tags: ['americana', 'roots', 'folk blues', 'delta blues'], expected: 'Vintage Warmth' },
  { name: 'folk-road-trip', tags: ['road trip', 'folk rock', 'alt-country', 'americana'], expected: 'Scenic Route' },

  // Heavy
  { name: 'metal-thrash', tags: ['heavy metal', 'thrash', 'hard rock'], expected: 'Full Throttle' },
  { name: 'metalcore-mosh', tags: ['metalcore', 'hardcore punk', 'breakdown', 'mosh'], expected: 'Mosh Pit Magic' },
  { name: 'classic-rock', tags: ['classic rock', 'rock', '70s rock'], expected: 'Dad Rock' },

  // Chill / Immersion
  { name: 'summer-beach', tags: ['summer', 'beach', 'coastal', 'sunny'], expected: 'Windows Down' },
  { name: 'chill-relax', tags: ['chill', 'relaxing', 'mellow', 'calm'], expected: 'Hammock Mode' },
  { name: 'reggae-dub', tags: ['reggae', 'dub', 'ska', 'dancehall'], expected: 'Under A Palm Tree' },
  { name: 'sad-rainy', tags: ['sad', 'melancholic', 'heartbreak', 'rainy day'], expected: 'Rainy Day Replay' },
  { name: 'study-focus', tags: ['study', 'focus', 'lofi beats', 'instrumental'], expected: 'Zen Garden' },
  { name: 'cinematic-score', tags: ['cinematic', 'soundtrack', 'immersive', 'atmospheric'], expected: 'Do Not Disturb' },
  { name: 'morning-dawn', tags: ['morning', 'dawn', 'commute', 'early morning'], expected: 'Sunrise Drive' },
  { name: 'sunday-coffee', tags: ['peaceful', 'morning', 'acoustic', 'coffee shop'], expected: 'Sunday Morning' },

  // Vocal / Emotional
  { name: 'ballad-diva', tags: ['pop', 'ballad', 'big vocal', 'belting'], expected: 'Heart on Sleeve' },
  { name: 'pop-punk-anthem', tags: ['pop punk', 'emo pop', 'sing along', 'rock anthem'], expected: 'Side B' },

  // Global
  { name: 'reggaeton-latin', tags: ['reggaeton', 'latin trap', 'dembow', 'urbano'], expected: 'Pulso' },
  { name: 'afrobeats-core', tags: ['afrobeats', 'afropop', 'nigerian'], expected: 'Palmwine Nights' },

  // Digital / Synth
  { name: 'hyperpop-glitch', tags: ['hyperpop', 'pc music', 'glitch pop'], expected: 'Pixelated Pop' },
  { name: 'synth-pop', tags: ['synth-pop', 'electropop', 'indie electronic'], expected: 'Electric Daydream' },
  { name: 'k-pop', tags: ['k-pop', 'korean pop'], expected: 'In Sync' },
];

export function runVibeTests(): { passed: number; failed: number; failures: string[] } {
  let passed = 0;
  let failed = 0;
  const failures: string[] = [];

  for (const tc of VIBE_TEST_CASES) {
    const profile = deriveVibeProfile(tc.tags);
    const topTwo = [profile.primaryVibeGenre, ...profile.secondaryVibeGenres.slice(0, 1)];
    const acceptable = [tc.expected, ...(tc.acceptable ?? [])];
    const ok = acceptable.some(v => topTwo.includes(v));

    if (ok) {
      passed++;
    } else {
      failed++;
      failures.push(
        `FAIL [${tc.name}]: expected ${tc.expected} in top 2, got [${topTwo.join(', ')}]`
      );
    }
  }

  return { passed, failed, failures };
}

// Keep existing test for backwards compat
export function testHeartOnSleeveFitsBalladTags(): boolean {
  const testTags = ['pop', 'ballad', 'big vocal'];
  const profile = deriveVibeProfile(testTags);
  const topTwo = [profile.primaryVibeGenre, ...profile.secondaryVibeGenres.slice(0, 1)];
  const has = topTwo.includes('Heart on Sleeve');
  if (!has) {
    console.warn(
      `Test failed: Expected 'Heart on Sleeve' in top 2 for tags ${JSON.stringify(testTags)}, got: ${topTwo.join(', ')}`
    );
  }
  return has;
}

// Run assertions in development
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    assertVibeGradientsComplete();
    assertVibeMetaComplete();
    assertDescriptorsValid();
    testHeartOnSleeveFitsBalladTags();

    const results = runVibeTests();
    if (results.failed > 0) {
      console.warn(`Vibe tests: ${results.passed} passed, ${results.failed} failed`);
      results.failures.forEach(f => console.warn(f));
    }
  } catch (e) {
    console.error('Vibe Taxonomy assertion failed:', e);
  }
}
