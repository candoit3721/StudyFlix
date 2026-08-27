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
  { id: "q0", icon: "🔬", title: "Visual Science Super-Lab", desc: "Build spinning Bohr atoms, trigger reaction flasks, explore cell cities, and run roller coasters!", targetTab: "tab-lab" },
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

  // Initialize Lab Simulators
  loadLabAtom(1);
  triggerLabReaction('baking_soda');
  switchCellType('plant');

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

  // Render Live Animated Bohr Atom in Modal
  renderBohrAtomSVG('modal-atom-svg-wrap', el.num, 160);
  const data = BOHR_DATA[el.num] || BOHR_DATA[1];
  const configText = data.shells.map((c, i) => `${['K','L','M','N'][i]}=${c}`).join(', ');
  document.getElementById('modal-electron-config').textContent = `Electrons (${el.num}): ${configText}`;

  const card = document.getElementById('element-detail-card');
  card.classList.remove('hidden');
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeElementModal() {
  document.getElementById('element-detail-card').classList.add('hidden');
}

// =============================================================================
// VISUAL SUPER-LAB ENGINE & SIMULATORS
// =============================================================================

// Bohr Rutherford Atomic Models Dictionary
const BOHR_DATA = {
  1: { sym: "H", name: "Hydrogen", sub: "The Rocket Launcher", p: 1, n: 0, shells: [1], val: 1, valDesc: "1 outer electron. Super eager to bond!", power: "Rocket fuel & solar fusion powerhouse." },
  2: { sym: "He", name: "Helium", sub: "The High-Pitch Floater", p: 2, n: 2, shells: [2], val: 2, valDesc: "Full K-shell (2/2). Super stable Noble Gas!", power: "Lighter than air; party balloons and cooling MRI magnets." },
  3: { sym: "Li", name: "Lithium", sub: "The Battery Boss", p: 3, n: 4, shells: [2, 1], val: 1, valDesc: "1 valence electron. Super reactive alkali metal!", power: "Lightest solid metal; stores power in Tesla & iPad batteries." },
  4: { sym: "Be", name: "Beryllium", sub: "The Space Shield", p: 4, n: 5, shells: [2, 2], val: 2, valDesc: "2 valence electrons in L-shell.", power: "Lightweight space-telescope mirrors & emerald crystals." },
  5: { sym: "B", name: "Boron", sub: "The Heatproof Glassmaker", p: 5, n: 6, shells: [2, 3], val: 3, valDesc: "3 valence electrons in L-shell.", power: "Pyrex heatproof kitchen glass & silly putty." },
  6: { sym: "C", name: "Carbon", sub: "The Shape-Shifting King", p: 6, n: 6, shells: [2, 4], val: 4, valDesc: "4 valence electrons. The #1 Lego brick of all organic life!", power: "Forms diamonds, pencil graphite, and every cell in human bodies." },
  7: { sym: "N", name: "Nitrogen", sub: "The Silent Giant", p: 7, n: 7, shells: [2, 5], val: 5, valDesc: "5 valence electrons (needs 3 to fill octet).", power: "Makes up 78% of Earth's atmosphere & keeps chip bags crispy." },
  8: { sym: "O", name: "Oxygen", sub: "The Life Giver", p: 8, n: 8, shells: [2, 6], val: 6, valDesc: "6 valence electrons (needs 2 to fill octet).", power: "We breathe it to produce ATP energy; pairs with H for water (H2O)." },
  9: { sym: "F", name: "Fluorine", sub: "The Cavity Crusher", p: 9, n: 10, shells: [2, 7], val: 7, valDesc: "7 valence electrons. Super reactive halogen!", power: "Strengthens tooth enamel against cavities & Teflon coatings." },
  10: { sym: "Ne", name: "Neon", sub: "The Night Glow", p: 10, n: 10, shells: [2, 8], val: 8, valDesc: "Full outer shell (8/8 Octet). Totally unreactive Noble Gas!", power: "Glows brilliant red-orange with electricity in signs." },
  11: { sym: "Na", name: "Sodium", sub: "The Fiery Salt Partner", p: 11, n: 12, shells: [2, 8, 1], val: 1, valDesc: "1 valence electron. Eager to give 1 electron to Chlorine!", power: "Soft metal that pops in water, but makes delicious table salt (NaCl)!" },
  12: { sym: "Mg", name: "Magnesium", sub: "The Flashbang Sparkler", p: 12, n: 12, shells: [2, 8, 2], val: 2, valDesc: "2 valence electrons.", power: "Burns with blinding white light; central to plant photosynthesis." },
  13: { sym: "Al", name: "Aluminum", sub: "The Lightweight Armor", p: 13, n: 14, shells: [2, 8, 3], val: 3, valDesc: "3 valence electrons.", power: "Doesn't rust, ultra-light, 100% recyclable for soda cans & planes." },
  14: { sym: "Si", name: "Silicon", sub: "The Computer Brain", p: 14, n: 14, shells: [2, 8, 4], val: 4, valDesc: "4 valence electrons. Semiconductor master!", power: "Found in beach sand; powers all computer processors & solar cells." },
  15: { sym: "P", name: "Phosphorus", sub: "The Matchbox Igniter", p: 15, n: 16, shells: [2, 8, 5], val: 5, valDesc: "5 valence electrons.", power: "Friction igniter on matchsticks; builds DNA backbone & bones." },
  16: { sym: "S", name: "Sulfur", sub: "The Stinky Yellow Mineral", p: 16, n: 16, shells: [2, 8, 6], val: 6, valDesc: "6 valence electrons.", power: "Yellow volcanic crystal; creates onion tears and hot spring scents." },
  17: { sym: "Cl", name: "Chlorine", sub: "The Pool Cleaner", p: 17, n: 18, shells: [2, 8, 7], val: 7, valDesc: "7 valence electrons. Wants 1 electron from Sodium!", power: "Purifies swimming pools & pairs with Sodium to make NaCl table salt." },
  18: { sym: "Ar", name: "Argon", sub: "The Bulb Protector", p: 18, n: 22, shells: [2, 8, 8], val: 8, valDesc: "Full octet (8/8). Noble Gas shield!", power: "Protects incandescent light bulb filaments from burning up." },
  19: { sym: "K", name: "Potassium", sub: "The Banana King", p: 19, n: 20, shells: [2, 8, 8, 1], val: 1, valDesc: "1 valence electron in N-shell.", power: "Stops muscle cramps in bananas and powers heartbeat rhythms." },
  20: { sym: "Ca", name: "Calcium", sub: "The Bone Fortress", p: 20, n: 20, shells: [2, 8, 8, 2], val: 2, valDesc: "2 valence electrons in N-shell.", power: "Builds rock-hard bones, teeth, seashell armor, and limestone caves." }
};

