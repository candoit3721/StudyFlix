/**
 * Sophia's Math Studio - "Fraction of a Remainder" word problem generator
 *
 * The Singapore Math / Waterloo Gauss problem family from the Set 2 and
 * Remainder Masterclass worksheets: an amount is cut down in steps, each step
 * taking a fraction of WHAT IS LEFT rather than of the start.
 *
 *   "Sophia had 6 2/3 L of orange juice. After giving 1/5 of it to her
 *    neighbour, she drank 1/8 of what she still had. She then used half of
 *    the remaining juice to make smoothies. What is the difference between
 *    what she had left and what she gave to her neighbour?"
 *
 * Every number is generated, not picked from a list. The fractions are chosen
 * first; the starting amount is then derived from them so that every
 * intermediate amount comes out clean -- a whole number of cookies or dollars,
 * or a mixed number with a small denominator for litres, kilograms and metres.
 * All arithmetic is exact (integer numerator/denominator pairs), so a worked
 * solution can never disagree with its own answer through rounding.
 *
 * Variants:
 *   diff        difference between what is left and the first share
 *   left        how much is left at the end
 *   middle      the amount taken in the middle step
 *   firstTwo    the first two steps added together
 *   fraction    what fraction of the original is left
 *   repeat      the same fraction taken three days running
 *   fixed       a fixed amount (not a fraction) taken in the middle step
 *   twoPeople   the first share goes to a second person; who has more left?
 *   backwards   the end amount is given; find the start
 */

