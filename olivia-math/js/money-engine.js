/**
 * Olivia's Money & Coin Math Course Engine
 * ---------------------------------------------------------------------------
 * Canadian coins and bills, counting drills, purse building, making change,
 * money stories, fewest-coin contest logic and the printable money test.
 *
 * EVERY AMOUNT IN THIS FILE IS AN INTEGER NUMBER OF CENTS.
 *
 * That is not a style choice. Money in floating point is wrong by
 * construction: 0.1 + 0.2 is 0.30000000000000004, so a change drill built on
 * dollars would eventually mark a correct answer wrong, and a worksheet answer
 * key would eventually print an amount nobody can pay. Cents are integers, and
 * dollars only ever appear at the edge, in formatMoney().
 *
 * The arithmetic lives in the SFMoney namespace at the bottom, separately from
 * the DOM, so tests/olivia_money.spec.ts can exercise the real functions the
 * drills and the printed test use rather than a copy of them.
 */

// =========================================================================
// CANADIAN CURRENCY
// =========================================================================

/*
 * `mm` is the coin's true diameter, and the drawings use it.
 *
 * This is the single most counter-intuitive fact in Grade 3 money: the dime is
 * the SMALLEST coin in the set and worth twice the much larger nickel. Drawing
 * every coin at an arbitrary uniform size would quietly teach the opposite.
 */
const COINS = {
  nickel:  { cents: 5,   label: '5¢',  name: 'Nickel',  mm: 21.2,  metal: 'silver',  shape: 'round',      motif: 'Beaver' },
  dime:    { cents: 10,  label: '10¢', name: 'Dime',    mm: 18.03, metal: 'silver',  shape: 'round',      motif: 'Bluenose schooner' },
  quarter: { cents: 25,  label: '25¢', name: 'Quarter', mm: 23.88, metal: 'silver',  shape: 'round',      motif: 'Caribou' },
  loonie:  { cents: 100, label: '$1',  name: 'Loonie',  mm: 26.5,  metal: 'gold',    shape: 'hendecagon', motif: 'Common loon' },
  toonie:  { cents: 200, label: '$2',  name: 'Toonie',  mm: 28.0,  metal: 'bimetal', shape: 'round',      motif: 'Polar bear' }
};

const BILLS = {
  five:   { cents: 500,  label: '$5',  name: 'Five',   ink: '#2563eb', wash: '#dbeafe' },
  ten:    { cents: 1000, label: '$10', name: 'Ten',    ink: '#7c3aed', wash: '#ede9fe' },
  twenty: { cents: 2000, label: '$20', name: 'Twenty', ink: '#15803d', wash: '#dcfce7' }
};

/** Biggest first. Counting order, greedy order, and display order are all this. */
const DENOM_ORDER = ['twenty', 'ten', 'five', 'toonie', 'loonie', 'quarter', 'dime', 'nickel'];

/** Coins only, biggest first. Change is never given in bills at this level. */
const COIN_ORDER = ['toonie', 'loonie', 'quarter', 'dime', 'nickel'];

function pieceOf(key) {
  return COINS[key] || BILLS[key];
}

function valueOf(key) {
  const p = pieceOf(key);
  return p ? p.cents : 0;
}

// =========================================================================
// MONEY ARITHMETIC (pure, integer cents)
// =========================================================================

/** Total of a list of denomination keys, in cents. */
function sumCents(pieces) {
  return pieces.reduce((total, key) => total + valueOf(key), 0);
}

/** 345 -> "$3.45". Always two digits after the dot, always a leading zero. */
function formatMoney(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  return sign + '$' + Math.floor(abs / 100) + '.' + String(abs % 100).padStart(2, '0');
}

/** How a Grade 3 student would say it: 45 -> "45¢", 345 -> "$3.45". */
function formatCents(cents) {
  return Math.abs(cents) < 100 ? cents + '¢' : formatMoney(cents);
}

/**
 * The fewest pieces that make an amount.
 *
 * Greedy is provably optimal for the Canadian set (5, 10, 25, 100, 200), which
 * is why the fewest-coins drills can mark an answer without searching. It is
 * NOT optimal for every currency system, so the comment matters more than the
 * code: swap the denominations and this needs revisiting.
 *
 * Returns [{ key, count }], biggest first.
 */
function fewestPieces(cents, order) {
  const denoms = order || COIN_ORDER;
  const out = [];
  let left = cents;
  for (const key of denoms) {
    const v = valueOf(key);
    const n = Math.floor(left / v);
    if (n > 0) {
      out.push({ key: key, count: n });
      left -= n * v;
    }
  }
  return out;
}

/** Total number of pieces in a fewestPieces() breakdown. */
function pieceCount(breakdown) {
  return breakdown.reduce((n, b) => n + b.count, 0);
}

/** "1 loonie, 3 quarters, 1 dime" */
function describePieces(breakdown) {
  return breakdown
    .map((b) => {
      const p = pieceOf(b.key);
      const noun = COINS[b.key] ? p.name.toLowerCase() : p.label + ' bill';
      return b.count + ' ' + noun + (b.count > 1 ? 's' : '');
    })
    .join(', ');
}

/** Change owed, in cents. Negative means not enough money was handed over. */
function changeFor(priceCents, paidCents) {
  return paidCents - priceCents;
}

/**
 * The Canadian cash rounding rule, in force since the penny was retired in
 * 2013: a CASH total rounds to the nearest 5 cents, and a tie cannot happen
 * because cents are whole numbers (1,2 down; 3,4 up; 6,7 down; 8,9 up).
 * Debit and credit still charge the exact amount.
 */
function roundToNickel(cents) {
  const rem = cents % 5;
  return rem <= 2 ? cents - rem : cents + (5 - rem);
}

/**
 * The cashier's count-up ladder from a price to what was handed over.
 *
 * Hop to the next quarter, then to the next whole dollar, then in dollars.
 * That is the order a cashier actually uses, and it is the order the Chapter 4
 * number line draws, so the strategy a student is taught is the strategy the
 * hint shows.
 *
 * Returns [{ from, add, to, pieces }] with every amount in cents.
 */
function countUpLadder(priceCents, paidCents) {
  const steps = [];
  let cur = priceCents;

  const hop = (to) => {
    if (to <= cur || to > paidCents) return;
    steps.push({ from: cur, add: to - cur, to: to, pieces: fewestPieces(to - cur) });
    cur = to;
  };

  // Up to the next quarter, then the next whole dollar.
  if (cur % 25 !== 0) hop(cur + (25 - (cur % 25)));
  if (cur % 100 !== 0) hop(cur + (100 - (cur % 100)));
  // Then the whole dollars that remain, in one hop.
  hop(paidCents);

  return steps;
}

// =========================================================================
// VECTOR COINS AND BILLS
// =========================================================================

