import type {
  EventFormData,
  EventType,
  Aesthetic,
  EventBlueprint,
  ColorSwatch,
  PersonalizedIdea,
  ScheduleItem,
  VendorItem,
  TaskMilestone,
} from '@/types/event';
import { generateRecommendedBudget, recalculateBudget } from '@/lib/budget/calculator';

// Aesthetic Color Palettes
const PALETTES_BY_AESTHETIC: Record<Aesthetic, ColorSwatch[]> = {
  elegant: [
    { name: 'Imperial Plum', hex: '#321D35', role: 'Primary Anchor', description: 'Deep velvet tone lending dramatic regal grounding.' },
    { name: 'Champagne Shimmer', hex: '#D8BD91', role: 'Lustrous Accent', description: 'Warm metallic shimmer for stationery, cutlery, and trims.' },
    { name: 'Warm Ivory', hex: '#FAF7F2', role: 'Base Canvas', description: 'Crisp yet gentle neutral for table linens and soft draping.' },
    { name: 'Soft Sage', hex: '#A9B8A0', role: 'Botanical Balance', description: 'Subtle eucalyptus green to temper richness.' },
  ],
  modern: [
    { name: 'Charcoal Noir', hex: '#28262B', role: 'Primary Anchor', description: 'Architectural, clean dark tone for sleek frames and typography.' },
    { name: 'Muted Coral', hex: '#E88D83', role: 'Dynamic Punctuation', description: 'Electric warm pop for contemporary florals and signage.' },
    { name: 'Pure Ivory', hex: '#FAF7F2', role: 'Base Canvas', description: 'Minimalist backdrop maximizing negative space.' },
    { name: 'Champagne Buff', hex: '#D8BD91', role: 'Subtle Foil', description: 'Brushed brass accents preventing clinical chill.' },
  ],
  garden: [
    { name: 'Soft Sage', hex: '#A9B8A0', role: 'Primary Anchor', description: 'Verdant leafy olive and sage grounding outdoor arrangements.' },
    { name: 'Blush Coral', hex: '#E88D83', role: 'Floral Focal', description: 'Garden rose and ranunculus tones for vibrant centerpieces.' },
    { name: 'Warm Ivory', hex: '#FAF7F2', role: 'Base Canvas', description: 'Textured natural linen and raw silk finish.' },
    { name: 'Deep Plum Leaf', hex: '#321D35', role: 'Contrast Shadow', description: 'Dark plum foliage like smokebush for depth.' },
  ],
  minimal: [
    { name: 'Warm Ivory', hex: '#FAF7F2', role: 'Base Canvas', description: 'Porous limestone, cream plaster, and unbleached cotton.' },
    { name: 'Charcoal Trace', hex: '#28262B', role: 'Linear Anchor', description: 'Hairline borders, subtle serifs, and wrought iron touches.' },
    { name: 'Champagne Oat', hex: '#D8BD91', role: 'Warmth Infusion', description: 'Natural unvarnished light oak and champagne glass.' },
    { name: 'Muted Coral Blush', hex: '#E88D83', role: 'Single Focal', description: 'Single-variety botanical moment.' },
  ],
  traditional: [
    { name: 'Royal Plum', hex: '#321D35', role: 'Heritage Dominant', description: 'Opulent ceremonial heritage tone signifying grandeur.' },
    { name: 'Gilded Champagne', hex: '#D8BD91', role: 'Sacred Gold', description: 'Ornate foil, brass ceremonial vessels, and brocade.' },
    { name: 'Crimson Coral', hex: '#E88D83', role: 'Auspicious Glow', description: 'Warm festive vibrancy celebrating life and joy.' },
    { name: 'Warm Ivory', hex: '#FAF7F2', role: 'Loom Canvas', description: 'Handloom cream background balancing ornate goldwork.' },
  ],
  playful: [
    { name: 'Vibrant Coral', hex: '#E88D83', role: 'Energy Lead', description: 'High-spirit warmth igniting playful moments.' },
    { name: 'Spark Champagne', hex: '#D8BD91', role: 'Festive Spark', description: 'Confetti shimmer, disco reflections, and golden hour light.' },
    { name: 'Plum Velvet', hex: '#321D35', role: 'Grounded Rhythm', description: 'Contrast shade preventing colors from overwhelming.' },
    { name: 'Sage Mint', hex: '#A9B8A0', role: 'Fresh Zing', description: 'Crisp green accent balancing the warm tones.' },
  ],
};

// Decor styling highlights by aesthetic
const DECOR_BY_AESTHETIC: Record<Aesthetic, string[]> = {
  elegant: [
    'Layered taper candles in antique crystal and tinted glass hurricane lanterns',
    'Custom textured paper menus with gold-leaf calligraphic monogramming',
    'Low-sprawling floral runners in deep plum dahlias, garden roses, and wild privet berries',
    'Velvet table runners draped against matte ivory porcelain place settings',
  ],
  modern: [
    'Clean-lined matte black wire stands with asymmetrical floral sculptural clouds',
    'Bespoke neon acrylic welcome signage framed by monolithic plaster pillars',
    'Architectural pin-spot lighting highlighting tablescape geometry',
    'Smoked glass stemware paired with brushed copper flatware',
  ],
  garden: [
    'Festoon bistro fairy lights suspended between heritage wooden pergolas',
    'Earthy terracotta pots intermingled with olive branches and fresh rosemary sprigs',
    'Handmade deckle-edge cotton paper place cards pressed with dried botanicals',
    'Bespoke rattan lounge vignettes accented with soft sage and coral throw pillows',
  ],
  minimal: [
    'Single-stem anthuriums and Japanese ikebana branch installations in ceramic vessels',
    'Expansive negative space on uncluttered linen-covered communal banquet tables',
    'Hidden indirect warm uplighting washing textured walls',
    'Monochromatic stone plateware paired with raw linen napkins tied in organic loose knots',
  ],
  traditional: [
    'Intricately woven floral garlands woven with marigold, jasmine, and deep roses',
    'Polished brass lanterns and traditional candle urns along the entrance pathway',
    'Hand-painted motif backdrops drawing from classical regional artisan tapestries',
    'Rich embroidered textile overlays accentuating ceremonial centerpiece shrines',
  ],
  playful: [
    'Oversized monochrome balloon clouds intertwined with cascading ribbon streamers',
    'Interactive 360-degree holographic photobooth with customized celebratory filters',
    'Color-blocked custom signage with tongue-in-cheek editorial quotes and puns',
    'Retro cocktail cart serving color-coordinated signature beverages with edible glitter',
  ],
};

