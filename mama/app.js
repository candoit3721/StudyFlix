/**
 * Mama's Specialty Coffee Masterclass Studio Logic
 */

// =============================================================================
// 1. State Management & Constants
// =============================================================================
const BADGES = [
  { id: 'first_sip', name: 'First Sip', icon: '☕', desc: 'Began the Specialty Coffee Journey' },
  { id: 'origin_explorer', name: 'Origin Explorer', icon: '🌍', desc: 'Mastered the 3 Global Terroirs' },
  { id: 'bean_botanist', name: 'Bean Botanist', icon: '🌿', desc: 'Explored Arabica Varietals & Anatomy' },
  { id: 'roast_artisan', name: 'Roast Artisan', icon: '🔥', desc: 'Navigated the Roast Spectrum' },
  { id: 'flavour_sommelier', name: 'Flavour Sommelier', icon: '🎨', desc: 'Explored the SCA Flavour Wheel' },
  { id: 'golden_ratio', name: 'Golden Brewer', icon: '⚖️', desc: 'Calculated a Mama Matchmaker Recipe' },
  { id: 'cupping_master', name: 'Cupping Ace', icon: '👃', desc: 'Scored 50+ XP in the Tasting Quiz' },
  { id: 'grand_connoisseur', name: 'Grand Connoisseur', icon: '👑', desc: 'Earned 200+ Coffee XP' }
];

