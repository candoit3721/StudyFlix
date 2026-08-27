/**
 * Sophia's Super Science & Chemistry Quest
 * Interactive Web Application Logic
 */

// Global State
const state = {
  xp: parseInt(localStorage.getItem('sophia_science_xp') || '0'),
  streak: 0,
  soundEnabled: true,
  badges: JSON.parse(localStorage.getItem('sophia_science_badges') || '[]'),
  completedQuests: JSON.parse(localStorage.getItem('sophia_science_completed_quests') || '[]'),
  currentQuizMode: 'periodic',
  currentQuizQuestions: [],
  currentQuestionIndex: 0,
  quizScore: 0,
  hasAnsweredCurrent: false,
  decoderIndex: 0
};

// Elements Database
const ELEMENTS = [
  { num: 1, sym: "H", name: "Hydrogen", type: "gas", emoji: "🚀", title: "The Rocket Launcher", desc: "Lightest element in universe! Fuels stars & rockets.", real: "Water (H2O), the Sun, rocket fuel.", mnemonic: "Happy in 'Happy Henry Likes Berries...'" },
  { num: 2, sym: "He", name: "Helium", type: "noble", emoji: "🎈", title: "The High-Pitch Floater", desc: "Lighter than air; makes balloons float & voices squeaky!", real: "Party balloons, blimps, MRI cooling.", mnemonic: "Henry in 'Happy Henry Likes Berries...'" },
  { num: 3, sym: "Li", name: "Lithium", type: "metal", emoji: "🔋", title: "The Battery Boss", desc: "Lightest solid metal! Stores massive electric energy.", real: "Smartphones, iPads, Tesla electric cars.", mnemonic: "Likes in 'Happy Henry Likes Berries...'" },
  { num: 4, sym: "Be", name: "Beryllium", type: "metal", emoji: "🛰️", title: "The Space Shield", desc: "Super lightweight, strong metal that withstands space cold.", real: "James Webb Space Telescope mirrors, emeralds.", mnemonic: "Berries in 'Happy Henry Likes Berries...'" },
  { num: 5, sym: "B", name: "Boron", type: "metal", emoji: "🧪", title: "The Heatproof Glassmaker", desc: "Makes glass ultra-tough so it won't crack in ovens.", real: "Pyrex baking dishes, silly putty.", mnemonic: "But in 'Happy Henry Likes Berries...'" },
  { num: 6, sym: "C", name: "Carbon", type: "metal", emoji: "💎", title: "The Shape-Shifting King", desc: "The foundation of all life! Soft graphite or shiny diamond.", real: "Pencils, diamonds, DNA, humans, trees.", mnemonic: "Can in 'Happy Henry Likes Berries...'" },
  { num: 7, sym: "N", name: "Nitrogen", type: "gas", emoji: "💨", title: "The Silent Giant", desc: "Makes up 78% of air! Keeps potato chips fresh & crunchy.", real: "Atmosphere, fertilizer, chip bags.", mnemonic: "Not in 'Happy Henry Likes Berries...'" },
  { num: 8, sym: "O", name: "Oxygen", type: "gas", emoji: "🫁", title: "The Life Giver", desc: "We breathe it to produce cellular energy; feeds flames.", real: "Air we breathe (21%), water (H2O).", mnemonic: "Offer in 'Happy Henry Likes Berries...'" },
  { num: 9, sym: "F", name: "Fluorine", type: "gas", emoji: "🪥", title: "The Cavity Crusher", desc: "Bonds tightly to enamel to protect teeth from cavities.", real: "Toothpaste, Teflon non-stick pans.", mnemonic: "Four in 'Happy Henry Likes Berries...'" },
  { num: 10, sym: "Ne", name: "Neon", type: "noble", emoji: "🏮", title: "The Night Glow", desc: "Noble gas that glows brilliant reddish-orange with electricity.", real: "Store signs, runway lights.", mnemonic: "Nuts in 'Happy Henry Likes Berries...'" },
  { num: 11, sym: "Na", name: "Sodium", type: "metal", emoji: "🧂", title: "The Fiery Salt Partner", desc: "Soft metal that pops in water, but makes table salt with Chlorine!", real: "Table salt (NaCl), baking soda.", mnemonic: "Naughty in 'Naughty Monkeys Always...'" },
  { num: 12, sym: "Mg", name: "Magnesium", type: "metal", emoji: "🎆", title: "The Flashbang Sparkler", desc: "Burns with blinding white light; central to plant chlorophyll.", real: "Sparklers, fireworks, green plant leaves.", mnemonic: "Monkeys in 'Naughty Monkeys Always...'" },
  { num: 13, sym: "Al", name: "Aluminum", type: "metal", emoji: "🥫", title: "The Lightweight Armor", desc: "Doesn't rust easily, super light, and 100% recyclable!", real: "Soda cans, foil, airplanes, bicycles.", mnemonic: "Always in 'Naughty Monkeys Always...'" },
  { num: 14, sym: "Si", name: "Silicon", type: "metal", emoji: "💻", title: "The Computer Brain", desc: "Found in beach sand; powers all computer processors.", real: "Computer chips, smartphones, sand, solar panels.", mnemonic: "Sing in 'Naughty Monkeys Always...'" },
  { num: 15, sym: "P", name: "Phosphorus", type: "metal", emoji: "🔥", title: "The Matchbox Igniter", desc: "Ignites easily with friction; strengthens bones & DNA.", real: "Matchstick tips, bones, cell membranes.", mnemonic: "Pop in 'Naughty Monkeys Always...'" },
  { num: 16, sym: "S", name: "Sulfur", type: "metal", emoji: "🌋", title: "The Stinky Yellow Mineral", desc: "Yellow volcanic crystal; smells like rotten eggs and onions!", real: "Volcanoes, hot springs, onion tears.", mnemonic: "Songs in 'Naughty Monkeys Always...'" },
  { num: 17, sym: "Cl", name: "Chlorine", type: "gas", emoji: "🏊", title: "The Pool Cleaner", desc: "Greenish gas that purifies swimming pools & pairs for salt.", real: "Pools, bleach, table salt (NaCl).", mnemonic: "Clapping in 'Naughty Monkeys Always...'" },
  { num: 18, sym: "Ar", name: "Argon", type: "noble", emoji: "💡", title: "The Bulb Protector", desc: "Noble gas that shields light bulb filaments from burning.", real: "Light bulbs, double-pane insulated windows.", mnemonic: "Around in 'Naughty Monkeys Always...'" },
  { num: 19, sym: "K", name: "Potassium", type: "metal", emoji: "🍌", title: "The Banana King", desc: "Prevents muscle cramps & keeps heart rhythm healthy.", real: "Bananas, potatoes, avocados.", mnemonic: "King's in 'Naughty Monkeys Always...'" },
  { num: 20, sym: "Ca", name: "Calcium", type: "metal", emoji: "🦴", title: "The Bone Fortress", desc: "Makes teeth, bones, and seashells rock-hard!", real: "Milk, cheese, chalk, coral reefs.", mnemonic: "Castles in 'Naughty Monkeys Always...'" },
  // VIP Elements
  { num: 26, sym: "Fe", name: "Iron", type: "vip", emoji: "🦾", title: "The Magnetic Muscle", desc: "Makes blood red and carries oxygen; super magnetic metal.", real: "Blood hemoglobin, bridges, cast iron pans.", mnemonic: "Iron-Man is Fearless (Fe)!" },
  { num: 29, sym: "Cu", name: "Copper", type: "vip", emoji: "⚡", title: "The Lightning Conductor", desc: "Carries electric power through wires; turns green over time!", real: "Statue of Liberty, electric wires, pennies.", mnemonic: "Copper pennies are CUte (Cu)!" },
  { num: 47, sym: "Ag", name: "Silver", type: "vip", emoji: "🥈", title: "The Shiny Mirror", desc: "Best conductor of heat and light in the world.", real: "Mirrors, fine jewelry, solar panels.", mnemonic: "AGh, I almost got gold! (Ag)" },
  { num: 79, sym: "Au", name: "Gold", type: "vip", emoji: "👑", title: "The Eternal Treasure", desc: "Never rusts or tarnishes; malleable and precious.", real: "Jewelry, astronaut visors, electronics.", mnemonic: "AY YOU (Au), bring back my gold!" }
];