// Concepts and themes
function generateConceptAndNarrative(
  eventType: EventType,
  aesthetic: Aesthetic,
  title: string,
  location: string,
  guestCount: number
): { conceptTitle: string; tagline: string; narrative: string; atmosphereNotes: string } {
  const isIntimate = guestCount <= 60;
  const isLarge = guestCount >= 250;
  const scaleTerm = isIntimate ? 'an intimate, soul-stirring' : isLarge ? 'a breathtaking, grand-scale' : 'a beautifully balanced';

  if (eventType === 'wedding') {
    const conceptMap: Record<Aesthetic, { title: string; tag: string }> = {
      elegant: { title: 'Velvet & Vows: Midnight Symphony', tag: 'A candlelit celebration of timeless romance and orchestral poise' },
      modern: { title: 'The Atelier Union: Monolithic Romance', tag: 'Sculptural purity meets contemporary city glamour' },
      garden: { title: 'Verdant Romance: An English Glasshouse Affair', tag: 'Sun-dappled botanicals, whispery silks, and open skies' },
      minimal: { title: 'Pure Intimacy: The Gallery Union', tag: 'Stripped of excess, elevated by quiet devotion and light' },
      traditional: { title: 'Heritage & Hearth: Timeless Ceremonial Radiance', tag: 'Honoring sacred ancestral rites wrapped in gold and crimson' },
      playful: { title: 'Electric Ever-After: A Vibrant Celebration', tag: 'Joy uninhibited, sparkling laughter, and neon euphoria' },
    };
    const c = conceptMap[aesthetic];
    return {
      conceptTitle: c.title,
      tagline: c.tag,
      narrative: `Designed specifically for ${title} in ${location}, this blueprint orchestrates ${scaleTerm} wedding gathering for ${guestCount} cherished guests. The experience transitions organically from an emotive, heart-grounded ceremony into an atmospheric reception where guests feel like participants in a high-fashion editorial tableau. Every spatial touchpoint celebrates the couple's personal history through tactile textures and curated culinary chapters.`,
      atmosphereNotes: `Warm, immersive ambient lighting calibrated at 2700K golden spectrum. Unobtrusive acoustic acoustics during dinner shifting smoothly to high-energy celebratory beats as the evening matures.`,
    };
  }

  if (eventType === 'birthday') {
    const conceptMap: Record<Aesthetic, { title: string; tag: string }> = {
      elegant: { title: 'Golden Epoch: An Evening of Vintage Reverie', tag: 'Sophisticated cocktails, jazz nuance, and distinguished company' },
      modern: { title: 'The Luminary Loft: Contemporary Milestone Soirée', tag: 'Architectural beats, craft mixology, and dynamic visuals' },
      garden: { title: 'Botanical Solstice: An Al Fresco Gathering', tag: 'Sunset long-table dining under leafy canopies and stars' },
      minimal: { title: 'Quiet Distinction: The Curated Table', tag: 'Thoughtful gastronomy, effortless styling, and authentic conversation' },
      traditional: { title: 'Legacy & Laughter: Generational Banquet', tag: 'Feasting on family heritage recipes and ancestral warmth' },
      playful: { title: 'Carnival of Curiosities: Whimsical Milestone Fiesta', tag: 'Unfiltered joy, immersive surprises, and vibrant memories' },
    };
    const c = conceptMap[aesthetic];
    return {
      conceptTitle: c.title,
      tagline: c.tag,
      narrative: `Crafted for ${title} in ${location}, this milestone birthday plan brings together ${guestCount} friends and loved ones for ${scaleTerm} immersion. Rather than standard party tropes, the celebration unfolds as an interactive journey—from personalized signature welcome elixirs through a crescendo of memorable toasts and sensory culinary pairings.`,
      atmosphereNotes: `Vibrant, warm, and highly engaging. Designed with distinct social zones: an energetic mixology bar, a conversational lounge, and an uninhibited celebratory dance stage.`,
    };
  }

  if (eventType === 'corporate') {
    const conceptMap: Record<Aesthetic, { title: string; tag: string }> = {
      elegant: { title: 'The Executive Summit: Vision & Prestige', tag: 'High-caliber networking framed in understated sophistication' },
      modern: { title: 'Frontiers Ahead: The Innovation Gala', tag: 'Sleek multimedia stages, forward-thinking dialogue, and dynamic engagement' },
      garden: { title: 'The Retreat: Natural Horizons Leadership Gathering', tag: 'Fresh air, mindful strategy, and grounded collaboration' },
      minimal: { title: 'Clarity & Focus: The Strategic Colloquium', tag: 'Uncluttered environments built for high-impact decision making' },
      traditional: { title: 'Foundation & Heritage: Centennial Corporate Honors', tag: 'Celebrating company milestones and honoring enduring loyalty' },
      playful: { title: 'Ignite & Elevate: Interactive Team Festival', tag: 'High energy, collaborative triumphs, and playful innovation' },
    };
    const c = conceptMap[aesthetic];
    return {
      conceptTitle: c.title,
      tagline: c.tag,
      narrative: `Designed for ${title} in ${location}, this executive gathering brings together ${guestCount} colleagues and stakeholders for ${scaleTerm} corporate experience. Seamless transitions between keynote addresses, collaborative breakaways, and elevated networking ensure high ROI and lasting impressions.`,
      atmosphereNotes: `Polished, tech-enabled, and professional. Crystal-clear audiovisual coverage with ambient networking lounges.`,
    };
  }

  if (eventType === 'college') {
    const conceptMap: Record<Aesthetic, { title: string; tag: string }> = {
      elegant: { title: 'The Baccalaureate Gala: An Evening of Honors', tag: 'Dressed in distinction, celebrating scholastic milestone achievements' },
      modern: { title: 'Nexus Campus: The Vanguard Collegiate Festival', tag: 'Pulsing energy, student entrepreneurship, and future-ready minds' },
      garden: { title: 'Quadrangle Echoes: Open-Air Campus Jubilee', tag: 'Lawn gatherings, acoustic sets, and starlit quad revelry' },
      minimal: { title: 'The Thesis Forum: Ideas That Matter', tag: 'Refined presentations, student showcases, and thoughtful dialogue' },
      traditional: { title: 'Alma Mater Traditions: Centennial Homecoming', tag: 'Timeless campus anthems, ceremonial regalia, and proud alumni pride' },
      playful: { title: 'Spring Carnival & Pulse Fest', tag: 'Electrifying beat drops, food trucks, and unforgettable student memories' },
    };
    const c = conceptMap[aesthetic];
    return {
      conceptTitle: c.title,
      tagline: c.tag,
      narrative: `Crafted for ${title} in ${location}, this vibrant campus event unites ${guestCount} students, faculty, and alumni. Built around energetic communal zones and high-impact live stages, the celebration sparks lifelong university memories.`,
      atmosphereNotes: `High-octane, inclusive, and vibrant. Zoned for live performances, interactive activity booths, and casual social gathering.`,
    };
  }

  if (eventType === 'concert') {
    const conceptMap: Record<Aesthetic, { title: string; tag: string }> = {
      elegant: { title: 'Nocturne: Intimate Acoustic Residency', tag: 'Velvet seating, vintage ribbon mics, and breathtaking vocal acoustics' },
      modern: { title: 'Prism Sound: Immersive Audiovisual Live Arena', tag: 'Cutting-edge beam lighting, sub-bass immersion, and live synths' },
      garden: { title: 'Under the Stars: Amphitheater Sunset Sessions', tag: 'Acoustic warmth, picnic blankets, and festival glow' },
      minimal: { title: 'Raw & Unplugged: The Minimalist Session', tag: 'Spotlight on songwriting, zero gimmicks, and pure musical emotion' },
      traditional: { title: 'Classical Grandeur: Orchestral Heritage Showcase', tag: 'Full philharmonic majesty in historic acoustic grandeur' },
      playful: { title: 'Neon Beat Wave: Electric Dance Carnival', tag: 'Laser bursts, multi-genre DJs, and euphoric crowd energy' },
    };
    const c = conceptMap[aesthetic];
    return {
      conceptTitle: c.title,
      tagline: c.tag,
      narrative: `Engineered for ${title} in ${location}, this concert event immerses ${guestCount} music lovers in an acoustically balanced sonic environment with dynamic stage production and unforgettable performance energy.`,
      atmosphereNotes: `Dynamic concert sound pressure level with dedicated front-of-house mixing, immersive stage wash, and safe egress paths.`,
    };
  }

  if (eventType === 'party') {
    const conceptMap: Record<Aesthetic, { title: string; tag: string }> = {
      elegant: { title: 'Velvet Midnight: Chic Penthouse Soirée', tag: 'Craft cocktails, moody low-lighting, and effortless elegance' },
      modern: { title: 'Electric Skyline: Rooftop Beats & Neon', tag: 'Pulsing house music, skyline panoramas, and VIP mixology' },
      garden: { title: 'Boho Sunset Soirée: Lanterns & Chill', tag: 'Fairy lights, rattan floor poufs, and acoustic sunset jams' },
      minimal: { title: 'The Monochrome Lounge: Sleek & Intimate', tag: 'Monochromatic aesthetics, vinyl grooves, and clean cocktail pairings' },
      traditional: { title: 'Old Hollywood Glamour: Vintage Speakeasy', tag: 'Champagne coupe towers, jazz standards, and glamorous attire' },
      playful: { title: 'Retro Groove: Disco Fever Dance Night', tag: 'Mirror balls, confetti cannons, and uninhibited euphoria' },
    };
    const c = conceptMap[aesthetic];
    return {
      conceptTitle: c.title,
      tagline: c.tag,
      narrative: `Designed for ${title} in ${location}, this party brings together ${guestCount} guests for a high-spirited, uninhibited celebration filled with great music, delicious bites, and electric camaraderie.`,
      atmosphereNotes: `Upbeat, immersive, and social. Designed with an energetic dance floor, signature cocktail station, and conversational corners.`,
    };
  }

  // Community Event & Custom fallback
  const conceptMap: Record<Aesthetic, { title: string; tag: string }> = {
    elegant: { title: 'The Civic Gala: Honoring Community Trailblazers', tag: 'Inspiring keynote narratives amidst polished civic grandeur' },
    modern: { title: 'Civic Pulse: Innovation & Connection Summit', tag: 'Futuristic design, collaborative energy, and shared vision' },
    garden: { title: 'Earth & Common Ground: Green Horizon Festival', tag: 'Open-air grassroots celebration of sustainable community bonds' },
    minimal: { title: 'Common Ground: Clean Spaces, Collective Voices', tag: 'Democratic, accessible, and centered purely on shared human stories' },
    traditional: { title: 'Heritage Square: Cultural Traditions in Harmony', tag: 'Celebrating diverse ethnic roots through folk arts and heirloom culinary fare' },
    playful: { title: 'Neighbourhood Jamboree: Street Art & Harmony', tag: 'Interactive installations, upbeat street music, and family laughter' },
  };
  const c = conceptMap[aesthetic];
  return {
    conceptTitle: c.title,
    tagline: c.tag,
    narrative: `Built for ${title} in ${location}, this celebration orchestrates an accessible, safe, and memorable gathering for ${guestCount} attendees. The blueprint prioritizes intuitive crowd flow, inclusive amenities, and memorable focal points where people forge enduring connections.`,
    atmosphereNotes: `Welcoming, inclusive, and barrier-free. Acoustic clarity across all sound zones with clearly demarcated quiet rest nooks and active gathering spaces.`,
  };
}