const MAP_ORIGINS_DATA = {
  ethiopia: {
    lat: 9.02,
    lng: 38.74,
    region: "africa",
    flag: "🇪🇹",
    title: "Ethiopia • Yirgacheffe & Guji (埃塞俄比亚 • 耶加雪菲)",
    sub: "The Ancestral Homeland of Arabica • Great Rift Valley Highlands",
    alt: "1,800m - 2,200m (High Mountain)",
    var: "Indigenous Heirloom (原生树种)",
    proc: "Washed (Floral Tea) & Natural (Berry Jam)",
    harvest: "October - January",
    tags: ["Jasmine Blossom", "Bergamot Citrus", "White Peach", "Earl Grey Tea"],
    story: "Grown under the natural forest canopy in high-altitude volcanic soils, Ethiopian coffees are celebrated as the 'Champagne of Coffee'. Washed Yirgacheffe delivers crisp, tea-like jasmine and citrus elegance, while natural Guji explodes with sun-drenched blueberries and floral honey!",
    flavourMatch: "floral",
    acidMatch: "high"
  },
  kenya: {
    lat: -0.42,
    lng: 36.95,
    region: "africa",
    flag: "🇰🇪",
    title: "Kenya • Mount Kenya & Nyeri (肯尼亚 • 涅里 AA)",
    sub: "Phosphoric Red Volcanic Loam • Scott Laboratories Royalty",
    alt: "1,700m - 2,100m",
    var: "SL-28, SL-34, Ruiru 11, Batian",
    proc: "Double Washed (Kenya 72h Fermentation)",
    harvest: "November - January (Main Crop)",
    tags: ["Blackcurrant", "Ruby Grapefruit", "Blackberry", "Tomato Jam Sweetness"],
    story: "Kenya coffees are revered for their complex phosphoric acidity and mouthwatering blackcurrant fruit punch. The double-washed fermentation with mountain spring water leaves an intensely vibrant, clean, and juicy cup.",
    flavourMatch: "fruity",
    acidMatch: "high"
  },
  yemen: {
    lat: 15.35,
    lng: 44.20,
    region: "africa",
    flag: "🇾🇪",
    title: "Yemen • Port of Al-Makha & Haraz (也门 • 摩卡港古树)",
    sub: "Ancient Terraced Dry Mountains • 15th Century Sufi Heritage",
    alt: "1,900m - 2,400m",
    var: "Ancient Heirloom (Udaini, Dawairi)",
    proc: "Traditional Dry Natural (Rooftop Sun-Dried)",
    harvest: "October - December",
    tags: ["Baker's Cacao", "Dried Fig", "Cardamom & Cinnamon", "Winey Depth"],
    story: "Perched on ancient stone mountain terraces, Yemen's ancient wild coffee trees are harvested by hand and dried on stone rooftops. Produces an exotic, deeply complex cup with notes of rich dark chocolate, dried fruit, and oriental spices.",
    flavourMatch: "spicy",
    acidMatch: "low"
  },
  panama: {
    lat: 8.78,
    lng: -82.43,
    region: "americas",
    flag: "🇵🇦",
    title: "Panama • Boquete & Volcán Barú (巴拿马 • 翡翠瑰夏)",
    sub: "Volcanic Cloud Forest • The Microclimate Miracle",
    alt: "1,600m - 1,950m",
    var: "Geisha / Gesha, Typica, Catuai",
    proc: "Washed & Anaerobic Slow Dry",
    harvest: "December - March",
    tags: ["White Jasmine", "Bergamot", "Meyer Lemon", "Orange Blossom Honey"],
    story: "Grown along the slopes of Volcán Barú where Pacific and Caribbean winds converge in gentle mists ('Bajareque'). Panama Geisha is the most decorated coffee in world auctions, offering an intoxicating perfume of white blossoms and silky bergamot.",
    flavourMatch: "floral",
    acidMatch: "high"
  },
  colombia: {
    lat: 2.92,
    lng: -75.28,
    region: "americas",
    flag: "🇨🇴",
    title: "Colombia • Huila & Nariño (哥伦比亚 • 慧兰/娜玲珑)",
    sub: "Andes Cordillera Mountain Terroir • Year-Round Fresh Harvests",
    alt: "1,500m - 2,000m",
    var: "Castillo, Caturra, Colombia, Pink Bourbon",
    proc: "Washed & Extended Fermentation",
    harvest: "April - June & October - December",
    tags: ["Milk Chocolate", "Crisp Red Apple", "Caramel Sugar", "Silky Butter Body"],
    story: "Nurtured across the high Andes Cordillera, Colombia produces the world's most balanced and comforting cups. Expect harmonious sweetness, red apple brightness, and a velvety milk chocolate body.",
    flavourMatch: "nutty",
    acidMatch: "medium"
  },
  guatemala: {
    lat: 14.56,
    lng: -90.73,
    region: "americas",
    flag: "🇬🇹",
    title: "Guatemala • Antigua & Huehuetenango (危地马拉 • 安提瓜)",
    sub: "Three Surrounding Volcanoes (Agua, Fuego, Acatenango)",
    alt: "1,500m - 1,800m",
    var: "Bourbon, Caturra, Typica",
    proc: "Washed",
    harvest: "January - April",
    tags: ["Dark Chocolate", "Roasted Hazelnut", "Subtle Smoky Cacao", "Orange Zest"],
    story: "Rich volcanic ash soils around Antigua retain natural moisture, infusing beans with deep baker's cocoa, sweet roasted hazelnut, and delicate warm spice.",
    flavourMatch: "nutty",
    acidMatch: "medium"
  },
  costarica: {
    lat: 9.66,
    lng: -84.02,
    region: "americas",
    flag: "🇨🇷",
    title: "Costa Rica • Tarrazú & Canet (哥斯达黎加 • 塔拉珠)",
    sub: "Pioneers of Micro-Mill Honey Processing & Musician Series",
    alt: "1,400m - 1,900m",
    var: "Catuai, Caturra, Villa Sarchi",
    proc: "Yellow / Red / Black Honey & Anaerobic",
    harvest: "December - March",
    tags: ["Apricot Jam", "Wild Honey", "Raisin Sweetness", "Rose Perfume"],
    story: "Costa Rica's artisan micro-mills perfected Honey processing (leaving sweet fruit mucilage during drying) and anaerobic fermentation (Musician series like Mozart & Beethoven), producing fragrant floral and dried apricot notes.",
    flavourMatch: "fruity",
    acidMatch: "medium"
  },
  brazil: {
    lat: -18.91,
    lng: -48.27,
    region: "americas",
    flag: "🇧🇷",
    title: "Brazil • Cerrado Mineiro & Sul de Minas (巴西 • 喜拉多)",
    sub: "Sun-Drenched Plateaus • The Global Specialty Powerhouse",
    alt: "1,000m - 1,300m",
    var: "Yellow Bourbon, Mundo Novo, Catuai",
    proc: "Natural (Dry) & Pulped Natural",
    harvest: "May - August",
    tags: ["Roasted Peanut / Pecan", "Creamy Milk Chocolate", "Brown Sugar", "Low Acidity"],
    story: "The quintessential morning comfort coffee! Brazilian Naturals feature heavy crema, buttery chocolate sweetness, roasted nut aromas, and almost zero acidity.",
    flavourMatch: "nutty",
    acidMatch: "low"
  },
  indonesia: {
    lat: 2.68,
    lng: 98.88,
    region: "asia",
    flag: "🇮🇩",
    title: "Indonesia • Sumatra Lake Toba & Gayo (印尼 • 曼特宁)",
    sub: "Ancient Volcanic Lake Toba • Traditional Wet-Hulled Process",
    alt: "1,200m - 1,600m",
    var: "Typica, Ateng, Tim Tim (Gayo 1)",
    proc: "Wet-Hulled (Giling Basah)",
    harvest: "October - December & March - May",
    tags: ["Cedarwood", "Dark Cocoa", "Clove & Cardamom", "Syrupy Heavy Body"],
    story: "The unique Indonesian 'Giling Basah' wet-hulling technique strips the parchment hull at 50% moisture, creating intense forest cedar, dark baker's chocolate, and a lush velvety body that cuts wonderfully through milk.",
    flavourMatch: "spicy",
    acidMatch: "low"
  },
  yunnan: {
    lat: 25.11,
    lng: 99.16,
    region: "asia",
    flag: "🇨🇳",
    title: "China • Yunnan Baoshan & Pu'er (中国 • 云南保山/普洱)",
    sub: "Gaoligong Mountain Range & Ancient Tea Terraces",
    alt: "1,200m - 1,650m",
    var: "Catimor, Typica, Bourbon",
    proc: "Double Washed, Natural & Pu'er Tea Anaerobic",
    harvest: "November - March",
    tags: ["Black Tea", "Dried Plum", "Brown Sugar", "Nutty Cocoa Finish"],
    story: "Grown alongside ancient tea trees in Yunnan's misty mountain valleys. Yunnan specialty lots showcase delightful black tea aromas, sweet dried red plum, and comforting brown sugar cane sweetness.",
    flavourMatch: "nutty",
    acidMatch: "medium"
  },
  hawaii: {
    lat: 19.53,
    lng: -155.92,
    region: "asia",
    flag: "🇺🇸",
    title: "Hawaii, USA • Kona Coast (美国夏威夷 • 科纳)",
    sub: "Mauna Loa Volcanic Slopes • Sunny Mornings & Afternoon Cloud Cover",
    alt: "600m - 900m",
    var: "Kona Typica (Guatemalan Ancestor)",
    proc: "Washed",
    harvest: "August - January",
    tags: ["Buttery Caramel", "Macadamia Nut", "Sweet Brown Sugar", "Gentle Floral"],
    story: "Benefiting from rich volcanic soil and Hawaii's natural afternoon cloud cover ('free shade'), pure 100% Kona coffee offers a remarkably clean, buttery mouthfeel with sweet macadamia nut nuances.",
    flavourMatch: "nutty",
    acidMatch: "medium"
  },
  jamaica: {
    lat: 18.04,
    lng: -76.65,
    region: "americas",
    flag: "🇯🇲",
    title: "Jamaica • Blue Mountain (牙买加 • 蓝山)",
    sub: "Misty Blue Mountain Peak • Traditional Wooden Barrel Export",
    alt: "1,000m - 1,700m",
    var: "Typica",
    proc: "Washed",
    harvest: "January - May",
    tags: ["Sweet Floral", "Mild Cocoa", "Smooth Hazelnut", "Zero Bitterness"],
    story: "Grown in the cool Caribbean mountain mist, Jamaica Blue Mountain is famous for its gentle mildness, silk-smooth mouthfeel, and complete lack of bitterness.",
    flavourMatch: "nutty",
    acidMatch: "low"
  }
};

