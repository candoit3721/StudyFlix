/**
 * Sophia's Ancient Rome Quest & Engineering Studio
 * Interactive Logic, Quiz Engine, Caesar Cipher, and Roman STEM Lab
 */

// Global State
const state = {
  // Roman XP is this studio's subtotal of the shared, profile-wide record.
  xp: 0,
  // This is a CORRECT-ANSWER run, not the hub's day streak. Two different
  // things were previously both labelled "Streak" in the same kind of pill.
  answerRun: 0,
  soundEnabled: true,
  badges: JSON.parse(localStorage.getItem('sophia_rome_badges') || '[]'),
  completedQuests: JSON.parse(localStorage.getItem('sophia_rome_completed_quests') || '[]'),
  currentQuizMode: 'republic',
  currentQuizQuestions: [],
  currentQuestionIndex: 0,
  quizScore: 0,
  hasAnsweredCurrent: false,
  cipherIndex: 0,
  currentShift: 3,
  keystoneInserted: true
};

// Quests Database
const QUESTS = [
  { id: "q1", glyph: "temple", title: "The Roman Republic & Senate", desc: "Patricians vs. Plebeians, Twelve Tables, and the Rule of Law.", targetTab: "tab-learn", quizMode: "republic" },
  { id: "q2", glyph: "ruler", title: "Mastering the Roman Arch", desc: "Discover keystone compression forces and build stable bridges.", targetTab: "tab-engineering", quizMode: "engineering" },
  { id: "q3", glyph: "globe", title: "Aqueducts & Hydraulic STEM", desc: "Calculate gravity flow slopes to transport water across valleys.", targetTab: "tab-engineering", quizMode: "engineering" },
  { id: "q4", glyph: "person", title: "Julius Caesar & The Imperial Era", desc: "Cross the Rubicon, the Ides of March, and Caesar Augustus's Pax Romana.", targetTab: "tab-learn", quizMode: "republic" },
  { id: "q5", glyph: "cipher", title: "Caesar's Secret Military Cipher", desc: "Decode top-secret battlefield messages sent from Gaul.", targetTab: "tab-cipher" },
  { id: "q6", glyph: "flask", title: "Daily Life, Gladiators & Pompeii", desc: "Explore Thermae baths, hypocaust heating, and Mount Vesuvius (79 CE).", targetTab: "tab-learn", quizMode: "daily_life" }
];

// Caesar Military Dispatches Database
const DISPATCH_DATA = [
  {
    num: 1,
    ciphertext: "YHQL YLGL YLFL",
    plaintext: "VENI VIDI VICI",
    sender: "Julius Caesar (47 BCE)",
    hint: "Caesar's famous victory declaration: 'I came, I saw, I conquered!'",
    shift: 3
  },
  {
    num: 2,
    ciphertext: "DOHD MDFWD HVW",
    plaintext: "ALEA IACTA EST",
    sender: "Julius Caesar (Crossing the Rubicon, 49 BCE)",
    hint: "'The die is cast' — crossing the Rubicon into Italy!",
    shift: 3
  },
  {
    num: 3,
    ciphertext: "FDHVDU DXJXVWXV",
    plaintext: "CAESAR AUGUSTUS",
    sender: "Imperial Decree (27 BCE)",
    hint: "Rome's very first emperor and architect of the Pax Romana!",
    shift: 3
  },
  {
    num: 4,
    ciphertext: "SDJ URPDQD",
    plaintext: "PAX ROMANA",
    sender: "Senate Proclamation",
    hint: "The 200-year golden era of Roman peace and prosperity!",
    shift: 3
  },
  {
    num: 5,
    ciphertext: "DTXHGXFWV",
    plaintext: "AQUEDUCTS",
    sender: "Chief Engineer Frontinus",
    hint: "Massive stone bridge channels bringing mountain spring water to Rome!",
    shift: 3
  },
  {
    num: 6,
    ciphertext: "WHVWXGR",
    plaintext: "TESTUDO",
    sender: "Legionary Centurion",
    hint: "The impenetrable 'tortoise' battle formation with shields locked above!",
    shift: 3
  }
];

// Badges Database
const BADGES = [
  { id: "recruit", glyph: "person", title: "Legionary Recruit", desc: "Began your very first Roman quest!" },
  { id: "streak_3", glyph: "flame", title: "Centurion Streak", desc: "Answered 3 questions correctly in a row!" },
  { id: "republic_senator", glyph: "lesson", title: "Senate Orator", desc: "Scored 100% on the Roman Republic & Law Quiz!" },
  { id: "keystone_architect", glyph: "temple", title: "Master Architect", desc: "Mastered arch compression and aqueduct gravity flow!" },
  { id: "caesar_decoder", glyph: "cipher", title: "Imperial Codebreaker", desc: "Decrypted Caesar's secret military dispatches!" },
  { id: "pompeii_historian", glyph: "globe", title: "Pompeii Archaeologist", desc: "Mastered Roman daily life, thermae baths, and Vesuvius!" },
  { id: "math_imperator", glyph: "ruler", title: "Roman Numeral Champion", desc: "Converted ancient numerals and modern dates!" },
  { id: "triumph_maximus", glyph: "trophy", title: "Triumph Imperator", desc: "Accumulated over 300 total Roman XP!" }
];