// Generate schedule tailored to event type
function generateEventSchedule(eventType: EventType): ScheduleItem[] {
  if (eventType === 'wedding') {
    return [
      { id: 'sch-1', time: '11:00 AM', title: 'Bridal Party & Groom Suite Preparations', description: 'Hair, makeup, artisan brunch, and detail photography of rings, invitations, and attire.', phase: 'Pre-Ceremony' },
      { id: 'sch-2', time: '02:30 PM', title: 'First Look & Private Portraiture Session', description: 'Intimate reveal between partners followed by bridal party editorial portraits in prime daylight.', phase: 'Photography' },
      { id: 'sch-3', time: '04:00 PM', title: 'Guest Arrival & Welcome Refreshments', description: 'Live acoustic strings play while guests are served infused botanical spritzes and seated.', phase: 'Arrival' },
      { id: 'sch-4', time: '04:30 PM', title: 'Solemnization & Ceremony Processional', description: 'Exchange of vows, rings, and ceremonial blessings framed by custom floral arch.', phase: 'Ceremony' },
      { id: 'sch-5', time: '05:30 PM', title: 'Golden Hour Cocktail & Hors d’Oeuvres Hour', description: 'Passed canapés, signature cocktails, and roving saxophone ensemble amidst sunset glow.', phase: 'Cocktails' },
      { id: 'sch-6', time: '07:00 PM', title: 'Grand Ballroom Entrance & Seated Dinner', description: 'Musical introduction of newlyweds, heartfelt welcome toast, and 3-course plated service.', phase: 'Reception' },
      { id: 'sch-7', time: '08:30 PM', title: 'Toasts, Cake Cutting & First Dance', description: 'Emotional parent dances, couple first dance under pin-spot lights, and champagne toast.', phase: 'Celebration' },
      { id: 'sch-8', time: '09:15 PM', title: 'Dance Floor Ignition & Late-Night Bites', description: 'Live DJ set, open dance floor, interactive photobooth, and gourmet midnight slider snacks.', phase: 'Party' },
      { id: 'sch-9', time: '11:30 PM', title: 'Sparkler Grand Exit & Send-Off', description: 'Guests line pathway with warm fiber optic wands / cold spark fountains for farewell getaway.', phase: 'Departure' },
    ];
  }

  if (eventType === 'birthday') {
    return [
      { id: 'sch-1', time: '04:30 PM', title: 'Vendor Load-In & Thematic Setup', description: 'Sound checks, balloon installation, bar stocking, and ambient lighting check.', phase: 'Setup' },
      { id: 'sch-2', time: '06:00 PM', title: 'Red Carpet Arrivals & Signature Elixirs', description: 'Guests greeted with customized party cocktails, polaroid guestbook station, and upbeat lounge vinyl.', phase: 'Welcome' },
      { id: 'sch-3', time: '07:00 PM', title: 'Interactive Grazing & Social Games', description: 'Roving small plates, curated party quiz, and photo wall moments with customized props.', phase: 'Mingle' },
      { id: 'sch-4', time: '08:15 PM', title: 'Milestone Tribute & Birthday Toast', description: 'Surprise video montage, heartfelt speeches from closest friends, and tribute toast.', phase: 'Spotlight' },
      { id: 'sch-5', time: '08:45 PM', title: 'Artisan Cake Reveal & Champagne Pop', description: 'Showstopper celebration cake presented with sparklers, celebratory chorus, and sweets bar.', phase: 'Cake' },
      { id: 'sch-6', time: '09:15 PM', title: 'DJ Set & Celebration Dance Floor', description: 'High-energy dance playlist featuring the guest of honor’s all-time favorite anthems.', phase: 'Dance' },
      { id: 'sch-7', time: '11:00 PM', title: 'Midnight Favors & Safe Departures', description: 'Distribution of personalized takeaway gift boxes and pre-coordinated transport assistance.', phase: 'Farewell' },
    ];
  }

  if (eventType === 'corporate') {
    return [
      { id: 'sch-1', time: '08:00 AM', title: 'Registration, Badging & Morning Networking', description: 'Executive check-in, continental artisan breakfast, and high-speed badge printing.', phase: 'Arrival' },
      { id: 'sch-2', time: '09:30 AM', title: 'Opening Keynote & Strategic Vision Address', description: 'Welcome remarks from leadership and high-production company showcase.', phase: 'Keynote' },
      { id: 'sch-3', time: '11:00 AM', title: 'Breakout Workshops & Panel Tracks', description: 'Focused breakout rooms for product strategy, leadership, and tech innovation.', phase: 'Sessions' },
      { id: 'sch-4', time: '01:00 PM', title: 'Curated Networking Luncheon', description: 'Plated or upscale buffet lunch with reserved sector discussion tables.', phase: 'Dining' },
      { id: 'sch-5', time: '02:30 PM', title: 'Afternoon Product Reveal & Fireside Chat', description: 'Flagship roadmap presentation with Q&A session broadcast to remote teams.', phase: 'Showcase' },
      { id: 'sch-6', time: '04:30 PM', title: 'Awards Ceremony & Milestone Recognition', description: 'Honoring top team achievements, project impact, and partner contributions.', phase: 'Awards' },
      { id: 'sch-7', time: '05:30 PM', title: 'Cocktail Reception & Live Jazz Lounge', description: 'Open bar, passed hors d’oeuvres, and casual executive networking.', phase: 'Reception' },
    ];
  }

  if (eventType === 'college') {
    return [
      { id: 'sch-1', time: '10:00 AM', title: 'Campus Gate Open & Fest Orientation', description: 'Student wristband validation, festival map distribution, and merch pop-ups.', phase: 'Welcome' },
      { id: 'sch-2', time: '11:30 AM', title: 'Inter-College Competitions & Hackathons', description: 'Concurrent rounds of debate, coding sprints, dance battles, and robotic challenges.', phase: 'Contests' },
      { id: 'sch-3', time: '02:00 PM', title: 'Street Food Boulevard & Acoustic Lawn', description: 'Pop-up gourmet food trucks and student indie bands performing on the lawn stage.', phase: 'Social' },
      { id: 'sch-4', time: '04:30 PM', title: 'Fashion Show & Cultural Showcase', description: 'Inter-department couture showcase and thematic theatrical performances.', phase: 'Stage' },
      { id: 'sch-5', time: '06:30 PM', title: 'Championship Trophy Distribution', description: 'Announcement of winning college contingents and award citations.', phase: 'Awards' },
      { id: 'sch-6', time: '07:30 PM', title: 'Celebrity Headliner / EDM Pro-Night', description: 'High-voltage live artist concert with stadium lighting and visual effects.', phase: 'Concert' },
    ];
  }

  if (eventType === 'concert') {
    return [
      { id: 'sch-1', time: '02:00 PM', title: 'Soundcheck & Lighting Cue Run-Through', description: 'Audio calibration, monitor leveling, laser cue programming, and backline tune-up.', phase: 'Production' },
      { id: 'sch-2', time: '05:30 PM', title: 'Doors Open & Box Office Scanning', description: 'Ticket scanning, bag checks, merchandise booth sales, and beverage counters open.', phase: 'Doors' },
      { id: 'sch-3', time: '06:45 PM', title: 'Opening Act / Support Artist Set', description: 'High-energy 45-minute warm-up performance setting the sonic tone.', phase: 'Support' },
      { id: 'sch-4', time: '07:45 PM', title: 'Stage Changeover & Intermission', description: 'DJ set keeping the crowd energized while headline gear is prepped.', phase: 'Changeover' },
      { id: 'sch-5', time: '08:15 PM', title: 'Headline Performance & Visual Spectacle', description: 'Main artist 90-minute live set with pyrotechnics, visuals, and crowd interaction.', phase: 'Headline' },
      { id: 'sch-6', time: '10:00 PM', title: 'Encore & Grand Production Climax', description: 'Fan favorite encore songs, confetti blast, and final bow.', phase: 'Encore' },
      { id: 'sch-7', time: '10:30 PM', title: 'Safe Egress & VIP Meet & Greet', description: 'Controlled crowd departure and private backstage photo sessions.', phase: 'Departure' },
    ];
  }

  if (eventType === 'party') {
    return [
      { id: 'sch-1', time: '07:00 PM', title: 'Doors Open & Welcome Sparklers', description: 'Guests arrive to signature welcome drinks and atmospheric ambient beats.', phase: 'Arrival' },
      { id: 'sch-2', time: '08:00 PM', title: 'Passed Canapés & Interactive Photo Booth', description: 'Gourmet sliders, cocktail mixing, and themed photo station with live instant prints.', phase: 'Mingle' },
      { id: 'sch-3', time: '09:30 PM', title: 'Dance Floor Drop & Guest DJ Set', description: 'Lighting transition, bass drop, and peak celebration anthems.', phase: 'Dance' },
      { id: 'sch-4', time: '11:00 PM', title: 'Surprise Midnight Snack Drop', description: 'Gourmet street food bites, warm churros, and dessert shots.', phase: 'Snacks' },
      { id: 'sch-5', time: '12:30 AM', title: 'Late Night Chill & Safe Ride Coordination', description: 'Downbeat music, water stations, and rideshare dispatch.', phase: 'Departure' },
    ];
  }

  // Community Event & Custom fallback
  return [
    { id: 'sch-1', time: '07:30 AM', title: 'Logistics, AV Setup & Safety Inspection', description: 'Stage build, generator tests, first aid tent setup, and safety perimeter audit.', phase: 'Operations' },
    { id: 'sch-2', time: '08:30 AM', title: 'Volunteer & Staff Briefing', description: 'Distribution of walkie-talkies, badges, safety guidelines, and station assignments.', phase: 'Briefing' },
    { id: 'sch-3', time: '09:30 AM', title: 'Gates Open & Community Welcome Station', description: 'Welcome desks open, schedule maps distributed, and morning brass band commences.', phase: 'Opening' },
    { id: 'sch-4', time: '10:30 AM', title: 'Inaugural Keynote & Cultural Showcase', description: 'Civic leaders address attendees followed by traditional dance and youth choir showcases.', phase: 'Ceremony' },
    { id: 'sch-5', time: '12:00 PM', title: 'Community Culinary Fair & Artisan Pavilions', description: 'Local culinary stalls open alongside interactive DIY crafts and heritage workshops.', phase: 'Activities' },
    { id: 'sch-6', time: '02:30 PM', title: 'Interactive Panels & Family Field Competitions', description: 'Panel discussion on community initiatives alongside friendly park relay games.', phase: 'Engagement' },
    { id: 'sch-7', time: '04:30 PM', title: 'Community Honor Awards & Volunteer Tribute', description: 'Recognition of local champions, student scholars, and community service pillars.', phase: 'Awards' },
    { id: 'sch-8', time: '05:30 PM', title: 'Musical Finale & Grand Group Commemoration', description: 'Live headline band performance and collective aerial drone celebration photo.', phase: 'Finale' },
    { id: 'sch-9', time: '06:30 PM', title: 'Orderly Egress & Green Waste Clearance', description: 'Volunteer team conducts comprehensive zero-waste clean-up and recycling sweep.', phase: 'Closeout' },
  ];
}

