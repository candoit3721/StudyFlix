/**
 * STUDYFLIX: Netflix-Style Multi-Profile Learning Portal
 * Kids Projects Hub Logic
 */

// Default Profile Configurations
/**
 * Default profile catalog.
 *
 * Every catalog entry declares three things the UI needs in order to look
 * like a curated shelf instead of a palette test:
 *   kind    quest | lesson | printable  -> the card treatment and type mark,
 *                                          so the ICON tells you what opens
 *   family  subject palette             -> shared across a subject's tiles
 *   art     key-art scene id            -> a drawn scene, never a flat gradient
 */
const DEFAULT_PROFILES = [
  {
    id: "sophia",
    name: "Sophia",
    glyph: "flask",
    avatar: "astronaut",
    avatarBg: "ocean",
    grade: "Grade 5 & 6 Champion",
    themeClass: "theme-sophia",
    family: "rome",
    featured: {
      tag: "FEATURED QUEST",
      title: "Sophia's Ancient Rome & Engineering Quest",
      desc: "Step back 2,000 years! Master Roman semi-circular arch keystones, aqueduct gravity hydraulics, the Colosseum hypogeum, Caesar's military ciphers, and Senate law!",
      link: "sophia-rome/index.html",
      family: "rome",
      art: "rome-forum"
    },
    subjects: [
      { title: "Ancient Rome Quest & Studio", badge: "NEW & FEATURED", desc: "History, Arch Engineering, Aqueducts, Caesar's Cipher & Senate Law", link: "sophia-rome/index.html", kind: "quest", family: "rome", art: "rome-forum" },
      { title: "Geometry & Area Masterclass", badge: "NEW STUDIO", desc: "Interactive 2D shape transformer, shearing proofs & Waterloo Gauss Arena", link: "sophia-math/geometry.html", kind: "quest", family: "math", art: "math-geometry" },
      { title: "Science & Chemistry Quest", badge: "SCIENCE STUDIO", desc: "Periodic Table, Matter, Cells, Physics & Scientific Method", link: "sophia-science/index.html", kind: "quest", family: "science", art: "sci-atom" },
      { title: "Grade 5/6 Math Studio", badge: "MATH STUDIO", desc: "Fractions, Decimals, PEMDAS, Pre-Algebra, and Geometry", link: "sophia-math/index.html", kind: "quest", family: "math", art: "math-geometry" },
      { title: "Grade 6 Ontario Science Strands", badge: "NEW & COMPLETE", desc: "All 4 strands: Biodiversity, Flight, Space & Electricity with live labs", link: "sophia-science/index.html#tab-biodiversity", kind: "quest", family: "science", art: "sci-space" }
    ],
    topics: [
      { title: "Area of Polygons & Proofs", badge: "SPATIAL SENSE", desc: "Visual shearing proofs, base & perpendicular heights & trapezoid averages", link: "sophia-math/geometry.html#tab-triangle", kind: "lesson", family: "math", art: "math-geometry" },
      { title: "Circles & Composite Area", badge: "GAUSS CONTEST", desc: "Radius squared, annulus rings, L-shapes & Waterloo shaded region puzzles", link: "sophia-math/geometry.html#tab-circle", kind: "lesson", family: "math", art: "math-geometry" },
      { title: "Biodiversity & Six Kingdoms", badge: "GRADE 6 STRAND B", desc: "Kingdom sorter, dichotomous key & Great Lakes food web collapse", link: "sophia-science/index.html#tab-biodiversity", kind: "lesson", family: "science", art: "sci-biodiversity" },
      { title: "Flight & the Four Forces", badge: "GRADE 6 STRAND D", desc: "Lift, weight, thrust, drag, Bernoulli's principle & wing loading", link: "sophia-science/index.html#tab-flight", kind: "lesson", family: "science", art: "sci-flight" },
      { title: "Space & the Solar System", badge: "GRADE 6 STRAND E", desc: "Orbit simulator, axial tilt seasons & mass vs. weight on 9 worlds", link: "sophia-science/index.html#tab-space", kind: "lesson", family: "science", art: "sci-space" },
      { title: "Electricity & Circuits", badge: "GRADE 6 STRAND C", desc: "Series vs. parallel builder, conductor bench & Ontario energy audit", link: "sophia-science/index.html#tab-electricity", kind: "lesson", family: "science", art: "sci-electricity" },
      { title: "Roman Arch & Keystone Lab", badge: "ENGINEERING", desc: "Interactive keystone insertion, compression forces & abutments", link: "sophia-rome/index.html#tab-engineering", kind: "lesson", family: "rome", art: "rome-arch" },
      { title: "Aqueduct Hydraulic Flow", badge: "HYDRAULICS", desc: "Adjust gravity slopes (0.2%-0.5%) to transport mountain water", link: "sophia-rome/index.html#tab-engineering", kind: "lesson", family: "rome", art: "rome-aqueduct" },
      { title: "Caesar's Military Cipher", badge: "CRYPTOGRAPHY", desc: "Decode top-secret battlefield messages sent across Gaul", link: "sophia-rome/index.html#tab-cipher", kind: "lesson", family: "rome", art: "rome-cipher" },
      { title: "Roman Numeral Converter", badge: "ROMAN MATH", desc: "Additive and subtractive numeral calculations (IV, IX, XL, CM)", link: "sophia-rome/index.html#tab-cipher", kind: "lesson", family: "rome", art: "rome-numerals" },
      { title: "Senate & Twelve Tables", badge: "CIVICS & LAW", desc: "Patricians vs. Plebeians, Rule of Law & Canadian Charter", link: "sophia-rome/index.html#lesson-2", kind: "lesson", family: "rome", art: "rome-senate" },
      { title: "Pompeii & Mount Vesuvius", badge: "DAILY LIFE", desc: "Explore Thermae baths, hypocaust heating, and 79 CE artifacts", link: "sophia-rome/index.html#lesson-5", kind: "lesson", family: "rome", art: "rome-vesuvius" },
      { title: "Roman Quiz Arena", badge: "CHALLENGE", desc: "Test Republic history, engineering feats & gladiators for XP", link: "sophia-rome/index.html#tab-quiz", kind: "lesson", family: "rome", art: "generic-quiz" },
      { title: "Periodic Table First 20", badge: "CHEMISTRY", desc: "Mnemonics ('Happy Henry...') & Element Superpowers", link: "sophia-science/index.html#tab-periodic", kind: "lesson", family: "science", art: "sci-periodic" },
      { title: "Matter & Reactions", badge: "GRADE 5 CORE", desc: "Physical vs. Chemical changes and Conservation of Mass", link: "sophia-science/index.html#tab-learn", kind: "lesson", family: "science", art: "sci-reaction" },
      { title: "Chemical Word Decoder", badge: "SCIENCE PUZZLE", desc: "Crack secret spy words built from element symbols!", link: "sophia-science/index.html#tab-decoder", kind: "lesson", family: "science", art: "sci-decoder" },
      { title: "Cell City Biology Lab", badge: "GRADE 6 PREP", desc: "Nucleus Mayor, Mitochondria Powerhouse & plant cell organelles", link: "sophia-science/index.html#tab-learn", kind: "lesson", family: "science", art: "sci-cell" },
      { title: "Roller Coaster Physics", badge: "PHYSICS", desc: "Potential vs. Kinetic energy & Newton's 3 Laws of Motion", link: "sophia-science/index.html#tab-learn", kind: "lesson", family: "science", art: "sci-coaster" },
      { title: "Fraction Mastery", badge: "MATH", desc: "Unlike Denominators, Mixed Numbers & Keep-Change-Flip", link: "sophia-math/index.html", kind: "lesson", family: "math", art: "math-fractions" }
    ],
    printable: [
      { title: "30-Question Area Masterclass Guide", badge: "STUDY GUIDE", desc: "Comprehensive printable workbook with visual proofs, traps & Gauss solutions", link: "sophia-math/worksheets/sophia_geometry_area_masterclass.md", kind: "printable", family: "math", art: "generic-printable" },
      { title: "Composite Shapes & Shaded Area Test", badge: "20 QUESTIONS", desc: "Printable worksheet on decomposed polygons, house silhouettes & pool walkways", link: "sophia-math/worksheets/grade6_area_composite_shapes.md", kind: "printable", family: "math", art: "generic-printable" },
      { title: "Complete Ancient Rome Workbook", badge: "NEW WORKBOOK", desc: "Paper-Ready Study Guide with Arches, Law, Numerals & Solutions", link: "sophia-rome/workbook.html", kind: "printable", family: "rome", art: "generic-printable" },
      { title: "Complete Science Workbook", badge: "ALL-IN-ONE", desc: "Printable Master Study Guide with all questions & answers", link: "sophia-science/workbook.html", kind: "printable", family: "science", art: "generic-printable" },
      { title: "Grade 5/6 Math Practice", badge: "PDF WORKSHEET", desc: "Customizable math test generator with instant answer keys", link: "sophia-math/index.html", kind: "printable", family: "math", art: "math-worksheet" }
    ]
  },
  {
    id: "olivia",
    name: "Olivia",
    glyph: "clock",
    avatar: "unicorn",
    avatarBg: "berry",
    grade: "Grade 3 Explorer",
    themeClass: "theme-olivia",
    family: "grade3",
    featured: {
      tag: "FEATURED STUDIO",
      title: "Olivia's Math Worksheet Studio",
      desc: "Operations with carrying & borrowing, 12x12 times tables, clock time, Canadian money & coins, geometry, and fun word problems!",
      link: "olivia-math/index.html",
      family: "grade3",
      art: "math-operations"
    },
    subjects: [
      { title: "Grade 3 Math Studio", badge: "CORE STUDIO", desc: "Interactive practice & clean printable worksheet generator", link: "olivia-math/index.html", kind: "quest", family: "grade3", art: "math-operations" },
      { title: "Clock & Elapsed Time Studio", badge: "NEW & INTERACTIVE", desc: "Read analog clocks, set hands, timeline jumps & time word problems", link: "olivia-math/clock-time.html", kind: "quest", family: "grade3", art: "g3-clock" },
      { title: "Times Table Blitz", badge: "MULTIPLICATION", desc: "Master 0-12 multiplication tables with speed challenges", link: "olivia-math/index.html?preset=mult_core", kind: "lesson", family: "grade3", art: "g3-times" },
      { title: "Money & Coin Math", badge: "NEW & INTERACTIVE", desc: "Count Canadian coins, build a purse, make change & print money tests", link: "olivia-math/money-coins.html", kind: "quest", family: "grade3", art: "g3-money" }
    ],
    topics: [
      { title: "Telling Time & Clocks", badge: "TIME MATH", desc: "Read hour & minute hands with 5-minute intervals", link: "olivia-math/clock-time.html", kind: "lesson", family: "grade3", art: "g3-clock" },
      { title: "Elapsed Time Numberline", badge: "TIMELINE JUMPS", desc: "Calculate elapsed hours & minutes with visual jumps", link: "olivia-math/clock-time.html", kind: "lesson", family: "grade3", art: "g3-numberline" },
      { title: "Counting Coins & Bills", badge: "MONEY MATH", desc: "Add up piles of nickels, dimes, quarters, loonies & toonies", link: "olivia-math/money-coins.html?view=count_money", kind: "lesson", family: "grade3", art: "g3-money" },
      { title: "Making Change", badge: "COUNT UP", desc: "Count up from the price to what you paid, Canadian rounding included", link: "olivia-math/money-coins.html?view=make_change", kind: "lesson", family: "grade3", art: "g3-money" },
      { title: "3-Digit Addition", badge: "REGROUPING", desc: "Master column addition with carrying into tens and hundreds", link: "olivia-math/index.html?preset=add_3digit", kind: "lesson", family: "grade3", art: "g3-column" },
      { title: "3-Digit Subtraction", badge: "BORROWING", desc: "Borrowing across zeros and multi-step subtraction", link: "olivia-math/index.html?preset=sub_3digit", kind: "lesson", family: "grade3", art: "g3-column-borrow" },
      { title: "Missing Addend Equations", badge: "ALGEBRA", desc: "Solve mystery equations like 38 + __ = 95", link: "olivia-math/index.html?preset=missing_ops", kind: "lesson", family: "grade3", art: "g3-missing" },
      { title: "Early Equal Fractions", badge: "FRACTIONS", desc: "Visual halves, thirds, fourths, sixths, and eighths", link: "olivia-math/index.html", kind: "lesson", family: "grade3", art: "math-fractions" }
    ],
    printable: [
      { title: "Printable Clock & Time Worksheets", badge: "CLOCK PDF", desc: "12-clock test generator to draw hands or write digital times", link: "olivia-math/clock-time.html", kind: "printable", family: "grade3", art: "g3-clock" },
      { title: "Printable Money & Coin Tests", badge: "MONEY PDF", desc: "Count-the-coins, making-change & fewest-coin tests with answer keys", link: "olivia-math/money-coins.html?view=worksheet_gen", kind: "printable", family: "grade3", art: "g3-money" },
      { title: "100-Problem Times Table Sprint", badge: "SPEED TEST", desc: "Print a high-density speed drill on standard paper", link: "olivia-math/index.html?preset=mult_core", kind: "printable", family: "grade3", art: "g3-times" },
      { title: "Daily Math Worksheet", badge: "CUSTOM PDF", desc: "Generate custom mixed review tests with paper-saving keys", link: "olivia-math/index.html", kind: "printable", family: "grade3", art: "math-worksheet" }
    ]
  },
  {
    id: "yaya",
    name: "Yaya",
    glyph: "sigma",
    avatar: "owl",
    avatarBg: "deep",
    grade: "Pre-University Calculus",
    themeClass: "theme-yaya",
    family: "calculus",
    featured: {
      tag: "FEATURED STUDIO",
      title: "Yaya's Calculus & Statistics Studio",
      desc: "Pre-University, AP Calculus AB/BC, College Entrance Exam Prep, Derivatives, Integrals, Probability Distributions, and Hypothesis Testing.",
      link: "yaya/index.html",
      family: "calculus",
      art: "calc-derivative"
    },
    subjects: [
      { title: "Calculus & Statistics Studio", badge: "EXAM STUDIO", desc: "Derivatives, Integrals, Probability & Statistical Inference", link: "yaya/index.html", kind: "quest", family: "calculus", art: "calc-derivative" },
      { title: "Derivative & Extrema Analyzer", badge: "CALCULUS", desc: "Tangent equations, monotonic intervals, inflection points", link: "yaya/index.html", kind: "lesson", family: "calculus", art: "calc-tangent" },
      { title: "Probability & Statistics Hub", badge: "STATISTICS", desc: "Discrete distributions, Normal distribution & Chi-Square test", link: "yaya/index.html", kind: "lesson", family: "calculus", art: "calc-distribution" },
      { title: "Definite Integrals & Volume", badge: "INTEGRATION", desc: "Integration by substitution, by parts, and solids of revolution", link: "yaya/index.html", kind: "lesson", family: "calculus", art: "calc-integral" }
    ],
    topics: [
      { title: "参变分离法与函数零点", badge: "高难度专题", desc: "导数切线不等式放缩与泰勒展开二阶逼近", link: "yaya/index.html", kind: "lesson", family: "calculus", art: "calc-roots" },
      { title: "超几何分布与二项分布", badge: "概率决策", desc: "离散型随机变量期望与方差性质与经济决策模型", link: "yaya/index.html", kind: "lesson", family: "calculus", art: "calc-distribution" },
      { title: "2x2 列联表与卡方检验", badge: "统计推断", desc: "独立性检验卡方统计量计算与显著性水平决策", link: "yaya/index.html", kind: "lesson", family: "calculus", art: "calc-table" },
      { title: "最小二乘线性回归", badge: "回归分析", desc: "相关系数 r 计算与非线性指数增长对数线性化", link: "yaya/index.html", kind: "lesson", family: "calculus", art: "calc-regression" }
    ],
    printable: [
      { title: "高考数学/自主招生标准试卷", badge: "A4 试卷排版", desc: "标准考场抬头、草稿答题区与独立答案速查页", link: "yaya/index.html", kind: "printable", family: "calculus", art: "calc-exam" },
      { title: "AP Calculus Diagnostic Exam", badge: "DIAGNOSTIC", desc: "Full section test generator with detailed rubric solutions", link: "yaya/index.html", kind: "printable", family: "calculus", art: "generic-printable" }
    ]
  },
  {
    id: "mama",
    name: "Mama",
    glyph: "coffee",
    avatar: "bear",
    avatarBg: "mocha",
    grade: "Master Coffee Connoisseur",
    themeClass: "theme-mama",
    family: "coffee",
    featured: {
      tag: "FEATURED MASTERCLASS",
      title: "Mama's Specialty Coffee & Bean Tasting Studio",
      desc: "Explore single-origin terroirs (Ethiopia, Panama, Colombia), Arabica varietals (Geisha, Bourbon, Typica), processing methods, SCA Flavour Wheel, and golden hand-drip brewing recipes!",
      link: "mama/index.html",
      family: "coffee",
      art: "coffee-cup"
    },
    subjects: [
      { title: "Specialty Coffee Masterclass", badge: "NEW STUDIO", desc: "Bean Knowledge, Global Terroirs, Processing & Flavour Wheels", link: "mama/index.html", kind: "quest", family: "coffee", art: "coffee-cup" },
      { title: "World Coffee Atlas & Origins", badge: "TERROIR", desc: "Ethiopia Yirgacheffe, Kenya AA, Panama Geisha, Colombia Huila", link: "mama/index.html#tab-origins", kind: "lesson", family: "coffee", art: "coffee-belt" },
      { title: "SCA Flavour Wheel & Tasting", badge: "CUPPING", desc: "Floral, Fruity, Caramel, Cocoa & Spices Cupping Guide", link: "mama/index.html#tab-flavour", kind: "lesson", family: "coffee", art: "coffee-flavour" },
      { title: "Mama's Bean Matchmaker", badge: "BREWING RECIPE", desc: "Personalized bean pairing, grind sizes & golden V60 ratios", link: "mama/index.html#tab-matchmaker", kind: "lesson", family: "coffee", art: "coffee-brew" }
    ],
    topics: [
      { title: "Legend of Kaldi & Coffee Belt", badge: "HISTORY", desc: "Ethiopian highlands, ancient Mocha port & high-altitude terroir", link: "mama/index.html#tab-origins", kind: "lesson", family: "coffee", art: "coffee-mountain" },
      { title: "Panama Geisha & Arabica Lineages", badge: "VARIETALS", desc: "Geisha jasmine floral, Bourbon sweetness & Typica ancestors", link: "mama/index.html#tab-varietals", kind: "lesson", family: "coffee", art: "coffee-varietal" },
      { title: "Cherry Anatomy & Layers", badge: "BOTANY", desc: "Pulp mesocarp, sugar mucilage, parchment & green coffee bean", link: "mama/index.html#tab-varietals", kind: "lesson", family: "coffee", art: "coffee-cherry" },
      { title: "Washed vs. Natural vs. Honey", badge: "PROCESSING", desc: "Clean citric tea clarity vs. sun-dried strawberry berry sweetness", link: "mama/index.html#tab-processing", kind: "lesson", family: "coffee", art: "coffee-processing" },
      { title: "Interactive Roast Spectrum", badge: "ROASTING", desc: "Light City to Dark French Roast with First Crack caramelization", link: "mama/index.html#tab-processing", kind: "lesson", family: "coffee", art: "coffee-roast" },
      { title: "Golden V60 Pour-Over Recipe", badge: "BREWING", desc: "1:16 ratio, 92°C water temp, 45g bloom for clean balance", link: "mama/index.html#tab-matchmaker", kind: "lesson", family: "coffee", art: "coffee-brew" },
      { title: "Barista Connoisseur Quiz Arena", badge: "QUIZ & TROPHIES", desc: "Test cupping knowledge and unlock 8 Master Barista Badges", link: "mama/index.html#tab-quiz", kind: "lesson", family: "coffee", art: "generic-quiz" }
    ],
    printable: [
      { title: "Mama's Coffee Tasting Journal", badge: "PRINTABLE LOG", desc: "SCA cupping scoresheets, origin matrix & golden brewing compass", link: "mama/workbook.html", kind: "printable", family: "coffee", art: "coffee-journal" },
      { title: "Complete Coffee Masterclass Handbook", badge: "MASTER GUIDE", desc: "Comprehensive origin profiles, genetics & extraction science", link: "mama/00_MAMA_COFFEE_MASTERCLASS_GUIDE.md", kind: "printable", family: "coffee", art: "generic-printable" }
    ]
  }
];