// Comprehensive Quiz Question Bank
const QUIZ_QUESTIONS = {
  republic: [
    {
      q: "According to ancient legend, who were the twin brothers that founded the city of Rome in 753 BCE?",
      options: ["Romulus and Remus", "Julius and Augustus", "Achilles and Hector", "Pericles and Alexander"],
      ans: 0,
      hint: "They were rescued by a she-wolf (Lupa) on the banks of the Tiber River.",
      exp: "Legend says Romulus and Remus founded Rome in 753 BCE. Romulus became the first king and gave the city its name."
    },
    {
      q: "What geographic feature made Rome's location advantageous for defense and health?",
      options: ["Dense underground caves", "Seven defensible hills along the Tiber River", "Surrounded entirely by deep ocean cliffs", "Located in the Sahara desert"],
      ans: 1,
      hint: "Hills kept settlers above seasonal river floods and swamp mosquitoes.",
      exp: "Rome's Seven Hills (Palatine, Capitoline, Aventine, etc.) provided high-ground defense from enemy raids and safety from river floods."
    },
    {
      q: "In 509 BCE, Rome overthrew its kings to create a Republic (Res Publica). What does 'Republic' literally mean in Latin?",
      options: ["Rule of Kings", "Public Affair / Matter of the People", "Army Command", "Rich Man's Palace"],
      ans: 1,
      hint: "'Res' means affair/matter, and 'Publica' means public.",
      exp: "Res Publica translates to 'Public Affair' — a government where citizens elect representatives rather than being ruled by a monarch."
    },
    {
      q: "In the Roman Republic, who were the common citizens (farmers, craftspeople, soldiers)?",
      options: ["Patricians", "Plebeians", "Emperors", "Consuls"],
      ans: 1,
      hint: "Think of the word 'plebeian' used today for everyday common citizens.",
      exp: "Plebeians were the working-class citizens who made up the majority of Rome and fought for equal legal rights against wealthy Patricians."
    },
    {
      q: "What was the significance of the Twelve Tables (450 BCE) carved into bronze and posted in the Forum?",
      options: ["They listed secret cooking recipes", "They established written laws that applied equally to all citizens (Rule of Law)", "They were maps of the Roman road system", "They were tickets to the chariot races"],
      ans: 1,
      hint: "Written laws prevented judges from making up arbitrary rules.",
      exp: "The Twelve Tables established the Rule of Law — ensuring laws were written down and publicly visible so all citizens had equal protection."
    },
    {
      q: "Which elected officials had the power to shout 'VETO!' ('I forbid!') to protect common citizens from unfair Senate laws?",
      options: ["Gladiators", "Tribunes of the Plebs", "Archbishops", "Chariot Drivers"],
      ans: 1,
      hint: "The Latin word 'veto' means 'I forbid'.",
      exp: "Tribunes of the Plebs were elected to defend common citizens and had sacred veto power to block unfair patrician decrees."
    },
    {
      q: "In 49 BCE, Julius Caesar marched his army across which river, uttering 'Alea iacta est' (The die is cast)?",
      options: ["The Thames", "The Rubicon", "The Nile", "The Amazon"],
      ans: 1,
      hint: "Crossing this small northern Italian river was an act of treason that began a civil war.",
      exp: "Crossing the Rubicon River with an active army broke Roman law and signaled there was no turning back in Caesar's bid for power."
    },
    {
      q: "On what famous date was Julius Caesar assassinated in the Senate?",
      options: ["July 4th", "The Ides of March (March 15, 44 BCE)", "December 25th", "January 1st"],
      ans: 1,
      hint: "The Roman middle of the month is called the 'Ides'.",
      exp: "Julius Caesar was assassinated on the Ides of March (March 15, 44 BCE) by senators who feared he was restoring a monarchy."
    },
    {
      q: "Who became Rome's very first Emperor and ushered in the 200-year Pax Romana?",
      options: ["Nero", "Caesar Augustus (Octavian)", "Alexander the Great", "Marcus Aurelius"],
      ans: 1,
      hint: "He was Julius Caesar's adopted heir; the month of August is named in his honor.",
      exp: "Caesar Augustus (Octavian) became the first Roman Emperor in 27 BCE and initiated the Pax Romana (Roman Peace)."
    },
    {
      q: "How does the Roman legal system influence modern Canada's justice system today?",
      options: ["Canadian courts still use Latin robes only", "The principle of 'innocent until proven guilty' and written equality before the law", "Canada is ruled by a Roman Senate", "Every Canadian citizen must fight in a gladiator arena"],
      ans: 1,
      hint: "Think about fundamental legal human rights in the Canadian Charter.",
      exp: "The Roman legal concepts of written statutes, civil law, representation, and 'innocent until proven guilty' form the bedrock of Canadian jurisprudence."
    }
  ],

  engineering: [
    {
      q: "Why was the Roman semi-circular arch superior to Greek post-and-lintel flat stone beams?",
      options: ["It used less paint", "It distributed downward weight sideways into compression against ground abutments", "It was easier to cut with scissors", "It allowed buildings to float on water"],
      ans: 1,
      hint: "Stone is extremely strong under compression (pushing) but weak under tension (pulling/bending).",
      exp: "The arch transfers downward gravitational loads sideways into compressive force, allowing stone structures to bridge huge spans without snapping."
    },
    {
      q: "What is the name of the central, wedge-shaped stone at the very top of a Roman arch that locks all other stones in place?",
      options: ["Cornerstone", "Keystone", "Capacitor", "Pillar"],
      ans: 1,
      hint: "Without this 'key' stone, the arch would collapse immediately.",
      exp: "The Keystone sits at the vertex. When inserted, it locks the voussoirs (wedge stones) together under compressive friction."
    },
    {
      q: "What secret ingredient gave Roman concrete (Opus Caementicium) the superpower to set underwater and last over 2,000 years?",
      options: ["Sugar and honey", "Volcanic ash (Pozzolana) rich in silica and alumina", "Crushed sea shells only", "Animal glue"],
      ans: 1,
      hint: "This ash was sourced near Mount Vesuvius in the Bay of Naples.",
      exp: "Volcanic pozzolanic ash chemically reacts with lime and water to create robust calcium-silicate-hydrate crystal matrices that resist salt water corrosion for millennia."
    },
    {
      q: "How did Roman aqueducts transport millions of litres of water across mountains into city fountains?",
      options: ["With diesel water pumps", "Entirely by gentle gravity flow using precise downhill slopes (0.2% to 0.5%)", "With steam engine boilers", "By carrying buckets on chariots"],
      ans: 1,
      hint: "Roman surveyors used the chorobates tool to maintain a millimeter-precise downward slope.",
      exp: "Aqueducts relied 100% on continuous gravity flow, sloping downward just 1 to 2 metres every kilometre from mountain springs to urban fountains."
    },
    {
      q: "What architectural wonder has the world's largest unreinforced concrete dome (43.3m diameter) with a 9-metre open skylight called the Oculus?",
      options: ["The Colosseum", "The Pantheon", "Circus Maximus", "The Forum"],
      ans: 1,
      hint: "'Pan' means all, 'Theos' means gods — a temple dedicated to all gods.",
      exp: "The Pantheon in Rome features a magnificent concrete dome that tapers from 6.4m thick at the base to 1.2m at the top, illuminated by the central open Oculus."
    },
    {
      q: "What was the underground labyrinth of elevators and trapdoors beneath the Colosseum arena called?",
      options: ["The Hypogeum", "The Thermae", "The Basilicas", "The Insula"],
      ans: 0,
      hint: "'Hypo' means under, 'ge' means earth.",
      exp: "The Hypogeum was a 2-story subterranean staging area with 28 winch-operated pulley elevators to launch wild animals directly onto the sand."
    },
    {
      q: "What was the purpose of the 'Vomitoria' arched exits in the Colosseum?",
      options: ["Medical first aid stations", "Wide passageways designed to rapidly 'spew forth' 50,000 spectators in under 15 minutes", "Food preparation kitchens", "Gladiator sword sharpening stalls"],
      ans: 1,
      hint: "From the Latin 'vomere', meaning to discharge rapidly.",
      exp: "Vomitoria were engineered crowd-control corridors allowing tens of thousands of Roman spectators to exit the stadium smoothly and safely in minutes."
    },
    {
      q: "Why were Roman highways (such as the Via Appia) crowned with a curved hump in the middle?",
      options: ["To make chariots jump like ramps", "To allow rainwater to drain off to side drainage ditches preventing mud and erosion", "To prevent horses from running too fast", "Because stones were too heavy to flatten"],
      ans: 1,
      hint: "Standing water destroys road foundations through frost and mud.",
      exp: "The curved camber ensured rain ran off into stone side ditches, keeping the 4-layer paved highway dry and solid for army legions and trade wagons."
    },
    {
      q: "What Roman heating innovation circulated hot furnace air beneath raised tile floors to heat public baths and villas?",
      options: ["Electric baseboard radiators", "The Hypocaust system", "Solar panel coils", "Steam boilers"],
      ans: 1,
      hint: "'Hypo' = under, 'caust' = burnt/heated.",
      exp: "The Hypocaust used a wood furnace to push hot air and smoke under raised pillars (*pilae*) and through hollow wall tiles to heat rooms efficiently."
    },
    {
      q: "How many kilometres of paved military highways spanned the Roman Empire at its peak?",
      options: ["About 500 km", "Over 80,000 km (enough to circle Earth twice!)", "Only 2,000 km", "10,000 km"],
      ans: 1,
      hint: "Hence the famous proverb: 'All roads lead to Rome'.",
      exp: "Over 80,000 km of durable, layered paved highways connected Britain, Spain, France, Egypt, and Syria directly back to the capital."
    }
  ],

  daily_life: [
    {
      q: "In a Roman public bath (Thermae), what was the sequence of temperature rooms?",
      options: ["Frigidarium (Cold) only", "Apodyterium (Changing) ➔ Tepidarium (Warm) ➔ Caldarium (Hot) ➔ Frigidarium (Cold Plunge)", "Hot oven only", "Pool with soap bubbles only"],
      ans: 1,
      hint: "Romans warmed up first, broke a sweat, scraped dirt with a strigil, then closed pores in cold water.",
      exp: "Bathers moved through changing rooms, warm relaxation rooms, steam baths, and finished in the cold plunge pool."
    },
    {
      q: "What huge arena held up to 250,000 cheering spectators for dangerous four-horse chariot races?",
      options: ["The Colosseum", "Circus Maximus", "The Parthenon", "The Roman Senate"],
      ans: 1,
      hint: "'Circus' means circle/ring, 'Maximus' means greatest/largest.",
      exp: "Circus Maximus was Rome's gigantic chariot racing track where factions (Blues, Greens, Reds, Whites) competed for glory."
    },
    {
      q: "What catastrophic event occurred on August 24, 79 CE, preserving Roman daily life for modern historians?",
      options: ["A giant tsunami in the Atlantic", "The eruption of Mount Vesuvius burying Pompeii and Herculaneum in volcanic ash", "An ice age in Italy", "A meteor impact in Rome"],
      ans: 1,
      hint: "Volcanic ash sealed houses, bakeries, and art under an airtight layer.",
      exp: "Mount Vesuvius erupted in 79 CE, burying Pompeii under pumice and ash, providing an extraordinary snapshot of ancient Roman life."
    },
    {
      q: "What garment was the proud symbol of Roman citizenship worn on formal occasions?",
      options: ["A heavy leather jacket", "The Toga (a draped semi-circular wool cloth)", "A silk kimono", "A feathered cape"],
      ans: 1,
      hint: "Only free adult Roman citizens had the legal right to wear a toga.",
      exp: "The Toga was the formal national garment of Roman male citizens, draped carefully over a linen tunic."
    },
    {
      q: "What did Roman schoolchildren write on using a pointed metal stylus?",
      options: ["Paper notebooks", "Beeswax-coated wooden tablets (tabulae)", "Blackboards with chalk", "Digital tablets"],
      ans: 1,
      hint: "The wax could be smoothed flat with the blunt end of the stylus to erase mistakes!",
      exp: "Roman students wrote into soft wax tablets with a stylus and smoothed the wax to reuse the tablet over and over."
    },
    {
      q: "From Sophia's chemistry quest, why is the chemical symbol for Lead 'Pb'?",
      options: ["From the Latin word 'Plumbum' (which Romans used for water pipes, giving us 'plumbing')", "Named after Peanut Butter", "From the planet Pluto", "Named after Paris"],
      ans: 0,
      hint: "Lead was used for pipes, which is where the word 'plumber' comes from!",
      exp: "Lead comes from Latin 'Plumbum' (Pb). Romans built water pipes out of plumbum, giving us the word plumbing!"
    },
    {
      q: "Why is the chemical symbol for Gold 'Au' and Iron 'Fe'?",
      options: ["From Latin 'Aurum' (shining dawn) and 'Ferrum' (iron)", "Named after famous astronauts", "From Greek alphabet only", "They were picked randomly by dice roll"],
      ans: 0,
      hint: "Many elements on the periodic table use their historical Latin names.",
      exp: "Gold is Au from Latin 'Aurum', Iron is Fe from 'Ferrum', and Silver is Ag from 'Argentum'."
    },
    {
      q: "Which two months of our modern calendar are named directly after Roman historical leaders?",
      options: ["January and February", "July (Julius Caesar) and August (Caesar Augustus)", "September and October", "May and June"],
      ans: 1,
      hint: "Think of the two emperors who reorganized the Roman calendar into 365 days.",
      exp: "July honours Julius Caesar, and August honours his successor Caesar Augustus."
    },
    {
      q: "What did Roman gladiators famously fight for inside the arena?",
      options: ["Gold coins to buy castles", "Their freedom (symbolized by receiving a wooden sword called a Rudis)", "To become Emperor immediately", "To get a seat in the Senate"],
      ans: 1,
      hint: "Winning enough bouts allowed a gladiator to earn the wooden sword 'rudis' granting freedom.",
      exp: "While some fought for fame, enslaved gladiators fought for emancipation, awarded through the wooden training sword (*rudis*)."
    },
    {
      q: "What was the central public square of Rome, used for speeches, trials, markets, and triumphant parades?",
      options: ["The Roman Forum (Forum Romanum)", "The Catacombs", "The Appian Way", "The Pantheon Portico"],
      ans: 0,
      hint: "'Forum' means public open marketplace and meeting place.",
      exp: "The Forum Romanum was the vibrant religious, political, legal, and commercial heartbeat of Rome."
    }
  ]
};