/** Vertices of a regular N-gon inscribed in a circle, flat side up. */
function polygonPoints(sides, cx, cy, r) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const a = (i * 2 * Math.PI) / sides - Math.PI / 2;
    pts.push((cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2));
  }
  return pts.join(' ');
}

/**
 * One coin, drawn at its true relative size.
 *
 * `pxPerMm` is the only size knob, so every coin in a pile is automatically in
 * proportion to every other: the dime comes out smaller than the nickel
 * because it really is smaller, not because a constant says so.
 */
function coinSVG(key, pxPerMm) {
  const c = COINS[key];
  if (!c) return '';
  const size = Math.round(c.mm * pxPerMm);

  const silver = { face: '#dbe1e8', rim: '#9aa5b1', ink: '#1e293b' };
  const gold = { face: '#e9c67f', rim: '#c19338', ink: '#5b3d10' };
  const skin = c.metal === 'gold' ? gold : silver;

  // Milled (reeded) edge ticks, the detail that makes a circle read as a coin.
  let ticks = '';
  const tickCount = 44;
  for (let i = 0; i < tickCount; i++) {
    const a = (i * 2 * Math.PI) / tickCount;
    const x1 = 50 + 47 * Math.cos(a);
    const y1 = 50 + 47 * Math.sin(a);
    const x2 = 50 + 43 * Math.cos(a);
    const y2 = 50 + 43 * Math.sin(a);
    ticks +=
      '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) +
      '" y2="' + y2.toFixed(1) + '" stroke="' + skin.rim + '" stroke-width="1.6" opacity="0.55"/>';
  }

  let body;
  if (c.shape === 'hendecagon') {
    // The loonie really does have 11 straight sides, and a child can feel them.
    body =
      '<polygon points="' + polygonPoints(11, 50, 50, 48) + '" fill="' + gold.face +
      '" stroke="' + gold.rim + '" stroke-width="3"/>' +
      '<polygon points="' + polygonPoints(11, 50, 50, 40) + '" fill="none" stroke="' +
      gold.rim + '" stroke-width="1.4" opacity="0.7"/>';
  } else if (c.metal === 'bimetal') {
    // The toonie is the only two-metal coin: silver ring, gold centre.
    body =
      '<circle cx="50" cy="50" r="48" fill="' + silver.face + '" stroke="' + silver.rim + '" stroke-width="2.5"/>' +
      ticks +
      '<circle cx="50" cy="50" r="31" fill="' + gold.face + '" stroke="' + gold.rim + '" stroke-width="2"/>';
  } else {
    body =
      '<circle cx="50" cy="50" r="48" fill="' + skin.face + '" stroke="' + skin.rim + '" stroke-width="2.5"/>' +
      ticks +
      '<circle cx="50" cy="50" r="40" fill="none" stroke="' + skin.rim + '" stroke-width="1.4" opacity="0.7"/>';
  }

  /*
   * No engraving on the coin faces. A real loonie carries a loon and a toonie
   * a polar bear, but at the size a coin is actually drawn here -- 40px to
   * 84px -- any such shape ends up as a smear behind the value, which is the
   * one thing on the coin a learner has to read. The metal, the size and the
   * loonie's eleven sides carry the identification instead.
   */

  // The value is the reason the coin is on the page, so it is set large and
  // dark enough to survive a grayscale printer.
  const valueInk = c.metal === 'silver' ? silver.ink : gold.ink;

  return (
    '<svg class="sf-coin" width="' + size + '" height="' + size + '" viewBox="0 0 100 100" ' +
    'role="img" aria-label="' + c.name + ', ' + c.label + '">' +
    body +
    '<text x="50" y="58" text-anchor="middle" font-family="Nunito, sans-serif" ' +
    'font-size="34" font-weight="900" fill="' + valueInk + '">' + c.label + '</text>' +
    '</svg>'
  );
}

/**
 * One bill.
 *
 * Bills are NOT drawn to the same scale as the coins: a real $5 note is 152mm
 * wide, so at coin scale it would be five toonies across and the coins in the
 * same pile would be unreadable. The note is drawn at a legible fixed height
 * with the true 2.18:1 note proportion instead.
 */
function billSVG(key, pxPerMm) {
  const b = BILLS[key];
  if (!b) return '';
  /*
   * 28 rather than the note's true 70mm height. A note drawn against the coin
   * scale is 2.5 times a toonie across, which at three columns leaves room for
   * exactly one note per line and turns a six-piece pile into a tall stack.
   * This keeps the note comfortably the biggest thing in the pile while
   * letting two sit side by side.
   */
  const h = Math.round(28 * pxPerMm);
  const w = Math.round(h * 2.18);

  return (
    '<svg class="sf-bill" width="' + w + '" height="' + h + '" viewBox="0 0 218 100" ' +
    'role="img" aria-label="' + b.name + ' dollar bill">' +
    '<rect x="2" y="2" width="214" height="96" rx="8" fill="' + b.wash + '" stroke="' + b.ink + '" stroke-width="3"/>' +
    '<rect x="12" y="12" width="194" height="76" rx="5" fill="none" stroke="' + b.ink + '" stroke-width="1.4" opacity="0.55"/>' +
    '<text x="109" y="60" text-anchor="middle" font-family="Nunito, sans-serif" ' +
    'font-size="46" font-weight="900" fill="' + b.ink + '">' + b.label + '</text>' +
    '<text x="109" y="80" text-anchor="middle" font-family="Nunito, sans-serif" ' +
    'font-size="14" font-weight="700" fill="' + b.ink + '" opacity="0.8">CANADA</text>' +
    '</svg>'
  );
}

/** Draw any denomination, coin or bill. */
function pieceSVG(key, pxPerMm) {
  return COINS[key] ? coinSVG(key, pxPerMm) : billSVG(key, pxPerMm);
}

/** Markup for a whole pile, sorted biggest first the way it should be counted. */
function pileSVG(pieces, pxPerMm) {
  return sortPieces(pieces)
    .map((key) => '<span class="pile-piece">' + pieceSVG(key, pxPerMm) + '</span>')
    .join('');
}

function sortPieces(pieces) {
  return pieces.slice().sort((a, b) => valueOf(b) - valueOf(a));
}

// =========================================================================
// QUESTION GENERATORS
// =========================================================================

/**
 * The three difficulty levels.
 *
 * `maxTotal` keeps a generated pile inside the arithmetic the level is
 * teaching; without it a "silver coins only" pile could still land on $3.85
 * and stop being a Grade 3 under-a-dollar exercise.
 */