// App Version Cache Buster (increments on new releases)
const APP_VERSION = "3.1.0";
if (localStorage.getItem('studyflix_version') !== APP_VERSION) {
  localStorage.removeItem('studyflix_profiles');
  localStorage.setItem('studyflix_version', APP_VERSION);
}

// App State
let savedProfiles = JSON.parse(localStorage.getItem('studyflix_profiles') || 'null');
let appProfiles = DEFAULT_PROFILES;
if (savedProfiles) {
  appProfiles = DEFAULT_PROFILES.map(def => {
    const saved = savedProfiles.find(s => s.id === def.id);
    if (!saved) return def;
    return {
      ...def,
      name: saved.name || def.name,
      glyph: (saved.glyph && SFIcons.has(saved.glyph)) ? saved.glyph : def.glyph,
      // A picture a kid chose is theirs to keep: only fall back to the default
      // when the stored id is not one this build can actually draw.
      avatar: (saved.avatar && SFAvatars.hasCharacter(saved.avatar)) ? saved.avatar : def.avatar,
      avatarBg: (saved.avatarBg && SFAvatars.hasBackdrop(saved.avatarBg)) ? saved.avatarBg : def.avatarBg,
      grade: saved.grade || def.grade
    };
  });
}

/** One place that turns a profile into its picture, at any size. */
function profileAvatarMarkup(profile, size, radius) {
  return SFAvatars.render(profile.avatar, profile.avatarBg, {
    size: size,
    radius: radius,
    title: `${profile.name}'s picture: ${SFAvatars.labelOf(profile.avatar)}`
  });
}
let activeProfileId = localStorage.getItem('studyflix_active_profile_id') || null;
let isManageMode = false;
let editingProfileId = null;