const FractionRemainder = (function () {
  'use strict';

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /** Pick from [[value, weight], ...]. */
  function pickWeighted(entries) {
    const total = entries.reduce((sum, e) => sum + e[1], 0);
    let r = Math.random() * total;
    for (const [value, weight] of entries) {
      r -= weight;
      if (r < 0) return value;
    }
    return entries[entries.length - 1][0];
  }

  /* ---------------------------------------------------------------------
     Exact rational arithmetic
     --------------------------------------------------------------------- */

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  }

  function lcm(a, b) {
    return (a / gcd(a, b)) * b;
  }

  function Q(n, d = 1) {
    if (d < 0) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d) || 1;
    return { n: n / g, d: d / g };
  }

  const ONE = Q(1);
  const mul = (a, b) => Q(a.n * b.n, a.d * b.d);
  const div = (a, b) => Q(a.n * b.d, a.d * b.n);
  const add = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
  const sub = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
  const cmp = (a, b) => a.n * b.d - b.n * a.d;
  const parse = (s) => {
    const [n, d] = s.split('/').map(Number);
    return Q(n, d || 1);
  };

  /* ---------------------------------------------------------------------
     Formatting
     --------------------------------------------------------------------- */

  /** "6 2/3", "2/5", "3". Amounts here are never negative. */
  function mixedText(q) {
    if (q.d === 1) return String(q.n);
    const whole = Math.floor(q.n / q.d);
    const rem = q.n - whole * q.d;
    return whole ? `${whole} ${rem}/${q.d}` : `${rem}/${q.d}`;
  }

  function improperText(q) {
    return q.d === 1 ? String(q.n) : `${q.n}/${q.d}`;
  }

  /** Same markup as MathEngine.renderFractionHTML, so the studio CSS applies. */
  function mixedHTML(q) {
    if (q.d === 1) return `<span class="whole-num">${q.n}</span>`;
    const whole = Math.floor(q.n / q.d);
    const rem = q.n - whole * q.d;
    const frac = `<span class="fraction"><span class="numerator">${rem}</span><span class="fraction-line"></span><span class="denominator">${q.d}</span></span>`;
    return whole ? `<span class="mixed-whole">${whole}</span>${frac}` : frac;
  }

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------------------------------------------------------------------
     People
     --------------------------------------------------------------------- */

  const she = (name) => ({ name, he: 'she', him: 'her', his: 'her', self: 'herself' });
  const he = (name) => ({ name, he: 'he', him: 'him', his: 'his', self: 'himself' });

  const PEOPLE = [
    she('Sophia'), she('Olivia'), she('Emma'), she('Mia'), she('Ava'), she('Chloe'), she('Maya'), she('Zoe'),
    he('Lucas'), he('Noah'), he('Liam'), he('Ethan'), he('Benjamin'), he('Alexander')
  ];

  /* ---------------------------------------------------------------------
     Contexts

     Each context is a little story with three steps. `make(people)` fixes
     the random choices (who, which drink) and returns the story parts. A
     story function receives `fmt`, which renders amounts and fractions as
     either plain text (prompt, steps) or stacked-fraction HTML (worksheet).

     labels.t1/t2/t3/left describe the amount taken at each step and the
     amount left: `np` is a noun phrase for comparisons, `q` a direct
     question, `short` a step heading in the worked solution.
     --------------------------------------------------------------------- */

  const CONTEXTS = [
    {
      id: 'juice',
      kind: 'measure',
      unit: 'L',
      supports: ['fixed', 'twoPeople'],
      make: () => {
        const P = pick(PEOPLE);
        const drink = pick(['orange juice', 'lemonade', 'apple cider', 'fruit punch', 'maple iced tea']);
        const relation = pick(['neighbour', 'cousin', 'best friend']);
        return {
          P,
          noun: drink,
          intro: (fmt, amount) => amount
            ? `${P.name} had ${fmt.q(amount)} of ${drink}.`
            : `${P.name} had some ${drink}.`,
          steps: (fmt, [f1, f2, f3], { recipient, fixed } = {}) => {
            const to = recipient ? recipient.name : `${P.his} ${relation}`;
            const middle = fixed
              ? `${P.he} poured exactly ${fmt.q(fixed)} into a water bottle.`
              : `${P.he} drank ${fmt.f(f2)} of what ${P.he} still had.`;
            return `After giving ${fmt.f(f1)} of it to ${to}, ${middle} ${cap(P.he)} then used ${fmt.f(f3)} of the remaining ${drink} to make smoothies.`;
          },
          second: (fmt, Q2, g) => `Meanwhile, ${Q2.name} drank ${fmt.f(g)} of the ${drink} ${P.name} gave ${Q2.him}.`,
          labels: ({ recipient } = {}) => {
            const to = recipient ? recipient.name : `${P.his} ${relation}`;
            return {
              t1: { np: `what ${P.he} gave to ${to}`, q: `How much ${drink} did ${P.name} give to ${to}?`, short: `Given to ${to}` },
              t2: { np: `what ${P.he} drank`, q: `How much ${drink} did ${P.name} drink?`, short: 'Drunk', shortFixed: 'Poured into the bottle' },
              t3: { np: `what ${P.he} used for smoothies`, q: `How much ${drink} went into the smoothies?`, short: 'Used for smoothies' },
              left: { np: `what ${P.he} had left`, q: `How much ${drink} did ${P.name} have left?`, short: 'Left' }
            };
          },
          startQ: `How much ${drink} did ${P.name} have at the start?`,
          fractionQ: `What fraction of the ${drink} did ${P.name} have left at the end?`,
          endSentence: (fmt, amount) => `${cap(P.he)} had ${fmt.q(amount)} of ${drink} left.`
        };
      }
    },
    {
      id: 'paint',
      kind: 'measure',
      unit: 'L',
      supports: [],
      make: () => {
        const P = pick(PEOPLE);
        return {
          P,
          noun: 'paint',
          intro: (fmt, amount) => amount ? `Dad bought ${fmt.q(amount)} of paint.` : 'Dad bought some paint.',
          steps: (fmt, [f1, f2, f3]) =>
            `He used ${fmt.f(f1)} of it on the fence. ${P.name} accidentally spilled ${fmt.f(f2)} of what remained. Dad then used ${fmt.f(f3)} of the remaining paint on the shed.`,
          labels: () => ({
            t1: { np: 'the paint used on the fence', q: 'How much paint was used on the fence?', short: 'Used on the fence' },
            t2: { np: 'the paint that was spilled', q: 'How much paint was spilled?', short: 'Spilled' },
            t3: { np: 'the paint used on the shed', q: 'How much paint was used on the shed?', short: 'Used on the shed' },
            left: { np: 'the paint left over', q: 'How much paint was left over at the end?', short: 'Left over' }
          }),
          firstTwoQ: 'How much paint was used on the fence or spilled altogether?',
          startQ: 'How much paint did Dad buy?',
          fractionQ: 'What fraction of the paint Dad bought was left over?',
          endSentence: (fmt, amount) => `There was ${fmt.q(amount)} of paint left over.`
        };
      }
    },
    {
      id: 'milk',
      kind: 'measure',
      unit: 'L',
      supports: [],
      make: () => ({
        P: null,
        noun: 'milk',
        intro: (fmt, amount) => amount ? `There was ${fmt.q(amount)} of milk in the fridge.` : 'There was some milk in the fridge.',
        steps: (fmt, [f1, f2, f3]) =>
          `Mom gave ${fmt.f(f1)} of it to a neighbour. She used ${fmt.f(f2)} of what was still there to make pancakes. The family then drank ${fmt.f(f3)} of the remaining milk.`,
        labels: () => ({
          t1: { np: 'the milk Mom gave to the neighbour', q: 'How much milk did Mom give to the neighbour?', short: 'Given to the neighbour' },
          t2: { np: 'the milk used for pancakes', q: 'How much milk was used to make pancakes?', short: 'Used for pancakes' },
          t3: { np: 'the milk the family drank', q: 'How much milk did the family drink?', short: 'Drunk by the family' },
          left: { np: 'the milk left at the end', q: 'How much milk was left at the end?', short: 'Left' }
        }),
        firstTwoQ: 'How much milk did Mom give away and use for pancakes altogether?',
        startQ: 'How much milk was in the fridge at the start?',
        fractionQ: 'What fraction of the milk was left at the end?',
        endSentence: (fmt, amount) => `At the end, ${fmt.q(amount)} of milk was left.`
      })
    },
    {
      id: 'flour',
      kind: 'measure',
      unit: 'kg',
      supports: [],
      make: () => {
        const P = pick(PEOPLE);
        return {
          P,
          noun: 'flour',
          intro: (fmt, amount) => amount ? `Grandma had ${fmt.q(amount)} of flour.` : 'Grandma had some flour.',
          steps: (fmt, [f1, f2, f3]) =>
            `She used ${fmt.f(f1)} of it to bake bread. Then she used ${fmt.f(f2)} of the remaining flour to bake cookies. She gave ${fmt.f(f3)} of what was left to ${P.name}'s mom.`,
          labels: () => ({
            t1: { np: 'the flour used for bread', q: 'How much flour did Grandma use for the bread?', short: 'Used for bread' },
            t2: { np: 'the flour used for cookies', q: 'How much flour did Grandma use for the cookies?', short: 'Used for cookies' },
            t3: { np: `the flour she gave to ${P.name}'s mom`, q: `How much flour did Grandma give to ${P.name}'s mom?`, short: `Given to ${P.name}'s mom` },
            left: { np: 'the flour Grandma kept', q: 'How much flour did Grandma keep?', short: 'Kept' }
          }),
          firstTwoQ: 'How much flour did Grandma use for baking altogether (bread + cookies)?',
          startQ: 'How much flour did Grandma have at the start?',
          fractionQ: 'What fraction of her flour did Grandma keep?',
          endSentence: (fmt, amount) => `She kept the remaining ${fmt.q(amount)} of flour.`
        };
      }
    },
    {
      id: 'ribbon',
      kind: 'measure',
      unit: 'm',
      supports: ['fixed'],
      make: () => {
        const P = pick(PEOPLE);
        const material = pick(['ribbon', 'rope', 'piece of fabric']);
        const short = material === 'piece of fabric' ? 'fabric' : material;
        return {
          P,
          noun: short,
          intro: (fmt, amount) => amount
            ? `${P.name} had a ${material} ${fmt.q(amount)} long.`
            : `${P.name} had a long ${material}.`,
          steps: (fmt, [f1, f2, f3], { fixed } = {}) => {
            const middle = fixed
              ? `${cap(P.he)} then cut off exactly ${fmt.q(fixed)} for a bookmark.`
              : `${cap(P.he)} used ${fmt.f(f2)} of the remaining ${short} to make bows.`;
            return `${cap(P.he)} cut off ${fmt.f(f1)} of it to wrap a gift. ${middle} Then ${P.he} used ${fmt.f(f3)} of what was left for a class banner.`;
          },
          labels: () => ({
            t1: { np: 'the length used for the gift', q: 'How long was the piece used for the gift?', short: 'Used for the gift' },
            t2: { np: 'the length used for bows', q: `How much ${short} was used for the bows?`, short: 'Used for bows', shortFixed: 'Cut off for the bookmark' },
            t3: { np: 'the length used for the banner', q: `How much ${short} was used for the banner?`, short: 'Used for the banner' },
            left: { np: `the length of ${short} ${P.name} had left`, q: `How much ${short} did ${P.name} have left?`, short: 'Left' }
          }),
          firstTwoQ: `How much ${short} did ${P.name} use for the gift and the bows altogether?`,
          startQ: `How long was the ${material} at the start?`,
          fractionQ: `What fraction of the ${short} did ${P.name} have left?`,
          endSentence: (fmt, amount) => `${cap(P.he)} had ${fmt.q(amount)} of ${short} left.`
        };
      }
    },
    {
      id: 'pantry',
      kind: 'measure',
      unit: 'kg',
      supports: ['repeat'],
      make: () => {
        const food = pick(['sugar', 'rice', 'brown sugar', 'potting soil']);
        return {
          P: null,
          noun: food,
          intro: (fmt, amount) => amount ? `Mom had ${fmt.q(amount)} of ${food}.` : `Mom had some ${food}.`,
          steps: (fmt, [f1, f2, f3], { repeat } = {}) => repeat
            ? `She used ${fmt.f(f1)} of it. The next day she used ${fmt.f(f2)} of what was left. On the third day she used ${fmt.f(f3)} of what was left again.`
            : `On Monday she used ${fmt.f(f1)} of it. On Tuesday she used ${fmt.f(f2)} of what was left. On Wednesday she used ${fmt.f(f3)} of the remaining ${food}.`,
          labels: ({ repeat } = {}) => ({
            t1: { np: `the amount used on ${repeat ? 'Day 1' : 'Monday'}`, q: `How much ${food} did Mom use on ${repeat ? 'Day 1' : 'Monday'}?`, short: repeat ? 'Day 1' : 'Monday' },
            t2: { np: `the amount used on ${repeat ? 'Day 2' : 'Tuesday'}`, q: `How much ${food} did Mom use on ${repeat ? 'Day 2' : 'Tuesday'}?`, short: repeat ? 'Day 2' : 'Tuesday' },
            t3: { np: `the amount used on ${repeat ? 'Day 3' : 'Wednesday'}`, q: `How much ${food} did Mom use on ${repeat ? 'Day 3' : 'Wednesday'}?`, short: repeat ? 'Day 3' : 'Wednesday' },
            left: { np: 'the amount left', q: `How much ${food} was left after the three days?`, short: 'Left' }
          }),
          firstTwoQ: `How much ${food} did Mom use on the first two days altogether?`,
          startQ: `How much ${food} did Mom have at the start?`,
          fractionQ: `What fraction of the original ${food} was left?`,
          endSentence: (fmt, amount) => `She had ${fmt.q(amount)} of ${food} left.`
        };
      }
    },
    {
      id: 'allowance',
      kind: 'money',
      supports: [],
      make: () => {
        const P = pick(PEOPLE);
        const item = pick(['a book', 'a board game', 'art supplies', 'a hockey stick']);
        return {
          P,
          noun: 'money',
          intro: (fmt, amount) => amount ? `${P.name} had ${fmt.q(amount)}.` : `${P.name} had some money.`,
          steps: (fmt, [f1, f2, f3]) =>
            `${cap(P.he)} spent ${fmt.f(f1)} of it on ${item}. ${cap(P.he)} spent ${fmt.f(f2)} of the remaining money on snacks. ${cap(P.he)} then put ${fmt.f(f3)} of what was left into ${P.his} savings account.`,
          labels: () => ({
            t1: { np: `what ${P.he} spent on ${item}`, q: `How much did ${P.name} spend on ${item}?`, short: `Spent on ${item}` },
            t2: { np: `what ${P.he} spent on snacks`, q: `How much did ${P.name} spend on snacks?`, short: 'Spent on snacks' },
            t3: { np: 'what went into savings', q: `How much did ${P.name} put into savings?`, short: 'Put into savings' },
            left: { np: `the money ${P.he} had left in ${P.his} wallet`, q: `How much money did ${P.name} have left in ${P.his} wallet?`, short: 'Left in the wallet' }
          }),
          firstTwoQ: `How much did ${P.name} spend on ${item} and snacks altogether?`,
          startQ: `How much money did ${P.name} have at the start?`,
          fractionQ: `What fraction of ${P.his} money did ${P.name} have left in ${P.his} wallet?`,
          endSentence: (fmt, amount) => `${cap(P.he)} had ${fmt.q(amount)} left in ${P.his} wallet.`
        };
      }
    },
    {
      id: 'baking',
      kind: 'count',
      supports: ['twoPeople'],
      make: () => {
        const P = pick(PEOPLE);
        const item = pick(['maple cookies', 'blueberry muffins', 'granola bars', 'cupcakes', 'butter tarts']);
        return {
          P,
          noun: item,
          item,
          intro: (fmt, amount) => amount ? `${P.name} baked ${fmt.q(amount)}.` : `${P.name} baked a big batch of ${item}.`,
          steps: (fmt, [f1, f2, f3], { recipient } = {}) =>
            `${cap(P.he)} gave ${fmt.f(f1)} of them to ${recipient ? recipient.name : `${P.his} class`}. Of the remaining ${item}, ${P.he} gave ${fmt.f(f2)} to the neighbours. Finally, ${P.he} gave ${fmt.f(f3)} of what was left to ${P.his} family.`,
          second: (fmt, Q2, g) => `${Q2.name} then shared ${fmt.f(g)} of the ${item} ${Q2.he} got with ${Q2.his} soccer team.`,
          labels: ({ recipient } = {}) => ({
            t1: recipient
              ? { np: `the ${item} given to ${recipient.name}`, q: `How many ${item} did ${P.name} give to ${recipient.name}?`, short: `Given to ${recipient.name}` }
              : { np: `the ${item} given to the class`, q: `How many ${item} went to ${P.his} class?`, short: 'Given to the class' },
            t2: { np: `the ${item} given to the neighbours`, q: `How many ${item} went to the neighbours?`, short: 'Given to the neighbours' },
            t3: { np: `the ${item} given to ${P.his} family`, q: `How many ${item} went to ${P.his} family?`, short: 'Given to the family' },
            left: { np: `the ${item} ${P.he} kept for ${P.self}`, q: `How many ${item} did ${P.name} keep for ${P.self}?`, short: 'Kept' }
          }),
          firstTwoQ: `How many ${item} went to the class and the neighbours altogether?`,
          startQ: `How many ${item} did ${P.name} bake?`,
          fractionQ: `What fraction of the ${item} did ${P.name} keep for ${P.self}?`,
          endSentence: (fmt, amount) => `${cap(P.he)} kept ${fmt.q(amount)} for ${P.self}.`
        };
      }
    },
    {
      id: 'stickers',
      kind: 'count',
      supports: ['twoPeople'],
      make: () => {
        const P = pick(PEOPLE);
        const item = pick(['stickers', 'trading cards', 'marbles']);
        return {
          P,
          noun: item,
          item,
          intro: (fmt, amount) => amount ? `${P.name} had ${fmt.q(amount)}.` : `${P.name} had a collection of ${item}.`,
          steps: (fmt, [f1, f2, f3], { recipient } = {}) =>
            `${cap(P.he)} gave ${fmt.f(f1)} of them to ${recipient ? recipient.name : `${P.his} little brother`}. ${cap(P.he)} traded ${fmt.f(f2)} of the remaining ${item} at school. Then ${P.he} lost ${fmt.f(f3)} of what was left on the bus.`,
          second: (fmt, Q2, g) => `${Q2.name} later traded away ${fmt.f(g)} of the ${item} ${Q2.he} got.`,
          labels: ({ recipient } = {}) => ({
            t1: recipient
              ? { np: `the ${item} given to ${recipient.name}`, q: `How many ${item} did ${P.name} give to ${recipient.name}?`, short: `Given to ${recipient.name}` }
              : { np: `the ${item} given to ${P.his} brother`, q: `How many ${item} did ${P.name} give to ${P.his} brother?`, short: 'Given to the brother' },
            t2: { np: `the ${item} traded at school`, q: `How many ${item} did ${P.name} trade at school?`, short: 'Traded at school' },
            t3: { np: `the ${item} lost on the bus`, q: `How many ${item} were lost on the bus?`, short: 'Lost on the bus' },
            left: { np: `the ${item} ${P.he} had left`, q: `How many ${item} did ${P.name} have left?`, short: 'Left' }
          }),
          firstTwoQ: `How many ${item} did ${P.name} give away and trade altogether?`,
          startQ: `How many ${item} did ${P.name} have at the start?`,
          fractionQ: `What fraction of ${P.his} ${item} did ${P.name} have left?`,
          endSentence: (fmt, amount) => `${cap(P.he)} had ${fmt.q(amount)} left.`
        };
      }
    }
  ];

  /* ---------------------------------------------------------------------
     Choosing numbers
     --------------------------------------------------------------------- */

  // Fractions for the first two steps, weighted toward the friendly ones.
  const STEP_FRACTIONS = [
    ['1/2', 2], ['1/3', 4], ['2/3', 2], ['1/4', 4], ['3/4', 2], ['1/5', 4], ['2/5', 3], ['3/5', 2],
    ['1/6', 3], ['5/6', 1], ['1/7', 2], ['2/7', 2], ['3/7', 1], ['1/8', 3], ['3/8', 2], ['1/9', 2],
    ['2/9', 2], ['1/10', 2], ['3/10', 1], ['3/11', 1]
  ].map(([f, w]) => [parse(f), w]);

  // The last step is usually a simple split, as in the worksheets.
  const LAST_FRACTIONS = [
    ['1/2', 5], ['1/3', 2], ['2/3', 2], ['1/4', 2], ['3/4', 2], ['2/5', 1]
  ].map(([f, w]) => [parse(f), w]);

  const REPEAT_FRACTIONS = ['1/2', '1/3', '1/4', '1/5', '2/5'].map(parse);
  const SECOND_PERSON_FRACTIONS = ['1/2', '1/3', '2/3', '1/4', '3/4', '1/5', '2/5'].map(parse);

  // Denominators a measured start amount (and every amount after it) may use.
  const MEASURE_DENOMINATORS = [2, 3, 4, 5, 6, 8];

  const RANGES = {
    measure: { min: Q(2), max: Q(12) },
    money: { min: Q(20), max: Q(400) },
    count: { min: Q(12), max: Q(180) }
  };

  /**
   * Choose a start amount S for which S × m is clean for every multiplier m.
   *
   * With u the lcm of the multipliers' denominators, S = u·k/q makes every
   * S × m a whole multiple of 1/q. Money and counts use q = 1 (whole
   * numbers); measures use a small q and require S itself to be a proper
   * mixed number, so the problem opens with something like 6 2/3 L.
   */
  function chooseStart(kind, multipliers) {
    const u = multipliers.reduce((acc, m) => lcm(acc, m.d), 1);
    const range = RANGES[kind];
    const qs = kind === 'measure' ? MEASURE_DENOMINATORS : [1];
    const options = [];
    for (const q of qs) {
      for (let k = 1; k <= 400; k++) {
        const S = Q(u * k, q);
        if (cmp(S, range.max) > 0) break;
        if (cmp(S, range.min) < 0) continue;
        if (kind === 'measure' && S.d === 1) continue;
        options.push(S);
      }
    }
    return options.length ? pick(options) : null;
  }

  /** The chain S → (take f1) → (take f2) → (take f3), every amount exact. */
  function runChain(S, fractions, fixed) {
    const [f1, f2, f3] = fractions;
    const t1 = mul(S, f1);
    const r1 = sub(S, t1);
    const t2 = fixed ? fixed : mul(r1, f2);
    const r2 = sub(r1, t2);
    const t3 = mul(r2, f3);
    const r3 = sub(r2, t3);
    return { S, t1, r1, t2, r2, t3, r3 };
  }

  /** Multipliers of S for every amount in a fraction-only chain. */
  function chainMultipliers([f1, f2, f3]) {
    const k1 = sub(ONE, f1);
    const k2 = mul(k1, sub(ONE, f2));
    return [f1, k1, mul(k1, f2), k2, mul(k2, f3), mul(k2, sub(ONE, f3))];
  }

  const niceDenominator = (q) => q.d <= 12;

  /* ---------------------------------------------------------------------
     Formatters
     --------------------------------------------------------------------- */

  function formatters(ctx, kind, unit) {
    const qText = (q) => {
      if (kind === 'money') return `$${mixedText(q)}`;
      if (kind === 'count') return `${mixedText(q)} ${ctx.item}`;
      return `${mixedText(q)} ${unit}`;
    };
    const qHTML = (q) => {
      if (kind === 'money') return `$${mixedHTML(q)}`;
      if (kind === 'count') return `${mixedHTML(q)} ${ctx.item}`;
      return `${mixedHTML(q)}&nbsp;${unit}`;
    };
    const isHalf = (f) => f.n === 1 && f.d === 2;
    return {
      text: { q: qText, f: (f) => (isHalf(f) ? 'half' : improperText(f)) },
      html: { q: qHTML, f: (f) => (isHalf(f) ? 'half' : mixedHTML(f)) },
      // Worked solutions are plain text, like every other studio generator.
      amount: qText,
      value: (q) => (kind === 'money' ? `$${mixedText(q)}` : mixedText(q))
    };
  }

  /* ---------------------------------------------------------------------
     Problem assembly
     --------------------------------------------------------------------- */

  const VARIANTS_ALL = [
    ['diff', 4], ['left', 2], ['middle', 1], ['firstTwo', 1], ['fraction', 1],
    ['repeat', 1], ['fixed', 1], ['twoPeople', 1], ['backwards', 3]
  ];

  function contextsFor(variant) {
    const needs = { repeat: 'repeat', fixed: 'fixed', twoPeople: 'twoPeople' }[variant];
    if (variant === 'firstTwo') return CONTEXTS.filter((c) => c.id !== 'juice');
    return needs ? CONTEXTS.filter((c) => c.supports.includes(needs)) : CONTEXTS;
  }

  /** One attempt; returns null when the random choices do not work out. */
  function attempt(variant) {
    const context = pick(contextsFor(variant));
    const ctx = context.make();
    const kind = context.kind;
    const fmt = formatters(ctx, kind, context.unit);
    const opts = {};

    let fractions;
    if (variant === 'repeat') {
      const f = pick(REPEAT_FRACTIONS);
      fractions = [f, f, f];
      opts.repeat = true;
    } else {
      fractions = [pickWeighted(STEP_FRACTIONS), pickWeighted(STEP_FRACTIONS), pickWeighted(LAST_FRACTIONS)];
    }

    let g = null;
    let multipliers = chainMultipliers(fractions);
    if (variant === 'twoPeople') {
      opts.recipient = pick(PEOPLE.filter((p) => p !== ctx.P));
      g = pick(SECOND_PERSON_FRACTIONS);
      multipliers = multipliers.concat([mul(fractions[0], g), mul(fractions[0], sub(ONE, g))]);
    }
    if (variant === 'fixed') multipliers = [fractions[0], sub(ONE, fractions[0])];

    const S = chooseStart(kind, multipliers);
    if (!S) return null;

    if (variant === 'fixed') {
      // A fixed amount A taken from r1, leaving at least 1 unit so the last
      // step still splits cleanly. A is a friendly amount: a whole number,
      // a half or a quarter, or a multiple of r1's own denominator.
      const r1 = mul(S, sub(ONE, fractions[0]));
      const f3 = fractions[2];
      const step = Q(1, lcm(4, r1.d));
      const candidates = [];
      // At most half of what is there, so the fixed step reads as a side
      // errand rather than swallowing the story.
      for (let A = Q(1, 2); cmp(A, mul(r1, Q(1, 2))) <= 0 && cmp(sub(r1, A), ONE) >= 0; A = add(A, step)) {
        if (![1, 2, 4, r1.d].includes(A.d)) continue;
        const R2 = sub(r1, A);
        if (niceDenominator(R2) && niceDenominator(mul(R2, f3)) && niceDenominator(mul(R2, sub(ONE, f3)))) {
          candidates.push(A);
        }
      }
      if (!candidates.length) return null;
      opts.fixed = pick(candidates);
    }

    const c = runChain(S, fractions, opts.fixed);
    const amounts = [c.t1, c.r1, c.t2, c.r2, c.t3, c.r3];
    if (amounts.some((q) => q.n <= 0 || !niceDenominator(q))) return null;
    if (kind !== 'measure' && amounts.some((q) => q.d !== 1)) return null;

    let qLeft = null;
    if (variant === 'twoPeople') {
      qLeft = mul(c.t1, sub(ONE, g));
      if (cmp(qLeft, c.r3) === 0) return null;
    }
    // "What is the difference..." needs a difference.
    if ((variant === 'diff' || variant === 'fixed') && cmp(c.r3, c.t1) === 0) return null;

    return build(variant, ctx, kind, fmt, fractions, c, opts, g, qLeft);
  }

  function build(variant, ctx, kind, fmt, fractions, c, opts, g, qLeft) {
    const [f1, f2, f3] = fractions;
    const L = ctx.labels(opts);
    const backwards = variant === 'backwards';
    const t = fmt.text;
    const ft = (f) => improperText(f);

    // --- The question -------------------------------------------------
    let ask;
    let answer;
    let answerDisplay;
    let isFractionAnswer = false;
    let winner = null;

    switch (variant) {
      case 'left':
      case 'repeat':
        ask = L.left.q;
        answer = c.r3;
        break;
      case 'middle':
        ask = L.t2.q;
        answer = c.t2;
        break;
      case 'firstTwo':
        ask = ctx.firstTwoQ;
        answer = add(c.t1, c.t2);
        break;
      case 'fraction':
        ask = ctx.fractionQ;
        answer = div(c.r3, c.S);
        isFractionAnswer = true;
        break;
      case 'twoPeople': {
        const Q2 = opts.recipient;
        winner = cmp(c.r3, qLeft) > 0 ? ctx.P : Q2;
        ask = `Who has more ${ctx.noun} left, ${ctx.P.name} or ${Q2.name}? By how much?`;
        answer = cmp(c.r3, qLeft) > 0 ? sub(c.r3, qLeft) : sub(qLeft, c.r3);
        break;
      }
      case 'backwards':
        ask = ctx.startQ;
        answer = c.S;
        break;
      case 'diff':
      case 'fixed':
      default:
        ask = `What is the difference between ${L.left.np} and ${L.t1.np}?`;
        answer = cmp(c.r3, c.t1) > 0 ? sub(c.r3, c.t1) : sub(c.t1, c.r3);
        break;
    }

    const story = (f) => {
      const parts = [ctx.intro(f, backwards ? null : c.S), ctx.steps(f, fractions, opts)];
      if (variant === 'twoPeople') parts.push(ctx.second(f, opts.recipient, g));
      if (backwards) parts.push(ctx.endSentence(f, c.r3));
      return parts.join(' ');
    };

    const prompt = `${story(fmt.text)} ${ask}`;
    const htmlQuestion = `<div class="word-problem-text">${story(fmt.html)} <strong>${ask}</strong></div>`;

    // --- The worked solution ------------------------------------------
    // Counted things carry their noun only where the answer is stated, so a
    // worked line reads "112 − 14 = 98" rather than repeating "cookies".
    const A = kind === 'count' ? (q) => mixedText(q) : fmt.amount;
    const final = fmt.amount;
    const steps = [];

    if (backwards) {
      steps.push('Work backwards: undo the last step first. If a fraction f was taken, (1 − f) of the amount remained, so divide by (1 − f).');
      const undo = [
        [f3, c.r3, c.r2, L.t3.short],
        [f2, c.r2, c.r1, L.t2.short],
        [f1, c.r1, c.S, L.t1.short]
      ];
      undo.forEach(([f, after, before, label], i) => {
        const keep = sub(ONE, f);
        steps.push(`Undo step ${3 - i} (${label}): ${ft(f)} was taken, so ${ft(keep)} remained. Before it: ${mixedText(after)} ÷ ${ft(keep)} = ${A(before)}.`);
      });
      steps.push(`Check: ${mixedText(c.S)} × ${ft(sub(ONE, f1))} × ${ft(sub(ONE, f2))} × ${ft(sub(ONE, f3))} = ${mixedText(c.r3)}. Start: ${final(c.S)}.`);
    } else {
      if (kind === 'measure') {
        steps.push(`Change the start to an improper fraction: ${mixedText(c.S)} = ${improperText(c.S)}.`);
      }
      steps.push(`${L.t1.short}: ${ft(f1)} × ${improperText(c.S)} = ${A(c.t1)}. Left: ${mixedText(c.S)} − ${mixedText(c.t1)} = ${A(c.r1)}.`);
      if (opts.fixed) {
        steps.push(`${L.t2.shortFixed}: exactly ${A(c.t2)}. Left: ${mixedText(c.r1)} − ${mixedText(c.t2)} = ${A(c.r2)}.`);
      } else {
        steps.push(`${L.t2.short}: ${ft(f2)} of ${mixedText(c.r1)} = ${A(c.t2)}. Left: ${mixedText(c.r1)} − ${mixedText(c.t2)} = ${A(c.r2)}.`);
      }
      steps.push(`${L.t3.short}: ${ft(f3)} of ${mixedText(c.r2)} = ${A(c.t3)}. Left: ${mixedText(c.r2)} − ${mixedText(c.t3)} = ${A(c.r3)}.`);

      switch (variant) {
        case 'left':
        case 'repeat':
          steps.push(`${L.left.short} at the end: ${final(c.r3)}.`);
          break;
        case 'middle':
          steps.push(`${L.t2.short}: ${final(c.t2)}.`);
          break;
        case 'firstTwo':
          steps.push(`Together: ${mixedText(c.t1)} + ${mixedText(c.t2)} = ${final(answer)}.`);
          break;
        case 'fraction':
          steps.push(`Fraction left: ${mixedText(c.r3)} ÷ ${mixedText(c.S)} = ${ft(answer)} (or ${ft(sub(ONE, f1))} × ${ft(sub(ONE, f2))} × ${ft(sub(ONE, f3))} = ${ft(answer)}).`);
          break;
        case 'twoPeople': {
          const Q2 = opts.recipient;
          steps.push(`${Q2.name} got ${A(c.t1)} and gave up ${ft(g)}, keeping ${ft(sub(ONE, g))} × ${mixedText(c.t1)} = ${A(qLeft)}.`);
          const [hi, lo] = cmp(c.r3, qLeft) > 0 ? [c.r3, qLeft] : [qLeft, c.r3];
          steps.push(`${winner.name} has more: ${mixedText(hi)} − ${mixedText(lo)} = ${final(answer)}.`);
          break;
        }
        default: {
          const [hi, lo] = cmp(c.r3, c.t1) > 0 ? [c.r3, c.t1] : [c.t1, c.r3];
          steps.push(`Difference: ${mixedText(hi)} − ${mixedText(lo)} = ${final(answer)}.`);
        }
      }
    }

    // --- Answers --------------------------------------------------------
    const value = isFractionAnswer ? improperText(answer) : mixedText(answer);
    answerDisplay = isFractionAnswer ? value : final(answer);
    if (winner) answerDisplay = `${winner.name}, by ${final(answer)}`;

    const alts = new Set([value, improperText(answer), mixedText(answer), answerDisplay]);
    if (kind === 'money') alts.add(`$${value}`);
    if (kind === 'measure' && !isFractionAnswer) alts.add(`${value} ${ctx.unit || ''}`.trim());
    if (winner) {
      [`${winner.name} ${value}`, `${winner.name}, ${value}`, `${winner.name} by ${value}`, `${winner.name}, by ${value}`]
        .forEach((a) => alts.add(a));
    }

    // Keep a mixed number, and a number and its unit, on one line: "2 1/4 L"
    // must never wrap into "2" and "1/4 L".
    const glue = (line) => line
      .replace(/(\d) (?=\d+\/\d+)/g, '$1\u00a0')
      .replace(/(\d) (L|kg|m)\b/g, '$1\u00a0$2');
    steps.forEach((line, i) => { steps[i] = glue(line); });
    answerDisplay = glue(answerDisplay);

    // The answer key's worked chain: the arithmetic lines only, without the
    // teaching preamble (improper-fraction reminder, "work backwards" note).
    const keySteps = backwards ? steps.slice(1, 4) : steps.filter((line) => !line.startsWith('Change the start'));

    const hint = backwards
      ? `Start from the end (${final(c.r3)}) and undo each step: divide by the fraction that was LEFT after it.`
      : 'Draw a bar model. Each fraction is a fraction of what is LEFT at that moment, not of the start: if 1/5 is taken, 4/5 remains.';

    return {
      type: 'fraction_remainder',
      category: 'Fractions',
      topic: backwards ? 'Working Backwards (Fraction Chain)' : 'Fraction of a Remainder',
      prompt,
      htmlQuestion,
      equation: backwards
        ? `${mixedText(c.r3)} ÷ ${ft(sub(ONE, f3))} ÷ ${ft(sub(ONE, f2))} ÷ ${ft(sub(ONE, f1))} = ${mixedText(c.S)}`
        : `${mixedText(c.S)} → ${mixedText(c.r1)} → ${mixedText(c.r2)} → ${mixedText(c.r3)}`,
      answer: value,
      answerDisplay,
      altAnswers: Array.from(alts),
      steps,
      keySteps,
      hint,
      // Structured facts for tests: everything needed to re-derive the answer
      // independently of the text above.
      meta: {
        variant,
        context: ctx.noun,
        kind,
        start: c.S,
        fractions,
        fixed: opts.fixed || null,
        secondFraction: g,
        amounts: { t1: c.t1, r1: c.r1, t2: c.t2, r2: c.r2, t3: c.t3, r3: c.r3 },
        answer
      }
    };
  }

  /**
   * Generate one problem.
   * @param {'all'|'backwards'|string} mode 'all' mixes every variant; any
   *   variant name forces that variant.
   */
  function generate(mode = 'all') {
    for (let i = 0; i < 200; i++) {
      const variant = mode === 'all' ? pickWeighted(VARIANTS_ALL) : mode;
      const problem = attempt(variant);
      // Clean steps can still combine into an ugly answer (5 1/2 − 8/9 =
      // 4 11/18), so the answer is held to the same limit as every amount.
      // A "what fraction is left" answer is a fraction of the whole and is
      // allowed its natural denominator.
      if (problem && (variant === 'fraction' || niceDenominator(problem.meta.answer))) return problem;
    }
    throw new Error(`FractionRemainder: could not build a "${mode}" problem`);
  }

  return {
    generate,
    variants: VARIANTS_ALL.map(([v]) => v)
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FractionRemainder;
}