// Generate customized vendor checklist
function generateVendorChecklist(eventType: EventType, aesthetic: Aesthetic): VendorItem[] {
  if (eventType === 'wedding') {
    const baseWeddingVendors: VendorItem[] = [
      {
        id: 'ven-1',
        category: 'Venue',
        role: 'Ceremony & Reception Estate',
        priority: 'essential',
        deliverables: ['Exclusive 12-hour grounds access', 'Bridal dressing suite', 'Tables and Chiavari chairs', 'Post-event sanitation'],
        questionsToAsk: ['What is the bad-weather backup plan?', 'Are external caterers permitted or is there a preferred list?', 'What are the decibel sound limits after 10 PM?'],
        suggestedLeadTime: '9 to 12 months out',
        status: 'to_hire',
      },
      {
        id: 'ven-2',
        category: 'Catering & Bar',
        role: 'Master Banquet Caterer & Mixologist',
        priority: 'essential',
        deliverables: ['Menu tasting for 4 guests', 'Cocktail hour passed hors d’oeuvres', 'Plated 3-course dinner', 'Full bar staffing and glassware'],
        questionsToAsk: ['How do you manage severe allergies and special dietary requests?', 'What is the server-to-guest ratio?', 'Are bar corkage fees applicable?'],
        suggestedLeadTime: '7 to 9 months out',
        status: 'to_hire',
      },
      {
        id: 'ven-3',
        category: 'Photography',
        role: 'Lead Editorial Photographer & Second Shooter',
        priority: 'essential',
        deliverables: ['10 hours day-of continuous coverage', 'Online high-res curated gallery', 'Preview sneak peek within 48 hours', 'Print release rights'],
        questionsToAsk: ['Can we view a full wedding gallery from start to finish?', 'What is your backup equipment protocol?', 'How do you handle difficult low-light receptions?'],
        suggestedLeadTime: '8 to 10 months out',
        status: 'to_hire',
      },
      {
        id: 'ven-4',
        category: 'Floral & Decor',
        role: 'Artistic Floral Designer & Stylist',
        priority: 'essential',
        deliverables: ['Ceremony floral arch structure', 'Bridal bouquet and boutonnieres', 'Centerpieces for all guest tables', 'Candle rental and end-of-night teardown'],
        questionsToAsk: ['Do you repurpose ceremony florals into the reception space?', 'What blooms are in season on our wedding date?', 'Do you provide on-site mockup samples?'],
        suggestedLeadTime: '5 to 7 months out',
        status: 'to_hire',
      },
      {
        id: 'ven-5',
        category: 'Music & Audio',
        role: 'Master of Ceremonies & DJ / Live Ensemble',
        priority: 'recommended',
        deliverables: ['Ceremony wireless lapel mics', 'Cocktail acoustic set', 'Reception sound system and dance lighting', 'Customized do-not-play list compliance'],
        questionsToAsk: ['Do you provide wireless microphones for speeches?', 'How do you read the room to keep guests on the dance floor?', 'Do you have backup sound systems on-site?'],
        suggestedLeadTime: '5 to 6 months out',
        status: 'to_hire',
      },
      {
        id: 'ven-6',
        category: 'Beauty',
        role: 'Bridal Hair & Makeup Artist',
        priority: 'recommended',
        deliverables: ['Hair & makeup trial', 'Day-of touch-up kit', 'Bridal party styling schedule', 'Long-lasting photographic makeup'],
        questionsToAsk: ['How much time do you allot per person on the wedding morning?', 'Do you bring an assistant for large groups?', 'Do you travel to the bridal suite?'],
        suggestedLeadTime: '4 to 6 months out',
        status: 'to_hire',
      },
    ];

    if (aesthetic === 'traditional') {
      baseWeddingVendors.push({
        id: 'ven-7',
        category: 'Heritage Rites',
        role: 'Traditional Artisan & Ceremonial Officiant',
        priority: 'essential',
        deliverables: ['Sacred ceremonial rites guidance', 'Custom henna or artisanal calligraphy', 'Heirloom garland arrangements'],
        questionsToAsk: ['What traditional ceremonial items must the family prepare?'],
        suggestedLeadTime: '4 to 6 months out',
        status: 'to_hire',
      });
    }

    return baseWeddingVendors;
  }

  if (eventType === 'birthday') {
    return [
      {
        id: 'ven-1',
        category: 'Venue',
        role: 'Private Event Lounge or Rooftop Space',
        priority: 'essential',
        deliverables: ['Private space rental with audio system', 'Lounge furniture and bar access', 'Dedicated on-site manager'],
        questionsToAsk: ['Is outside catering and cake allowed?', 'What are the restrictions on confetti or flame candles?', 'What is the setup and teardown grace period?'],
        suggestedLeadTime: '2 to 3 months out',
        status: 'to_hire',
      },
      {
        id: 'ven-2',
        category: 'Culinary & Cake',
        role: 'Custom Cake Sculptor & Gourmet Finger Food',
        priority: 'essential',
        deliverables: ['Bespoke multi-tier celebration cake', 'Savory grazing boards or passed sliders', 'Custom dessert table styling'],
        questionsToAsk: ['Do you offer gluten-free and vegan alternatives?', 'Is delivery and cake stand rental included?', 'Can you match cake colors to our aesthetic?'],
        suggestedLeadTime: '4 to 6 weeks out',
        status: 'to_hire',
      },
      {
        id: 'ven-3',
        category: 'Entertainment',
        role: 'Open-Format DJ & Host',
        priority: 'recommended',
        deliverables: ['3 to 4 hour high energy DJ set', 'PA speakers and dance floor lighting', 'Announcements and cake reveal fanfare'],
        questionsToAsk: ['Can we submit a playlist of must-play tracks?', 'Do you take guest requests?', 'What lighting equipment do you include?'],
        suggestedLeadTime: '6 to 8 weeks out',
        status: 'to_hire',
      },
      {
        id: 'ven-4',
        category: 'Decor & Visuals',
        role: 'Bespoke Balloon & Backdrop Stylist',
        priority: 'recommended',
        deliverables: ['Custom color-matched photo backdrop', 'Organic balloon arch or floral garland', 'Neon greeting signage'],
        questionsToAsk: ['How long does installation take on the event day?', 'Do you return for teardown or can we dispose of it?', 'Is custom typography included?'],
        suggestedLeadTime: '3 to 5 weeks out',
        status: 'to_hire',
      },
      {
        id: 'ven-5',
        category: 'Photography',
        role: 'Event Candid Photographer',
        priority: 'optional',
        deliverables: ['3 hours candid party documentation', 'High-res downloadable gallery', 'Fast digital turnaround for social sharing'],
        questionsToAsk: ['Do you capture portrait stations as well as candids?', 'What is your turnaround timeframe for social media clips?'],
        suggestedLeadTime: '3 to 4 weeks out',
        status: 'to_hire',
      },
    ];
  }

  // Community Event
  return [
    {
      id: 'ven-1',
      category: 'Venue & Logistics',
      role: 'Municipal Authority / Park Management',
      priority: 'essential',
      deliverables: ['Permit approval for public gathering', 'Power hookup access', 'Sanitation and trash bin allocation', 'Fire marshal clearance'],
      questionsToAsk: ['What insurance liability certificates are required?', 'Are there restrictions on amplified outdoor sound?', 'What is the rain contingency agreement?'],
      suggestedLeadTime: '4 to 6 months out',
      status: 'to_hire',
    },
    {
      id: 'ven-2',
      category: 'Audio / Visual Production',
      role: 'Stage & Commercial AV Provider',
      priority: 'essential',
      deliverables: ['Outdoor rated PA sound system', 'Stage structure and canopy', '4 handheld wireless mics and monitor wedges', 'Full day on-site sound engineer'],
      questionsToAsk: ['Do you provide backup generators if line power fails?', 'Are your speakers weather-resistant?', 'Can you handle multiple acoustic instruments?'],
      suggestedLeadTime: '2 to 3 months out',
      status: 'to_hire',
    },
    {
      id: 'ven-3',
      category: 'Safety & First Aid',
      role: 'Licensed Event Security & Paramedic Crew',
      priority: 'essential',
      deliverables: ['Licensed crowd control personnel', 'Mobile first aid emergency station', 'Perimeter access monitoring', 'Incident response coordination'],
      questionsToAsk: ['What is the required guard ratio per 100 attendees?', 'Are guards trained in AED and heat exhaustion management?', 'Who coordinates with local emergency services?'],
      suggestedLeadTime: '2 months out',
      status: 'to_hire',
    },
    {
      id: 'ven-4',
      category: 'Food Vendors',
      role: 'Curated Food Truck & Beverage Collective',
      priority: 'recommended',
      deliverables: ['Diverse culinary options with health clearances', 'Zero-waste compostable serviceware', 'Quick service queue management'],
      questionsToAsk: ['Do vendors hold independent food safety certifications?', 'Are food trucks self-powered or do they require electrical ties?'],
      suggestedLeadTime: '6 to 8 weeks out',
      status: 'to_hire',
    },
    {
      id: 'ven-5',
      category: 'Signage & Facilities',
      role: 'Temporary Infrastructure & Wayfinding Signage',
      priority: 'recommended',
      deliverables: ['Directional A-frame signs and banners', 'Accessible portable restrooms and handwashing units', 'Recycling and compost stations'],
      questionsToAsk: ['When are units dropped off and serviced?', 'Do you provide wheelchair-accessible units?'],
      suggestedLeadTime: '4 to 6 weeks out',
      status: 'to_hire',
    },
  ];
}