// Confetti System
// Guarded: this runs at the top level, so a missing 2d context here would
// abort the rest of app.js and leave the hub with no profiles at all.
// Celebration is optional; the catalog is not.
const canvas = document.getElementById('confetti-canvas');
const ctx = (canvas && canvas.getContext) ? canvas.getContext('2d') : null;
let confetti = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  if (!ctx) return;
  confetti = [];
  const colors = ['#E50914', '#f59e0b', '#06b6d4', '#10b981', '#a855f7', '#ffffff'];
  for (let i = 0; i < 80; i++) {
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
  if (!ctx) return;
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

// Initialization
function init() {
  localStorage.setItem('studyflix_profiles', JSON.stringify(appProfiles));
  buildSearchIndex();
  renderProfileSelectScreen();
  initRowAffordances();

  // Check if there was an active profile previously selected
  if (activeProfileId) {
    const profile = appProfiles.find(p => p.id === activeProfileId);
    if (profile) {
      selectProfile(activeProfileId, false);
    } else {
      showProfileSelect();
    }
  } else {
    showProfileSelect();
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-header');
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const trigger = document.querySelector('.profile-menu-trigger');
    const dropdown = document.getElementById('profile-dropdown');
    if (trigger && !trigger.contains(e.target) && dropdown && !dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
    }
  });
}