let currentSelectedOriginId = "ethiopia";

const FLAVOUR_CATEGORIES = {
  floral: {
    title: "🌸 Floral Notes (优雅花香家族)",
    desc: "The hallmark of high-altitude Ethiopian and Panamanian Geisha coffees. Highly volatile, delicate aromatic compounds reminiscent of fresh blossoms.",
    tags: ["Jasmine (茉莉花)", "Bergamot (佛手柑)", "Orange Blossom (橙花)", "Rose Water (玫瑰露)", "Earl Grey Tea (伯爵茶香)", "Elderflower (接骨木花)"]
  },
  fruity: {
    title: "🍓 Fruity Notes (活泼水果与浆果)",
    desc: "Vibrant organic acids (citric, malic, phosphoric) and natural berry esters created in high-altitude volcanic loam and natural fermentations.",
    tags: ["Strawberry (草莓)", "Blueberry (蓝莓)", "White Peach (水蜜桃)", "Blackcurrant (黑加仑)", "Meyer Lemon (黄柠檬)", "Passionfruit (百香果)", "Red Cherry (红樱桃)"]
  },
  sweet: {
    title: "🍯 Sweet & Caramel Notes (焦糖与蜂蜜甜感)",
    desc: "Sucrose and fructose caramelized during the drying and roasting process. The sign of fully ripe, hand-selected harvest.",
    tags: ["Wildflower Honey (野花蜜)", "Cane Sugar (甘蔗甜)", "Caramel (奶油焦糖)", "Maple Syrup (枫糖浆)", "Brown Sugar (红糖蜜)", "Toffee (太妃糖)"]
  },
  nutty: {
    title: "🍫 Nutty & Cocoa Notes (坚果与浓醇可可)",
    desc: "Rich comforting baseline found across Central and South American classics. Low acidity and wonderful silky mouthfeel.",
    tags: ["Milk Chocolate (牛奶黑巧)", "Roasted Almond (烤扁桃仁)", "Hazelnut (榛子酱)", "Pecan (碧根果)", "Baker's Cocoa (纯可可脂)", "Walnut (胡桃)"]
  },
  spices: {
    title: "🌿 Spices & Herbal Notes (香料与草本韵味)",
    desc: "Complex secondary aromatics characteristic of Indo-Pacific wet-hulled Mandheling, aged coffees, and unique barrel-aged lots.",
    tags: ["Cinnamon (肉桂甜香)", "Cedarwood (雪松木香)", "Cardamom (豆蔻)", "Herbal Tea (草本)", "Dark Clove (丁香)", "Pipe Tobacco (烟草韵)"]
  }
};

const CHERRY_LAYERS = {
  exocarp: {
    title: "1. Outer Skin (Exocarp / Epicarp 果皮)",
    desc: "The protective taut outer skin of the coffee cherry. Changes from emerald green to brilliant crimson or golden-yellow when fully ripe."
  },
  mesocarp: {
    title: "2. Sweet Pulp (Mesocarp 果肉)",
    desc: "The sweet, juicy, high-sugar fruit flesh surrounding the bean. In natural processing, this pulp is dried directly on the bean to infuse deep berry sweetness."
  },
  mucilage: {
    title: "3. Sticky Mucilage (果胶层)",
    desc: "A nutrient-rich, sticky layer packed with complex sugars and pectins. Key to honey processing (Yellow, Red, and Black Honey) where it ferments in the sun."
  },
  endocarp: {
    title: "4. Parchment (Endocarp 羊皮纸)",
    desc: "A hard, protective hull that shields the green coffee bean during drying and resting in resting warehouses (Reposado) before export."
  },
  silverskin: {
    title: "5. Silver Skin (银皮 - 种皮)",
    desc: "A delicate, gossamer-thin membrane adhering directly to the green bean. During roasting, it dries and flakes off as coffee 'chaff'."
  },
  bean: {
    title: "6. Green Coffee Bean (咖啡生豆 - 胚乳)",
    desc: "The two twin flat seeds nestled at the core! Packed with chlorogenic acids, amino acids, and complex carbohydrates ready to blossom during roasting."
  }
};