// Generate preparation timeline milestones relative to event date
function generatePreparationTimeline(eventDateStr: string, eventType: EventType): TaskMilestone[] {
  const eventDate = new Date(eventDateStr);
  const now = new Date();

  // Helper to format due date string
  const formatOffsetDate = (daysBefore: number) => {
    const target = new Date(eventDate);
    target.setDate(target.getDate() - daysBefore);
    // If target date is before today, set to tomorrow so it is actionable
    if (target < now) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      return tomorrow.toISOString().split('T')[0];
    }
    return target.toISOString().split('T')[0];
  };

  if (eventType === 'wedding') {
    return [
      { id: 't-1', phase: 'Phase 1: Foundations', timeframe: '9–12 Months Out', title: 'Confirm Ceremony & Reception Venue', description: 'Finalize site contracts, review noise bylaws, and pay security deposits.', dueDate: formatOffsetDate(270), completed: true, category: 'Venue' },
      { id: 't-2', phase: 'Phase 1: Foundations', timeframe: '8–10 Months Out', title: 'Secure Key Creative Vendors', description: 'Interview and lock in lead photographer, videographer, and floral designer.', dueDate: formatOffsetDate(240), completed: false, category: 'Vendors' },
      { id: 't-3', phase: 'Phase 2: Guest Experience', timeframe: '6–8 Months Out', title: 'Send Save-the-Dates & Launch Wedding Site', description: 'Collect mailing addresses and publish travel and lodging accommodations.', dueDate: formatOffsetDate(180), completed: false, category: 'Guests' },
      { id: 't-4', phase: 'Phase 2: Guest Experience', timeframe: '5–6 Months Out', title: 'Schedule Menu Tastings & Cake Design', description: 'Sample signature dishes, pair reception wines, and finalize late-night snacks.', dueDate: formatOffsetDate(150), completed: false, category: 'Catering' },
      { id: 't-5', phase: 'Phase 3: Curation', timeframe: '3–4 Months Out', title: 'Mail Formal Wedding Invitations', description: 'Include response cards with meal options and dietary requirement prompts.', dueDate: formatOffsetDate(100), completed: false, category: 'Guests' },
      { id: 't-6', phase: 'Phase 3: Curation', timeframe: '2 Months Out', title: 'Curate Music Playlist & Ceremony Vows', description: 'Submit do-not-play list to DJ and finalize personalized marital vows.', dueDate: formatOffsetDate(60), completed: false, category: 'Music' },
      { id: 't-7', phase: 'Phase 4: Final Sprint', timeframe: '3–4 Weeks Out', title: 'Submit Final Headcount & Seating Chart', description: 'Deliver confirmed guest counts to caterer and export escort card list.', dueDate: formatOffsetDate(25), completed: false, category: 'Coordination' },
      { id: 't-8', phase: 'Phase 4: Final Sprint', timeframe: '1 Week Out', title: 'Finalize Day-of Run-Sheet & Emergency Kit', description: 'Distribute timeline to bridal party, assemble day-of emergency kit with steamer and pins.', dueDate: formatOffsetDate(7), completed: false, category: 'Logistics' },
      { id: 't-9', phase: 'Event Day', timeframe: 'Day Of', title: 'Execute Celebration & Enjoy Every Second', description: 'Hand over coordinator reins, stay hydrated, and soak in the celebration.', dueDate: formatOffsetDate(0), completed: false, category: 'Day-Of' },
    ];
  }

  if (eventType === 'birthday') {
    return [
      { id: 't-1', phase: 'Phase 1: Concept', timeframe: '6–8 Weeks Out', title: 'Secure Venue or Private Dining Space', description: 'Verify minimum spend, sound system, and reservation policies.', dueDate: formatOffsetDate(45), completed: true, category: 'Venue' },
      { id: 't-2', phase: 'Phase 1: Concept', timeframe: '4–5 Weeks Out', title: 'Send Invitations & Launch RSVP Tracker', description: 'Send digital animated invites and track dietary restrictions.', dueDate: formatOffsetDate(30), completed: false, category: 'Guests' },
      { id: 't-3', phase: 'Phase 2: Details', timeframe: '3 Weeks Out', title: 'Order Custom Cake & Thematic Decor', description: 'Finalize cake flavor, custom cake topper, and balloon installation mockup.', dueDate: formatOffsetDate(21), completed: false, category: 'Decor' },
      { id: 't-4', phase: 'Phase 2: Details', timeframe: '2 Weeks Out', title: 'Book DJ / Curate Celebration Playlist', description: 'Select 50 iconic party anthems and agree on sound equipment.', dueDate: formatOffsetDate(14), completed: false, category: 'Music' },
      { id: 't-5', phase: 'Phase 3: Final Countdown', timeframe: '1 Week Out', title: 'Finalize Catering Numbers & Signature Cocktails', description: 'Confirm final headcount with caterer and batch custom drink recipes.', dueDate: formatOffsetDate(7), completed: false, category: 'Catering' },
      { id: 't-6', phase: 'Event Day', timeframe: 'Day Of', title: 'Afternoon Venue Setup & Sound Check', description: 'Verify lighting, chill champagne, and test polaroid guestbook cameras.', dueDate: formatOffsetDate(0), completed: false, category: 'Day-Of' },
    ];
  }

  if (eventType === 'corporate') {
    return [
      { id: 't-1', phase: 'Phase 1: Scope & Budget', timeframe: '3–4 Months Out', title: 'Lock Conference Venue & Date', description: 'Confirm plenary room, breakout capacities, AV infrastructure, and catering.', dueDate: formatOffsetDate(100), completed: true, category: 'Venue' },
      { id: 't-2', phase: 'Phase 1: Scope & Budget', timeframe: '2–3 Months Out', title: 'Confirm Keynote Speakers & Agenda', description: 'Align speaker abstracts, executive bios, and keynote presentation deadlines.', dueDate: formatOffsetDate(75), completed: false, category: 'Program' },
      { id: 't-3', phase: 'Phase 2: Production', timeframe: '6–8 Weeks Out', title: 'Launch Attendee Registration & Mobile Portal', description: 'Send executive invitations and track RSVP dietary & accessibility needs.', dueDate: formatOffsetDate(45), completed: false, category: 'Guests' },
      { id: 't-4', phase: 'Phase 2: Production', timeframe: '3–4 Weeks Out', title: 'Order Swag, Badges & Event Signage', description: 'Print custom lanyard badges, welcome brochures, and branded stage backdrops.', dueDate: formatOffsetDate(21), completed: false, category: 'Branding' },
      { id: 't-5', phase: 'Phase 3: Final Tech Sync', timeframe: '1 Week Out', title: 'AV Rehearsal & Deck Review', description: 'Test presentation decks, wireless lavaliers, livestream feeds, and slide clickers.', dueDate: formatOffsetDate(7), completed: false, category: 'Tech' },
      { id: 't-6', phase: 'Event Day', timeframe: 'Day Of', title: 'Executive Operations & Stage Management', description: 'Manage speaker green room, monitor session timekeeping, and facilitate networking.', dueDate: formatOffsetDate(0), completed: false, category: 'Operations' },
    ];
  }

  if (eventType === 'college') {
    return [
      { id: 't-1', phase: 'Phase 1: Approvals & Headliners', timeframe: '2–3 Months Out', title: 'Secure Deanery & Security Clearance', description: 'Obtain campus administration permissions, safety clearances, and sports ground bookings.', dueDate: formatOffsetDate(75), completed: true, category: 'Permits' },
      { id: 't-2', phase: 'Phase 1: Approvals & Headliners', timeframe: '6–8 Weeks Out', title: 'Lock Headline Artist / Pro-Night Band', description: 'Sign artist rider contract, sound rider, and hotel accommodation requirements.', dueDate: formatOffsetDate(50), completed: false, category: 'Artists' },
      { id: 't-3', phase: 'Phase 2: Sponsorship & Marketing', timeframe: '4–5 Weeks Out', title: 'Finalize Brand Sponsors & Stall Partners', description: 'Confirm title sponsors, youth beverage partnerships, and campus publicity campaigns.', dueDate: formatOffsetDate(30), completed: false, category: 'Sponsorship' },
      { id: 't-4', phase: 'Phase 2: Logistics', timeframe: '2 Weeks Out', title: 'Finalize Stage Trussing, Line Arrays & Lighting', description: 'Inspect main stage build specs, generator backups, and acoustic sound fences.', dueDate: formatOffsetDate(14), completed: false, category: 'Production' },
      { id: 't-5', phase: 'Phase 3: Security & Teams', timeframe: '3 Days Out', title: 'Student Volunteer & Security Briefing', description: 'Distribute pass barcodes, walkie-talkies, and emergency medical station kits.', dueDate: formatOffsetDate(3), completed: false, category: 'Safety' },
      { id: 't-6', phase: 'Event Day', timeframe: 'Day Of', title: 'Live Fest Execution & Crowd Management', description: 'Execute inter-college event tracks, manage artist entry, and supervise pro-night crowd flow.', dueDate: formatOffsetDate(0), completed: false, category: 'Execution' },
    ];
  }

  if (eventType === 'concert') {
    return [
      { id: 't-1', phase: 'Phase 1: Booking & Venue', timeframe: '4–6 Months Out', title: 'Lock Concert Arena & Ticketing Platform', description: 'Sign arena lease, set box office tier pricing, and establish door security protocols.', dueDate: formatOffsetDate(120), completed: true, category: 'Venue' },
      { id: 't-2', phase: 'Phase 1: Booking & Venue', timeframe: '3 Months Out', title: 'Audio / Lighting / LED Production Contract', description: 'Finalize line array audio specs, lighting design, and backstage video wall rigs.', dueDate: formatOffsetDate(90), completed: false, category: 'Production' },
      { id: 't-3', phase: 'Phase 2: Marketing & Permits', timeframe: '6–8 Weeks Out', title: 'Secure Sound Licensing & Emergency Services', description: 'Obtain police clearances, fire safety certifications, and private ambulance deployment.', dueDate: formatOffsetDate(45), completed: false, category: 'Permits' },
      { id: 't-4', phase: 'Phase 2: Logistics', timeframe: '2 Weeks Out', title: 'Artist Hospitality & Backline Delivery', description: 'Verify artist green room riders, instrument rentals, and VIP lounge amenities.', dueDate: formatOffsetDate(14), completed: false, category: 'Hospitality' },
      { id: 't-5', phase: 'Phase 3: Production Load-In', timeframe: '1 Day Out', title: 'Full Technical Rehearsal & Rigging Inspection', description: 'Rigging structural checks, audio delay leveling, and laser cue programming.', dueDate: formatOffsetDate(1), completed: false, category: 'Rehearsal' },
      { id: 't-6', phase: 'Concert Day', timeframe: 'Day Of', title: 'Doors Open, Show Execution & Load-Out', description: 'Manage box office scanning, monitor stage run-sheet, and supervise load-out breakdown.', dueDate: formatOffsetDate(0), completed: false, category: 'Show' },
    ];
  }

  if (eventType === 'party') {
    return [
      { id: 't-1', phase: 'Phase 1: Concept & Venue', timeframe: '3–4 Weeks Out', title: 'Book Party Space / Lounge & DJ', description: 'Confirm venue deposit, sound system availability, and sound restrictions.', dueDate: formatOffsetDate(21), completed: true, category: 'Venue' },
      { id: 't-2', phase: 'Phase 1: Concept & Venue', timeframe: '2 Weeks Out', title: 'Send Party Invites & RSVP Link', description: 'Broadcast theme dress code and collect dietary drink preferences.', dueDate: formatOffsetDate(14), completed: false, category: 'Guests' },
      { id: 't-3', phase: 'Phase 2: Drinks & Decor', timeframe: '1 Week Out', title: 'Lock Signature Mixology & Lighting', description: 'Order ice, specialty spirits, glassware, and accent LED tube lighting.', dueDate: formatOffsetDate(7), completed: false, category: 'Bar' },
      { id: 't-4', phase: 'Phase 3: Final Countdown', timeframe: '2 Days Out', title: 'Playlist & Photo Setup Finalization', description: 'Confirm guest DJ cue times and prep instant photo wall camera film.', dueDate: formatOffsetDate(2), completed: false, category: 'Music' },
      { id: 't-5', phase: 'Party Day', timeframe: 'Day Of', title: 'Setup, Chill Drinks & Host Guests', description: 'Arrange welcome shots, test dance lighting, and kick off the evening.', dueDate: formatOffsetDate(0), completed: false, category: 'Host' },
    ];
  }

  // Community Event & Custom fallback
  return [
    { id: 't-1', phase: 'Phase 1: Permits & Vision', timeframe: '3–4 Months Out', title: 'Secure Municipal Permits & Facility Reservation', description: 'File park or street closure permits and obtain event insurance policy.', dueDate: formatOffsetDate(90), completed: true, category: 'Permits' },
    { id: 't-2', phase: 'Phase 2: Stakeholders', timeframe: '2 Months Out', title: 'Enlist Community Partners & Food Vendors', description: 'Recruit local food stalls, cultural performers, and confirm booth allocations.', dueDate: formatOffsetDate(60), completed: false, category: 'Partners' },
    { id: 't-3', phase: 'Phase 2: Stakeholders', timeframe: '6 Weeks Out', title: 'Launch Public Marketing & Volunteer Recruitment', description: 'Distribute posters, run social campaigns, and train volunteer team leaders.', dueDate: formatOffsetDate(42), completed: false, category: 'Outreach' },
    { id: 't-4', phase: 'Phase 3: Infrastructure', timeframe: '3 Weeks Out', title: 'Contract AV Stage, Sanitation & First Aid', description: 'Book mobile restrooms, commercial PA system, and certified medics.', dueDate: formatOffsetDate(21), completed: false, category: 'Logistics' },
    { id: 't-5', phase: 'Phase 3: Infrastructure', timeframe: '1 Week Out', title: 'Conduct Walkthrough & Run Sheet Review', description: 'Meet with volunteers and safety marshals to review emergency exit protocols.', dueDate: formatOffsetDate(7), completed: false, category: 'Safety' },
    { id: 't-6', phase: 'Event Day', timeframe: 'Day Of', title: 'Site Load-In, Event Execution & Site Cleanup', description: 'Oversee staging, crowd management, and enforce leave-no-trace cleanup.', dueDate: formatOffsetDate(0), completed: false, category: 'Operations' },
  ];
}