// 1. Profile Selection Functions
function renderProfileSelectScreen() {
  const container = document.getElementById('profiles-container');
  container.innerHTML = '';

  appProfiles.forEach(p => {
    const card = document.createElement('div');
    card.className = 'profile-card';
    // The chooser is the first screen of the product, so it has to be usable
    // from the keyboard: the :focus-visible ring already existed but nothing
    // could ever receive the focus.
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.dataset.profileLabel = `${p.name}, ${p.grade}`;
    card.setAttribute('aria-label', isManageMode ? `Edit ${p.name}, ${p.grade}` : `${p.name}, ${p.grade}`);
    // The picture is a drawn character, not a monogram: it is the one place in
    // the product that belongs to the kid rather than to the design system.
    // The pencil is always in the DOM so changing the picture is discoverable
    // without first hunting for "Manage Profiles".
    card.innerHTML = `
      <div class="profile-avatar-box">
        ${profileAvatarMarkup(p, 140, 16)}
        <button type="button" class="avatar-edit-badge"
                title="Edit ${p.name}'s profile" aria-label="Edit ${p.name}'s profile">
          <span data-sf-icon="pencil" data-sf-size="16"></span>
        </button>
      </div>
      <div class="profile-name">${p.name}</div>
      <div class="profile-grade-tag">${p.grade}</div>
    `;
    card.querySelector('.avatar-edit-badge').onclick = (e) => {
      e.stopPropagation();
      openEditProfileModal(p.id);
    };
    card.onclick = () => {
      if (isManageMode) {
        openEditProfileModal(p.id);
      } else {
        selectProfile(p.id, true);
      }
    };
    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    };
    container.appendChild(card);
  });

  SFIcons.upgrade(container);
}

/**
 * Manage Profiles is the gate for editing: the pencil on each picture only
 * appears once the grown-up has opted in, so a kid tapping around the chooser
 * lands in a studio rather than in an editor.
 */
function setManageMode(on) {
  isManageMode = on;
  const btn = document.getElementById('manage-profiles-btn');
  const screen = document.getElementById('profile-select-screen');
  const hint = document.getElementById('profile-picture-hint-text');

  screen.classList.toggle('manage-mode', on);

  if (on) {
    btn.innerHTML = SFIcons.icon('check', { size: 18 }) + '<span>Done Managing</span>';
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-outline');
  } else {
    btn.innerHTML = SFIcons.icon('settings', { size: 18 }) + '<span>Manage Profiles</span>';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
  }

  document.querySelectorAll('#profiles-container .profile-card').forEach(card => {
    const base = card.dataset.profileLabel || '';
    card.setAttribute('aria-label', on ? `Edit ${base}` : base);
  });

  // The hint has to name the control that is actually on screen right now.
  if (hint) {
    hint.textContent = on
      ? 'Tap the pencil on a picture to pick a new character.'
      : 'Tap Manage Profiles to change a name or picture.';
  }
}

function toggleManageMode() {
  setManageMode(!isManageMode);
}

function showProfileSelect() {
  stopHeroRotation();
  activeProfileId = null;
  localStorage.removeItem('studyflix_active_profile_id');
  document.getElementById('main-header').classList.add('hidden');
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('studio-viewer').classList.add('hidden');
  document.getElementById('profile-select-screen').classList.remove('hidden');
  setManageMode(false);
}

function selectProfile(profileId, triggerConfetti = true) {
  const profile = appProfiles.find(p => p.id === profileId);
  if (!profile) return;

  activeProfileId = profileId;
  localStorage.setItem('studyflix_active_profile_id', profileId);

  // Update UI Elements for active profile
  const navAvatar = document.getElementById('nav-profile-avatar');
  navAvatar.innerHTML = profileAvatarMarkup(profile, 34, 18);
  navAvatar.className = 'profile-mini-avatar';
  document.getElementById('nav-profile-name').textContent = profile.name;

  // Opening the hub counts as studying today, then the shell shows the ONE
  // canonical XP/streak record that the studios also read and write.
  SFProgress.touch(profileId);
  renderProfileStats(profileId);

  // Render Dropdown List
  renderProfileDropdown();

  // Populate Dashboard Billboard & Rows
  populateDashboard(profile);

  // Update Profile-Scoped Search UI
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.placeholder = `Search ${profile.name}'s topics & labs... (/)`;
    clearSearch();
  }
  renderQuickSearchTags(profileId);

  // Switch Views
  document.getElementById('profile-select-screen').classList.add('hidden');
  document.getElementById('dashboard-screen').classList.remove('hidden');
  document.getElementById('main-header').classList.remove('hidden');

  // Rows are measured only once they are actually laid out; doing it while the
  // dashboard is still hidden reports zero width and hides every arrow.
  refreshRowAffordances();

  if (triggerConfetti) {
    launchConfetti();
  }
}

function renderProfileDropdown() {
  const list = document.getElementById('dropdown-profiles-list');
  list.innerHTML = '';

  appProfiles.forEach(p => {
    if (p.id !== activeProfileId) {
      const item = document.createElement('button');
      item.className = 'dropdown-item';
      item.innerHTML = `
        <span class="dropdown-avatar">${profileAvatarMarkup(p, 32, 16)}</span>
        <div>
          <div style="font-weight:700;">${p.name}</div>
          <div style="font-size:0.75rem; color:#888;">${p.grade}</div>
        </div>
      `;
      item.onclick = (e) => {
        e.stopPropagation();
        document.getElementById('profile-dropdown').classList.add('hidden');
        selectProfile(p.id, true);
      };
      list.appendChild(item);
    }
  });
}

