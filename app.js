/**
 * STUDYFLIX: Netflix-Style Multi-Profile Learning Portal
 * Kids Projects Hub Logic
 */

// Default Profile Configurations
const DEFAULT_PROFILES = [
  {
    id: "sophia",
    name: "Sophia",
    avatar: "👩‍🔬",
    grade: "Grade 5 & 6 Champion",
    themeClass: "theme-sophia",
    featured: {
      tag: "🏛️ ANCIENT ROME & CIVILIZATION QUEST",
      title: "Sophia's Ancient Rome & Engineering Quest",
      desc: "Step back 2,000 years! Master Roman semi-circular arch keystones, aqueduct gravity hydraulics, the Colosseum hypogeum, Caesar's military ciphers, and Senate law!",
      link: "sophia-rome/index.html",
      bgGradient: "linear-gradient(135deg, rgba(200,16,46,0.9) 0%, rgba(212,175,55,0.85) 50%, rgba(26,26,36,0.95) 100%)"
    },
    subjects: [
      { title: "🏛️ Ancient Rome Quest & Studio", icon: "🏛️", badge: "NEW & FEATURED", desc: "History, Arch Engineering, Aqueducts, Caesar's Cipher & Senate Law", link: "sophia-rome/index.html", bg: "linear-gradient(135deg, #c8102e, #d4af37)" },
      { title: "🧪 Science & Chemistry Quest", icon: "⚛️", badge: "SCIENCE STUDIO", desc: "Periodic Table, Matter, Cells, Physics & Scientific Method", link: "sophia-science/index.html", bg: "linear-gradient(135deg, #0284c7, #0d9488)" },
      { title: "📐 Grade 5/6 Math Studio", icon: "📏", badge: "MATH STUDIO", desc: "Fractions, Decimals, PEMDAS, Pre-Algebra, and Geometry", link: "sophia-math/index.html", bg: "linear-gradient(135deg, #6366f1, #3b82f6)" }
    ],
    topics: [
      { title: "🌉 Roman Arch & Keystone Lab", icon: "🏛️", badge: "ENGINEERING", desc: "Interactive keystone insertion, compression forces & abutments", link: "sophia-rome/index.html#tab-engineering", bg: "linear-gradient(135deg, #c8102e, #d4af37)" },
      { title: "💧 Aqueduct Hydraulic Flow", icon: "🌊", badge: "HYDRAULICS", desc: "Adjust gravity slopes (0.2%-0.5%) to transport mountain water", link: "sophia-rome/index.html#tab-engineering", bg: "linear-gradient(135deg, #0284c7, #0d9488)" },
      { title: "🕵️ Caesar's Military Cipher", icon: "🕶️", badge: "CRYPTOGRAPHY", desc: "Decode top-secret battlefield messages sent across Gaul", link: "sophia-rome/index.html#tab-cipher", bg: "linear-gradient(135deg, #8b0000, #b45309)" },
      { title: "🔢 Roman Numeral Converter", icon: "📜", badge: "ROMAN MATH", desc: "Additive and subtractive numeral calculations (IV, IX, XL, CM)", link: "sophia-rome/index.html#tab-cipher", bg: "linear-gradient(135deg, #4338ca, #6366f1)" },
      { title: "⚖️ Senate & Twelve Tables", icon: "📜", badge: "CIVICS & LAW", desc: "Patricians vs. Plebeians, Rule of Law & Canadian Charter", link: "sophia-rome/index.html#lesson-2", bg: "linear-gradient(135deg, #7c2d12, #ea580c)" },
      { title: "🌋 Pompeii & Mount Vesuvius", icon: "🏺", badge: "DAILY LIFE", desc: "Explore Thermae baths, hypocaust heating, and 79 CE artifacts", link: "sophia-rome/index.html#lesson-5", bg: "linear-gradient(135deg, #b45309, #d97706)" },
      { title: "🎯 Roman Quiz Arena", icon: "👑", badge: "CHALLENGE", desc: "Test Republic history, engineering feats & gladiators for XP", link: "sophia-rome/index.html#tab-quiz", bg: "linear-gradient(135deg, #a21caf, #e11d48)" },
      { title: "⚛️ Periodic Table First 20", icon: "🧪", badge: "CHEMISTRY", desc: "Mnemonics ('Happy Henry...') & Element Superpowers", link: "sophia-science/index.html#tab-periodic", bg: "linear-gradient(135deg, #0ea5e9, #6366f1)" },
      { title: "🥞 Matter & Reactions", icon: "🔥", badge: "GRADE 5 CORE", desc: "Physical vs. Chemical changes and Conservation of Mass", link: "sophia-science/index.html#tab-learn", bg: "linear-gradient(135deg, #f59e0b, #ef4444)" },
      { title: "🕵️ Chemical Word Decoder", icon: "🧩", badge: "SCIENCE PUZZLE", desc: "Crack secret spy words built from element symbols!", link: "sophia-science/index.html#tab-decoder", bg: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
      { title: "🏙️ Cell City Biology Lab", icon: "🔬", badge: "GRADE 6 PREP", desc: "Nucleus Mayor, Mitochondria Powerhouse & plant cell organelles", link: "sophia-science/index.html#tab-learn", bg: "linear-gradient(135deg, #10b981, #059669)" },
      { title: "🎢 Roller Coaster Physics", icon: "🚀", badge: "PHYSICS", desc: "Potential vs. Kinetic energy & Newton's 3 Laws of Motion", link: "sophia-science/index.html#tab-learn", bg: "linear-gradient(135deg, #8b5cf6, #3b82f6)" },
      { title: "🍕 Fraction Mastery", icon: "🍰", badge: "MATH", desc: "Unlike Denominators, Mixed Numbers & Keep-Change-Flip", link: "sophia-math/index.html", bg: "linear-gradient(135deg, #ec4899, #f43f5e)" }
    ],
    printable: [
      { title: "📖 Complete Ancient Rome Workbook", icon: "🏛️", badge: "NEW WORKBOOK", desc: "Master Study Guide with Arches, Law, Numerals & Solutions", link: "sophia-rome/00_SOPHIA_COMPLETE_ANCIENT_ROME_WORKBOOK.md", bg: "linear-gradient(135deg, #8b0000, #b45309)" },
      { title: "📖 Complete Science Workbook", icon: "📘", badge: "ALL-IN-ONE", desc: "Printable Master Study Guide with all questions & answers", link: "sophia-science/00_SOPHIA_COMPLETE_SCIENCE_WORKBOOK.md", bg: "linear-gradient(135deg, #1e293b, #334155)" },
      { title: "🖨️ Grade 5/6 Math Practice", icon: "📝", badge: "PDF WORKSHEET", desc: "Customizable math test generator with instant answer keys", link: "sophia-math/index.html", bg: "linear-gradient(135deg, #374151, #4b5563)" }
    ]
  },
  {
    id: "olivia",
    name: "Olivia",
    avatar: "👧",
    grade: "Grade 3 Explorer",
    themeClass: "theme-olivia",
    featured: {
      tag: "✏️ GRADE 3 MATH STUDIO",
      title: "Olivia's Math Worksheet Studio",
      desc: "Operations with carrying & borrowing, 12x12 times tables, clock time, money math, geometry, and fun word problems!",
      link: "olivia-math/index.html",
      bgGradient: "linear-gradient(135deg, rgba(168,85,247,0.85) 0%, rgba(236,72,153,0.85) 100%)"
    },
    subjects: [
      { title: "✏️ Grade 3 Math Studio", icon: "📐", badge: "CORE STUDIO", desc: "Interactive practice & clean printable worksheet generator", link: "olivia-math/index.html", bg: "linear-gradient(135deg, #a855f7, #ec4899)" },
      { title: "⏰ Clock & Elapsed Time Studio", icon: "🕰️", badge: "NEW & INTERACTIVE", desc: "Read analog clocks, set hands, timeline jumps & time word problems", link: "olivia-math/clock-time.html", bg: "linear-gradient(135deg, #8b5cf6, #3b82f6)" },
      { title: "✖️ Times Table Blitz", icon: "⚡", badge: "MULTIPLICATION", desc: "Master 0-12 multiplication tables with speed challenges", link: "olivia-math/index.html", bg: "linear-gradient(135deg, #f59e0b, #fbbf24)" },
      { title: "💰 Money & Coin Math", icon: "🪙", badge: "REAL LIFE", desc: "Counting dollars, quarters, dimes, nickels, and making change", link: "olivia-math/index.html", bg: "linear-gradient(135deg, #10b981, #059669)" }
    ],
    topics: [
      { title: "⏰ Telling Time & Clocks", icon: "🕰️", badge: "TIME MATH", desc: "Read hour & minute hands with 5-minute intervals", link: "olivia-math/clock-time.html", bg: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
      { title: "⏱️ Elapsed Time Numberline", icon: "📈", badge: "TIMELINE JUMPS", desc: "Calculate elapsed hours & minutes with visual jumps", link: "olivia-math/clock-time.html", bg: "linear-gradient(135deg, #06b6d4, #10b981)" },
      { title: "➕ 3-Digit Addition", icon: "✨", badge: "REGROUPING", desc: "Master column addition with carrying into tens and hundreds", link: "olivia-math/index.html", bg: "linear-gradient(135deg, #ec4899, #f43f5e)" },
      { title: "➖ 3-Digit Subtraction", icon: "🎯", badge: "BORROWING", desc: "Borrowing across zeros and multi-step subtraction", link: "olivia-math/index.html", bg: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
      { title: "🧩 Missing Addend Equations", icon: "🔍", badge: "ALGEBRA", desc: "Solve mystery equations like 38 + __ = 95", link: "olivia-math/index.html", bg: "linear-gradient(135deg, #3b82f6, #06b6d4)" },
      { title: "🍕 Early Equal Fractions", icon: "🍰", badge: "FRACTIONS", desc: "Visual halves, thirds, fourths, sixths, and eighths", link: "olivia-math/index.html", bg: "linear-gradient(135deg, #f59e0b, #d97706)" }
    ],
    printable: [
      { title: "🖨️ Printable Clock & Time Worksheets", icon: "⏰", badge: "CLOCK PDF", desc: "12-clock test generator to draw hands or write digital times", link: "olivia-math/clock-time.html", bg: "linear-gradient(135deg, #6d28d9, #4f46e5)" },
      { title: "🖨️ 100-Problem Times Table Sprint", icon: "📄", badge: "SPEED TEST", desc: "Print a high-density speed drill on standard paper", link: "olivia-math/index.html", bg: "linear-gradient(135deg, #1e293b, #334155)" },
      { title: "🖨️ Daily Math Worksheet", icon: "📝", badge: "CUSTOM PDF", desc: "Generate custom mixed review tests with paper-saving keys", link: "olivia-math/index.html", bg: "linear-gradient(135deg, #374151, #4b5563)" }
    ]
  },
  {
    id: "yaya",
    name: "Yaya",
    avatar: "🧑‍🎓",
    grade: "Pre-University & Calculus Advanced",
    themeClass: "theme-yaya",
    featured: {
      tag: "🎓 ADVANCED MATHEMATICS & STATISTICS",
      title: "Yaya's Calculus & Statistics Studio",
      desc: "Pre-University, AP Calculus AB/BC, College Entrance Exam Prep, Derivatives, Integrals, Probability Distributions, and Hypothesis Testing.",
      link: "yaya/index.html",
      bgGradient: "linear-gradient(135deg, rgba(30,58,138,0.85) 0%, rgba(59,130,246,0.85) 50%, rgba(245,158,11,0.9) 100%)"
    },
    subjects: [
      { title: "🎓 Calculus & Statistics Studio", icon: "📈", badge: "EXAM STUDIO", desc: "Derivatives, Integrals, Probability & Statistical Inference", link: "yaya/index.html", bg: "linear-gradient(135deg, #1e3a8a, #3b82f6)" },
      { title: "📉 Derivative & Extrema Analyzer", icon: "📐", badge: "CALCULUS", desc: "Tangent equations, monotonic intervals, inflection points", link: "yaya/index.html", bg: "linear-gradient(135deg, #0284c7, #0d9488)" },
      { title: "📊 Probability & Statistics Hub", icon: "🎲", badge: "STATISTICS", desc: "Discrete distributions, Normal distribution & Chi-Square test", link: "yaya/index.html", bg: "linear-gradient(135deg, #d97706, #b45309)" },
      { title: "📐 Definite Integrals & Volume", icon: "🌌", badge: "INTEGRATION", desc: "Integration by substitution, by parts, and solids of revolution", link: "yaya/index.html", bg: "linear-gradient(135deg, #4f46e5, #7c3aed)" }
    ],
    topics: [
      { title: "📉 参变分离法与函数零点", icon: "📐", badge: "高难度专题", desc: "导数切线不等式放缩与泰勒展开二阶逼近", link: "yaya/index.html", bg: "linear-gradient(135deg, #1e3a8a, #0284c7)" },
      { title: "🎲 超几何分布与二项分布", icon: "🎯", badge: "概率决策", desc: "离散型随机变量期望与方差性质与经济决策模型", link: "yaya/index.html", bg: "linear-gradient(135deg, #b45309, #d97706)" },
      { title: "📊 2x2 列联表与卡方检验", icon: "📋", badge: "统计推断", desc: "独立性检验卡方统计量计算与显著性水平决策", link: "yaya/index.html", bg: "linear-gradient(135deg, #0f766e, #0d9488)" },
      { title: "📈 最小二乘线性回归", icon: "🔬", badge: "回归分析", desc: "相关系数 r 计算与非线性指数增长对数线性化", link: "yaya/index.html", bg: "linear-gradient(135deg, #4338ca, #6366f1)" }
    ],
    printable: [
      { title: "🖨️ 高考数学/自主招生标准试卷", icon: "📄", badge: "A4 试卷排版", desc: "标准考场抬头、草稿答题区与独立答案速查页", link: "yaya/index.html", bg: "linear-gradient(135deg, #1e293b, #334155)" },
      { title: "🖨️ AP Calculus Diagnostic Exam", icon: "📝", badge: "DIAGNOSTIC", desc: "Full section test generator with detailed rubric solutions", link: "yaya/index.html", bg: "linear-gradient(135deg, #374151, #4b5563)" }
    ]
  }
];

// App Version Cache Buster (increments on new releases)
const APP_VERSION = "2.3.0";
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
      avatar: saved.avatar || def.avatar,
      grade: saved.grade || def.grade
    };
  });
}
let activeProfileId = localStorage.getItem('studyflix_active_profile_id') || null;
let isManageMode = false;
let editingProfileId = null;