let currentLabAtomNum = 1;

function switchLabStation(stationKey) {
  document.querySelectorAll('.lab-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.lab-station-card').forEach(card => card.classList.add('hidden'));

  const btn = document.querySelector(`.lab-tab-btn[onclick*="${stationKey}"]`);
  const card = document.getElementById(`station-${stationKey}`);
  if (btn) btn.classList.add('active');
  if (card) {
    card.classList.remove('hidden');
    card.classList.add('active');
  }

  if (stationKey === 'atom') {
    loadLabAtom(currentLabAtomNum);
  } else if (stationKey === 'reactions') {
    triggerLabReaction(currentReactionKey);
  }
}

function openLabFromLesson(stationKey, param) {
  switchTab('tab-lab');
  switchLabStation(stationKey);
  if (stationKey === 'atom' && typeof param === 'number') {
    loadLabAtom(param);
  } else if (stationKey === 'reactions' && typeof param === 'string') {
    triggerLabReaction(param);
  } else if (stationKey === 'cell' && typeof param === 'string') {
    switchCellType(param);
  } else if (stationKey === 'physics' && typeof param === 'string') {
    jumpCoasterPosition(param);
  }
}

function renderBohrAtomSVG(targetContainerOrId, atomicNum, size = 380) {
  const container = typeof targetContainerOrId === 'string' ? document.getElementById(targetContainerOrId) : targetContainerOrId;
  if (!container) return;

  const data = BOHR_DATA[atomicNum] || BOHR_DATA[1];
  const center = size / 2;
  const maxShells = data.shells.length;
  const shellRadii = [45, 80, 115, 150].slice(0, maxShells).map(r => r * (size / 380));

  let svgHtml = `
    <defs>
      <radialGradient id="nucGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f87171" />
        <stop offset="70%" stop-color="#dc2626" />
        <stop offset="100%" stop-color="#991b1b" />
      </radialGradient>
      <filter id="atomGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  `;

  // 1. Draw Orbit Shell Circles
  shellRadii.forEach((radius, i) => {
    svgHtml += `
      <circle cx="${center}" cy="${center}" r="${radius}" 
              fill="none" stroke="rgba(56, 189, 248, 0.4)" stroke-width="1.5" stroke-dasharray="4, 4" />
      <text x="${center + radius - 4}" y="${center - 6}" fill="rgba(56, 189, 248, 0.6)" font-size="9" font-weight="700">
        ${['K','L','M','N'][i]}
      </text>
    `;
  });

  // 2. Draw Center Nucleus Cluster
  const nucleusRadius = 24 * (size / 380);
  svgHtml += `
    <circle cx="${center}" cy="${center}" r="${nucleusRadius}" fill="url(#nucGrad)" filter="url(#atomGlow)" />
    <text x="${center}" y="${center - 3}" fill="#ffffff" font-size="${11 * (size / 380)}" font-weight="800" text-anchor="middle">
      ${data.p}p⁺
    </text>
    <text x="${center}" y="${center + 10}" fill="#fecaca" font-size="${9 * (size / 380)}" font-weight="700" text-anchor="middle">
      ${data.n}n⁰
    </text>
  `;

  // 3. Draw Revolving Electrons along each Shell
  data.shells.forEach((count, sIndex) => {
    const radius = shellRadii[sIndex];
    const duration = 8 + sIndex * 4; // Inner shells rotate faster

    for (let e = 0; e < count; e++) {
      const angle = (360 / count) * e;
      svgHtml += `
        <g transform="rotate(${angle} ${center} ${center})">
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 ${center} ${center}" to="360 ${center} ${center}" dur="${duration}s" repeatCount="indefinite" />
            <circle cx="${center + radius}" cy="${center}" r="${6 * (size / 380)}" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" filter="url(#atomGlow)" />
            <text x="${center + radius}" y="${center + 3 * (size / 380)}" fill="#082f49" font-size="${7 * (size / 380)}" font-weight="900" text-anchor="middle">e⁻</text>
          </g>
        </g>
      `;
    }
  });

  if (container.tagName === 'svg' || container.id === 'bohr-atom-svg') {
    container.innerHTML = svgHtml;
  } else {
    container.innerHTML = `<svg viewBox="0 0 ${size} ${size}" style="width:100%; height:auto; max-width:${size}px;">${svgHtml}</svg>`;
  }
}