function toggleProfileDropdown() {
  const dd = document.getElementById('profile-dropdown');
  dd.classList.toggle('hidden');
}

// 2. Populate Dashboard Content
/** Paint the nav XP and streak pills from the shared progress record. */
function renderProfileStats(profileId) {
  const rec = SFProgress.get(profileId);
  const xpEl = document.getElementById('current-profile-xp');
  const streakEl = document.getElementById('current-profile-streak');
  if (xpEl) xpEl.textContent = rec.xp;
  if (streakEl) streakEl.textContent = rec.streak;
}

// A studio inside the iframe can award XP; the shell must not go stale.
SFProgress.onChange((profileId) => {
  if (profileId === activeProfileId) renderProfileStats(profileId);
});

/* =========================================================================
   HERO SPOTLIGHT
   -------------------------------------------------------------------------
   The billboard cycles through the profile's headline subjects rather than
   sitting on one. Each slide brings its own key art AND its own subject
   palette, so the top of the page takes on the tone of whatever is featured
   and then washes back to black before the content rows.

   Everything a slide needs already exists in the catalog (art, family,
   title, desc, link), so a slide is just a catalog entry - no parallel
   content to keep in sync.
   ========================================================================= */
const HERO_INTERVAL_MS = 8000;
let heroSlides = [];
let heroIndex = 0;
let heroTimer = null;
let heroArtLayer = 0;