// Confetti System
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
  renderProfileSelectScreen();

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
    card.innerHTML = `
      <div class="profile-avatar-box ${p.themeClass}">
        ${p.avatar}
      </div>
      <div class="profile-name">${p.name}</div>
      <div class="profile-grade-tag">${p.grade}</div>
    `;
    card.onclick = () => {
      if (isManageMode) {
        openEditProfileModal(p.id);
      } else {
        selectProfile(p.id, true);
      }
    };
    container.appendChild(card);
  });
}

function toggleManageMode() {
  isManageMode = !isManageMode;
  const btn = document.getElementById('manage-profiles-btn');
  if (isManageMode) {
    btn.textContent = '✅ Done Managing';
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-outline');
  } else {
    btn.textContent = '⚙️ Manage Profiles';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
  }
}

function showProfileSelect() {
  activeProfileId = null;
  localStorage.removeItem('studyflix_active_profile_id');
  document.getElementById('main-header').classList.add('hidden');
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('studio-viewer').classList.add('hidden');
  document.getElementById('profile-select-screen').classList.remove('hidden');
  isManageMode = false;
  toggleManageMode();
  toggleManageMode(); // Reset button text
}

function selectProfile(profileId, triggerConfetti = true) {
  const profile = appProfiles.find(p => p.id === profileId);
  if (!profile) return;

  activeProfileId = profileId;
  localStorage.setItem('studyflix_active_profile_id', profileId);

  // Update UI Elements for active profile
  document.getElementById('nav-profile-avatar').textContent = profile.avatar;
  document.getElementById('nav-profile-name').textContent = profile.name;
  
  // Profile Stats
  const profileXp = localStorage.getItem(`studyflix_${profileId}_xp`) || '120';
  const profileStreak = localStorage.getItem(`studyflix_${profileId}_streak`) || '3';
  document.getElementById('current-profile-xp').textContent = profileXp;
  document.getElementById('current-profile-streak').textContent = profileStreak;

  // Render Dropdown List
  renderProfileDropdown();

  // Populate Dashboard Billboard & Rows
  populateDashboard(profile);

  // Switch Views
  document.getElementById('profile-select-screen').classList.add('hidden');
  document.getElementById('dashboard-screen').classList.remove('hidden');
  document.getElementById('main-header').classList.remove('hidden');

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
        <span style="font-size:1.2rem;">${p.avatar}</span>
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
function populateDashboard(profile) {
  // Hero Billboard
  document.getElementById('hero-tag').textContent = profile.featured.tag;
  document.getElementById('hero-title').textContent = profile.featured.title;
  document.getElementById('hero-desc').textContent = profile.featured.desc;
  document.getElementById('hero-billboard').style.background = `linear-gradient(180deg, rgba(20,20,20,0.1) 0%, rgba(20,20,20,0.85) 80%, #141414 100%), ${profile.featured.bgGradient}`;

  // Row 1: Core Subjects
  document.getElementById('row1-title').textContent = `${profile.name}'s Core Subjects & Studios`;
  renderMediaRow('row-subjects-slider', profile.subjects);

  // Row 2: Deep Dive Topics
  renderMediaRow('row-topics-slider', profile.topics);

  // Row 3: Printable Worksheets
  renderMediaRow('row-printable-slider', profile.printable);
}

function renderMediaRow(sliderId, items) {
  const slider = document.getElementById(sliderId);
  slider.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.innerHTML = `
      <div class="card-bg-gradient" style="background: ${item.bg}"></div>
      <div class="card-icon">${item.icon}</div>
      <div class="card-badge">${item.badge}</div>
      <div class="card-content">
        <div class="card-title">${item.title}</div>
        <div class="card-desc">${item.desc}</div>
      </div>
    `;
    card.onclick = () => openStudio(item.link, item.title);
    slider.appendChild(card);
  });
}