const ROAST_PROFILES = {
  1: {
    name: "Light Roast (浅度烘焙 • City / Cinnamon)",
    temp: "195°C - 205°C (Just after First Crack)",
    title: "Light Roast (City) — 浅度烘焙",
    desc: "Roasted just after the 'First Crack' (一爆结束). Preserves the delicate terroir of the origin, floral jasmine, lemon brightness, and tea-like transparency. Zero bitterness!",
    acid: 92, sweet: 65, body: 40, bitter: 10,
    color: "#a47148"
  },
  2: {
    name: "Medium Roast (中度烘焙 • City+ / Full City)",
    temp: "210°C - 218°C (Peak Caramelization)",
    title: "Medium Roast (City+) — 中度烘焙",
    desc: "The sweet spot of balance! Acidity softens into ripe fruit and milk chocolate sweetness. Caramelization peaks, delivering a velvety, rounded body.",
    acid: 60, sweet: 92, body: 75, bitter: 25,
    color: "#6f432a"
  },
  3: {
    name: "Medium-Dark Roast (中深烘焙 • Full City+)",
    temp: "220°C - 228°C (Start of Second Crack)",
    title: "Medium-Dark (Full City+) — 中深烘焙",
    desc: "Roast starts to whisper the 'Second Crack' (二爆初起). Subtle oils emerge on the surface. Notes of dark chocolate, toasted hazelnut, and brown sugar dominate.",
    acid: 30, sweet: 70, body: 90, bitter: 50,
    color: "#4a2818"
  },
  4: {
    name: "Dark Roast (深度烘焙 • French / Italian)",
    temp: "230°C - 240°C (Heavy Carbonization)",
    title: "Dark Roast (French) — 深度烘焙",
    desc: "Beans are glistening with aromatic oils. Origin notes surrender to bold roasted smoky dark chocolate, baker's cacao, and heavy crema body. Perfect for rich milk lattes!",
    acid: 10, sweet: 40, body: 85, bitter: 85,
    color: "#2a150c"
  }
};

const QUIZ_QUESTIONS = [
  {
    q: "Which East African country is revered as the birthplace of coffee and famous for wild floral heirloom varietals?",
    options: ["Ethiopia (埃塞俄比亚)", "Brazil (巴西)", "Vietnam (越南)", "Italy (意大利)"],
    ans: 0,
    exp: "Ethiopia is the ancestral birthplace of Arabica coffee, renowned worldwide for its heirloom varietals and floral jasmine notes."
  },
  {
    q: "Why do coffee cherries grown at high elevations (1,500m+) taste naturally sweeter and more complex?",
    options: [
      "They are closer to the sun",
      "Cool mountain nights slow cherry maturation, concentrating fruit sugars and delicate floral acids",
      "They absorb mountain rain faster",
      "High elevation eliminates all caffeine"
    ],
    ans: 1,
    exp: "Cooler high-altitude nights slow the cherry's growth cycle, giving the tree more time to pack sugars and complex aromatics into the bean."
  },
  {
    q: "How many chromosomes does Arabica coffee possess compared to Robusta?",
    options: ["Arabica has 44 chromosomes; Robusta has 22", "Both have 12 chromosomes", "Robusta has double the chromosomes of Arabica", "Coffee beans have no chromosomes"],
    ans: 0,
    exp: "Arabica has 44 chromosomes (tetraploid), giving it nuanced aromatic complexity and natural sweetness, while Robusta has 22 (diploid)."
  },
  {
    q: "Which green bean processing method dries the whole intact cherry under the sun to infuse deep strawberry and blueberry sweetness?",
    options: ["Washed / Wet Process (水洗法)", "Natural / Dry Process (日晒处理法)", "Decaffeination (脱因处理)", "Steam Washing"],
    ans: 1,
    exp: "The Natural (Dry) process allows the seed to ferment slowly inside the sweet fruit pulp under the sun, infusing intense berry jam notes."
  },
  {
    q: "Which ultra-prized Arabica varietal is world-renowned for its bergamot citrus and white jasmine blossom tea aroma?",
    options: ["Geisha / Gesha (瑰夏)", "Robusta Canephora", "Catimor", "Liberica"],
    ans: 0,
    exp: "Panama Geisha is the crowning jewel of specialty coffee, celebrated for its jasmine floral and bergamot citrus elegance."
  },
  {
    q: "In specialty coffee tasting, what does 'Acidity' actually refer to?",
    options: [
      "Sourness like spoiled milk",
      "Crisp, sparkling brightness (like crisp green apples or citrus) that makes the cup lively and sweet",
      "Stomach irritation from dark roasts",
      "The amount of sugar in the milk"
    ],
    ans: 1,
    exp: "Specialty acidity is pleasant fruit brightness (malic, citric, tartaric) that balances sweetness and gives coffee its refreshing, fruit-like vibrancy."
  },
  {
    q: "What is the golden water-to-coffee brewing ratio recommended by SCA for hand-pour drip (V60)?",
    options: ["1:5 (Very strong)", "1:15 to 1:16 (15g coffee to 225-240g water)", "1:30 (Very watery)", "1:1 (Equal parts)"],
    ans: 1,
    exp: "The golden pour-over ratio is 1:15 to 1:16 (e.g. 15g coffee to 240mL water) for ideal extraction clarity and balance."
  },
  {
    q: "What is the optimal water temperature for brewing delicate light-to-medium roasted specialty beans?",
    options: ["Boiling at 100°C (Scorches florals)", "90°C - 93°C (194°F - 200°F)", "Warm at 60°C", "Freezing at 0°C"],
    ans: 1,
    exp: "Water between 90°C and 93°C extracts sweet carbohydrates and delicate aroma oils without scorching or extracting harsh bitter tannins."
  }
];