/** Auto-rotation is decoration; anyone who asked for less motion keeps a static hero. */
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Headline slides for a profile: the featured quest plus its core subjects.
 *
 * Deduped on link AND art, because a profile's featured quest is usually also
 * its first subject and the same slide twice reads as a stutter. Keying on the
 * link alone is wrong: several studios hold multiple topics behind one URL
 * (all four of Yaya's subjects open yaya/index.html), and those are genuinely
 * different slides - different title, different key art. Two entries are the
 * same slide only when they would look the same AND go to the same place.
 */
function buildHeroSlides(profile) {
  const pool = [];
  if (profile.featured) {
    pool.push({
      tag: profile.featured.tag || 'FEATURED QUEST',
      title: profile.featured.title,
      desc: profile.featured.desc,
      link: profile.featured.link,
      family: profile.featured.family,
      art: profile.featured.art
    });
  }
  (profile.subjects || []).forEach(s => {
    pool.push({
      tag: s.badge || 'FEATURED',
      title: s.title,
      desc: s.desc,
      link: s.link,
      family: s.family,
      art: s.art
    });
  });

  const seen = new Set();
  return pool.filter(s => {
    if (!s || !s.link) return false;
    const key = s.link + '|' + (s.art || '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** The slide the hero is actually showing - what Play and More Details act on. */
function currentHeroSlide() {
  return heroSlides[heroIndex] || null;
}

function renderHeroDots() {
  const wrap = document.getElementById('hero-dots');
  if (!wrap) return;
  wrap.innerHTML = '';
  // A single slide has nothing to rotate between, so the control would be noise.
  if (heroSlides.length < 2) return;

  heroSlides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-dot' + (i === heroIndex ? ' is-active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', String(i === heroIndex));
    dot.setAttribute('aria-label', slide.title);
    dot.title = slide.title;
    dot.onclick = () => {
      showHeroSlide(i);
      // A deliberate pick should get its full dwell, not the tail of the last tick.
      restartHeroRotation();
    };
    wrap.appendChild(dot);
  });
}

/** Paint a slide: text, cross-faded art, accent, and the page wash. */
function showHeroSlide(index, immediate) {
  if (!heroSlides.length) return;
  heroIndex = ((index % heroSlides.length) + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[heroIndex];
  const palette = SFKeyArt.palette(slide.family);

  document.getElementById('hero-tag').textContent = slide.tag;
  document.getElementById('hero-title').textContent = slide.title;
  document.getElementById('hero-desc').textContent = slide.desc;

  const billboard = document.getElementById('hero-billboard');
  if (billboard) {
    billboard.style.setProperty('--hero-accent', palette.accent);
    billboard.style.background = '';
  }

  // Two stacked layers so the art dissolves into the next one instead of
  // blanking between slides.
  const layers = document.querySelectorAll('#hero-backdrop .hero-art-layer');
  if (layers.length === 2) {
    const incoming = layers[heroArtLayer ^ 1];
    incoming.innerHTML = SFKeyArt.art(slide.art, slide.family, 'quest');
    if (immediate) {
      layers.forEach(l => l.classList.remove('is-active'));
      incoming.classList.add('is-active');
    } else {
      layers[heroArtLayer].classList.remove('is-active');
      incoming.classList.add('is-active');
    }
    heroArtLayer ^= 1;
  }

  // The wash carries the subject's sky colour down behind the top of the
  // page, then falls away so the rows below stay on the product's black.
  const wash = document.getElementById('page-wash');
  if (wash) {
    wash.style.setProperty('--wash-top', palette.sky[0]);
    wash.style.setProperty('--wash-bottom', palette.sky[1]);
  }

  renderHeroDots();
}

function advanceHero() {
  showHeroSlide(heroIndex + 1);
}

function startHeroRotation() {
  stopHeroRotation();
  if (heroSlides.length < 2 || prefersReducedMotion()) return;
  heroTimer = setInterval(advanceHero, HERO_INTERVAL_MS);
}

function stopHeroRotation() {
  if (heroTimer) {
    clearInterval(heroTimer);
    heroTimer = null;
  }
}

function restartHeroRotation() {
  if (heroTimer) startHeroRotation();
}

/**
 * Reading the blurb or reaching for Play should not be interrupted by the
 * slide changing underneath, so pointer or keyboard focus inside the hero
 * holds the rotation.
 */
function initHeroInteractionPauses() {
  const billboard = document.getElementById('hero-billboard');
  if (!billboard || billboard.dataset.heroPauseBound) return;
  billboard.dataset.heroPauseBound = '1';

  billboard.addEventListener('mouseenter', stopHeroRotation);
  billboard.addEventListener('mouseleave', () => { if (!billboard.contains(document.activeElement)) startHeroRotation(); });
  billboard.addEventListener('focusin', stopHeroRotation);
  billboard.addEventListener('focusout', () => { if (!billboard.matches(':hover')) startHeroRotation(); });

  // A hero rotating in a background tab is wasted work and lands the user on
  // a different slide than the one they left.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopHeroRotation();
    else if (!document.getElementById('dashboard-screen').classList.contains('hidden')) startHeroRotation();
  });
}

function populateDashboard(profile) {
  // Hero Billboard — real key art for the featured subject, not an abstract
  // gradient that says nothing about what the quest contains.
  heroSlides = buildHeroSlides(profile);
  heroIndex = 0;
  showHeroSlide(0, true);
  initHeroInteractionPauses();
  startHeroRotation();

  // Row 1: Core Subjects
  document.getElementById('row1-title').textContent = `${profile.name}'s Core Subjects & Studios`;
  renderMediaRow('row-subjects-slider', profile.subjects);

  // Row 2: Deep Dive Topics
  renderMediaRow('row-topics-slider', profile.topics);

  // Row 3: Printable Worksheets
  renderMediaRow('row-printable-slider', profile.printable);
}

// A card's type mark tells you what you are about to open, before you read
// the label. One icon per content type, product-wide.
const CONTENT_TYPES = {
  quest:     { icon: 'quest',     label: 'Quest' },
  lesson:    { icon: 'lesson',    label: 'Lesson' },
  printable: { icon: 'printable', label: 'Printable' }
};

function renderMediaRow(sliderId, items) {
  const slider = document.getElementById(sliderId);
  slider.innerHTML = '';

  items.forEach(item => {
    const kind = CONTENT_TYPES[item.kind] ? item.kind : 'lesson';
    const type = CONTENT_TYPES[kind];
    const card = document.createElement('button');
    card.className = `media-card media-card--${kind}`;
    card.type = 'button';
    card.style.setProperty('--card-accent', SFKeyArt.palette(item.family).accent);
    card.innerHTML = `
      <span class="card-art">${SFKeyArt.art(item.art, item.family, kind)}</span>
      <span class="card-scrim"></span>
      <span class="card-type" data-kind="${kind}">
        ${SFIcons.icon(type.icon, { size: 15 })}<span>${type.label}</span>
      </span>
      <span class="card-badge">${item.badge}</span>
      <span class="card-content">
        <span class="card-title">${item.title}</span>
        <span class="card-desc">${item.desc}</span>
      </span>
    `;
    card.onclick = () => openStudio(item.link, item.title);
    slider.appendChild(card);
  });
}

/**
 * Recompute every row's fades and arrows.
 * Runs immediately AND on the next frame: a row measured before its first
 * paint reports zero width, which would leave a scrollable row with no
 * visible way to scroll it.
 */
function refreshRowAffordances() {
  const run = () => document.querySelectorAll('.row-slider').forEach(s => updateRowAffordances(s));
  // This is usually called immediately after a container stops being
  // display:none. Force the pending style recalculation first, or the rows
  // still measure as zero-width and a scrollable row shows no way to scroll.
  void document.body.offsetHeight;
  run();
  requestAnimationFrame(run);
}

/**
 * Netflix either peeks the next tile deliberately or fades it under a mask.
 * A hard crop reads as unfinished, so every row gets edge fades plus real
 * arrow controls, and both are hidden when there is nothing more to scroll to.
 */
function updateRowAffordances(slider) {
  const wrap = slider.closest('.row-slider-wrap');
  if (!wrap) return;
  const max = slider.scrollWidth - slider.clientWidth;
  // Sub-pixel layout and the slider's own padding can leave scrollLeft a
  // hair off zero; a few pixels is still "at the start".
  const EPS = 6;
  const scrollable = max > EPS;
  wrap.classList.toggle('can-scroll-left', scrollable && slider.scrollLeft > EPS);
  wrap.classList.toggle('can-scroll-right', scrollable && slider.scrollLeft < max - EPS);
}

function scrollRow(button, direction) {
  const wrap = button.closest('.row-slider-wrap');
  const slider = wrap && wrap.querySelector('.row-slider');
  if (!slider) return;
  // Advance by whole tiles so a card is never left half-cropped.
  const card = slider.querySelector('.media-card');
  const step = card ? (card.offsetWidth + 16) * Math.max(1, Math.floor(slider.clientWidth / (card.offsetWidth + 16))) : slider.clientWidth * 0.8;
  // Jump instead of gliding when the reader has asked for reduced motion.
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  slider.scrollBy({ left: direction * step, behavior: reduced ? 'auto' : 'smooth' });
  if (reduced) updateRowAffordances(slider);
}

function initRowAffordances() {
  const supportsObserver = typeof ResizeObserver !== 'undefined';
  const observer = supportsObserver
    ? new ResizeObserver(entries => entries.forEach(e => updateRowAffordances(e.target)))
    : null;

  document.querySelectorAll('.row-slider').forEach(slider => {
    slider.addEventListener('scroll', () => updateRowAffordances(slider), { passive: true });
    // The row is populated and resized long after this runs, so watch it
    // rather than relying on a single well-timed measurement.
    if (observer) observer.observe(slider);
    updateRowAffordances(slider);
  });

  window.addEventListener('resize', refreshRowAffordances);
}

// 3. Studio Launcher & Fullscreen Viewer
let currentStudioUrl = '';

function launchFeaturedTopic() {
  // The hero rotates, so Play has to follow what is on screen right now -
  // opening the profile's static featured quest would contradict the slide
  // the user is looking at.
  const slide = currentHeroSlide();
  if (slide) {
    openStudio(slide.link, slide.title);
    return;
  }
  const profile = appProfiles.find(p => p.id === activeProfileId);
  if (profile && profile.featured) {
    openStudio(profile.featured.link, profile.featured.title);
  }
}

// A native alert() blocks the page and cannot be styled. The details panel is
// part of the product, so it gets the product's own chrome.
function showFeaturedDetails() {
  const profile = appProfiles.find(p => p.id === activeProfileId);
  if (!profile) return;
  const slide = currentHeroSlide() || profile.featured;
  const modal = document.getElementById('featured-details-modal');
  document.getElementById('featured-details-tag').textContent = slide.tag;
  document.getElementById('featured-details-title').textContent = slide.title;
  document.getElementById('featured-details-desc').textContent = slide.desc;
  document.getElementById('featured-details-art').innerHTML =
    SFKeyArt.art(slide.art, slide.family, 'quest');
  // The hero must not rotate on behind an open panel describing one slide.
  stopHeroRotation();
  modal.classList.remove('hidden');
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeFeaturedDetails() {
  document.getElementById('featured-details-modal').classList.add('hidden');
  if (!document.getElementById('dashboard-screen').classList.contains('hidden')) {
    startHeroRotation();
  }
}

function playFeaturedFromDetails() {
  closeFeaturedDetails();
  launchFeaturedTopic();
}

function openStudio(link, title) {
  stopHeroRotation();
  currentStudioUrl = link;
  document.getElementById('studio-viewer-title').textContent = title;
  document.getElementById('studio-iframe').src = link;
  document.getElementById('studio-viewer').classList.remove('hidden');
}

function closeStudioViewer() {
  document.getElementById('studio-iframe').src = '';
  document.getElementById('studio-viewer').classList.add('hidden');
  if (!document.getElementById('dashboard-screen').classList.contains('hidden')) {
    startHeroRotation();
  }
}

function openStudioInNewTab() {
  if (currentStudioUrl) {
    window.open(currentStudioUrl, '_blank');
  }
}

// 4. Edit Profile Modal (the "Picture Studio")
// The picture is chosen as character + backdrop rather than as a single flat
// option, so a small cast still gives every kid a picture that feels their own.
let selectedAvatar = 'fox';
let selectedAvatarBg = 'ocean';

/** Repaint the big live preview and its caption from the current selection. */
function refreshAvatarPreview() {
  const stage = document.getElementById('avatar-preview-stage');
  const caption = document.getElementById('avatar-preview-caption');
  if (stage) stage.innerHTML = SFAvatars.render(selectedAvatar, selectedAvatarBg, { size: 116, radius: 16 });
  if (caption) {
    const bg = SFAvatars.backdrops.find(b => b.id === selectedAvatarBg);
    caption.textContent = `${SFAvatars.labelOf(selectedAvatar)} · ${bg ? bg.label : ''}`;
  }
}

function renderCharacterPicker() {
  const grid = document.getElementById('avatar-options-grid');
  grid.innerHTML = '';
  SFAvatars.characters.forEach(c => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `avatar-option-btn ${c.id === selectedAvatar ? 'selected' : ''}`;
    btn.title = c.label;
    btn.setAttribute('aria-label', c.label);
    btn.setAttribute('aria-pressed', String(c.id === selectedAvatar));
    // Each option previews on the backdrop the kid has actually picked, so the
    // grid always shows the real result rather than a stand-in colour.
    btn.innerHTML = SFAvatars.render(c.id, selectedAvatarBg, { size: 56, radius: 14 }) +
      `<span class="avatar-option-name">${c.label}</span>`;
    btn.onclick = () => {
      selectedAvatar = c.id;
      grid.querySelectorAll('.avatar-option-btn').forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      refreshAvatarPreview();
    };
    grid.appendChild(btn);
  });
}

function renderBackdropPicker() {
  const row = document.getElementById('avatar-backdrop-row');
  row.innerHTML = '';
  SFAvatars.backdrops.forEach(bg => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `backdrop-swatch ${bg.id === selectedAvatarBg ? 'selected' : ''}`;
    btn.title = bg.label;
    btn.setAttribute('aria-label', `${bg.label} background`);
    btn.setAttribute('aria-pressed', String(bg.id === selectedAvatarBg));
    btn.style.background = `linear-gradient(145deg, ${bg.from} 0%, ${bg.to} 100%)`;
    btn.onclick = () => {
      selectedAvatarBg = bg.id;
      row.querySelectorAll('.backdrop-swatch').forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      // The character tiles preview on the live backdrop, so they repaint too.
      renderCharacterPicker();
      refreshAvatarPreview();
    };
    row.appendChild(btn);
  });
}

/** Roll a picture nobody has to think about - the fastest way to try the cast. */
function surpriseMeAvatar() {
  const chars = SFAvatars.characters;
  const bgs = SFAvatars.backdrops;
  let nextChar = selectedAvatar;
  let nextBg = selectedAvatarBg;
  // Never hand back the picture already on screen; a no-op reads as a dead button.
  while (nextChar === selectedAvatar && chars.length > 1) {
    nextChar = chars[Math.floor(Math.random() * chars.length)].id;
  }
  while (nextBg === selectedAvatarBg && bgs.length > 1) {
    nextBg = bgs[Math.floor(Math.random() * bgs.length)].id;
  }
  selectedAvatar = nextChar;
  selectedAvatarBg = nextBg;
  renderCharacterPicker();
  renderBackdropPicker();
  refreshAvatarPreview();
}

function openEditProfileModal(profileId) {
  editingProfileId = profileId;
  const p = appProfiles.find(x => x.id === profileId);
  if (!p) return;

  selectedAvatar = SFAvatars.hasCharacter(p.avatar) ? p.avatar : SFAvatars.characters[0].id;
  selectedAvatarBg = SFAvatars.hasBackdrop(p.avatarBg) ? p.avatarBg : SFAvatars.backdrops[0].id;
  document.getElementById('edit-profile-name').value = p.name;
  document.getElementById('edit-profile-grade').value = p.grade;
  document.getElementById('avatar-modal-title').textContent = `${p.name}'s Picture Studio`;

  renderBackdropPicker();
  renderCharacterPicker();
  refreshAvatarPreview();

  document.getElementById('profile-edit-modal').classList.remove('hidden');
}

function closeProfileModal() {
  document.getElementById('profile-edit-modal').classList.add('hidden');
  editingProfileId = null;
}

function saveProfileChanges() {
  if (!editingProfileId) return;
  const p = appProfiles.find(x => x.id === editingProfileId);
  if (p) {
    p.name = document.getElementById('edit-profile-name').value.trim() || p.name;
    p.grade = document.getElementById('edit-profile-grade').value.trim() || p.grade;
    p.avatar = selectedAvatar;
    p.avatarBg = selectedAvatarBg;

    localStorage.setItem('studyflix_profiles', JSON.stringify(appProfiles));
    renderProfileSelectScreen();
    closeProfileModal();
    launchConfetti();
  }
}

// Views Navigation
function showView(view) {
  const profile = appProfiles.find(p => p.id === activeProfileId);
  if (view === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (view === 'topics') {
    document.getElementById('row-topics-slider').scrollIntoView({ behavior: 'smooth' });
  } else if (view === 'printable') {
    document.getElementById('row-printable-slider').scrollIntoView({ behavior: 'smooth' });
  } else if (view === 'stats') {
    alert(`🏆 ${profile.name}'s Stats:\n⭐ XP: ${document.getElementById('current-profile-xp').textContent}\n🔥 Streak: ${document.getElementById('current-profile-streak').textContent} Days`);
  }
}

// =========================================================================
// 5. Profile-Scoped Search Engine & Topic Discovery
// =========================================================================
let searchQuery = "";
let searchIndex = [];

// Profile-Specific Popular Search Tags
const PROFILE_QUICK_TAGS = {
  sophia: [
    { label: "📐 Area & Geometry", query: "Geometry" },
    { label: "🧩 Composite Shapes", query: "Composite" },
    { label: "🏛️ Ancient Rome", query: "Ancient Rome" },
    { label: "🌉 Roman Arch & Keystones", query: "Arch" },
    { label: "🕵️ Caesar Cipher", query: "Cipher" },
    { label: "⚛️ Periodic Table", query: "Periodic" },
    { label: "🏙️ Cell City Biology", query: "Cell" },
    { label: "🥞 Matter & Reactions", query: "Matter" },
    { label: "🎢 Roller Coaster Physics", query: "Physics" },
    { label: "🍕 Fractions", query: "Fraction" },
    { label: "📖 Area Masterclass", query: "Masterclass" }
  ],
  olivia: [
    { label: "⏰ Analog Clocks", query: "Clock" },
    { label: "⏱️ Elapsed Time", query: "Elapsed" },
    { label: "➕ Addition & Carrying", query: "Addition" },
    { label: "➖ Subtraction Borrowing", query: "Subtraction" },
    { label: "✖️ 12x12 Multiplication", query: "Multiplication" },
    { label: "💰 Money & Coins", query: "Money" },
    { label: "📏 2D & 3D Geometry", query: "Geometry" }
  ],
  yaya: [
    { label: "📈 AP Calculus", query: "Calculus" },
    { label: "📊 Statistics & Distribution", query: "Statistics" },
    { label: "📐 Analytical Geometry", query: "Geometry" },
    { label: "∫ Definite Integrals", query: "Integral" },
    { label: "🎯 Probability Theory", query: "Probability" },
    { label: "📝 Diagnostic Exam", query: "Diagnostic" }
  ],
  mama: [
    { label: "☕ Specialty Coffee", query: "Coffee" },
    { label: "👑 Panama Geisha", query: "Geisha" },
    { label: "🌸 Ethiopia Yirgacheffe", query: "Yirgacheffe" },
    { label: "🍫 Colombia Huila", query: "Colombia" },
    { label: "☀️ Washed vs Natural", query: "Processing" },
    { label: "🔥 Roast Spectrum", query: "Roast" },
    { label: "🎨 Flavour Wheel", query: "Flavour" },
    { label: "⚖️ Golden Brew Ratio", query: "Brewing" },
    { label: "📖 Cupping Journal", query: "Journal" }
  ]
};

function renderQuickSearchTags(profileId) {
  const container = document.getElementById('search-quick-tags-container');
  if (!container) return;

  const tags = PROFILE_QUICK_TAGS[profileId] || PROFILE_QUICK_TAGS.sophia;
  container.innerHTML = `<span class="quick-tags-label">Popular in Curriculum:</span>`;

  tags.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'quick-tag-btn';
    btn.textContent = t.label;
    btn.onclick = () => quickSearch(t.query);
    container.appendChild(btn);
  });
}