// Generate personalized ideas based on scale, budget, and aesthetic
function generatePersonalizedIdeas(
  eventType: EventType,
  aesthetic: Aesthetic,
  guestCount: number,
  totalBudget: number,
  notes?: string
): PersonalizedIdea[] {
  const ideas: PersonalizedIdea[] = [];

  // Idea 1: Guest Touchpoint
  if (guestCount <= 50) {
    ideas.push({
      title: 'Handwritten Letter Place Settings',
      category: 'Guest Experience',
      description: 'Place an intimate wax-sealed envelope at every seat containing a personalized 3-sentence note recalling a cherished memory with that guest.',
      whyItWorks: 'Creates immediate emotional resonance and turns dinner seating into an unforgettable heartfelt keepsake.',
    });
  } else if (guestCount <= 180) {
    ideas.push({
      title: 'Curated Audio Guestbook Station',
      category: 'Guest Experience',
      description: 'Install a vintage rotary telephone where guests pick up the receiver to hear a warm greeting from the host, then record spontaneous voicemail memories.',
      whyItWorks: 'Preserves the authentic voices, laughs, and late-night toasts of your loved ones for decades to come.',
    });
  } else {
    ideas.push({
      title: 'Live Interactive Mosaic Wall',
      category: 'Guest Experience',
      description: 'A real-time mosaic wall where guest photos taken on polaroid or tagged on a private hashtag are printed as adhesive tiles forming a giant commemorative artwork.',
      whyItWorks: 'Engages high-volume attendance seamlessly and yields an extraordinary physical art piece for your home or community hall.',
    });
  }

  // Idea 2: Sensory & Culinary
  if (eventType === 'wedding') {
    ideas.push({
      title: 'His, Hers & Our Heritage Cocktail Trio',
      category: 'Culinary & Bar',
      description: 'Three crafted signature drinks: one honoring one partner’s roots, one honoring the other, and a third sparkling blend celebrating their shared journey.',
      whyItWorks: 'Turns standard bar service into storytelling while controlling beverage costs through batched craft cocktails.',
    });
  } else if (eventType === 'birthday') {
    ideas.push({
      title: 'Midnight Decadence Dessert Bar',
      category: 'Culinary & Bar',
      description: 'At 10:30 PM, roll out an unexpected warm churro and artisanal gelato station with spiked espresso martinis as a high-energy dance floor revival.',
      whyItWorks: 'Re-energizes the crowd during the final hours and creates a spontaneous delight moment everyone raves about.',
    });
  } else {
    ideas.push({
      title: 'Neighborhood Heirloom Recipe Kiosk',
      category: 'Culinary & Bar',
      description: 'A community tasting lane featuring miniature bites prepared from long-time residents’ generational family recipes, printed with recipe takeaway cards.',
      whyItWorks: 'Celebrates local cultural diversity and fosters conversations across age groups through food traditions.',
    });
  }

  // Idea 3: Aesthetic-specific immersion
  if (aesthetic === 'elegant') {
    ideas.push({
      title: 'Chamber String Quartet Playing Modern Classics',
      category: 'Atmosphere & Sound',
      description: 'Hire a classical string quartet to perform acoustic arrangements of modern indie, pop, and rock anthems during guest arrivals and cocktail hour.',
      whyItWorks: 'Bridges refined high-culture poise with contemporary nostalgia that captivates both elders and younger guests.',
    });
  } else if (aesthetic === 'garden') {
    ideas.push({
      title: 'Living Potted Herb Centerpieces to Take Home',
      category: 'Decor & Sustainability',
      description: 'Instead of cut flowers that wilt, arrange tables with terracotta pots of lavender, rosemary, and thyme surrounded by pillar candles, gifted to guests at departure.',
      whyItWorks: 'Provides intoxicating natural fragrance, reduces floral waste to zero, and lives on in guests’ home gardens.',
    });
  } else if (aesthetic === 'modern') {
    ideas.push({
      title: 'Sculptural Monolith Photo Vignette',
      category: 'Visual & Art Direction',
      description: 'A museum-inspired backdrop featuring raw concrete-textured fluted arches, warm hidden LED halos, and a single dramatic floral cloud.',
      whyItWorks: 'Elevates guest photography to high-fashion editorial quality without tacky commercial props.',
    });
  } else if (aesthetic === 'playful') {
    ideas.push({
      title: 'The Confetti Cannon Grand Crescendo',
      category: 'Entertainment',
      description: 'Coordinate biodegradable pastel paper confetti cannons to erupt during the peak of the headline dance track or celebratory toast.',
      whyItWorks: 'Produces a burst of pure euphoria and cinematic photos that encapsulate the joy of the day.',
    });
  } else if (aesthetic === 'traditional') {
    ideas.push({
      title: 'Living Artisan Heritage Workshop Corner',
      category: 'Cultural Engagement',
      description: 'Invite a master traditional artisan (calligrapher, bangle maker, or weaver) to craft live custom souvenirs for guests throughout the evening.',
      whyItWorks: 'Connects celebration to living heritage and provides an authentic, high-value bespoke gift.',
    });
  } else {
    ideas.push({
      title: 'Kinetic Monochrome Light Ceiling',
      category: 'Lighting Architecture',
      description: 'A focused canopy of delicate paper globe lanterns hung at varying heights with subtle breathing dimming transitions.',
      whyItWorks: 'Transforms the ceiling plane into an architectural masterpiece while keeping floor spaces clutter-free.',
    });
  }

  // Idea 4: Custom adaptation if notes provided
  if (notes && notes.trim().length > 0) {
    ideas.push({
      title: 'Custom Curated Vision Accent',
      category: 'Personalized Touch',
      description: `Specifically tailored to your vision ("${notes.slice(0, 80)}${notes.length > 80 ? '...' : ''}"): integrate a dedicated showcase station and bespoke signage honoring this distinctive focal point.`,
      whyItWorks: 'Ensures the celebration feels unmistakably yours and communicates your unique personal narrative.',
    });
  }

  return ideas;
}