const LEVELS = {
  coins_small: {
    denoms: ['quarter', 'dime', 'nickel'],
    minPieces: 3,
    maxPieces: 6,
    maxTotal: 99,
    priceMax: 95,
    maxOverpay: 200
  },
  coins_all: {
    denoms: ['toonie', 'loonie', 'quarter', 'dime', 'nickel'],
    minPieces: 3,
    maxPieces: 7,
    maxTotal: 999,
    priceMax: 495,
    maxOverpay: 500
  },
  with_bills: {
    denoms: ['ten', 'five', 'toonie', 'loonie', 'quarter', 'dime', 'nickel'],
    minPieces: 3,
    maxPieces: 8,
    maxTotal: 4999,
    priceMax: 1895,
    maxOverpay: 1000
  }
};

const moneyState = {
  score: 0,
  streak: 0,
  badges: [],
  currentMode: 'course_lessons',
  level: 'coins_all',

  count: { pieces: [], totalCents: 0 },
  build: { targetCents: 0, pieces: [] },
  change: { priceCents: 0, paidCents: 0, changeCents: 0, item: null },

  currentStory: null,
  contestIndex: 0,

  printCount: 12,
  printCols: 2,
  printMode: 'mixed',
  showPrintAnswers: false
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * A random pile for the current level.
 *
 * Retries rather than clamps: a pile that busts the level's ceiling is thrown
 * away and redrawn, so the denominations stay varied instead of collapsing
 * onto the small ones near the limit.
 */
function randomPile(levelKey) {
  const level = LEVELS[levelKey] || LEVELS.coins_all;

  for (let attempt = 0; attempt < 40; attempt++) {
    const n = randInt(level.minPieces, level.maxPieces);
    const pieces = [];
    for (let i = 0; i < n; i++) pieces.push(pick(level.denoms));
    if (sumCents(pieces) <= level.maxTotal) return sortPieces(pieces);
  }

  // Fallback that cannot bust any ceiling: the smallest denomination only.
  return [level.denoms[level.denoms.length - 1]];
}

/** A price the level can actually pay for, always a whole number of nickels. */
function randomPrice(levelKey) {
  const level = LEVELS[levelKey] || LEVELS.coins_all;
  return randInt(1, Math.floor(level.priceMax / 5)) * 5;
}

/**
 * What the shopper hands over: a round amount that covers the price.
 *
 * Two rules, both of them about the question being believable. It is always
 * strictly greater than the price, because "change of $0.00" teaches nothing
 * and reads like a bug. And it is never wildly more than the price -- handing
 * over a $10 bill for a 90 cent puzzle is not what anybody does, and the
 * resulting $9.10 of change is a different exercise from the one the level is
 * teaching. `maxOverpay` is what keeps the change inside the level.
 */
function paymentFor(priceCents, levelKey) {
  const level = LEVELS[levelKey] || LEVELS.coins_all;
  const ceilingTo = (unit) => Math.ceil((priceCents + 1) / unit) * unit;

  // The next whole dollar is always payable: two toonies, a fistful of
  // quarters, whatever the shopper has.
  const candidates = [ceilingTo(100)];

  const nextFive = ceilingTo(500);
  if (nextFive <= priceCents + level.maxOverpay) candidates.push(nextFive);

  const nextTen = ceilingTo(1000);
  if (level.denoms.indexOf('ten') !== -1 && nextTen <= priceCents + level.maxOverpay) {
    candidates.push(nextTen);
  }

  return pick(candidates);
}

// =========================================================================
// CANADIAN MONEY STORY PROBLEMS
// =========================================================================

const MONEY_STORY_PROBLEMS = [
  {
    icon: '🍁',
    text: 'At the sugar bush, Olivia buys a bottle of maple syrup for $6.45 and a maple candy for $1.25. She pays with a $10 bill. How much change does she get back?',
    options: ['$2.30', '$2.45', '$3.30', '$7.70'],
    ans: 0,
    exp: '$6.45 + $1.25 = $7.70 spent. Counting up from $7.70 to $10.00: 30¢ gets to $8.00, then $2.00 more. Change = $2.30!'
  },
  {
    icon: '🧁',
    text: 'Olivia sells butter tarts at the school bake sale for 75¢ each. She sells 8 tarts. How much money did she collect?',
    options: ['$5.60', '$6.00', '$6.75', '$8.75'],
    ans: 1,
    exp: '75¢ × 8 = 600¢. Four tarts make $3.00, so eight tarts make $6.00!'
  },
  {
    icon: '🏒',
    text: 'A pack of hockey cards costs $4.35. Olivia pays with a toonie, two loonies and a quarter. How much more money does she still need?',
    options: ['10¢', '15¢', '25¢', '35¢'],
    ans: 0,
    exp: 'Toonie + 2 loonies + quarter = $2.00 + $2.00 + $0.25 = $4.25. $4.35 − $4.25 = 10¢ short!'
  },
  {
    icon: '🚌',
    text: 'A student bus ticket costs $2.60. Olivia has exactly 12 quarters. Can she pay, and what is left over?',
    options: ['No, she is 10¢ short', 'Yes, 15¢ left over', 'Yes, 40¢ left over', 'Yes, nothing left over'],
    ans: 2,
    exp: '12 quarters = 12 × 25¢ = 300¢ = $3.00. $3.00 − $2.60 = 40¢ left over!'
  },
  {
    icon: '📚',
    text: 'Olivia saves a toonie every week for her book fund. After 7 weeks, how much has she saved?',
    options: ['$7.00', '$12.00', '$14.00', '$16.00'],
    ans: 2,
    exp: '$2.00 × 7 = $14.00. Skip count by 2s: 2, 4, 6, 8, 10, 12, 14!'
  },
  {
    icon: '🍎',
    text: 'At the farmers market, apples cost $3.20 for a bag. Olivia buys 2 bags and pays with a $10 bill. What change does she get?',
    options: ['$3.20', '$3.60', '$6.40', '$6.80'],
    ans: 1,
    exp: '2 bags = $3.20 + $3.20 = $6.40. Counting up from $6.40 to $10.00: 60¢ makes $7.00, then $3.00 more. Change = $3.60!'
  },
  {
    icon: '🛒',
    text: 'Olivia pays CASH for groceries and the till shows $12.83. Canada has no pennies, so what does she actually pay?',
    options: ['$12.80', '$12.83', '$12.85', '$13.00'],
    ans: 2,
    exp: 'A cash total ending in 3¢ rounds UP to the nearest 5 cents, so she pays $12.85. On a debit card she would pay the exact $12.83!'
  },
  {
    icon: '🎁',
    text: 'Olivia has $5.00. She wants a toque that costs $8.75. How much more must she save?',
    options: ['$3.25', '$3.75', '$4.25', '$13.75'],
    ans: 1,
    exp: 'Count up from $5.00 to $8.75: $3.00 gets to $8.00, then 75¢ more. She needs $3.75!'
  }
];

// =========================================================================
// FEWEST-COINS CONTEST PUZZLES (TIER 3 ENRICHED)
// =========================================================================

const MONEY_CONTEST_PUZZLES = [
  {
    num: 1,
    title: 'The Fewest Coins Challenge 🪙',
    desc: 'Olivia must pay exactly $1.85 using only coins. What is the smallest number of coins she can use?',
    options: ['4 coins', '5 coins', '6 coins', '8 coins'],
    ans: 1,
    exp: 'Take the biggest coin that fits, over and over: 1 loonie ($1.00), then 3 quarters ($0.75), then 1 dime ($0.10). That is 5 coins.'
  },
  {
    num: 2,
    title: 'The Six Coin Dollar 💰',
    desc: 'Olivia has exactly 6 coins in her pocket and they add up to exactly $1.00. Which set could she be holding?',
    options: [
      '4 quarters and 2 dimes',
      '3 quarters, 2 dimes and 1 nickel',
      '2 quarters, 4 dimes',
      '6 dimes'
    ],
    ans: 1,
    exp: '3 quarters = 75¢, 2 dimes = 20¢, 1 nickel = 5¢. 75 + 20 + 5 = 100¢, using exactly 6 coins!'
  },
  {
    num: 3,
    title: 'How Many Ways to Make 25¢? 🧮',
    desc: 'Using only nickels, dimes and quarters, how many different ways can Olivia make exactly 25 cents?',
    options: ['3 ways', '4 ways', '5 ways', '6 ways'],
    ans: 1,
    exp: '1 quarter; 2 dimes + 1 nickel; 1 dime + 3 nickels; 5 nickels. That is 4 different ways!'
  },
  {
    num: 4,
    title: 'The Penny-Free Till 🍁',
    desc: 'A cash total comes to $9.62. Canada retired the penny in 2013, so the till rounds to the nearest 5 cents. What does the customer pay in cash?',
    options: ['$9.60', '$9.62', '$9.65', '$9.70'],
    ans: 0,
    exp: 'A total ending in 1¢ or 2¢ rounds DOWN. $9.62 becomes $9.60 in cash. A debit card would still charge exactly $9.62.'
  },
  {
    num: 5,
    title: 'The Change Trap 🎯',
    desc: 'Olivia buys a freezie for $1.35 and pays with a toonie. The cashier gives her back the fewest coins possible. How many coins does she receive?',
    options: ['3 coins', '4 coins', '5 coins', '6 coins'],
    ans: 1,
    exp: 'Change = $2.00 − $1.35 = 65¢. Fewest coins: 2 quarters (50¢), 1 dime (60¢), 1 nickel (65¢). That is 4 coins.'
  }
];

// =========================================================================
// 1. COUNT THE MONEY
// =========================================================================

function generateNewCountQuestion() {
  moneyState.count.pieces = randomPile(moneyState.level);
  moneyState.count.totalCents = sumCents(moneyState.count.pieces);

  const pile = document.getElementById('count-coin-pile');
  if (pile) pile.innerHTML = pileSVG(moneyState.count.pieces, 2.9);

  const dollars = document.getElementById('count-dollars-input');
  const cents = document.getElementById('count-cents-input');
  const fb = document.getElementById('count-feedback');
  const ladder = document.getElementById('count-ladder');

  if (dollars) dollars.value = '';
  if (cents) cents.value = '';
  if (fb) fb.className = 'feedback-msg hidden';
  if (ladder) ladder.className = 'ladder-box hidden';
  if (dollars) dollars.focus();
}

/** Read a "$ __ . __" pair as one integer number of cents. */
function readMoneyInputs(dollarsId, centsId) {
  const d = parseInt(document.getElementById(dollarsId).value, 10);
  const c = parseInt(document.getElementById(centsId).value, 10);
  if (isNaN(d) && isNaN(c)) return null;
  const dollars = isNaN(d) ? 0 : d;
  const cents = isNaN(c) ? 0 : c;
  if (cents > 99 || cents < 0 || dollars < 0) return NaN;
  return dollars * 100 + cents;
}

function checkCountAnswer() {
  const fb = document.getElementById('count-feedback');
  const entered = readMoneyInputs('count-dollars-input', 'count-cents-input');

  if (entered === null) {
    showFeedback(fb, 'error', 'Type the dollars and the cents, for example 3 and 45 for $3.45.');
    return;
  }
  if (isNaN(entered)) {
    showFeedback(fb, 'error', 'Cents must be between 00 and 99. 145 cents is $1.45!');
    return;
  }

  const truth = moneyState.count.totalCents;
  if (entered === truth) {
    reward(10, 'pile_counter', 'Pile Counter');
    showFeedback(
      fb,
      'success',
      '🎉 <strong>EXACTLY RIGHT, OLIVIA!</strong> That pile is <strong>' + formatMoney(truth) + '</strong>! ✨'
    );
    launchConfetti();
  } else {
    breakStreak();
    showFeedback(
      fb,
      'error',
      '💡 Not quite. Count again from the biggest coin down. The pile is <strong>' +
        formatMoney(truth) + '</strong>.'
    );
    showCountLadder();
  }
}

/** The skip-count ladder a cashier would say out loud. */
function showCountLadder() {
  const box = document.getElementById('count-ladder');
  if (!box) return;

  let running = 0;
  const steps = sortPieces(moneyState.count.pieces).map((key) => {
    running += valueOf(key);
    return (
      '<span class="ladder-step"><em>' + pieceOf(key).label + '</em> &rarr; ' +
      formatMoney(running) + '</span>'
    );
  });

  box.innerHTML =
    '<h4>Count from the biggest piece down:</h4><div class="ladder-steps">' +
    steps.join('') + '</div>';
  box.className = 'ladder-box';
}

// =========================================================================
// 2. BUILD THE AMOUNT
// =========================================================================

function generateNewBuildChallenge() {
  // Targets are always payable in coins, so "fewest coins" is always meaningful.
  const level = LEVELS[moneyState.level] || LEVELS.coins_all;
  const ceiling = Math.min(level.maxTotal, moneyState.level === 'coins_small' ? 95 : 495);
  moneyState.build.targetCents = randInt(1, Math.floor(ceiling / 5)) * 5;
  moneyState.build.pieces = [];

  const display = document.getElementById('build-target-display');
  if (display) display.textContent = formatMoney(moneyState.build.targetCents);

  renderBuildCoinButtons();
  renderPurse();

  const fb = document.getElementById('build-feedback');
  if (fb) fb.className = 'feedback-msg hidden';
}

function buildCoinKeys() {
  // The purse is built from coins only: a bill cannot make an exact 65¢.
  return moneyState.level === 'coins_small'
    ? ['quarter', 'dime', 'nickel']
    : COIN_ORDER.slice();
}

function renderBuildCoinButtons() {
  const row = document.getElementById('build-coin-buttons');
  if (!row) return;

  row.innerHTML = '';
  // Every button reserves the tallest coin's height, so the faces sit on one
  // baseline and the name labels line up across the row.
  const pxPerMm = 2.2;
  const slot = Math.round(COINS.toonie.mm * pxPerMm);

  buildCoinKeys().forEach((key) => {
    const btn = document.createElement('button');
    btn.className = 'coin-btn';
    btn.setAttribute('data-coin', key);
    btn.setAttribute('aria-label', 'Add a ' + COINS[key].name);
    btn.innerHTML =
      '<span class="coin-slot" style="height:' + slot + 'px">' + coinSVG(key, pxPerMm) + '</span>' +
      '<span class="coin-btn-name">' + COINS[key].name + '</span>';
    btn.onclick = () => addBuildCoin(key);
    row.appendChild(btn);
  });
}

function addBuildCoin(key) {
  moneyState.build.pieces.push(key);
  renderPurse();
}

function undoBuildCoin() {
  moneyState.build.pieces.pop();
  renderPurse();
}

function resetBuildPurse() {
  moneyState.build.pieces = [];
  renderPurse();
  const fb = document.getElementById('build-feedback');
  if (fb) fb.className = 'feedback-msg hidden';
}

function renderPurse() {
  const pile = document.getElementById('build-purse-pile');
  const total = document.getElementById('build-current-total');
  const count = document.getElementById('build-coin-count');
  const fewest = document.getElementById('build-fewest');

  const sum = sumCents(moneyState.build.pieces);

  if (pile) {
    pile.innerHTML = moneyState.build.pieces.length
      ? pileSVG(moneyState.build.pieces, 2.2)
      : '<span class="purse-empty">Empty. Tap a coin below to add it.</span>';
  }
  if (total) {
    total.textContent = formatMoney(sum);
    // Over the target is a different mistake from under it, and the running
    // total is where a child notices which one they made.
    total.className = sum > moneyState.build.targetCents ? 'over-target' : '';
  }
  if (count) count.textContent = moneyState.build.pieces.length;
  if (fewest) fewest.textContent = pieceCount(fewestPieces(moneyState.build.targetCents));
}

function checkBuildAmount() {
  const fb = document.getElementById('build-feedback');
  const sum = sumCents(moneyState.build.pieces);
  const target = moneyState.build.targetCents;
  const used = moneyState.build.pieces.length;
  const best = pieceCount(fewestPieces(target));

  if (sum === target) {
    const perfect = used === best;
    reward(perfect ? 25 : 15, 'purse_builder', 'Purse Builder');
    showFeedback(
      fb,
      'success',
      perfect
        ? '🏆 <strong>PERFECT PAYMENT!</strong> ' + formatMoney(target) + ' with the fewest possible coins (' +
          best + '): ' + describePieces(fewestPieces(target)) + '! ✨'
        : '🎉 <strong>CORRECT AMOUNT!</strong> You made ' + formatMoney(target) + ' with ' + used +
          ' coins. A cashier could do it with just <strong>' + best + '</strong>: ' +
          describePieces(fewestPieces(target)) + '.'
    );
    launchConfetti();
  } else if (sum > target) {
    breakStreak();
    showFeedback(
      fb,
      'error',
      'That is <strong>' + formatMoney(sum - target) + ' too much</strong>. Undo a coin and try a smaller one!'
    );
  } else {
    breakStreak();
    showFeedback(
      fb,
      'error',
      'You still need <strong>' + formatMoney(target - sum) + '</strong> more to reach ' +
        formatMoney(target) + '.'
    );
  }
}

// =========================================================================
// 3. MAKING CHANGE
// =========================================================================

const SHOP_ITEMS = [
  { icon: '🧃', name: 'Apple juice box' },
  { icon: '🍫', name: 'Maple syrup taffy' },
  { icon: '✏️', name: 'Pencil crayon set' },
  { icon: '🧦', name: 'Winter socks' },
  { icon: '🍩', name: 'Beaver tail pastry' },
  { icon: '🏒', name: 'Hockey card pack' },
  { icon: '📓', name: 'Sticker notebook' },
  { icon: '🧩', name: 'Mini puzzle' }
];

function generateNewChangeQuestion() {
  const price = randomPrice(moneyState.level);
  const paid = paymentFor(price, moneyState.level);

  moneyState.change = {
    priceCents: price,
    paidCents: paid,
    changeCents: changeFor(price, paid),
    item: pick(SHOP_ITEMS)
  };

  const icon = document.getElementById('change-item-icon');
  const text = document.getElementById('change-item-text');
  const priceEl = document.getElementById('change-price-display');
  const paidEl = document.getElementById('change-paid-display');
  const dollars = document.getElementById('change-dollars-input');
  const cents = document.getElementById('change-cents-input');
  const fb = document.getElementById('change-feedback');
  const ladder = document.getElementById('change-ladder');

  if (icon) icon.textContent = moneyState.change.item.icon;
  if (text) text.textContent = moneyState.change.item.name;
  if (priceEl) priceEl.textContent = formatMoney(price);
  if (paidEl) paidEl.textContent = formatMoney(paid);
  if (dollars) dollars.value = '';
  if (cents) cents.value = '';
  if (fb) fb.className = 'feedback-msg hidden';
  if (ladder) ladder.className = 'ladder-box hidden';
  if (dollars) dollars.focus();
}

function checkChangeAnswer() {
  const fb = document.getElementById('change-feedback');
  const entered = readMoneyInputs('change-dollars-input', 'change-cents-input');

  if (entered === null) {
    showFeedback(fb, 'error', 'Type the dollars and the cents of the change, for example 1 and 55 for $1.55.');
    return;
  }
  if (isNaN(entered)) {
    showFeedback(fb, 'error', 'Cents must be between 00 and 99. 155 cents is $1.55!');
    return;
  }

  const truth = moneyState.change.changeCents;
  if (entered === truth) {
    reward(15, 'change_maker', 'Change Maker');
    showFeedback(
      fb,
      'success',
      '🎉 <strong>PERFECT CHANGE!</strong> ' + formatMoney(moneyState.change.paidCents) + ' − ' +
        formatMoney(moneyState.change.priceCents) + ' = <strong>' + formatMoney(truth) +
        '</strong>, which the cashier hands back as ' + describePieces(fewestPieces(truth)) + '. 🚀'
    );
    launchConfetti();
  } else {
    breakStreak();
    showFeedback(
      fb,
      'error',
      '💡 Close! Count UP from ' + formatMoney(moneyState.change.priceCents) + ' to ' +
        formatMoney(moneyState.change.paidCents) + '. The change is <strong>' + formatMoney(truth) + '</strong>.'
    );
    showChangeLadder();
  }
}

function showChangeLadder() {
  const box = document.getElementById('change-ladder');
  if (!box) return;

  const steps = countUpLadder(moneyState.change.priceCents, moneyState.change.paidCents);
  const rows = steps.map(
    (s) =>
      '<span class="ladder-step">' + formatMoney(s.from) + ' <em>+' + formatCents(s.add) + '</em> &rarr; ' +
      formatMoney(s.to) + '<small>' + describePieces(s.pieces) + '</small></span>'
  );

  box.innerHTML =
    '<h4>Count up from the price to what you paid:</h4><div class="ladder-steps">' +
    rows.join('') +
    '</div><p class="ladder-total">Total change = <strong>' +
    formatMoney(moneyState.change.changeCents) + '</strong></p>';
  box.className = 'ladder-box';
}

// =========================================================================
// 4. MONEY STORY PROBLEMS
// =========================================================================

function generateNewStoryProblem() {
  const item = pick(MONEY_STORY_PROBLEMS);
  moneyState.currentStory = item;

  const iconEl = document.getElementById('story-icon');
  const textEl = document.getElementById('story-problem-text');
  const container = document.getElementById('story-options-container');
  const fb = document.getElementById('story-feedback');

  if (iconEl) iconEl.textContent = item.icon;
  if (textEl) textEl.textContent = item.text;
  if (container) {
    container.innerHTML = '';
    item.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'story-option-btn';
      btn.textContent = opt;
      btn.onclick = () => selectStoryOption(idx, btn);
      container.appendChild(btn);
    });
  }
  if (fb) fb.className = 'feedback-msg hidden';
}