function buildSearchIndex() {
  searchIndex = [];
  appProfiles.forEach(p => {
    // Featured
    if (p.featured) {
      searchIndex.push({
        id: `${p.id}-featured`,
        profileId: p.id,
        profileName: p.name,
        profileGlyph: p.glyph,
        profileGrade: p.grade,
        title: p.featured.title,
        desc: p.featured.desc,
        badge: p.featured.tag || "FEATURED",
        kind: "quest",
        family: p.featured.family,
        art: p.featured.art,
        link: p.featured.link,
        category: "Featured Quest"
      });
    }

    // Subjects
    if (p.subjects) {
      p.subjects.forEach((s, idx) => {
        searchIndex.push({
          id: `${p.id}-subject-${idx}`,
          profileId: p.id,
          profileName: p.name,
          profileGlyph: p.glyph,
          profileGrade: p.grade,
          title: s.title,
          desc: s.desc,
          badge: s.badge || "STUDIO",
          kind: s.kind,
          family: s.family,
          art: s.art,
          link: s.link,
          category: "Core Subject"
        });
      });
    }

    // Topics
    if (p.topics) {
      p.topics.forEach((t, idx) => {
        searchIndex.push({
          id: `${p.id}-topic-${idx}`,
          profileId: p.id,
          profileName: p.name,
          profileGlyph: p.glyph,
          profileGrade: p.grade,
          title: t.title,
          desc: t.desc,
          badge: t.badge || "TOPIC",
          kind: t.kind,
          family: t.family,
          art: t.art,
          link: t.link,
          category: "Deep-Dive Topic"
        });
      });
    }

    // Printable
    if (p.printable) {
      p.printable.forEach((w, idx) => {
        searchIndex.push({
          id: `${p.id}-print-${idx}`,
          profileId: p.id,
          profileName: p.name,
          profileGlyph: p.glyph,
          profileGrade: p.grade,
          title: w.title,
          desc: w.desc,
          badge: w.badge || "WORKBOOK",
          kind: w.kind,
          family: w.family,
          art: w.art,
          link: w.link,
          category: "Printable Worksheet"
        });
      });
    }
  });
}