// App State
let state = {
  xp: parseInt(localStorage.getItem('mama_coffee_xp') || '0', 10),
  badges: JSON.parse(localStorage.getItem('mama_coffee_badges') || '["first_sip"]'),
  soundEnabled: true,
  currentQuizIndex: 0,
  matchmaker: {
    flavour: 'floral',
    acid: 'high',
    method: 'pourover'
  }
};

// =============================================================================
// 2. Web Audio Sound Synthesizer
// =============================================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'chime') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'triumph') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.6);
      });
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    console.warn("Audio Context init deferred", e);
  }
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  document.getElementById('sound-toggle-btn').textContent = state.soundEnabled ? '🔊' : '🔇';
}

// =============================================================================
// 3. UI Navigation & Stats
// =============================================================================
let leafletMap = null;
let leafletMarkers = {};
let currentMapView = 'leaflet';

function init() {
  updateUIStats();
  setupNavTabs();
  initLeafletMap();
  selectMapOrigin('ethiopia');
  filterFlavourCategory('floral');
  updateRoastSimulator(1);
  calculateMamaMatch();
  renderQuizQuestion();
  renderTrophies();
  handleHashNavigation();

  awardBadge('first_sip');
}

function updateUIStats() {
  document.getElementById('xp-count').textContent = state.xp;
  document.getElementById('badge-count').textContent = `${state.badges.length}/${BADGES.length}`;

  localStorage.setItem('mama_coffee_xp', state.xp);
  localStorage.setItem('mama_coffee_badges', JSON.stringify(state.badges));
}

function addXP(amount) {
  state.xp += amount;
  updateUIStats();
  if (state.xp >= 50) awardBadge('cupping_master');
  if (state.xp >= 200) awardBadge('grand_connoisseur');
}

function awardBadge(badgeId) {
  if (!state.badges.includes(badgeId)) {
    state.badges.push(badgeId);
    updateUIStats();
    renderTrophies();
    playSound('triumph');
    launchConfetti();
  }
}

function setupNavTabs() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      switchTab(tabId);
      if (tabId === 'tab-origins' && leafletMap) {
        setTimeout(() => leafletMap.invalidateSize(), 200);
      }
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  const activeTabBtn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
  const activeContent = document.getElementById(tabId);

  if (activeTabBtn) activeTabBtn.classList.add('active');
  if (activeContent) activeContent.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleHashNavigation() {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    switchTab(hash);
  }
}
window.addEventListener('hashchange', handleHashNavigation);

// =============================================================================
// Map Functions: Leaflet Real-World Map Engine & Origin Selection
// =============================================================================
function initLeafletMap() {
  const mapContainer = document.getElementById('coffee-leaflet-map');
  if (!mapContainer || typeof L === 'undefined') return;

  try {
    // 1. Initialize Leaflet Map Centered on Coffee Belt
    leafletMap = L.map('coffee-leaflet-map', {
      center: [12, 10],
      zoom: 2.3,
      minZoom: 2,
      maxZoom: 9,
      zoomControl: true,
      attributionControl: false
    });

    // 2. Add CartoDB Dark Matter / Luxury Cafe Base Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(leafletMap);

    // 3. Highlight The Coffee Belt (25°N to 25°S Translucent Golden Ribbon)
    const beltBounds = [[25, -180], [-25, 180]];
    L.rectangle(beltBounds, {
      color: '#e5a93c',
      weight: 1.5,
      dashArray: '6, 6',
      fillColor: '#e5a93c',
      fillOpacity: 0.12
    }).addTo(leafletMap);

    // 4. Add Interactive Custom Gold Coffee Markers for each Origin
    Object.entries(MAP_ORIGINS_DATA).forEach(([id, data]) => {
      const customIcon = L.divIcon({
        className: 'custom-coffee-pin',
        html: `
          <div class="marker-pin-wrapper" id="marker-${id}">
            <div class="marker-flag-badge">
              <span>${data.flag}</span> <span>${data.title.split(' ')[0]}</span>
            </div>
            <div class="marker-dot-core"></div>
          </div>
        `,
        iconSize: [80, 40],
        iconAnchor: [40, 36]
      });

      const marker = L.marker([data.lat, data.lng], { icon: customIcon }).addTo(leafletMap);
      
      // Popup
      marker.bindPopup(`
        <div class="popup-coffee-card">
          <h5>${data.flag} ${data.title}</h5>
          <p>${data.alt} &bull; ${data.var}</p>
          <button class="popup-btn" onclick="selectMapOrigin('${id}')">Inspect Terroir 🔍</button>
        </div>
      `);

      marker.on('click', () => {
        selectMapOrigin(id, true);
      });

      leafletMarkers[id] = marker;
    });

  } catch (err) {
    console.warn("Leaflet Map init fallback to SVG:", err);
    switchMapView('svg');
  }
}