function selectStoryOption(idx, btnEl) {
  const item = moneyState.currentStory;
  const fb = document.getElementById('story-feedback');
  const allBtns = document.querySelectorAll('.story-option-btn');

  if (idx === item.ans) {
    btnEl.classList.add('correct');
    reward(15, 'money_storyteller', 'Money Storyteller');
    showFeedback(fb, 'success', '🎉 <strong>CORRECT!</strong> ' + item.exp);
    launchConfetti();
  } else {
    btnEl.classList.add('wrong');
    if (allBtns[item.ans]) allBtns[item.ans].classList.add('correct');
    breakStreak();
    showFeedback(fb, 'error', '💡 ' + item.exp);
  }
}

// =========================================================================
// 5. CONTEST LOGIC ARENA
// =========================================================================

function renderContestPuzzle() {
  const puzzle = MONEY_CONTEST_PUZZLES[moneyState.contestIndex];
  const numEl = document.getElementById('contest-num');
  const titleEl = document.getElementById('contest-title');
  const descEl = document.getElementById('contest-desc');
  const container = document.getElementById('contest-options-grid');
  const fb = document.getElementById('contest-feedback');

  if (numEl) numEl.textContent = puzzle.num;
  if (titleEl) titleEl.textContent = puzzle.title;
  if (descEl) descEl.textContent = puzzle.desc;

  if (container) {
    container.innerHTML = '';
    puzzle.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'contest-opt-btn';
      btn.textContent = opt;
      btn.onclick = () => selectContestOption(idx, btn);
      container.appendChild(btn);
    });
  }
  if (fb) fb.className = 'feedback-msg hidden';
}