// Quests Definition for Map
const QUESTS = [
  { id: "q1", icon: "🧪", title: "Periodic Table Superheroes", desc: "Master the first 20 elements, symbols, and real-world superpowers.", targetTab: "tab-periodic", quizMode: "periodic" },
  { id: "q2", icon: "🕶️", title: "Secret Chemical Decoder", desc: "Crack hidden words built from chemical element symbols!", targetTab: "tab-decoder" },
  { id: "q3", icon: "🥞", title: "Matter & Kitchen Chemistry", desc: "Physical vs. Chemical changes, lemonade solutions, and conservation of mass.", targetTab: "tab-learn", quizMode: "grade5" },
  { id: "q4", icon: "🌲", title: "Ecosystems & Energy Flow", desc: "Photosynthesis, food webs, and the 10% energy pyramid rule.", targetTab: "tab-learn", quizMode: "grade5" },
  { id: "q5", icon: "🌎", title: "Earth's 4 Spheres & Water", desc: "Explore the dinosaur water cycle and sphere interactions.", targetTab: "tab-learn", quizMode: "grade5" },
  { id: "q6", icon: "🏙️", title: "Cell City Biology (Grade 6)", desc: "Nucleus Mayor, Mitochondria Powerhouse, and Plant Cell upgrades!", targetTab: "tab-learn", quizMode: "grade6" },
  { id: "q7", icon: "🎢", title: "Roller Coaster Physics (Grade 6)", desc: "Potential vs. Kinetic energy and Newton's 3 Laws of Motion.", targetTab: "tab-learn", quizMode: "grade6" },
  { id: "q8", icon: "🕵️", title: "Scientific Method Detective", desc: "Master the I-D-C Variable rule and design fair science tests.", targetTab: "tab-learn", quizMode: "grade6" }
];