function handleSearchInput(value) {
  searchQuery = value.trim();
  const clearBtn = document.getElementById('search-clear-btn');
  const searchSection = document.getElementById('search-results-section');
  const heroBillboard = document.getElementById('hero-billboard');
  const contentRows = document.querySelector('.content-rows-container');

  if (searchQuery.length > 0) {
    if (clearBtn) clearBtn.classList.remove('hidden');
    if (searchSection) searchSection.classList.remove('hidden');
    if (heroBillboard) heroBillboard.classList.add('hidden');
    if (contentRows) contentRows.classList.add('hidden');
    renderSearchResults();
  } else {
    if (clearBtn) clearBtn.classList.add('hidden');
    if (searchSection) searchSection.classList.add('hidden');
    if (heroBillboard) heroBillboard.classList.remove('hidden');
    if (contentRows) contentRows.classList.remove('hidden');
    refreshRowAffordances();
  }
}

function clearSearch() {
  const input = document.getElementById('global-search-input');
  if (input) input.value = '';
  handleSearchInput('');
}

function quickSearch(tag) {
  const input = document.getElementById('global-search-input');
  if (input) {
    input.value = tag;
    handleSearchInput(tag);
    input.focus();
  }
}

function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, `<span class="search-match-highlight">$1</span>`);
}

function renderSearchResults() {
  const grid = document.getElementById('search-results-grid');
  const countDisplay = document.getElementById('search-count-display');
  const queryDisplay = document.getElementById('search-query-display');
  const profileNameDisplay = document.getElementById('search-profile-name');

  const currentProfile = appProfiles.find(p => p.id === activeProfileId) || appProfiles[0];
  if (profileNameDisplay) profileNameDisplay.textContent = currentProfile.name;
  if (queryDisplay) queryDisplay.textContent = searchQuery;

  const q = searchQuery.toLowerCase();
  
  // Scope search STRICTLY to the current active profile
  let results = searchIndex.filter(item => {
    if (item.profileId !== activeProfileId) return false;
    const searchableText = `${item.title} ${item.desc} ${item.badge} ${item.category}`.toLowerCase();
    return searchableText.includes(q);
  });

  // Deduplicate results by link + title
  const seen = new Set();
  results = results.filter(item => {
    const key = `${item.link}|${item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (countDisplay) {
    countDisplay.textContent = `Found ${results.length} topic${results.length === 1 ? '' : 's'} in ${currentProfile.name}'s curriculum`;
  }

  if (!grid) return;
  grid.innerHTML = '';

  if (results.length === 0) {
    grid.innerHTML = `
      <div class="search-empty-box">
        <h3>No matching topics found in ${currentProfile.name}'s courses for "${searchQuery}"</h3>
        <p>Try searching with another keyword above or explore ${currentProfile.name}'s full curriculum!</p>
        <button class="btn btn-primary" style="margin-top:14px;" onclick="clearSearch()">View ${currentProfile.name}'s Full Dashboard</button>
      </div>
    `;
    return;
  }

  results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'search-result-card';
    const kind = CONTENT_TYPES[item.kind] ? item.kind : 'lesson';
    const type = CONTENT_TYPES[kind];
    card.style.setProperty('--card-accent', SFKeyArt.palette(item.family).accent);
    card.innerHTML = `
      <div class="result-card-banner">
        <span class="result-card-art">${SFKeyArt.art(item.art, item.family, kind)}</span>
        <span class="result-profile-badge">
          ${SFIcons.icon(item.profileGlyph, { size: 14 })} ${item.profileName}
        </span>
        <span class="result-type-badge">${item.badge}</span>
        <span class="card-type" data-kind="${kind}">
          ${SFIcons.icon(type.icon, { size: 14 })}<span>${type.label}</span>
        </span>
      </div>
      <div class="result-card-body">
        <div class="result-card-title">${highlightMatch(item.title, searchQuery)}</div>
        <div class="result-card-desc">${highlightMatch(item.desc, searchQuery)}</div>
        <span class="result-card-action">
          ${SFIcons.icon('play', { size: 15 })}<span>Launch ${type.label}</span>
        </span>
      </div>
    `;
    card.onclick = () => openStudio(item.link, item.title);
    grid.appendChild(card);
  });
}

// A studio can ask the hub to close the viewer from its own "back" control.
window.addEventListener('message', (e) => {
  const d = e && e.data;
  if (d && d.source === 'studyflix-nav' && d.action === 'close-studio') {
    closeStudioViewer();
  }
});

// Global Keyboard Shortcuts (/ or Cmd+K / Ctrl+K to search, Esc to close)
window.addEventListener('keydown', (e) => {
  const searchInput = document.getElementById('global-search-input');
  if (!searchInput) return;

  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  } else if (e.key === 'Escape') {
    const details = document.getElementById('featured-details-modal');
    if (details && !details.classList.contains('hidden')) {
      closeFeaturedDetails();
      return;
    }
    if (document.activeElement === searchInput) {
      clearSearch();
      searchInput.blur();
    }
  }
});

// Run on load
window.addEventListener('DOMContentLoaded', init);