// Web Audio API Sound Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (!state.soundEnabled) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;

  if (type === 'correct') {
    // Triumphant Roman trumpet/fanfare chord
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.18, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + 0.5);
    });
  } else if (type === 'wrong') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(140, now + 0.1);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'keystone') {
    // Heavy stone lock clack
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  } else if (type === 'triumph') {
    // Grand Imperial Fanfare
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.2, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + 0.8);
    });
  }
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  // One icon set, so the muted state cannot render as a different
  // picture on a different platform.
  document.getElementById('sound-toggle-btn').innerHTML =
    SFIcons.icon(state.soundEnabled ? 'volumeOn' : 'volumeOff', { size: 18 });
}

// Confetti Particle System
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confetti = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  confetti = [];
  const colors = ['#c8102e', '#d4af37', '#fde047', '#06b6d4', '#10b981', '#ffffff'];
  for (let i = 0; i < 90; i++) {
    confetti.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      life: 90
    });
  }
  requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti = confetti.filter(p => p.life > 0);
  confetti.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.4;
    p.rotation += p.vRot;
    p.life--;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });
  if (confetti.length > 0) requestAnimationFrame(updateConfetti);
}

// =============================================================================
// Initialization & Navigation
// =============================================================================
function init() {
  SFQuest.init({ module: 'rome', profileId: 'sophia', badgeTotal: BADGES.length });
  updateUIStats();
  renderQuestCards();
  renderTrophies();
  setupNavTabs();
  loadDispatch(state.cipherIndex);
  convertArabicToRoman(2026);
  handleHashNavigation();

  // Check initial recruit badge
  awardBadge('recruit');
}