// Decoder Words Database
const DECODER_DATA = [
  { prompt: "Carbon (C) + Argon (Ar) =", answer: "CAR", hint: "A four-wheeled vehicle! Beep beep! 🚗", elements: "C (#6) + Ar (#18)" },
  { prompt: "Sodium (Na) + Phosphorus (P) =", answer: "NAP", hint: "A cozy afternoon sleep! 😴", elements: "Na (#11) + P (#15)" },
  { prompt: "Boron (B) + Oxygen (O) + Sulfur (S) + Sulfur (S) =", answer: "BOSS", hint: "The leader in charge of an organization! 👑", elements: "B (#5) + O (#8) + S (#16) + S (#16)" },
  { prompt: "Tungsten (W) + Silver (Ag) + Sulfur (S) =", answer: "WAGS", hint: "What happy dogs do with their tails! 🐕", elements: "W (#74) + Ag (#47) + S (#16)" },
  { prompt: "Tantalum (Ta) + Cobalt (Co) =", answer: "TACO", hint: "Delicious crunchy Mexican food! 🌮", elements: "Ta (#73) + Co (#27)" },
  { prompt: "Lithium (Li) + Oxygen (O) + Nitrogen (N) =", answer: "LION", hint: "The roar of the jungle king! 🦁", elements: "Li (#3) + O (#8) + N (#7)" },
  { prompt: "Phosphorus (P) + Iodine (I) + Zirconium (Zr) + Zirconium (Zr) + Aluminum (Al) =", answer: "PIZZA", hint: "Yummy cheesy Italian dinner! 🍕", elements: "P (#15) + I (#53) + Zr (#40) + Zr (#40) + Al (#13)" },
  { prompt: "Scandium (Sc) + Iodine (I) + Einsteinium (Es) + Cerium (Ce) =", answer: "SCIENCE", hint: "The greatest subject of all! 🧪✨", elements: "Sc (#21) + I (#53) + Es (#99) + Ce (#58)" }
];

// Badges Database
const BADGES = [
  { id: "first_quest", icon: "🌱", title: "Curious Explorer", desc: "Completed your very first science quiz!" },
  { id: "streak_3", icon: "🔥", title: "On Fire!", desc: "Got 3 correct answers in a row!" },
  { id: "chemist_queen", icon: "🧪", title: "Element Queen", desc: "Scored 100% on the Periodic Table Quiz!" },
  { id: "code_breaker", icon: "🕵️", title: "Secret Code Breaker", desc: "Unlocked all 8 secret chemical words!" },
  { id: "grade5_champ", icon: "🌍", title: "Grade 5 Science Master", desc: "Mastered matter, ecosystems & Earth spheres!" },
  { id: "cell_mayor", icon: "🏙️", title: "Cell City Mayor", desc: "Aced the cell biology & organelle questions!" },
  { id: "physics_wizard", icon: "🎢", title: "Physics Wizard", desc: "Conquered roller coaster physics & Newton's laws!" },
  { id: "science_legend", icon: "👑", title: "Grand Science Legend", desc: "Accumulated over 500 total XP!" }
];