function selectContestOption(idx, btnEl) {
  const puzzle = MONEY_CONTEST_PUZZLES[moneyState.contestIndex];
  const fb = document.getElementById('contest-feedback');
  const allBtns = document.querySelectorAll('.contest-opt-btn');

  if (idx === puzzle.ans) {
    btnEl.classList.add('correct');
    reward(25, 'coin_champion', 'Coin Logic Champion');
    showFeedback(fb, 'success', '🏆 <strong>BRILLIANT CONTEST THINKING!</strong> ' + puzzle.exp);
    launchConfetti();
  } else {
    btnEl.classList.add('wrong');
    if (allBtns[puzzle.ans]) allBtns[puzzle.ans].classList.add('correct');
    breakStreak();
    showFeedback(fb, 'error', '💡 <strong>Contest Hint:</strong> ' + puzzle.exp);
  }
}

function nextContestPuzzle() {
  moneyState.contestIndex = (moneyState.contestIndex + 1) % MONEY_CONTEST_PUZZLES.length;
  renderContestPuzzle();
}

// =========================================================================
// 6. PRINTABLE MONEY TEST
// =========================================================================

/**
 * Draw one question of a money test.
 *
 * The question's numbers are decided ONCE, by makeMoneyQuestion(), and this
 * function only draws them.
 *
 * That separation is load-bearing. assets/sf/paginate.js renders every item
 * twice -- once off-screen to measure how tall it is, and again to emit the
 * page -- so a renderer that invented fresh random coins on each call would
 * have the paginator packing pages against a worksheet that is not the one
 * being printed. A pile of eight coins measured where a pile of two is emitted
 * wastes half a page; the other way round overflows it.
 */