function loadLabAtom(num) {
  currentLabAtomNum = num;
  const data = BOHR_DATA[num] || BOHR_DATA[1];

  // Highlight button chip
  document.querySelectorAll('.atom-chip').forEach(c => c.classList.remove('active'));
  const activeBtn = document.querySelector(`.atom-chip[onclick*="loadLabAtom(${num})"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Render SVG Canvas
  renderBohrAtomSVG('bohr-atom-svg', num, 400);

  // Update Data Panel
  document.getElementById('lab-atom-symbol').textContent = data.sym;
  document.getElementById('lab-atom-name').textContent = `${data.name} (#${num})`;
  document.getElementById('lab-atom-subtitle').textContent = data.sub;
  document.getElementById('lab-atom-protons').textContent = data.p;
  document.getElementById('lab-atom-neutrons').textContent = data.n;
  document.getElementById('lab-atom-electrons').textContent = num;
  document.getElementById('lab-atom-mass').textContent = data.p + data.n;

  // Shell breakdown
  const shellNames = ['K', 'L', 'M', 'N'];
  const maxCaps = [2, 8, 8, 2];
  const shellsWrap = document.getElementById('lab-atom-shells-display');
  shellsWrap.innerHTML = '';
  data.shells.forEach((count, i) => {
    const pill = document.createElement('span');
    pill.className = 'shell-pill';
    pill.textContent = `${shellNames[i]}-Shell: ${count} / ${maxCaps[i]}`;
    shellsWrap.appendChild(pill);
  });

  document.getElementById('lab-atom-valence-text').innerHTML = `💡 <strong>Valence Electrons:</strong> ${data.val} in outer shell. ${data.valDesc}`;
  document.getElementById('lab-atom-superpower-desc').textContent = data.power;

  playSound('pop');
}

// 2. Kitchen Chemistry Reaction Simulator Logic
const LAB_REACTIONS = {
  baking_soda: {
    type: "chemical",
    typeLabel: "🔥 Chemical Change",
    formula: "NaHCO₃ + CH₃COOH → CO₂↑ + H₂O + NaCH₃COO",
    title: "Baking Soda + Vinegar Reaction",
    desc: "When solid sodium bicarbonate mixes with acidic acetic acid, chemical bonds rearrange instantly to produce water, sodium acetate, and fizzy Carbon Dioxide gas (CO₂)!",
    color: "linear-gradient(180deg, #ec4899 0%, #db2777 100%)",
    balloon: true,
    scale: "⚖️ 110.0 g",
    evidence: [
      "🫧 Gas Production: Rapid foaming CO₂ bubbles expand and inflate the balloon!",
      "🌡️ Temperature Drop: Endothermic reaction absorbs heat (feels noticeably cold to touch!).",
      "⚖️ Law of Conservation of Mass: Scale reads 110.0g before and exactly 110.0g after!"
    ],
    tip: "Put 2 spoonfuls of baking soda inside a balloon, fit it over a bottle of vinegar, and lift it to watch it inflate hands-free!"
  },
  ice_melt: {
    type: "physical",
    typeLabel: "🧊 Physical Change",
    formula: "H₂O (solid ice) ➔ H₂O (liquid) ➔ H₂O (steam gas)",
    title: "Ice Melting & Boiling (3 States of Water)",
    desc: "Heating ice cubes speeds up the H₂O molecules, breaking the rigid crystal lattice into liquid water and then steam. NO new substance is formed — every molecule remains pure H₂O!",
    color: "linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)",
    balloon: false,
    scale: "⚖️ 50.0 g",
    evidence: [
      "🧊 State Change Only: Solid ice → Liquid water → Gas vapor.",
      "🔄 100% Reversible: Cool the steam down or freeze the water to get ice cubes back!",
      "🧪 Same Substance: Chemical identity remains H₂O throughout all 3 states."
    ],
    tip: "Water expands when it freezes into ice, which is why ice cubes float in your drink and icebergs float in oceans!"
  },
  cabbage_ph: {
    type: "chemical",
    typeLabel: "🔥 Chemical Change (pH Indicator)",
    formula: "Anthocyanin (Purple) + Acid (H⁺) ➔ Bright Red / Pink",
    title: "Magic Red Cabbage pH Indicator",
    desc: "Boiled red cabbage juice contains 'Anthocyanin' dye molecules that shift color like a chameleon depending on whether a solution is an Acid or a Base!",
    color: "linear-gradient(180deg, #a855f7 0%, #ec4899 100%)",
    balloon: false,
    scale: "⚖️ 125.0 g",
    evidence: [
      "🎨 Dramatic Color Shift: Purple liquid turns vivid magenta-pink with lemon juice (Acid, pH 2)!",
      "🌿 Base Reaction: Turns emerald blue-green when mixed with baking soda (Base, pH 9).",
      "🧪 Chemical Rearrangement: Hydrogen ions (H⁺) alter the pigment's light absorption."
    ],
    tip: "Boil chopped purple cabbage leaves in water for 10 minutes to make your own secret home pH detector!"
  },
  mentos: {
    type: "physical",
    typeLabel: "⚡ Physical Nucleation Blast",
    formula: "Diet Coke (CO₂ dissolved) + Mentos (Pitted surface) ➔ Foam Geyser",
    title: "Diet Coke + Mentos Geyser Blast",
    desc: "Each Mentos candy has millions of microscopic pits (nucleation sites). Dropping it into soda causes dissolved CO₂ gas to rapidly escape in an explosive 2.5-meter foam fountain!",
    color: "linear-gradient(180deg, #78350f 0%, #451a03 100%)",
    balloon: true,
    scale: "⚖️ 250.0 g",
    evidence: [
      "💥 Rapid Nucleation: Physical surface roughness triggers instant gas bubble formation.",
      "🚀 Height Meter: Foam erupts up to 2.5 meters high!",
      "💡 Note: This is a Physical release of trapped gas, not a new chemical bond creation."
    ],
    tip: "Always do the Mentos geyser experiment outside on the grass to avoid sweet soda spray on ceilings!"
  },
  rust: {
    type: "chemical",
    typeLabel: "🔥 Chemical Change (Oxidation)",
    formula: "4Fe + 3O₂ + 6H₂O ➔ 2Fe₂O₃·3H₂O (Rust)",
    title: "Rusting Iron Nail in Moisture",
    desc: "Shiny iron metal slowly reacts with oxygen gas dissolved in water to form iron oxide (rust) — a crumbly, flaky, reddish-brown new chemical substance!",
    color: "linear-gradient(180deg, #ea580c 0%, #9a3412 100%)",
    balloon: false,
    scale: "⚖️ 28.5 g (+0.5g O₂ absorbed)",
    evidence: [
      "🎨 Permanent Color Change: Shiny gray metal turns flaky reddish-orange.",
      "🦀 New Substance: Rust is brittle, non-magnetic, and cannot conduct electricity like iron.",
      "⚖️ Mass Increase: Nail gains weight because it bonds with oxygen atoms from the air!"
    ],
    tip: "Painting bicycles and coating cars in zinc prevents oxygen and water from touching the iron underneath!"
  }
};

let currentReactionKey = 'baking_soda';

function triggerLabReaction(rxKey) {
  currentReactionKey = rxKey;
  const rx = LAB_REACTIONS[rxKey] || LAB_REACTIONS.baking_soda;

  // Highlight Button
  document.querySelectorAll('.reaction-tab-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.reaction-tab-btn[onclick*="${rxKey}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update Visual Flask
  const liquid = document.getElementById('flask-liquid');
  const balloon = document.getElementById('reaction-balloon');
  const scale = document.getElementById('scale-screen');

  if (liquid) liquid.style.background = rx.color;
  if (scale) scale.textContent = rx.scale;

  if (balloon) {
    if (rx.balloon) {
      balloon.classList.add('inflated');
    } else {
      balloon.classList.remove('inflated');
    }
  }

  // Update Panel Text
  const typeBadge = document.getElementById('rx-type-badge');
  typeBadge.className = `rx-type-badge ${rx.type}`;
  typeBadge.textContent = rx.typeLabel;

  document.getElementById('rx-formula').textContent = rx.formula;
  document.getElementById('rx-title').textContent = rx.title;
  document.getElementById('rx-desc').textContent = rx.desc;

  const evList = document.getElementById('rx-evidence-list');
  evList.innerHTML = '';
  rx.evidence.forEach(e => {
    const li = document.createElement('li');
    li.innerHTML = e;
    evList.appendChild(li);
  });

  document.getElementById('rx-tip-box').innerHTML = `💡 <strong>Try This at Home:</strong> ${rx.tip}`;

  playSound(rx.type === 'chemical' ? 'magic' : 'pop');
}

function replayCurrentReaction() {
  const liquid = document.getElementById('flask-liquid');
  const balloon = document.getElementById('reaction-balloon');
  
  if (liquid) {
    liquid.style.height = '10%';
    setTimeout(() => { liquid.style.height = '55%'; }, 150);
  }
  if (balloon) {
    balloon.classList.remove('inflated');
    setTimeout(() => { triggerLabReaction(currentReactionKey); }, 250);
  } else {
    triggerLabReaction(currentReactionKey);
  }
}

// 3. Cell City Organelle Visualizer Logic
const ORGANELLES_DATA = {
  nucleus: {
    name: "Nucleus",
    icon: "🏛️",
    role: "City Job: City Hall & DNA Blueprint Vault",
    desc: "The control headquarters of the cell! Holds the master DNA instruction manual for building proteins and directing cellular life.",
    city: "Mayor's Office & City Archives",
    presence: "Found in Both Plant & Animal Cells"
  },
  mitochondria: {
    name: "Mitochondria",
    icon: "⚡",
    role: "City Job: The Power Plant (ATP Energy Factory)",
    desc: "Uses oxygen and glucose food to generate high-energy ATP fuel packs through cellular respiration. Muscle cells have thousands of them!",
    city: "Electric Power Generation Station",
    presence: "Found in Both Plant & Animal Cells"
  },
  chloroplast: {
    name: "Chloroplasts 🌿",
    icon: "☀️",
    role: "City Job: Solar Power Food Farm (Plant Superpower!)",
    desc: "Packed with green chlorophyll pigment. Captures sunlight to convert CO₂ and water into glucose sugar food via Photosynthesis!",
    city: "Solar Hydroponic Greenhouse Farm",
    presence: "PLANT CELLS ONLY! (Animals eat food instead)"
  },
  vacuole: {
    name: "Central Vacuole",
    icon: "💧",
    role: "City Job: High-Capacity Water Tower & Waste Storage",
    desc: "Massive water reservoir in plant cells. When full of water, it pushes outward against the cell wall (turgor pressure) to keep flowers standing tall!",
    city: "Municipal Water Reservoir & Storage Silos",
    presence: "Huge in Plants (90% volume), Tiny in Animals"
  },
  ribosome: {
    name: "Ribosomes & ER",
    icon: "🏭",
    role: "City Job: 3D Protein Manufacturing Factories",
    desc: "Reads RNA codes from the Nucleus and snaps amino acid building blocks together to manufacture enzymes, muscle fibers, and antibodies!",
    city: "Automated Industrial Assembly Lines",
    presence: "Found in Both Plant & Animal Cells"
  }
};

function switchCellType(type) {
  document.querySelectorAll('.cell-toggle-group .toggle-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`btn-cell-${type}`);
  if (btn) btn.classList.add('active');

  const wall = document.getElementById('svg-cell-wall');
  const chloroplast = document.getElementById('node-chloroplast');
  const notice = document.getElementById('plant-badge-notice');

  if (type === 'plant') {
    if (wall) wall.setAttribute('opacity', '0.9');
    if (chloroplast) chloroplast.style.display = 'block';
    if (notice) notice.textContent = '🌿 Plant Superpowers Active: Cell Wall + Chloroplasts';
    inspectOrganelle('chloroplast');
  } else {
    if (wall) wall.setAttribute('opacity', '0.05');
    if (chloroplast) chloroplast.style.display = 'none';
    if (notice) notice.textContent = '🐾 Animal Cell: Flexible Membrane & Small Vacuoles';
    inspectOrganelle('nucleus');
  }
}

function inspectOrganelle(key) {
  const organelle = ORGANELLES_DATA[key] || ORGANELLES_DATA.nucleus;

  // Highlight SVG Node
  document.querySelectorAll('.cell-organelle-node').forEach(n => n.classList.remove('active'));
  const node = document.getElementById(`node-${key}`);
  if (node) node.classList.add('active');

  // Update Dossier
  document.getElementById('dossier-icon').textContent = organelle.icon;
  document.getElementById('dossier-name').textContent = organelle.name;
  document.getElementById('dossier-role').textContent = organelle.role;
  document.getElementById('dossier-desc').textContent = organelle.desc;
  document.getElementById('dossier-city').textContent = organelle.city;
  document.getElementById('dossier-presence').textContent = organelle.presence;

  playSound('click');
}

// 4. Roller Coaster Physics Simulator Logic
let coasterAnimating = false;
let coasterProgress = 0.2; // 0 to 1 along track
let coasterInterval = null;

function toggleCoasterAnimation() {
  coasterAnimating = !coasterAnimating;
  const btn = document.getElementById('btn-coaster-play');

  if (coasterAnimating) {
    btn.textContent = '⏸️ Pause Coaster';
    btn.className = 'btn btn-secondary';
    coasterInterval = setInterval(runCoasterStep, 40);
  } else {
    btn.textContent = '▶️ Start Coaster Run';
    btn.className = 'btn btn-primary';
    clearInterval(coasterInterval);
  }
}

function runCoasterStep() {
  coasterProgress += 0.008;
  if (coasterProgress > 0.95) coasterProgress = 0.05;

  const path = document.getElementById('coaster-track-path');
  if (!path) return;

  const pathLength = path.getTotalLength();
  const point = path.getPointAtLength(coasterProgress * pathLength);

  // Position Cart
  const cart = document.getElementById('coaster-cart');
  if (cart) {
    cart.setAttribute('transform', `translate(${point.x}, ${point.y})`);
  }

  // Calculate PE and KE based on Y coordinate (Y: 60 = Top hill, Y: 250 = Bottom valley)
  const normalizedHeight = (250 - point.y) / 190; // 1.0 at peak, 0.0 at bottom
  const pePercent = Math.max(2, Math.min(98, Math.round(normalizedHeight * 100)));
  const kePercent = 100 - pePercent;

  document.getElementById('meter-pe-val').textContent = `${pePercent}%`;
  document.getElementById('meter-pe-fill').style.width = `${pePercent}%`;

  document.getElementById('meter-ke-val').textContent = `${kePercent}%`;
  document.getElementById('meter-ke-fill').style.width = `${kePercent}%`;
}

function jumpCoasterPosition(pos) {
  if (coasterAnimating) toggleCoasterAnimation();

  const path = document.getElementById('coaster-track-path');
  if (!path) return;

  coasterProgress = pos === 'top' ? 0.23 : 0.49;
  const pathLength = path.getTotalLength();
  const point = path.getPointAtLength(coasterProgress * pathLength);

  const cart = document.getElementById('coaster-cart');
  if (cart) {
    cart.setAttribute('transform', `translate(${point.x}, ${point.y})`);
  }

  const pe = pos === 'top' ? 95 : 5;
  const ke = 100 - pe;

  document.getElementById('meter-pe-val').textContent = `${pe}%`;
  document.getElementById('meter-pe-fill').style.width = `${pe}%`;

  document.getElementById('meter-ke-val').textContent = `${ke}%`;
  document.getElementById('meter-ke-fill').style.width = `${ke}%`;

  playSound('chime');
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