// Sound Synthesizer via Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (!state.soundEnabled) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'correct') {
    // Pleasant high-pitch celebratory chime
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
    osc.frequency.setValueAtTime(1174.66, now + 0.16); // D6
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.start(now);
    osc.stop(now + 0.45);
  } else if (type === 'wrong') {
    // Soft low buzz
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(180, now + 0.12);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'fanfare') {
    // Victory trumpet fanfare
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      o.connect(g);
      g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.2, now + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
      o.start(now + i * 0.1);
      o.stop(now + i * 0.1 + 0.35);
    });
  }
}

// Confetti Particle System
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  confettiParticles = [];
  const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#38bdf8', '#fbbf24'];
  for (let i = 0; i < 90; i++) {
    confettiParticles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      life: 100
    });
  }
  requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles = confettiParticles.filter(p => p.life > 0);

  confettiParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.4; // gravity
    p.rotation += p.vRot;
    p.life--;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });

  if (confettiParticles.length > 0) {
    requestAnimationFrame(updateConfetti);
  }
}

// UI Initialization & Tab Switching
function initUI() {
  // Update header stats
  updateStatsDisplay();

  // Render Quests
  renderQuests();

  // Render Elements Grid
  renderElements('all');

  // Render Decoder
  renderDecoder();

  // Render Trophies
  renderTrophies();

  // Tab click listeners
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.getAttribute('data-tab'));
    });
  });

  // Filter buttons for elements
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderElements(btn.getAttribute('data-filter'));
    });
  });

  // Sound toggle button
  document.getElementById('sound-toggle-btn').addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    document.getElementById('sound-toggle-btn').textContent = state.soundEnabled ? '🔊' : '🔇';
  });

  // Decoder Enter key support
  document.getElementById('decoder-answer-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      checkDecoderAnswer();
    }
  });

  handleHashNavigation();
}

function handleHashNavigation() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;

  if (document.getElementById(hash)) {
    switchTab(hash);
  }
}
window.addEventListener('hashchange', handleHashNavigation);

function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStatsDisplay() {
  document.getElementById('xp-count').textContent = state.xp;
  document.getElementById('streak-count').textContent = state.streak;
  document.getElementById('badge-count').textContent = `${state.badges.length}/${BADGES.length}`;

  localStorage.setItem('sophia_science_xp', state.xp.toString());
  localStorage.setItem('sophia_science_badges', JSON.stringify(state.badges));
  localStorage.setItem('sophia_science_completed_quests', JSON.stringify(state.completedQuests));
}

function addXP(amount) {
  state.xp += amount;
  updateStatsDisplay();
  if (state.xp >= 500 && !state.badges.includes('science_legend')) {
    unlockBadge('science_legend');
  }
}

function unlockBadge(badgeId) {
  if (!state.badges.includes(badgeId)) {
    state.badges.push(badgeId);
    updateStatsDisplay();
    renderTrophies();
    launchConfetti();
    playSound('fanfare');
  }
}

// Render Quests on Map
function renderQuests() {
  const grid = document.getElementById('quest-cards-grid');
  grid.innerHTML = '';

  QUESTS.forEach(q => {
    const isCompleted = state.completedQuests.includes(q.id);
    const card = document.createElement('div');
    card.className = 'quest-card';
    card.innerHTML = `
      <div>
        <div class="quest-card-header">
          <div class="quest-icon">${q.icon}</div>
          <h4>${q.title}</h4>
        </div>
        <p>${q.desc}</p>
      </div>
      <div>
        <span class="quest-status-badge ${isCompleted ? 'completed' : 'ready'}">
          ${isCompleted ? '✅ Completed' : '⚡ Ready to Play'}
        </span>
      </div>
    `;
    card.onclick = () => {
      if (q.quizMode) {
        switchTab('tab-quiz');
        startQuiz(q.quizMode);
      } else {
        switchTab(q.targetTab);
      }
    };
    grid.appendChild(card);
  });
}