function makeMoneyQuestion(index) {
  const kind =
    moneyState.printMode === 'mixed' ? ['count', 'change', 'fewest'][index % 3] : moneyState.printMode;

  if (kind === 'change') {
    const price = randomPrice(moneyState.level);
    return { index: index, kind: kind, price: price, paid: paymentFor(price, moneyState.level) };
  }

  if (kind === 'fewest') {
    const ceiling = moneyState.level === 'coins_small' ? 95 : 495;
    return { index: index, kind: kind, amount: randInt(1, Math.floor(ceiling / 5)) * 5 };
  }

  return { index: index, kind: 'count', pieces: randomPile(moneyState.level) };
}

function buildMoneyItem(q) {
  const item = document.createElement('div');
  item.className = 'sf-card printable-money-item';

  const answers = moneyState.showPrintAnswers;
  const key = (text) => (answers ? '<span class="print-answer">[' + text + ']</span>' : '');

  if (q.kind === 'change') {
    const change = changeFor(q.price, q.paid);
    item.innerHTML =
      '<span class="q-num">' + q.index + '. Make change.</span>' +
      '<div class="print-receipt">' +
      '<div><span>Price</span><strong>' + formatMoney(q.price) + '</strong></div>' +
      '<div><span>Paid</span><strong>' + formatMoney(q.paid) + '</strong></div>' +
      '</div>' +
      '<div class="print-answer-line">Change: <span class="write-line"></span> ' + key(formatMoney(change)) + '</div>';
    return item;
  }

  if (q.kind === 'fewest') {
    const best = fewestPieces(q.amount);
    item.innerHTML =
      '<span class="q-num">' + q.index + '. Pay ' + formatMoney(q.amount) + ' with the fewest coins.</span>' +
      '<div class="print-prompt">Write the coins you would use:</div>' +
      '<div class="print-answer-line"><span class="write-line write-line--long"></span></div>' +
      '<div class="print-answer-line">How many coins? <span class="write-line write-line--short"></span> ' +
      key(pieceCount(best) + ': ' + describePieces(best)) +
      '</div>';
    return item;
  }

  item.innerHTML =
    '<span class="q-num">' + q.index + '. Count the money.</span>' +
    '<div class="print-pile">' + pileSVG(q.pieces, 1.5) + '</div>' +
    '<div class="print-answer-line">Total: <span class="write-line"></span> ' +
    key(formatMoney(sumCents(q.pieces))) + '</div>';
  return item;
}