function switchMapView(mode) {
  currentMapView = mode;
  const leafletWrap = document.getElementById('coffee-leaflet-wrapper');
  const svgWrap = document.getElementById('coffee-svg-wrapper');
  const btnLeaflet = document.getElementById('btn-view-leaflet');
  const btnSvg = document.getElementById('btn-view-svg');

  if (mode === 'leaflet') {
    if (leafletWrap) leafletWrap.classList.remove('hidden');
    if (svgWrap) svgWrap.classList.add('hidden');
    if (btnLeaflet) btnLeaflet.classList.add('active');
    if (btnSvg) btnSvg.classList.remove('active');
    if (leafletMap) setTimeout(() => leafletMap.invalidateSize(), 150);
  } else {
    if (leafletWrap) leafletWrap.classList.add('hidden');
    if (svgWrap) svgWrap.classList.remove('hidden');
    if (btnLeaflet) btnLeaflet.classList.remove('active');
    if (btnSvg) btnSvg.classList.add('active');
  }
}

function selectMapOrigin(originId, skipFly) {
  const origin = MAP_ORIGINS_DATA[originId];
  if (!origin) return;
  currentSelectedOriginId = originId;

  // 1. Highlight SVG Pins
  document.querySelectorAll('.map-pin-item').forEach(p => p.classList.remove('active'));
  const svgPin = document.querySelector(`.map-pin-item[data-id="${originId}"]`);
  if (svgPin) svgPin.classList.add('active');

  // 2. Highlight Leaflet Markers
  document.querySelectorAll('.marker-pin-wrapper').forEach(m => m.classList.remove('active'));
  const markerEl = document.getElementById(`marker-${originId}`);
  if (markerEl) markerEl.classList.add('active');

  // 3. Highlight Quick Carousel Chip
  document.querySelectorAll('.quick-origin-chip').forEach(c => c.classList.remove('active'));
  const chip = document.querySelector(`.quick-origin-chip[data-id="${originId}"]`);
  if (chip) {
    chip.classList.add('active');
    chip.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
  }

  // 4. Smooth Map FlyTo (if leaflet is active and not already centered)
  if (leafletMap && !skipFly && currentMapView === 'leaflet') {
    leafletMap.flyTo([origin.lat, origin.lng], 4.5, { duration: 1.2 });
  }

  // 5. Update Spotlight UI Card
  const flagElem = document.getElementById('spotlight-flag');
  const titleElem = document.getElementById('spotlight-title');
  const subElem = document.getElementById('spotlight-sub');
  const altElem = document.getElementById('spotlight-alt');
  const varElem = document.getElementById('spotlight-var');
  const procElem = document.getElementById('spotlight-proc');
  const harvestElem = document.getElementById('spotlight-harvest');
  const storyElem = document.getElementById('spotlight-story');

  if (flagElem) flagElem.textContent = origin.flag;
  if (titleElem) titleElem.textContent = origin.title;
  if (subElem) subElem.textContent = origin.sub;
  if (altElem) altElem.textContent = origin.alt;
  if (varElem) varElem.textContent = origin.var;
  if (procElem) procElem.textContent = origin.proc;
  if (harvestElem) harvestElem.textContent = origin.harvest;
  if (storyElem) storyElem.textContent = origin.story;

  const tagsContainer = document.getElementById('spotlight-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    origin.tags.forEach(t => {
      const span = document.createElement('span');
      span.textContent = t;
      tagsContainer.appendChild(span);
    });
  }

  playSound('chime');
  awardBadge('origin_explorer');
}