// Render Elements Grid
function renderElements(filter) {
  const grid = document.getElementById('elements-grid');
  grid.innerHTML = '';

  const filtered = ELEMENTS.filter(el => {
    if (filter === 'all') return el.num <= 20;
    if (filter === 'gas') return el.type === 'gas' || el.type === 'noble';
    if (filter === 'metal') return el.type === 'metal';
    if (filter === 'noble') return el.type === 'noble';
    if (filter === 'vip') return el.type === 'vip';
    return true;
  });

  filtered.forEach(el => {
    const card = document.createElement('div');
    card.className = 'element-card';
    card.innerHTML = `
      <span class="el-num">#${el.num}</span>
      <span class="el-symbol">${el.sym}</span>
      <div class="el-name">${el.name}</div>
      <span class="el-hero">${el.emoji} ${el.title}</span>
    `;
    card.onclick = () => showElementDetail(el);
    grid.appendChild(card);
  });
}

function showElementDetail(el) {
  document.getElementById('modal-atomic-num').textContent = `#${el.num}`;
  document.getElementById('modal-name').textContent = el.name;
  document.getElementById('modal-symbol').textContent = el.sym;
  document.getElementById('modal-emoji').textContent = el.emoji;
  document.getElementById('modal-superpower-title').textContent = el.title;
  document.getElementById('modal-superpower-desc').textContent = el.desc;
  document.getElementById('modal-real-life').textContent = el.real;
  document.getElementById('modal-mnemonic').textContent = el.mnemonic;

  const card = document.getElementById('element-detail-card');
  card.classList.remove('hidden');
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeElementModal() {
  document.getElementById('element-detail-card').classList.add('hidden');
}

// Lesson Accordion Toggle
function toggleLesson(headerEl) {
  const card = headerEl.parentElement;
  card.classList.toggle('open');
}

// Quiz Arena Logic
const QUIZ_QUESTIONS = {
  periodic: [
    { q: "What is the very first and lightest element on the Periodic Table?", options: ["Helium (He)", "Hydrogen (H)", "Oxygen (O)", "Lithium (Li)"], ans: 1, tag: "🧪 Chemistry", exp: "Hydrogen (H, #1) is the simplest element and makes up ~75% of the universe's mass!" },
    { q: "Which element fills floating birthday balloons and makes your voice squeaky?", options: ["Nitrogen (N)", "Argon (Ar)", "Helium (He)", "Neon (Ne)"], ans: 2, tag: "🧪 Chemistry", exp: "Helium (He, #2) is lighter than air and super calm/noble!" },
    { q: "Which element is found in pencil lead (graphite) and can form diamonds under high heat and pressure?", options: ["Silicon (Si)", "Carbon (C)", "Iron (Fe)", "Gold (Au)"], ans: 1, tag: "🧪 Chemistry", exp: "Carbon (C, #6) is the shape-shifting building block of all living things!" },
    { q: "Why is the chemical symbol for Gold 'Au'?", options: ["It stands for 'Awesome Universe'", "It comes from the Latin word 'Aurum'", "It was an accidental spelling mistake", "It was named after King Austin"], ans: 1, tag: "🧪 Chemistry", exp: "Ancient Romans named it 'Aurum' meaning shining dawn (Au)!" },
    { q: "Which element strengthens bones, teeth, and seashells?", options: ["Sodium (Na)", "Calcium (Ca)", "Potassium (K)", "Magnesium (Mg)"], ans: 1, tag: "🧪 Chemistry", exp: "Calcium (Ca, #20) is essential for strong bones and chalk!" },
    { q: "Which element in bananas keeps muscles from cramping?", options: ["Potassium (K)", "Phosphorus (P)", "Fluorine (F)", "Boron (B)"], ans: 0, tag: "🧪 Chemistry", exp: "Potassium (K, #19 from Latin Kalium) is the King of bananas!" },
    { q: "Table salt (NaCl) is made from Sodium (Na) and which element?", options: ["Chlorine (Cl)", "Carbon (C)", "Calcium (Ca)", "Copper (Cu)"], ans: 0, tag: "🧪 Chemistry", exp: "Sodium (Na) + Chlorine (Cl) = Sodium Chloride (NaCl) table salt!" },
    { q: "Which noble gas glows reddish-orange in illuminated city storefront signs?", options: ["Neon (Ne)", "Nitrogen (N)", "Nickel (Ni)", "Hydrogen (H)"], ans: 0, tag: "🧪 Chemistry", exp: "Neon (Ne, #10) lights up signs with brilliant glow!" },
    { q: "Which element is in beach sand and is sliced into computer microchips?", options: ["Silver (Ag)", "Silicon (Si)", "Sulfur (S)", "Sodium (Na)"], ans: 1, tag: "🧪 Chemistry", exp: "Silicon (Si, #14) is the semiconductor heart of technology!" },
    { q: "Which element is added to toothpaste to protect enamel from cavities?", options: ["Fluorine (F)", "Iron (Fe)", "Aluminum (Al)", "Helium (He)"], ans: 0, tag: "🧪 Chemistry", exp: "Fluorine (F, #9) replaces ions in enamel to resist acids!" }
  ],
  grade5: [
    { q: "Which of the following is a CHEMICAL change (creates a brand new substance)?", options: ["Melting an ice cube", "Baking a chocolate cake", "Tearing paper into strips", "Dissolving sugar into tea"], ans: 1, tag: "🌍 Grade 5", exp: "Baking triggers heat reactions creating new gas pockets and compounds!" },
    { q: "In a forest ecosystem, which organism is a PRODUCER that makes its own food using sunlight?", options: ["Mushroom", "Red Fox", "Oak Tree", "Robin Bird"], ans: 2, tag: "🌍 Grade 5", exp: "Plants like Oak Trees use photosynthesis to produce glucose from light!" },
    { q: "If you dissolve 15g of sugar into 200g of water, how much will the sweet solution weigh?", options: ["185 grams", "200 grams", "215 grams", "250 grams"], ans: 2, tag: "🌍 Grade 5", exp: "Conservation of Mass: 15g + 200g = 215g! Matter cannot be destroyed!" },
    { q: "When water vapor cools high in the sky to form clouds, which step is this?", options: ["Evaporation", "Condensation", "Precipitation", "Transpiration"], ans: 1, tag: "🌍 Grade 5", exp: "Condensation turns water vapor gas into tiny liquid cloud droplets!" },
    { q: "Which Earth sphere includes all rocks, mountains, sand dunes, and tectonic plates?", options: ["Atmosphere", "Hydrosphere", "Geosphere", "Biosphere"], ans: 2, tag: "🌍 Grade 5", exp: "'Geo' means Earth/Rock — Geosphere includes all solid land and crust!" }
  ],
  grade6: [
    { q: "Which cell organelle is the 'Powerhouse of the Cell' that generates cellular energy?", options: ["Nucleus", "Mitochondria", "Cell Wall", "Vacuole"], ans: 1, tag: "🚀 Grade 6 Prep", exp: "Mitochondria convert glucose sugar and oxygen into usable ATP energy!" },
    { q: "What TWO special structures do Plant Cells have that Animal Cells do NOT have?", options: ["Cell Wall & Chloroplasts", "Nucleus & Mitochondria", "Cell Membrane & Cytoplasm", "Bones & Muscles"], ans: 0, tag: "🚀 Grade 6 Prep", exp: "Plants have a rigid Cell Wall (fortress) and Chloroplasts (solar panels)!" },
    { q: "On a roller coaster, where is POTENTIAL ENERGY (stored energy) at its highest?", options: ["At the bottom of the drop", "At the top of the highest hill", "In the middle loop", "When parked at the end"], ans: 1, tag: "🚀 Grade 6 Prep", exp: "The higher you climb against gravity, the more potential energy is stored!" },
    { q: "In a test of which fertilizer makes plants grow tallest, what is the INDEPENDENT VARIABLE?", options: ["Plant height in cm", "Type of fertilizer tested", "Amount of water given", "Type of seed"], ans: 1, tag: "🚀 Grade 6 Prep", exp: "Independent Variable is the ONE thing 'I' change on purpose to test!" },
    { q: "Pushing backward with your foot on a skateboard to move forward is an example of:", options: ["Newton's 1st Law (Inertia)", "Newton's 2nd Law (F = ma)", "Newton's 3rd Law (Action/Reaction)", "Gravity"], ans: 2, tag: "🚀 Grade 6 Prep", exp: "Newton's 3rd Law: For every action, there is an equal and opposite reaction!" }
  ]
};

function startQuiz(mode) {
  state.currentQuizMode = mode;
  state.currentQuestionIndex = 0;
  state.quizScore = 0;
  state.hasAnsweredCurrent = false;

  if (mode === 'marathon') {
    state.currentQuizQuestions = [
      ...QUIZ_QUESTIONS.periodic,
      ...QUIZ_QUESTIONS.grade5,
      ...QUIZ_QUESTIONS.grade6
    ].sort(() => Math.random() - 0.5);
  } else {
    state.currentQuizQuestions = [...QUIZ_QUESTIONS[mode]].sort(() => Math.random() - 0.5);
  }

  document.getElementById('quiz-selection-screen').classList.add('hidden');
  document.getElementById('quiz-result-screen').classList.add('hidden');
  document.getElementById('quiz-play-screen').classList.remove('hidden');

  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  state.hasAnsweredCurrent = false;
  const q = state.currentQuizQuestions[state.currentQuestionIndex];
  const total = state.currentQuizQuestions.length;

  document.getElementById('quiz-step-counter').textContent = `Q ${state.currentQuestionIndex + 1}/${total}`;
  document.getElementById('quiz-progress-fill').style.width = `${((state.currentQuestionIndex) / total) * 100}%`;
  document.getElementById('quiz-category-tag').textContent = q.tag;
  document.getElementById('quiz-question-text').textContent = q.q;

  // Reset feedback & next button
  document.getElementById('quiz-feedback-box').classList.add('hidden');
  document.getElementById('quiz-next-btn').classList.add('hidden');
  document.getElementById('quiz-hint-btn').classList.remove('hidden');

  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';

  q.options.forEach((optText, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span><strong>${['A', 'B', 'C', 'D'][idx]})</strong> ${optText}</span>`;
    btn.onclick = () => selectOption(idx);
    optionsContainer.appendChild(btn);
  });
}

function selectOption(selectedIndex) {
  if (state.hasAnsweredCurrent) return;
  state.hasAnsweredCurrent = true;

  const q = state.currentQuizQuestions[state.currentQuestionIndex];
  const optionButtons = document.querySelectorAll('.option-btn');

  const isCorrect = (selectedIndex === q.ans);

  if (isCorrect) {
    state.quizScore++;
    state.streak++;
    addXP(15);
    playSound('correct');
    optionButtons[selectedIndex].classList.add('correct');

    if (state.streak >= 3 && !state.badges.includes('streak_3')) {
      unlockBadge('streak_3');
    }

    showFeedback(true, "🎉 Awesome Job, Sophia!", q.exp);
  } else {
    state.streak = 0;
    playSound('wrong');
    optionButtons[selectedIndex].classList.add('wrong');
    optionButtons[q.ans].classList.add('correct');

    showFeedback(false, "💡 Good Try! Here's the Science:", q.exp);
  }

  updateStatsDisplay();
  document.getElementById('quiz-hint-btn').classList.add('hidden');
  document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function showFeedback(isCorrect, title, exp) {
  const box = document.getElementById('quiz-feedback-box');
  box.className = `feedback-box ${isCorrect ? '' : 'wrong-feed'}`;
  document.getElementById('feedback-icon').textContent = isCorrect ? '✨' : '🧐';
  document.getElementById('feedback-title').textContent = title;
  document.getElementById('feedback-explanation').textContent = exp;
  box.classList.remove('hidden');
}

function showHint() {
  const q = state.currentQuizQuestions[state.currentQuestionIndex];
  alert(`💡 Hint for Sophia:\nThink about: ${q.exp.split('!')[0]}!`);
}

function nextQuestion() {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex < state.currentQuizQuestions.length) {
    renderCurrentQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  document.getElementById('quiz-play-screen').classList.add('hidden');
  document.getElementById('quiz-result-screen').classList.remove('hidden');

  const total = state.currentQuizQuestions.length;
  const score = state.quizScore;
  const pct = Math.round((score / total) * 100);

  document.getElementById('result-score').textContent = `${score}/${total}`;
  document.getElementById('result-percentage').textContent = `${pct}%`;
  document.getElementById('result-xp-earned').textContent = `${score * 15}`;

  // Achievements check
  if (!state.badges.includes('first_quest')) {
    unlockBadge('first_quest');
  }

  if (state.currentQuizMode === 'periodic' && pct === 100) {
    unlockBadge('chemist_queen');
  } else if (state.currentQuizMode === 'grade5' && pct >= 80) {
    unlockBadge('grade5_champ');
  } else if (state.currentQuizMode === 'grade6' && pct >= 80) {
    unlockBadge('cell_mayor');
    unlockBadge('physics_wizard');
  }

  // Mark Quest as completed
  const modeQuestMap = { periodic: 'q1', grade5: 'q3', grade6: 'q6', marathon: 'q8' };
  const questId = modeQuestMap[state.currentQuizMode];
  if (questId && !state.completedQuests.includes(questId)) {
    state.completedQuests.push(questId);
    renderQuests();
  }

  launchConfetti();
  playSound('fanfare');
}

function restartCurrentQuiz() {
  startQuiz(state.currentQuizMode);
}

function showQuizSelection() {
  document.getElementById('quiz-result-screen').classList.add('hidden');
  document.getElementById('quiz-play-screen').classList.add('hidden');
  document.getElementById('quiz-selection-screen').classList.remove('hidden');
}

function quitQuiz() {
  showQuizSelection();
}

// Secret Decoder Logic
function renderDecoder() {
  const item = DECODER_DATA[state.decoderIndex];
  document.getElementById('decoder-clue-num').textContent = (state.decoderIndex + 1);
  document.getElementById('decoder-prompt').textContent = item.prompt;
  document.getElementById('decoder-hint').textContent = `Hint: ${item.hint} (${item.elements})`;
  document.getElementById('decoder-tracker').textContent = `Word ${state.decoderIndex + 1} of ${DECODER_DATA.length}`;
  document.getElementById('decoder-answer-input').value = '';

  const fb = document.getElementById('decoder-feedback');
  fb.className = 'decoder-feedback hidden';
}

function checkDecoderAnswer() {
  const input = document.getElementById('decoder-answer-input').value.trim().toUpperCase();
  const item = DECODER_DATA[state.decoderIndex];
  const fb = document.getElementById('decoder-feedback');

  if (input === item.answer) {
    fb.className = 'decoder-feedback success';
    fb.textContent = `🔓 BINGO! "${item.answer}" is correct! (${item.elements})`;
    fb.classList.remove('hidden');
    playSound('correct');
    addXP(20);
    launchConfetti();

    if (!state.completedQuests.includes('q2')) {
      state.completedQuests.push('q2');
      renderQuests();
    }

    if (state.decoderIndex === DECODER_DATA.length - 1 && !state.badges.includes('code_breaker')) {
      unlockBadge('code_breaker');
    }
  } else {
    fb.className = 'decoder-feedback error';
    fb.textContent = `❌ Not quite! Check the element symbols: ${item.elements}`;
    fb.classList.remove('hidden');
    playSound('wrong');
  }
}

function nextDecoder() {
  state.decoderIndex = (state.decoderIndex + 1) % DECODER_DATA.length;
  renderDecoder();
}

function prevDecoder() {
  state.decoderIndex = (state.decoderIndex - 1 + DECODER_DATA.length) % DECODER_DATA.length;
  renderDecoder();
}

// Trophy Room Logic
function renderTrophies() {
  const grid = document.getElementById('trophy-grid');
  grid.innerHTML = '';

  BADGES.forEach(b => {
    const isUnlocked = state.badges.includes(b.id);
    const card = document.createElement('div');
    card.className = `trophy-card ${isUnlocked ? 'unlocked' : ''}`;
    card.innerHTML = `
      <div class="trophy-icon">${b.icon}</div>
      <h4>${b.title}</h4>
      <p>${b.desc}</p>
      <small style="display:block; margin-top:8px; font-weight:800; color:${isUnlocked ? '#059669' : '#94a3b8'};">
        ${isUnlocked ? '✨ UNLOCKED' : '🔒 LOCKED'}
      </small>
    `;
    grid.appendChild(card);
  });
}

// Start App
window.addEventListener('DOMContentLoaded', initUI);