function handleHashNavigation() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;

  if (hash.startsWith('lesson-')) {
    switchTab('tab-learn');
    const lessonIdx = parseInt(hash.replace('lesson-', '')) - 1;
    const cards = document.querySelectorAll('.lesson-card');
    if (cards[lessonIdx]) {
      cards[lessonIdx].classList.add('open');
      cards[lessonIdx].scrollIntoView({ behavior: 'smooth' });
    }
  } else if (document.getElementById(hash)) {
    switchTab(hash);
  }
}
window.addEventListener('hashchange', handleHashNavigation);

function updateUIStats() {
  // The shell pills show the profile-wide totals, identical to the hub.
  state.xp = SFQuest.moduleXp();
  SFQuest.renderStats(state.badges.length);

  const runEl = document.getElementById('answer-run-count');
  if (runEl) runEl.textContent = state.answerRun;

  // Studio-local state that the shared record does not own.
  localStorage.setItem('sophia_rome_badges', JSON.stringify(state.badges));
  localStorage.setItem('sophia_rome_completed_quests', JSON.stringify(state.completedQuests));
}

function addXP(amount) {
  SFQuest.award(amount);
  updateUIStats();
  if (state.xp >= 300) {
    awardBadge('triumph_maximus');
  }
}

function awardBadge(badgeId) {
  if (!state.badges.includes(badgeId)) {
    state.badges.push(badgeId);
    SFQuest.unlockBadge(badgeId);
    updateUIStats();
    renderTrophies();
    playSound('triumph');
    launchConfetti();
  }
}