function moneySheetHeader(pageIdx, totalPages) {
  const header = document.createElement('div');
  header.className = 'doc-header';
  const page = totalPages > 1 ? ' • Page ' + (pageIdx + 1) + ' of ' + totalPages : '';
  header.innerHTML =
    '<div class="doc-title-row">' +
    '<h2>Grade 3 Money &amp; Coin Math Test</h2>' +
    '<span class="doc-sub">Olivia\'s Learning Studio • Ontario Financial Literacy' + page + '</span>' +
    '</div>' +
    '<div class="doc-meta-row">' +
    '<div>Name: <span class="doc-line">Olivia</span></div>' +
    '<div>Date: <span class="doc-line"></span></div>' +
    '<div>Score: <span class="doc-line" style="min-width: 60px;"></span></div>' +
    '</div>';
  return header;
}

function moneySheetFooter() {
  const footer = document.createElement('div');
  footer.className = 'doc-footer';
  footer.innerHTML =
    '<span>Olivia\'s Math Studio • Ontario Grade 3 Financial Literacy</span>' +
    '<span>Count from the biggest coin down, and count UP to make change! 🍁</span>';
  return footer;
}

function generatePrintableMoney() {
  const target = document.getElementById('printable-money-doc');
  if (!target || typeof SFPaginate === 'undefined') return Promise.resolve();

  const count = moneyState.printCount || 12;
  const cols = moneyState.printCols || 2;

  // Decide every question up front, so measuring and emitting see the same
  // worksheet. See makeMoneyQuestion().
  const items = [];
  for (let i = 1; i <= count; i++) items.push(makeMoneyQuestion(i));

  SFPaginate.beginRender();

  return SFPaginate.paginate({
    target: target,
    mode: 'fill',
    items: items,
    sheetClass: 'sf-sheet printable-money-doc',
    gridClass: 'printable-money-grid cols-' + cols,
    cacheKey: 'money|cols=' + cols,
    renderItem: (question) => buildMoneyItem(question),
    renderHeader: moneySheetHeader,
    renderFooter: moneySheetFooter
  }).then((result) => {
    SFPaginate.publish({
      sheets: result.sheets.length,
      requestedPages: null,
      overflowRows: result.overflowRows,
      chunkSplits: 0,
      config: {
        count: count,
        cols: cols,
        mode: moneyState.printMode,
        level: moneyState.level,
        showAnswers: moneyState.showPrintAnswers
      }
    });
    return result;
  });
}

/**
 * URL parameters for the printable test.
 *
 * Question count, column count, question mix and level all change how tall a
 * question is, so all four must be addressable or the print matrix cannot
 * sweep the layouts a user can actually reach from the sidebar.
 */
const MONEY_URL_SCHEMA = {
  count: {
    type: 'int', min: 4, max: 40,
    apply: (c, v) => {
      c.printCount = v;
      const sel = document.getElementById('money-count-select');
      if (sel) sel.value = String(v);
    }
  },
  cols: {
    type: 'int', min: 1, max: 3,
    apply: (c, v) => {
      c.printCols = v;
      const sel = document.getElementById('money-cols-select');
      if (sel) sel.value = String(v);
    }
  },
  mode: {
    type: 'enum', values: ['mixed', 'count', 'change', 'fewest'],
    apply: (c, v) => {
      c.printMode = v;
      const sel = document.getElementById('money-mode-select');
      if (sel) sel.value = v;
    }
  },
  level: {
    type: 'enum', values: ['coins_small', 'coins_all', 'with_bills'],
    apply: (c, v) => {
      c.level = v;
      if (typeof SFUrl !== 'undefined') SFUrl.syncControl('level', v);
    }
  },
  answers: {
    type: 'bool',
    apply: (c, v) => {
      c.showPrintAnswers = v;
      const chk = document.getElementById('chk-show-answers-print');
      if (chk) chk.checked = v;
    }
  },
  /*
   * Open a particular activity directly. `?view=worksheet_gen` is how a deep
   * link (or a print test) lands on the printable test rather than the course
   * lessons the page opens on. The test is generated either way -- printing
   * must work from any view -- but it is only visible on screen when its own
   * tab is showing.
   */
  view: {
    type: 'string',
    apply: (c, v) => setActivityMode(v)
  }
};

function setPrintMoneyCount(value) {
  moneyState.printCount = parseInt(value, 10) || 12;
  return generatePrintableMoney();
}

function setPrintMoneyCols(value) {
  moneyState.printCols = parseInt(value, 10) || 2;
  return generatePrintableMoney();
}

function setPrintMoneyMode(value) {
  moneyState.printMode = value;
  return generatePrintableMoney();
}

function togglePrintAnswers(isChecked) {
  moneyState.showPrintAnswers = isChecked;
  return generatePrintableMoney();
}

// =========================================================================
// LESSON VISUALS
// =========================================================================

/** The Chapter 1 gallery: every coin at true relative size, with its facts. */
function renderCoinGallery() {
  const gallery = document.getElementById('coin-gallery');
  if (!gallery) return;

  const pxPerMm = 3.0;
  const slot = Math.round(COINS.toonie.mm * pxPerMm);

  gallery.innerHTML = COIN_ORDER.slice()
    .reverse()
    .map((key) => {
      const c = COINS[key];
      return (
        '<figure class="coin-card">' +
        '<span class="coin-slot" style="height:' + slot + 'px">' + coinSVG(key, pxPerMm) + '</span>' +
        '<figcaption><strong>' + c.name + '</strong>' +
        '<span>' + c.label + ' = ' + c.cents + ' cents</span>' +
        '<span class="coin-fact">' + c.mm + ' mm • ' + c.motif + '</span>' +
        '</figcaption></figure>'
      );
    })
    .join('');
}

/** The Chapter 3 worked example: a fixed pile counted biggest first. */
function renderWorkedCountExample() {
  const box = document.getElementById('worked-count-example');
  if (!box) return;

  const pile = ['loonie', 'quarter', 'quarter', 'dime', 'nickel'];
  let running = 0;
  const ladder = pile
    .map((key) => {
      running += valueOf(key);
      return '<span class="ladder-step"><em>' + COINS[key].label + '</em> &rarr; ' + formatMoney(running) + '</span>';
    })
    .join('');

  box.innerHTML =
    '<div class="coin-pile">' + pileSVG(pile, 2.1) + '</div>' +
    '<div class="ladder-steps">' + ladder + '</div>' +
    '<p class="ladder-total">This pile is <strong>' + formatMoney(sumCents(pile)) + '</strong>.</p>';
}