// 3. Studio Launcher & Fullscreen Viewer
let currentStudioUrl = '';

function launchFeaturedTopic() {
  const profile = appProfiles.find(p => p.id === activeProfileId);
  if (profile && profile.featured) {
    openStudio(profile.featured.link, profile.featured.title);
  }
}

function showFeaturedDetails() {
  const profile = appProfiles.find(p => p.id === activeProfileId);
  if (profile) {
    alert(`🌟 ${profile.featured.title}\n\n${profile.featured.desc}\n\nClick 'Play Studio Now' to launch interactive practice!`);
  }
}

function openStudio(link, title) {
  currentStudioUrl = link;
  document.getElementById('studio-viewer-title').textContent = title;
  document.getElementById('studio-iframe').src = link;
  document.getElementById('studio-viewer').classList.remove('hidden');
}

function closeStudioViewer() {
  document.getElementById('studio-iframe').src = '';
  document.getElementById('studio-viewer').classList.add('hidden');
}

function openStudioInNewTab() {
  if (currentStudioUrl) {
    window.open(currentStudioUrl, '_blank');
  }
}

// 4. Edit Profile Modal
const AVAILABLE_AVATARS = ["👧", "👩‍🔬", "🧑‍🎓", "🚀", "🎨", "🦁", "🌟", "⚡", "🐱", "🦄", "👑", "⚽"];
let selectedModalAvatar = "👧";

function openEditProfileModal(profileId) {
  editingProfileId = profileId;
  const p = appProfiles.find(x => x.id === profileId);
  if (!p) return;

  selectedModalAvatar = p.avatar;
  document.getElementById('edit-profile-name').value = p.name;
  document.getElementById('edit-profile-grade').value = p.grade;

  const grid = document.getElementById('avatar-options-grid');
  grid.innerHTML = '';
  AVAILABLE_AVATARS.forEach(av => {
    const btn = document.createElement('button');
    btn.className = `avatar-option-btn ${av === selectedModalAvatar ? 'selected' : ''}`;
    btn.textContent = av;
    btn.onclick = () => {
      document.querySelectorAll('.avatar-option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedModalAvatar = av;
    };
    grid.appendChild(btn);
  });

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
    p.avatar = selectedModalAvatar;

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

// Run on load
window.addEventListener('DOMContentLoaded', init);