function filterMapRegion(region) {
  document.querySelectorAll('.map-pill').forEach(p => p.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-reg-${region}`) || event.target;
  if (activeBtn) activeBtn.classList.add('active');

  // Filter SVG Pins
  const svgPins = document.querySelectorAll('.map-pin-item');
  svgPins.forEach(pin => {
    const pinId = pin.getAttribute('data-id');
    const data = MAP_ORIGINS_DATA[pinId];
    if (region === 'all' || (data && data.region === region)) {
      pin.classList.remove('hidden-region');
    } else {
      pin.classList.add('hidden-region');
    }
  });

  // Filter Leaflet Markers & Zoom
  if (leafletMap) {
    if (region === 'all') {
      leafletMap.flyTo([12, 10], 2.3, { duration: 1.2 });
    } else if (region === 'africa') {
      leafletMap.flyTo([6, 38], 4.2, { duration: 1.2 });
    } else if (region === 'americas') {
      leafletMap.flyTo([4, -75], 3.8, { duration: 1.2 });
    } else if (region === 'asia') {
      leafletMap.flyTo([10, 105], 3.8, { duration: 1.2 });
    }
  }

  // Select first visible origin in this region
  for (const [id, d] of Object.entries(MAP_ORIGINS_DATA)) {
    if (region === 'all' || d.region === region) {
      selectMapOrigin(id, true);
      break;
    }
  }

  playSound('click');
}

function brewSpotlightOrigin() {
  const origin = MAP_ORIGINS_DATA[currentSelectedOriginId] || MAP_ORIGINS_DATA.ethiopia;
  
  // Switch to Matchmaker Tab
  switchTab('tab-matchmaker');

  // Set flavor and acidity
  state.matchmaker.flavour = origin.flavourMatch || 'floral';
  state.matchmaker.acid = origin.acidMatch || 'high';

  // Highlight UI Buttons in Matchmaker
  document.querySelectorAll('.choice-btn[data-type="flavour"]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-val') === state.matchmaker.flavour);
  });
  document.querySelectorAll('.choice-btn[data-type="acid"]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-val') === state.matchmaker.acid);
  });

  calculateMamaMatch();
  playSound('triumph');
}

// =============================================================================
// 4. Interactive Tools: Anatomy, Flavour Wheel & Roast
// =============================================================================
function showLayerInfo(layerKey) {
  document.querySelectorAll('.layer-pill').forEach(p => p.classList.remove('active'));
  event.target.classList.add('active');

  const layer = CHERRY_LAYERS[layerKey] || CHERRY_LAYERS.bean;
  document.getElementById('layer-title').textContent = layer.title;
  document.getElementById('layer-desc').textContent = layer.desc;
  playSound('click');
}

function updateRoastSimulator(val) {
  const profile = ROAST_PROFILES[val] || ROAST_PROFILES[1];
  document.getElementById('roast-name-display').textContent = profile.name;
  document.getElementById('roast-temp-display').textContent = profile.temp;
  document.getElementById('roast-title-desc').textContent = profile.title;
  document.getElementById('roast-text-desc').textContent = profile.desc;

  document.getElementById('meter-acid').style.width = `${profile.acid}%`;
  document.getElementById('meter-sweet').style.width = `${profile.sweet}%`;
  document.getElementById('meter-body').style.width = `${profile.body}%`;
  document.getElementById('meter-bitter').style.width = `${profile.bitter}%`;

  const bean = document.getElementById('roast-bean-preview');
  bean.style.color = profile.color;

  awardBadge('roast_artisan');
}

function filterFlavourCategory(catKey) {
  document.querySelectorAll('.wheel-btn').forEach(btn => btn.classList.remove('active'));
  if (event && event.target && event.target.classList) {
    event.target.classList.add('active');
  }

  const cat = FLAVOUR_CATEGORIES[catKey] || FLAVOUR_CATEGORIES.floral;
  document.getElementById('flavour-group-title').textContent = cat.title;
  document.getElementById('flavour-group-desc').textContent = cat.desc;

  const container = document.getElementById('flavour-tags-cloud');
  container.innerHTML = '';
  cat.tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'flavour-tag-item';
    span.textContent = t;
    container.appendChild(span);
  });

  awardBadge('flavour_sommelier');
}

function filterOriginStory(region) {
  awardBadge('origin_explorer');
  playSound('chime');
}

// =============================================================================
// 5. Mama's Coffee Matchmaker
// =============================================================================
function selectMatchmakerChoice(btn) {
  const type = btn.getAttribute('data-type');
  const val = btn.getAttribute('data-val');

  btn.parentElement.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  state.matchmaker[type] = val;
  playSound('click');
}

function calculateMamaMatch() {
  const { flavour, acid, method } = state.matchmaker;

  let title = "Ethiopia Yirgacheffe G1 Washed (埃塞俄比亚 • 耶加雪菲)";
  let sub = "Kochere Washing Station • Heirloom Varietals • 1,900m - 2,100m";
  let tags = ["🌸 Jasmine Blossom", "🍋 Bergamot Citrus", "🍑 White Peach", "🍵 Earl Grey Tea Finish"];
  let dose = "15 g";
  let water = "240 mL (1:16 Ratio)";
  let temp = "92°C (198°F)";
  let grind = "Medium-Fine (如海盐粗细)";
  let time = "2m 15s - 2m 30s";
  let bloom = "45g water for 35 seconds";

  if (flavour === 'fruity') {
    title = "Ethiopia Guji Hambela Natural (埃塞俄比亚 • 古吉日晒)";
    sub = "Dimtu Washing Station • Heirloom • 2,000m - 2,200m";
    tags = ["🍓 Ripe Strawberry", "🫐 Wild Blueberry", "🍷 Red Winey Body", "🍯 Floral Honey"];
    temp = "91°C (196°F)";
    time = "2m 20s";
  } else if (flavour === 'nutty' || acid === 'low') {
    title = "Colombia Huila San Agustin Washed (哥伦比亚 • 慧兰)";
    sub = "Caturra & Castillo Varietals • 1,600m - 1,850m";
    tags = ["🍫 Milk Chocolate", "🌰 Roasted Hazelnut", "🍎 Red Apple Sweetness", "🧈 Creamy Body"];
    temp = "90°C (194°F)";
    water = "225 mL (1:15 Ratio)";
  } else if (flavour === 'spicy') {
    title = "Sumatra Mandheling Triple Picked (印尼 • 黄金曼特宁)";
    sub = "Gayo Mountain • Wet-Hulled (Giling Basah) • 1,400m";
    tags = ["🍫 Dark Baker's Cacao", "🌲 Cedarwood", "🌿 Herbal Spices", "🍯 Heavy Velvety Body"];
    temp = "88°C (190°F)";
    water = "225 mL (1:15 Ratio)";
    grind = "Medium (中度研磨)";
  }

  // Method Adjustments
  if (method === 'espresso') {
    dose = "18 g - 20 g";
    water = "36 g - 40 g (1:2 Espresso Ratio)";
    temp = "93°C (200°F)";
    grind = "Extra Fine (超细粉如细面粉)";
    time = "26s - 30s extraction";
    bloom = "Optional pre-infusion 4s";
  } else if (method === 'frenchpress') {
    dose = "20 g";
    water = "300 mL (1:15 Ratio)";
    grind = "Coarse (粗颗粒如粗海盐)";
    time = "4m 00s full immersion steep";
    bloom = "Stir crust at 3:30, plunge at 4:00";
  } else if (method === 'coldbrew') {
    dose = "60 g";
    water = "600 mL (1:10 Ratio)";
    temp = "Room Temp / Refrigerator Chilled";
    grind = "Extra Coarse (粗研磨)";
    time = "14 - 18 hours in fridge";
    bloom = "Steep in cold filtered water";
  }

  document.getElementById('rec-bean-title').textContent = title;
  document.getElementById('rec-bean-sub').textContent = sub;
  
  const tagsContainer = document.getElementById('rec-flavour-tags');
  tagsContainer.innerHTML = '';
  tags.forEach(t => {
    const span = document.createElement('span');
    span.textContent = t;
    tagsContainer.appendChild(span);
  });

  document.getElementById('rec-dose').textContent = dose;
  document.getElementById('rec-water').textContent = water;
  document.getElementById('rec-temp').textContent = temp;
  document.getElementById('rec-grind').textContent = grind;
  document.getElementById('rec-time').textContent = time;
  document.getElementById('rec-bloom').textContent = bloom;

  playSound('chime');
  awardBadge('golden_ratio');
}

// =============================================================================
// 6. Tasting Quiz & Trophies
// =============================================================================
function renderQuizQuestion() {
  const qData = QUIZ_QUESTIONS[state.currentQuizIndex];
  if (!qData) return;

  document.getElementById('quiz-q-num').textContent = `Question ${state.currentQuizIndex + 1} of ${QUIZ_QUESTIONS.length}`;
  document.getElementById('quiz-q-text').textContent = qData.q;
  document.getElementById('quiz-progress-fill').style.width = `${((state.currentQuizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`;

  const optionsList = document.getElementById('quiz-options-list');
  optionsList.innerHTML = '';

  document.getElementById('quiz-feedback-box').classList.add('hidden');

  qData.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(idx);
    optionsList.appendChild(btn);
  });
}

function handleAnswer(selectedIdx) {
  const qData = QUIZ_QUESTIONS[state.currentQuizIndex];
  const buttons = document.querySelectorAll('.quiz-opt-btn');

  buttons.forEach(b => b.disabled = true);

  const feedbackBox = document.getElementById('quiz-feedback-box');
  const feedbackMsg = document.getElementById('feedback-message');

  if (selectedIdx === qData.ans) {
    buttons[selectedIdx].classList.add('correct');
    feedbackMsg.innerHTML = `<strong>✨ Correct!</strong> ${qData.exp}`;
    playSound('chime');
    addXP(25);
  } else {
    buttons[selectedIdx].classList.add('wrong');
    buttons[qData.ans].classList.add('correct');
    feedbackMsg.innerHTML = `<strong>💡 Knowledge Note:</strong> ${qData.exp}`;
    playSound('click');
  }

  feedbackBox.classList.remove('hidden');
}

function nextQuestion() {
  if (state.currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
    state.currentQuizIndex++;
    renderQuizQuestion();
  } else {
    // Finished Quiz
    document.getElementById('quiz-card').innerHTML = `
      <div style="text-align:center; padding:30px 10px;">
        <div style="font-size:3.5rem; margin-bottom:10px;">☕👑</div>
        <h3 style="font-size:1.6rem; color:#ffd27d; margin-bottom:8px;">Bravo, Mama! Tasting Masterclass Completed!</h3>
        <p style="color:#d1c5b8; font-size:0.95rem; margin-bottom:20px;">You have mastered single-origin terroirs, Arabica genetics, roasting curves, and golden brew ratios.</p>
        <button class="btn btn-primary" onclick="restartQuiz()">🔄 Retake Quiz</button>
      </div>
    `;
    playSound('triumph');
    launchConfetti();
    awardBadge('cupping_master');
  }
}

function restartQuiz() {
  state.currentQuizIndex = 0;
  location.reload();
}

function renderTrophies() {
  const container = document.getElementById('trophies-grid');
  if (!container) return;
  container.innerHTML = '';

  BADGES.forEach(b => {
    const isUnlocked = state.badges.includes(b.id);
    const card = document.createElement('div');
    card.className = `trophy-badge-card ${isUnlocked ? 'unlocked' : ''}`;
    card.innerHTML = `
      <div class="trophy-icon">${b.icon}</div>
      <div class="trophy-name">${b.name}</div>
    `;
    card.title = `${b.name}: ${b.desc}`;
    container.appendChild(card);
  });
}

// =============================================================================
// 7. Confetti Particles
// =============================================================================
let confettiParticles = [];
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  confettiParticles = [];
  const colors = ['#e5a93c', '#ffd27d', '#b45309', '#f5eee6', '#3e6b52', '#c84b31'];

  for (let i = 0; i < 80; i++) {
    confettiParticles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 100,
      rot: Math.random() * 360
    });
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.life--;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    confettiParticles = confettiParticles.filter(p => p.life > 0);
    if (confettiParticles.length > 0) {
      requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  renderConfetti();
}

// Run on load
window.addEventListener('DOMContentLoaded', init);