// =========================================================================
// SCORING, BADGES & SHARED PROGRESS
// =========================================================================

const BADGE_TOTAL = 6;

function showFeedback(el, kind, html) {
  if (!el) return;
  el.className = 'feedback-msg ' + kind;
  el.innerHTML = html;
}

/** A correct answer: local points, answer streak, badge, and profile XP. */
function reward(points, badgeId, badgeTitle) {
  moneyState.score += points;
  moneyState.streak++;
  unlockBadge(badgeId, badgeTitle);
  if (typeof SFQuest !== 'undefined') SFQuest.award(points);
  updateStats();
}

function breakStreak() {
  moneyState.streak = 0;
  updateStats();
}

function unlockBadge(badgeId) {
  if (moneyState.badges.indexOf(badgeId) === -1) {
    moneyState.badges.push(badgeId);
    if (typeof SFQuest !== 'undefined') SFQuest.unlockBadge(badgeId);
  }
  const badgeEl = document.getElementById('sf-badge-count');
  if (badgeEl) badgeEl.textContent = moneyState.badges.length + '/' + BADGE_TOTAL;
}

function updateStats() {
  const scoreEl = document.getElementById('money-score');
  const streakEl = document.getElementById('money-streak');
  if (scoreEl) scoreEl.textContent = moneyState.score;
  if (streakEl) streakEl.textContent = moneyState.streak;
}

// =========================================================================
// VIEW SWITCHING
// =========================================================================

const MODE_VIEWS = {
  course_lessons: 'view-course-lessons',
  count_money: 'view-count-money',
  build_amount: 'view-build-amount',
  make_change: 'view-make-change',
  word_problems: 'view-word-problems',
  contest_puzzles: 'view-contest-puzzles',
  worksheet_gen: 'view-worksheet-gen'
};

function setActivityMode(mode) {
  if (!MODE_VIEWS[mode]) return;
  moneyState.currentMode = mode;

  document.querySelectorAll('.activity-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-mode') === mode);
  });

  document.querySelectorAll('.activity-stage').forEach((s) => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });

  const targetEl = document.getElementById(MODE_VIEWS[mode]);
  if (targetEl) {
    targetEl.classList.remove('hidden');
    targetEl.classList.add('active');
  }

  if (mode === 'count_money') generateNewCountQuestion();
  else if (mode === 'build_amount') generateNewBuildChallenge();
  else if (mode === 'make_change') generateNewChangeQuestion();
  else if (mode === 'word_problems') generateNewStoryProblem();
  else if (mode === 'contest_puzzles') renderContestPuzzle();
  // The printable test is generated on load, so entering its view must not
  // rebuild it -- that would discard the sheet the user is looking at.
  // Regeneration is explicit: the Generate button, the answers toggle, or a
  // count / column / mix change.
}

function updateLevel(value) {
  moneyState.level = value;
  if (moneyState.currentMode === 'count_money') generateNewCountQuestion();
  if (moneyState.currentMode === 'build_amount') generateNewBuildChallenge();
  if (moneyState.currentMode === 'make_change') generateNewChangeQuestion();
  if (moneyState.currentMode === 'worksheet_gen') generatePrintableMoney();
}

// =========================================================================
// CONFETTI
// =========================================================================

const canvas = document.getElementById('confetti-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let confettiParticles = [];

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  if (!canvas || !ctx) return;
  canvas.style.display = 'block';
  confettiParticles = [];
  const colors = ['#f59e0b', '#eab308', '#10b981', '#8b5cf6', '#e879f9'];
  for (let i = 0; i < 70; i++) {
    confettiParticles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      life: 80
    });
  }
  requestAnimationFrame(updateConfetti);
}

function updateConfetti() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles = confettiParticles.filter((p) => p.life > 0);
  confettiParticles.forEach((p) => {
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
  if (confettiParticles.length > 0) {
    requestAnimationFrame(updateConfetti);
  } else {
    canvas.style.display = 'none';
  }
}

// =========================================================================
// BOOT
// =========================================================================

window.addEventListener('DOMContentLoaded', () => {
  ['count-cents-input', 'count-dollars-input'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keyup', (e) => { if (e.key === 'Enter') checkCountAnswer(); });
  });
  ['change-cents-input', 'change-dollars-input'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keyup', (e) => { if (e.key === 'Enter') checkChangeAnswer(); });
  });

  // The shared progress record, so XP earned here shows up on the hub.
  if (typeof SFQuest !== 'undefined') {
    SFQuest.init({ module: 'olivia-money', badgeTotal: BADGE_TOTAL });
  }

  renderCoinGallery();
  renderWorkedCountExample();
  updateStats();
  setActivityMode('course_lessons');

  /*
   * Build the printable test up front, whichever view is showing. The print
   * stylesheet force-shows #view-worksheet-gen, so the header's Print button
   * can be pressed from anywhere -- and without this it would produce a sheet
   * with a header, a footer and no questions at all, which is exactly the bug
   * the clock studio shipped with.
   */
  if (typeof SFUrl !== 'undefined') SFUrl.read(MONEY_URL_SCHEMA, moneyState);
  generatePrintableMoney();
});

/*
 * Last line of defence. If anything ever empties the grid, regenerate before
 * the print dialog rather than sending blank paper to the printer.
 */
window.addEventListener('beforeprint', () => {
  const grid = document.querySelector('#printable-money-doc .printable-money-grid');
  if (!grid || !grid.children.length) generatePrintableMoney();
});

/**
 * The money arithmetic, exposed for tests and for any future studio that needs
 * Canadian currency. Everything here is pure and takes integer cents.
 */
window.SFMoney = {
  COINS: COINS,
  BILLS: BILLS,
  /* The question decks, so their arithmetic can be checked by test rather
     than by proofreading. */
  STORIES: MONEY_STORY_PROBLEMS,
  CONTEST: MONEY_CONTEST_PUZZLES,
  COIN_ORDER: COIN_ORDER,
  DENOM_ORDER: DENOM_ORDER,
  valueOf: valueOf,
  sumCents: sumCents,
  formatMoney: formatMoney,
  formatCents: formatCents,
  fewestPieces: fewestPieces,
  pieceCount: pieceCount,
  describePieces: describePieces,
  changeFor: changeFor,
  roundToNickel: roundToNickel,
  countUpLadder: countUpLadder,
  randomPile: randomPile,
  randomPrice: randomPrice,
  paymentFor: paymentFor,
  state: moneyState
};