// Master Blueprint Generator
export function generateEventBlueprint(formData: EventFormData, eventId: string): EventBlueprint {
  const { eventType, aesthetic, title, location, guestCount, totalBudget, currency, notes, customBudgetCategories } = formData;

  const concept = generateConceptAndNarrative(eventType, aesthetic, title, location, guestCount);
  const defaultPalette = PALETTES_BY_AESTHETIC[aesthetic] || PALETTES_BY_AESTHETIC.elegant;
  // Pre-configured custom palettes
  const CUSTOM_NAMED_PALETTES: Record<string, ColorSwatch[]> = {
    'Royal Crimson & Antique Gold': [
      { name: 'Royal Crimson', hex: '#800020', role: 'Primary Anchor', description: 'Deep regal crimson velvet grounding' },
      { name: 'Antique Gold', hex: '#D4AF37', role: 'Lustrous Accent', description: 'Gilded metallic warmth and ceremonial glow' },
      { name: 'Warm Ivory', hex: '#FAF7F2', role: 'Base Canvas', description: 'Clean warm neutral linen' },
      { name: 'Imperial Noir', hex: '#1E0F24', role: 'Depth Shadow', description: 'Midnight plum shadow contrast' },
    ],
    'Midnight Velvet & Champagne': [
      { name: 'Midnight Velvet', hex: '#1E0F24', role: 'Primary Anchor', description: 'Deep evening drama and mystery' },
      { name: 'Champagne Gold', hex: '#F5E6C8', role: 'Lustrous Accent', description: 'Soft radiant glow' },
      { name: 'Muted Coral', hex: '#E86A58', role: 'Vibrant Accent', description: 'Warm energetic floral touch' },
      { name: 'Deep Aubergine', hex: '#3A1B42', role: 'Secondary Tone', description: 'Rich velvet shading' },
    ],
    'Sage Garden & Blush Rose': [
      { name: 'Sage Leaf', hex: '#4A6B4F', role: 'Primary Botanical', description: 'Earthy botanical foundation' },
      { name: 'Blush Rose', hex: '#E88D83', role: 'Floral Focal', description: 'Romantic petal accents' },
      { name: 'Warm Ivory', hex: '#FAF7F2', role: 'Base Canvas', description: 'Organic linen and silk' },
      { name: 'Deep Forest', hex: '#263829', role: 'Grounding Shadow', description: 'Verdant shadow structure' },
    ],
    'Ivory Minimal & Brushed Brass': [
      { name: 'Warm Ivory', hex: '#FAF7F2', role: 'Base Canvas', description: 'Luminous architectural serenity' },
      { name: 'Brushed Brass', hex: '#D8BD91', role: 'Refined Accent', description: 'Warm metallic highlights' },
      { name: 'Charcoal Noir', hex: '#28262B', role: 'Linear Anchor', description: 'Precise contrast lines' },
      { name: 'Stone Grey', hex: '#9E9E9E', role: 'Subtle Foil', description: 'Balanced midtones' },
    ],
  };

  const colorPalette: ColorSwatch[] =
    formData.colorPalette && CUSTOM_NAMED_PALETTES[formData.colorPalette]
      ? CUSTOM_NAMED_PALETTES[formData.colorPalette]
      : defaultPalette;

  const decorHighlights = DECOR_BY_AESTHETIC[aesthetic] || DECOR_BY_AESTHETIC.elegant;
  const schedule = generateEventSchedule(eventType);
  let budget = generateRecommendedBudget(eventType, totalBudget, currency);

  if (customBudgetCategories && customBudgetCategories.length > 0) {
    const updatedCats = budget.categories.map((cat) => {
      const customMatch = customBudgetCategories.find(
        (c) =>
          c.name.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0]) ||
          cat.name.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])
      );
      if (customMatch) {
        return {
          ...cat,
          allocated: customMatch.allocated,
        };
      }
      return cat;
    });
    budget = recalculateBudget(updatedCats, totalBudget, currency);
  }

  const vendors = generateVendorChecklist(eventType, aesthetic);
  const timeline = generatePreparationTimeline(formData.date, eventType);
  const personalizedIdeas = generatePersonalizedIdeas(eventType, aesthetic, guestCount, totalBudget, notes);

  return {
    eventId,
    conceptTitle: concept.conceptTitle,
    tagline: concept.tagline,
    narrative: concept.narrative,
    colorPalette,
    decorHighlights,
    atmosphereNotes: formData.atmosphere || concept.atmosphereNotes,
    personalizedIdeas,
    schedule,
    budget,
    vendors,
    timeline,
    generatedAt: new Date().toISOString(),
    engineType: 'deterministic-rules',
  };
}