function setupNavTabs() {
  document.querySelectorAll('.sf-shell-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchTab(target);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.sf-shell-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  const activeTabBtn = document.querySelector(`.sf-shell-tab[data-tab="${tabId}"]`);
  const activeContent = document.getElementById(tabId);

  if (activeTabBtn) activeTabBtn.classList.add('active');
  if (activeContent) activeContent.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================================================
// Tab 1: Quest Map Renderer
// =============================================================================
function renderQuestCards() {
  const container = document.getElementById('quest-cards-grid');
  container.innerHTML = '';

  QUESTS.forEach(q => {
    const isCompleted = state.completedQuests.includes(q.id);
    const card = document.createElement('div');
    card.className = 'quest-card';
    card.innerHTML = `
      <div>
        <div class="quest-card-top">
          <div class="quest-icon-badge">${SFIcons.icon(q.glyph, { size: 22 })}</div>
          <div>
            <h4 class="quest-card-title">${q.title}</h4>
            <p class="quest-card-desc">${q.desc}</p>
          </div>
        </div>
      </div>
      <button class="sf-btn ${isCompleted ? 'sf-btn--explore' : 'sf-btn--play'} quest-card-btn">
        ${SFIcons.icon(isCompleted ? 'check' : 'play', { size: 17 })}
        <span>${isCompleted ? 'Review Quest' : 'Launch Quest'}</span>
      </button>
    `;
    card.onclick = () => {
      if (q.quizMode) {
        switchTab('tab-quiz');
        startQuiz(q.quizMode);
      } else {
        switchTab(q.targetTab);
      }
    };
    container.appendChild(card);
  });
}

// =============================================================================
// Tab 2: Roman Engineering & STEM Lab Logic
// =============================================================================
function toggleKeystone() {
  state.keystoneInserted = !state.keystoneInserted;
  const stone = document.getElementById('keystone-stone');
  const text = document.getElementById('keystone-text');
  const arrows = document.getElementById('force-arrows');
  const status = document.getElementById('arch-status');
  const btn = document.getElementById('keystone-btn');

  playSound('keystone');

  if (state.keystoneInserted) {
    stone.setAttribute('fill', '#f59e0b');
    stone.setAttribute('transform', 'translate(0, 0)');
    text.setAttribute('opacity', '1');
    arrows.classList.remove('hidden');
    status.className = 'status-callout success';
    status.innerHTML = '<strong>Status:</strong> Keystone locked in place! Compression forces distribute weight smoothly down into stone abutments! 🛡️';
    btn.textContent = '👑 Remove Keystone';
    addXP(10);
    awardBadge('keystone_architect');
  } else {
    stone.setAttribute('fill', '#475569');
    stone.setAttribute('transform', 'translate(0, -35)');
    text.setAttribute('opacity', '0');
    arrows.classList.add('hidden');
    status.className = 'status-callout danger';
    status.innerHTML = '<strong>Status:</strong> Keystone missing! Arch stones slip inward and collapse under gravity! ⚠️';
    btn.textContent = '👑 Insert Keystone';
  }
}

function updateAqueductSlope(val) {
  const numVal = parseFloat(val);
  const display = document.getElementById('slope-value');
  const stream = document.getElementById('water-stream');
  const feedback = document.getElementById('aqueduct-feedback');

  display.textContent = `${numVal.toFixed(1)}%`;

  if (numVal < 0.2) {
    display.textContent += ' (Too Flat)';
    stream.className = 'water-stream slow';
    feedback.className = 'status-callout danger';
    feedback.innerHTML = '⚠️ <strong>Water Stagnation!</strong> Gradient is too flat; water stops moving and debris clogs the channel!';
  } else if (numVal <= 0.6) {
    display.textContent += ' (Optimal Roman Slope)';
    stream.className = 'water-stream optimal';
    feedback.className = 'status-callout success';
    feedback.innerHTML = '✅ <strong>Perfect Flow!</strong> Smooth laminar stream delivers 1,000,000 m³ clean mountain drinking water daily to Roman fountains!';
    addXP(5);
  } else {
    display.textContent += ' (Too Steep)';
    stream.className = 'water-stream fast';
    feedback.className = 'status-callout danger';
    feedback.innerHTML = '🌊 <strong>Torrential Erosion!</strong> High velocity water breaches channel walls and damages mortar bridges!';
  }
}

const MONUMENT_DETAILS = {
  velarium: {
    title: "🎪 Velarium (Retractable Sun Shade)",
    desc: "A massive canvas awning suspended by ropes and 240 wooden masts around the Colosseum rim. It was operated by a specialized cohort of Roman imperial sailors to shield 50,000 cheering citizens from the scorching Mediterranean sun!"
  },
  vomitoria: {
    title: "🚪 Vomitoria (Rapid Evacuation Gates)",
    desc: "The Colosseum featured 76 numbered arched gates with wide vaulted corridors. Modern stadium architects still copy this Roman innovation, allowing 50,000 spectators to fill or evacuate the entire arena in under 15 minutes!"
  },
  hypogeum: {
    title: "⚙️ Hypogeum (Subterranean Machine Labyrinth)",
    desc: "Constructed beneath the wooden arena floor, this 2-story basement housed 28 counterweight pulley elevators, animal holding pens, and hidden trapdoors to surprise spectators with sudden lion and gladiator entrances!"
  },
  arena: {
    title: "🪵 Arena Floor (Harena & Sea Battles)",
    desc: "The wooden floor was covered in absorbent silica sand (*harena* in Latin, giving us the word 'arena'). In early years, engineers could flood the arena floor with aqueduct water to stage realistic mock naval battles (*naumachiae*)!"
  }
};

function inspectMonumentFeature(featKey) {
  const info = MONUMENT_DETAILS[featKey];
  if (info) {
    document.getElementById('monument-detail-title').textContent = info.title;
    document.getElementById('monument-detail-desc').textContent = info.desc;
    playSound('correct');
    addXP(5);
  }
}

// =============================================================================
// Tab 3: Story & Inquiry Accordion
// =============================================================================
function toggleLesson(headerEl) {
  const card = headerEl.parentElement;
  card.classList.toggle('open');
}

function revealAnswer(btnEl) {
  const ans = btnEl.nextElementSibling;
  ans.classList.toggle('hidden');
  btnEl.textContent = ans.classList.contains('hidden') ? 'Show Answer' : 'Hide Answer';
}

// =============================================================================
// Tab 4: Interactive Quiz Arena Engine
// =============================================================================
function startQuiz(mode) {
  state.currentQuizMode = mode;
  state.currentQuestionIndex = 0;
  state.quizScore = 0;
  state.hasAnsweredCurrent = false;

  if (mode === 'triumph') {
    // Combine questions from all categories and shuffle
    const combined = [
      ...QUIZ_QUESTIONS.republic,
      ...QUIZ_QUESTIONS.engineering,
      ...QUIZ_QUESTIONS.daily_life
    ].sort(() => Math.random() - 0.5).slice(0, 12);
    state.currentQuizQuestions = combined;
  } else {
    state.currentQuizQuestions = [...(QUIZ_QUESTIONS[mode] || QUIZ_QUESTIONS.republic)];
  }

  document.getElementById('quiz-selection-screen').classList.add('hidden');
  document.getElementById('quiz-result-screen').classList.add('hidden');
  document.getElementById('quiz-play-screen').classList.remove('hidden');

  loadQuizQuestion();
}

function quitQuiz() {
  document.getElementById('quiz-play-screen').classList.add('hidden');
  document.getElementById('quiz-result-screen').classList.add('hidden');
  document.getElementById('quiz-selection-screen').classList.remove('hidden');
}

function showQuizSelection() {
  quitQuiz();
}

function restartCurrentQuiz() {
  startQuiz(state.currentQuizMode);
}

function loadQuizQuestion() {
  state.hasAnsweredCurrent = false;
  const q = state.currentQuizQuestions[state.currentQuestionIndex];
  const total = state.currentQuizQuestions.length;

  document.getElementById('quiz-step-counter').textContent = `Q ${state.currentQuestionIndex + 1}/${total}`;
  document.getElementById('quiz-progress-fill').style.width = `${((state.currentQuestionIndex) / total) * 100}%`;
  document.getElementById('quiz-question-text').textContent = q.q;
  document.getElementById('quiz-category-tag').textContent = `🏛️ Roman Quest &bull; Level ${state.currentQuestionIndex + 1}`;

  // Hide feedback & Next button
  document.getElementById('quiz-feedback-box').classList.add('hidden');
  document.getElementById('quiz-next-btn').classList.add('hidden');
  document.getElementById('quiz-hint-btn').classList.remove('hidden');

  // Render options
  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span style="color: var(--roman-gold); font-weight:800;">${String.fromCharCode(65 + idx)}.</span> ${opt}`;
    btn.onclick = () => selectQuizAnswer(idx);
    optionsContainer.appendChild(btn);
  });
}

function selectQuizAnswer(selectedIndex) {
  if (state.hasAnsweredCurrent) return;
  state.hasAnsweredCurrent = true;

  const q = state.currentQuizQuestions[state.currentQuestionIndex];
  const optionButtons = document.querySelectorAll('.option-btn');
  const isCorrect = selectedIndex === q.ans;

  optionButtons.forEach((b, idx) => {
    b.disabled = true;
    if (idx === q.ans) {
      b.classList.add('correct');
    } else if (idx === selectedIndex) {
      b.classList.add('wrong');
    }
  });

  const feedbackBox = document.getElementById('quiz-feedback-box');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackExp = document.getElementById('feedback-explanation');

  feedbackBox.classList.remove('hidden');
  feedbackExp.textContent = q.exp;

  if (isCorrect) {
    state.quizScore++;
    state.answerRun++;
    addXP(10);
    playSound('correct');
    feedbackIcon.textContent = '🎉';
    feedbackTitle.textContent = 'Optime! (Excellent!) Correct!';
    feedbackTitle.style.color = '#10b981';

    if (state.answerRun >= 3) {
      awardBadge('streak_3');
    }
  } else {
    state.answerRun = 0;
    playSound('wrong');
    feedbackIcon.textContent = '🤔';
    feedbackTitle.textContent = 'Not quite! Review the insight:';
    feedbackTitle.style.color = '#f59e0b';
  }

  updateUIStats();
  document.getElementById('quiz-next-btn').classList.remove('hidden');
}

function showHint() {
  const q = state.currentQuizQuestions[state.currentQuestionIndex];
  alert(`💡 Imperial Scholar Hint:\n\n${q.hint}`);
}

function nextQuestion() {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex < state.currentQuizQuestions.length) {
    loadQuizQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  document.getElementById('quiz-play-screen').classList.add('hidden');
  document.getElementById('quiz-result-screen').classList.remove('hidden');

  const total = state.currentQuizQuestions.length;
  const pct = Math.round((state.quizScore / total) * 100);

  document.getElementById('result-score').textContent = `${state.quizScore}/${total}`;
  document.getElementById('result-percentage').textContent = `${pct}%`;
  
  const xpEarned = state.quizScore * 10 + (pct === 100 ? 50 : 0);
  document.getElementById('result-xp-earned').textContent = xpEarned;
  addXP(pct === 100 ? 50 : 0);

  if (pct >= 80) {
    if (state.currentQuizMode === 'republic') awardBadge('republic_senator');
    if (state.currentQuizMode === 'engineering') awardBadge('keystone_architect');
    if (state.currentQuizMode === 'daily_life') awardBadge('pompeii_historian');
  }

  // Mark Quest completed
  if (!state.completedQuests.includes(state.currentQuizMode)) {
    state.completedQuests.push(state.currentQuizMode);
    updateUIStats();
    renderQuestCards();
  }

  playSound('triumph');
  launchConfetti();
}

// =============================================================================
// Tab 5: Roman Numerals & Caesar Cipher Lab
// =============================================================================

// Roman Numeral Converter
const ROMAN_MAP = [
  { val: 1000, sym: "M" },
  { val: 900, sym: "CM" },
  { val: 500, sym: "D" },
  { val: 400, sym: "CD" },
  { val: 100, sym: "C" },
  { val: 90, sym: "XC" },
  { val: 50, sym: "L" },
  { val: 40, sym: "XL" },
  { val: 10, sym: "X" },
  { val: 9, sym: "IX" },
  { val: 5, sym: "V" },
  { val: 4, sym: "IV" },
  { val: 1, sym: "I" }
];

function convertArabicToRoman(numStr) {
  let num = parseInt(numStr);
  if (isNaN(num) || num < 1 || num > 3999) {
    document.getElementById('roman-input').value = '---';
    document.getElementById('numeral-breakdown').innerHTML = 'Please enter an integer between 1 and 3999.';
    return;
  }

  let roman = '';
  let breakdownParts = [];
  let temp = num;

  for (let item of ROMAN_MAP) {
    while (temp >= item.val) {
      roman += item.sym;
      breakdownParts.push(`${item.sym} (${item.val})`);
      temp -= item.val;
    }
  }

  document.getElementById('roman-input').value = roman;
  document.getElementById('numeral-breakdown').innerHTML = `<strong>Breakdown:</strong> ${breakdownParts.join(' + ')} = <strong>${num}</strong>`;

  if (num === 2026 || num === 753) {
    awardBadge('math_imperator');
  }
}

function convertRomanToArabic(romanStr) {
  const str = romanStr.trim().toUpperCase();
  const romanValues = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    const current = romanValues[str[i]];
    if (!current) {
      document.getElementById('arabic-input').value = '';
      document.getElementById('numeral-breakdown').textContent = 'Invalid Roman character!';
      return;
    }
    if (current < prev) {
      total -= current;
    } else {
      total += current;
    }
    prev = current;
  }

  document.getElementById('arabic-input').value = total;
  document.getElementById('numeral-breakdown').innerHTML = `<strong>Decoded Value:</strong> ${str} = <strong>${total}</strong>`;
}

// Caesar Cipher
function loadDispatch(idx) {
  state.cipherIndex = idx;
  const dispatch = DISPATCH_DATA[idx];
  document.getElementById('dispatch-num').textContent = dispatch.num;
  document.getElementById('dispatch-ciphertext').textContent = dispatch.ciphertext;
  document.getElementById('dispatch-tracker').textContent = `Mission ${idx + 1} of ${DISPATCH_DATA.length}`;
  document.getElementById('cipher-user-input').value = '';
  document.getElementById('cipher-feedback').classList.add('hidden');
}

function updateCipherShift(val) {
  state.currentShift = parseInt(val);
  document.getElementById('shift-value-display').textContent = `${val} ${val == 3 ? '(Caesar Classic Shift)' : ''}`;
}

function checkCipherAnswer() {
  const userText = document.getElementById('cipher-user-input').value.trim().toUpperCase();
  const dispatch = DISPATCH_DATA[state.cipherIndex];
  const feedback = document.getElementById('cipher-feedback');

  feedback.classList.remove('hidden');

  if (userText === dispatch.plaintext) {
    feedback.className = 'feedback-box success';
    feedback.innerHTML = `
      <span style="font-size:1.8rem;">🎉</span>
      <div>
        <h4 style="color:#10b981;">Mission Decrypted Successfully!</h4>
        <p><strong>Decoded:</strong> "${dispatch.plaintext}"</p>
        <p><em>Historical Context: ${dispatch.hint}</em></p>
      </div>
    `;
    playSound('correct');
    addXP(25);
    launchConfetti();

    // Check all dispatches badge
    if (state.cipherIndex === DISPATCH_DATA.length - 1) {
      awardBadge('caesar_decoder');
    }
  } else {
    feedback.className = 'feedback-box danger';
    feedback.innerHTML = `
      <span style="font-size:1.8rem;">🔒</span>
      <div>
        <h4 style="color:#ef4444;">Decryption Failed!</h4>
        <p>Hint: ${dispatch.hint}</p>
      </div>
    `;
    playSound('wrong');
  }
}

function prevDispatch() {
  if (state.cipherIndex > 0) {
    loadDispatch(state.cipherIndex - 1);
  }
}

function nextDispatch() {
  if (state.cipherIndex < DISPATCH_DATA.length - 1) {
    loadDispatch(state.cipherIndex + 1);
  }
}

// =============================================================================
// Tab 6: Trophy Room Renderer
// =============================================================================
function renderTrophies() {
  const container = document.getElementById('trophy-grid');
  container.innerHTML = '';

  BADGES.forEach(b => {
    const isUnlocked = state.badges.includes(b.id);
    const card = document.createElement('div');
    card.className = `trophy-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `
      <div class="trophy-icon-circle">${SFIcons.icon(b.glyph, { size: 26 })}</div>
      <h4>${b.title}</h4>
      <p>${b.desc}</p>
      <span class="trophy-status-pill">${isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
    `;
    container.appendChild(card);
  });
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', init);
