/**
 * Sophia's Grade 5 & 6 Math Generator Engine
 * Comprehensive algorithmic problem generator supporting:
 * - Fractions & Mixed Numbers (Add, Sub, Mult, Div, Simplification, Unlike Denominators)
 * - Decimals (Add, Sub, Mult, Long Div, Conversions)
 * - Ratios, Rates & Proportions (Equivalent Ratios, Proportions, Unit Rates)
 * - Percentages (Percent of number, Finding percent, Discounts, Sales Tax)
 * - Order of Operations (PEMDAS with brackets & exponents)
 * - Integers & Negative Numbers (Add, Sub, Mult, Div, Absolute Value)
 * - Pre-Algebra & Equations (1-Step, 2-Step Equations, Expression Evaluation)
 * - Exponents, Factors & Multiples (Powers, GCF, LCM, Square Roots)
 * - Geometry & Measurement (Area, Perimeter, Volume, Angles)
 * - Statistics & Data (Mean, Median, Mode, Range)
 */

const MathEngine = (function () {
  // --- Math Utility Helpers ---
  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Greatest Common Divisor (Euclidean Algorithm)
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  // Least Common Multiple
  function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs((a * b) / gcd(a, b));
  }

  // Simplify fraction {n, d}
  function simplifyFraction(n, d) {
    if (d === 0) return { n: 0, d: 1 };
    if (d < 0) {
      n = -n;
      d = -d;
    }
    const divisor = gcd(n, d);
    return {
      n: n / divisor,
      d: d / divisor
    };
  }

  // Format fraction as HTML / text
  function formatFraction(n, d, isMixed = false) {
    const sim = simplifyFraction(n, d);
    if (sim.d === 1) return `${sim.n}`;
    if (isMixed && Math.abs(sim.n) > sim.d) {
      const whole = Math.floor(Math.abs(sim.n) / sim.d) * (sim.n < 0 ? -1 : 1);
      const rem = Math.abs(sim.n) % sim.d;
      if (rem === 0) return `${whole}`;
      return `${whole} ${rem}/${sim.d}`;
    }
    return `${sim.n}/${sim.d}`;
  }

  function renderFractionHTML(n, d, whole = 0) {
    if (d === 1) return `<span class="whole-num">${n}</span>`;
    let html = '';
    if (whole !== 0) {
      html += `<span class="mixed-whole">${whole}</span>`;
    }
    html += `<span class="fraction"><span class="numerator">${n}</span><span class="fraction-line"></span><span class="denominator">${d}</span></span>`;
    return html;
  }

  // --- Fraction Generators ---

  /**
   * Generates Fraction Addition or Subtraction problem
   * Options:
   * - op: 'add', 'sub', 'mixed'
   * - denominatorType: 'like', 'unlike', 'mixed_numbers'
   */
  function generateFractionAddSub(options = {}) {
    const opType = options.op || (Math.random() < 0.5 ? 'add' : 'sub');
    const subType = options.subType || 'unlike'; // 'like', 'unlike', 'mixed_numbers'

    let d1, d2, n1, n2, w1 = 0, w2 = 0;
    const denominatorsPool = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16];

    if (subType === 'like') {
      d1 = pickRandom([3, 4, 5, 6, 8, 10, 12]);
      d2 = d1;
      n1 = randomInt(1, d1 - 1);
      n2 = randomInt(1, d1 - 1);
    } else if (subType === 'mixed_numbers') {
      d1 = pickRandom([2, 3, 4, 5, 6, 8]);
      d2 = pickRandom([2, 3, 4, 5, 6, 8]);
      while (d1 === d2) {
        d2 = pickRandom([2, 3, 4, 5, 6, 8]);
      }
      n1 = randomInt(1, d1 - 1);
      n2 = randomInt(1, d2 - 1);
      w1 = randomInt(1, 4);
      w2 = randomInt(1, 3);
    } else {
      // unlike denominators
      d1 = pickRandom(denominatorsPool);
      d2 = pickRandom(denominatorsPool);
      while (d1 === d2) {
        d2 = pickRandom(denominatorsPool);
      }
      n1 = randomInt(1, d1 - 1);
      n2 = randomInt(1, d2 - 1);
    }

    // Convert to improper for calculation
    const improperN1 = w1 * d1 + n1;
    const improperN2 = w2 * d2 + n2;

    // If subtraction, ensure first >= second
    let val1 = improperN1 / d1;
    let val2 = improperN2 / d2;

    let finalW1 = w1, finalN1 = n1, finalD1 = d1;
    let finalW2 = w2, finalN2 = n2, finalD2 = d2;

    if (opType === 'sub' && val1 < val2) {
      finalW1 = w2; finalN1 = n2; finalD1 = d2;
      finalW2 = w1; finalN2 = n1; finalD2 = d1;
    }

    const impN1 = finalW1 * finalD1 + finalN1;
    const impN2 = finalW2 * finalD2 + finalN2;
    const commonD = lcm(finalD1, finalD2);
    const scaledN1 = impN1 * (commonD / finalD1);
    const scaledN2 = impN2 * (commonD / finalD2);

    const resultN = opType === 'add' ? scaledN1 + scaledN2 : scaledN1 - scaledN2;
    const simplified = simplifyFraction(resultN, commonD);

    // Format display string and step-by-step explanation
    const symbol = opType === 'add' ? '+' : '−';
    const term1Text = finalW1 ? `${finalW1} ${finalN1}/${finalD1}` : `${finalN1}/${finalD1}`;
    const term2Text = finalW2 ? `${finalW2} ${finalN2}/${finalD2}` : `${finalN2}/${finalD2}`;
    
    let answerText = formatFraction(simplified.n, simplified.d);
    let mixedAnswer = '';
    if (simplified.n > simplified.d && simplified.d > 1) {
      const wholePart = Math.floor(simplified.n / simplified.d);
      const remPart = simplified.n % simplified.d;
      mixedAnswer = remPart === 0 ? `${wholePart}` : `${wholePart} ${remPart}/${simplified.d}`;
    }

    // Step by step
    let steps = [];
    if (finalW1 || finalW2) {
      steps.push(`Convert mixed numbers to improper fractions: ${term1Text} = ${impN1}/${finalD1} and ${term2Text} = ${impN2}/${finalD2}.`);
    }
    if (finalD1 !== finalD2) {
      steps.push(`Find the Least Common Denominator (LCD) of ${finalD1} and ${finalD2}, which is ${commonD}.`);
      steps.push(`Rewrite fractions with LCD: ${impN1}/${finalD1} = ${scaledN1}/${commonD}, and ${impN2}/${finalD2} = ${scaledN2}/${commonD}.`);
    }
    steps.push(`${opType === 'add' ? 'Add' : 'Subtract'} the numerators: (${scaledN1} ${symbol} ${scaledN2}) / ${commonD} = ${resultN}/${commonD}.`);
    if (gcd(resultN, commonD) > 1) {
      steps.push(`Simplify by dividing numerator and denominator by GCF (${gcd(resultN, commonD)}): ${resultN}/${commonD} = ${simplified.n}/${simplified.d}.`);
    }
    if (mixedAnswer) {
      steps.push(`Convert to mixed number: ${mixedAnswer}.`);
    }

    const htmlQuestion = `<div class="math-expr">${renderFractionHTML(finalN1, finalD1, finalW1)} <span class="math-op">${symbol}</span> ${renderFractionHTML(finalN2, finalD2, finalW2)} = </div>`;

    return {
      type: 'fractions_add_sub',
      category: 'Fractions',
      topic: `Fraction ${opType === 'add' ? 'Addition' : 'Subtraction'}`,
      prompt: `${term1Text} ${symbol} ${term2Text} = ?`,
      htmlQuestion,
      answer: answerText,
      altAnswers: mixedAnswer ? [mixedAnswer, answerText, `${simplified.n}/${simplified.d}`] : [answerText, `${simplified.n}/${simplified.d}`],
      steps,
      hint: finalD1 !== finalD2 ? `Find the common denominator for ${finalD1} and ${finalD2} first (LCD = ${commonD}).` : `Denominators match! Keep the denominator ${finalD1} and ${opType === 'add' ? 'add' : 'subtract'} the numerators.`
    };
  }

  /**
   * Generates Fraction Multiplication problem
   * Options:
   * - subType: 'fraction_fraction', 'fraction_whole', 'mixed_numbers'
   */
  function generateFractionMult(options = {}) {
    const subType = options.subType || pickRandom(['fraction_fraction', 'fraction_fraction', 'fraction_whole', 'mixed_numbers']);
    let n1, d1, n2, d2, w1 = 0, w2 = 0;

    if (subType === 'fraction_whole') {
      w1 = 0;
      d1 = pickRandom([2, 3, 4, 5, 6, 8]);
      n1 = randomInt(1, d1 - 1);
      n2 = randomInt(2, 9);
      d2 = 1;
    } else if (subType === 'mixed_numbers') {
      w1 = randomInt(1, 3);
      d1 = pickRandom([2, 3, 4, 5]);
      n1 = randomInt(1, d1 - 1);
      w2 = randomInt(1, 2);
      d2 = pickRandom([2, 3, 4, 5]);
      n2 = randomInt(1, d2 - 1);
    } else {
      // fraction x fraction
      d1 = pickRandom([2, 3, 4, 5, 6, 7, 8, 9, 10]);
      n1 = randomInt(1, d1 - 1);
      d2 = pickRandom([2, 3, 4, 5, 6, 7, 8, 9, 10]);
      n2 = randomInt(1, d2 - 1);
    }

    const impN1 = w1 * d1 + n1;
    const impN2 = w2 * d2 + n2;

    const rawNumerator = impN1 * impN2;
    const rawDenominator = d1 * d2;
    const simplified = simplifyFraction(rawNumerator, rawDenominator);

    const term1Text = w1 ? `${w1} ${n1}/${d1}` : `${n1}/${d1}`;
    const term2Text = d2 === 1 ? `${n2}` : (w2 ? `${w2} ${n2}/${d2}` : `${n2}/${d2}`);

    let answerText = formatFraction(simplified.n, simplified.d);
    let mixedAnswer = '';
    if (simplified.n > simplified.d && simplified.d > 1) {
      const wholePart = Math.floor(simplified.n / simplified.d);
      const remPart = simplified.n % simplified.d;
      mixedAnswer = remPart === 0 ? `${wholePart}` : `${wholePart} ${remPart}/${simplified.d}`;
    }

    let steps = [];
    if (w1 || w2) {
      steps.push(`Convert any mixed numbers to improper fractions: ${term1Text} = ${impN1}/${d1}, ${term2Text} = ${impN2}/${d2}.`);
    }
    steps.push(`Multiply straight across: Numerators (${impN1} × ${impN2} = ${rawNumerator}) and Denominators (${d1} × ${d2} = ${rawDenominator}).`);
    steps.push(`Result before simplifying: ${rawNumerator}/${rawDenominator}.`);
    if (gcd(rawNumerator, rawDenominator) > 1) {
      steps.push(`Simplify by dividing numerator and denominator by GCF (${gcd(rawNumerator, rawDenominator)}): ${simplified.n}/${simplified.d}.`);
    }
    if (mixedAnswer) {
      steps.push(`Convert to mixed number: ${mixedAnswer}.`);
    }

    const htmlQuestion = `<div class="math-expr">${renderFractionHTML(n1, d1, w1)} <span class="math-op">×</span> ${d2 === 1 ? `<span class="whole-num">${n2}</span>` : renderFractionHTML(n2, d2, w2)} = </div>`;

    return {
      type: 'fractions_mult',
      category: 'Fractions',
      topic: 'Fraction Multiplication',
      prompt: `${term1Text} × ${term2Text} = ?`,
      htmlQuestion,
      answer: answerText,
      altAnswers: mixedAnswer ? [mixedAnswer, answerText, `${simplified.n}/${simplified.d}`] : [answerText, `${simplified.n}/${simplified.d}`],
      steps,
      hint: `Multiply numerators together, then multiply denominators together. Simplify the resulting fraction.`
    };
  }

  /**
   * Generates Fraction Division problem (Keep-Change-Flip)
   */
  function generateFractionDiv(options = {}) {
    const subType = options.subType || pickRandom(['fraction_fraction', 'fraction_whole', 'whole_fraction', 'mixed_numbers']);
    let n1, d1, n2, d2, w1 = 0, w2 = 0;

    if (subType === 'fraction_whole') {
      d1 = pickRandom([2, 3, 4, 5, 6]);
      n1 = randomInt(1, d1 - 1);
      n2 = randomInt(2, 6);
      d2 = 1;
    } else if (subType === 'whole_fraction') {
      n1 = randomInt(2, 6);
      d1 = 1;
      d2 = pickRandom([2, 3, 4, 5, 6]);
      n2 = randomInt(1, d2 - 1);
    } else if (subType === 'mixed_numbers') {
      w1 = randomInt(1, 2);
      d1 = pickRandom([2, 3, 4]);
      n1 = randomInt(1, d1 - 1);
      w2 = randomInt(1, 2);
      d2 = pickRandom([2, 3, 4]);
      n2 = randomInt(1, d2 - 1);
    } else {
      d1 = pickRandom([2, 3, 4, 5, 6, 8]);
      n1 = randomInt(1, d1 - 1);
      d2 = pickRandom([2, 3, 4, 5, 6, 8]);
      n2 = randomInt(1, d2 - 1);
    }

    const impN1 = w1 * d1 + n1;
    const impN2 = w2 * d2 + n2;

    // Division is Multiply by reciprocal of 2nd: (impN1 / d1) * (d2 / impN2)
    const rawNumerator = impN1 * d2;
    const rawDenominator = d1 * impN2;
    const simplified = simplifyFraction(rawNumerator, rawDenominator);

    const term1Text = d1 === 1 ? `${n1}` : (w1 ? `${w1} ${n1}/${d1}` : `${n1}/${d1}`);
    const term2Text = d2 === 1 ? `${n2}` : (w2 ? `${w2} ${n2}/${d2}` : `${n2}/${d2}`);

    let answerText = formatFraction(simplified.n, simplified.d);
    let mixedAnswer = '';
    if (simplified.n > simplified.d && simplified.d > 1) {
      const wholePart = Math.floor(simplified.n / simplified.d);
      const remPart = simplified.n % simplified.d;
      mixedAnswer = remPart === 0 ? `${wholePart}` : `${wholePart} ${remPart}/${simplified.d}`;
    }

    let steps = [
      `Apply Keep-Change-Flip (KCF):`,
      `1. KEEP the first fraction: ${term1Text} = ${impN1}/${d1}`,
      `2. CHANGE division (÷) to multiplication (×)`,
      `3. FLIP the second fraction to its reciprocal: ${term2Text} = ${impN2}/${d2} ➔ ${d2}/${impN2}`,
      `Multiply: (${impN1} × ${d2}) / (${d1} × ${impN2}) = ${rawNumerator}/${rawDenominator}.`
    ];
    if (gcd(rawNumerator, rawDenominator) > 1) {
      steps.push(`Simplify by dividing by GCF (${gcd(rawNumerator, rawDenominator)}): ${simplified.n}/${simplified.d}.`);
    }
    if (mixedAnswer) {
      steps.push(`Convert to mixed number: ${mixedAnswer}.`);
    }

    const htmlQuestion = `<div class="math-expr">${d1 === 1 ? `<span class="whole-num">${n1}</span>` : renderFractionHTML(n1, d1, w1)} <span class="math-op">÷</span> ${d2 === 1 ? `<span class="whole-num">${n2}</span>` : renderFractionHTML(n2, d2, w2)} = </div>`;

    return {
      type: 'fractions_div',
      category: 'Fractions',
      topic: 'Fraction Division (Keep-Change-Flip)',
      prompt: `${term1Text} ÷ ${term2Text} = ?`,
      htmlQuestion,
      answer: answerText,
      altAnswers: mixedAnswer ? [mixedAnswer, answerText, `${simplified.n}/${simplified.d}`] : [answerText, `${simplified.n}/${simplified.d}`],
      steps,
      hint: `Remember "Keep, Change, Flip"! Keep the 1st fraction, change ÷ to ×, and flip the 2nd fraction upside-down.`
    };
  }

  // --- Decimal Operations ---

  /**
   * Generates Decimal Operations (+, -, x, /)
   */
  function generateDecimals(options = {}) {
    const op = options.op || pickRandom(['add', 'sub', 'mult', 'div']);

    if (op === 'add' || op === 'sub') {
      const places1 = randomInt(1, 2);
      const places2 = randomInt(1, 2);
      let num1 = parseFloat((randomInt(10, 999) / Math.pow(10, places1)).toFixed(places1));
      let num2 = parseFloat((randomInt(10, 999) / Math.pow(10, places2)).toFixed(places2));

      if (op === 'sub' && num1 < num2) {
        const tmp = num1; num1 = num2; num2 = tmp;
      }

      const isAdd = op === 'add';
      const ansVal = isAdd ? (num1 + num2) : (num1 - num2);
      const ansStr = parseFloat(ansVal.toFixed(3)).toString();
      const symbol = isAdd ? '+' : '−';

      const steps = [
        `Align the decimal points vertically:`,
        `  ${num1}`,
        `${symbol} ${num2}`,
        `Pad empty trailing decimal places with zero if needed.`,
        `${isAdd ? 'Add' : 'Subtract'} column by column from right to left, carrying or borrowing as necessary.`,
        `Bring the decimal point straight down into the answer: ${ansStr}.`
      ];

      return {
        type: 'decimals_add_sub',
        category: 'Decimals',
        topic: `Decimal ${isAdd ? 'Addition' : 'Subtraction'}`,
        prompt: `${num1} ${symbol} ${num2} = ?`,
        htmlQuestion: `<div class="math-expr"><span class="whole-num">${num1}</span> <span class="math-op">${symbol}</span> <span class="whole-num">${num2}</span> = </div>`,
        answer: ansStr,
        altAnswers: [ansStr],
        steps,
        hint: `Line up the decimal points vertically before ${isAdd ? 'adding' : 'subtracting'}.`
      };
    } else if (op === 'mult') {
      const p1 = randomInt(1, 2);
      const p2 = randomInt(1, 2);
      const int1 = randomInt(12, 65);
      const int2 = randomInt(3, 35);
      const num1 = parseFloat((int1 / Math.pow(10, p1)).toFixed(p1));
      const num2 = parseFloat((int2 / Math.pow(10, p2)).toFixed(p2));

      const ansVal = parseFloat((num1 * num2).toFixed(4));
      const ansStr = ansVal.toString();
      const totalDecPlaces = (num1.toString().split('.')[1] || '').length + (num2.toString().split('.')[1] || '').length;

      const steps = [
        `Multiply the numbers as whole numbers without decimal points: ${Math.round(num1 * Math.pow(10, p1))} × ${Math.round(num2 * Math.pow(10, p2))} = ${Math.round(num1 * Math.pow(10, p1)) * Math.round(num2 * Math.pow(10, p2))}.`,
        `Count the total number of decimal places in both factors: ${num1} has ${(num1.toString().split('.')[1]||'').length}, ${num2} has ${(num2.toString().split('.')[1]||'').length} (Total = ${totalDecPlaces} decimal places).`,
        `Place the decimal point ${totalDecPlaces} places from the right in the product: ${ansStr}.`
      ];

      return {
        type: 'decimals_mult',
        category: 'Decimals',
        topic: 'Decimal Multiplication',
        prompt: `${num1} × ${num2} = ?`,
        htmlQuestion: `<div class="math-expr"><span class="whole-num">${num1}</span> <span class="math-op">×</span> <span class="whole-num">${num2}</span> = </div>`,
        answer: ansStr,
        altAnswers: [ansStr],
        steps,
        hint: `Multiply like regular numbers first, then count total decimal places in both factors to position your decimal point.`
      };
    } else {
      // Division: ensure clean terminating decimal quotients
      const divisorChoices = [2, 4, 5, 8, 1.2, 0.4, 0.5, 0.25, 1.5, 2.5, 0.8];
      const divisor = pickRandom(divisorChoices);
      const quotient = randomInt(4, 45) * 0.5; // clean quotient
      const dividend = parseFloat((divisor * quotient).toFixed(3));
      const ansStr = quotient.toString();

      const steps = [
        `If the divisor (${divisor}) is a decimal, shift decimal point to make it a whole number. Shift dividend (${dividend}) the same number of places.`,
        `Divide as normal and bring the decimal point straight up into the quotient.`,
        `Final quotient: ${ansStr}.`
      ];

      return {
        type: 'decimals_div',
        category: 'Decimals',
        topic: 'Decimal Long Division',
        prompt: `${dividend} ÷ ${divisor} = ?`,
        htmlQuestion: `<div class="math-expr"><span class="whole-num">${dividend}</span> <span class="math-op">÷</span> <span class="whole-num">${divisor}</span> = </div>`,
        answer: ansStr,
        altAnswers: [ansStr],
        steps,
        hint: `If divisor has a decimal, move the decimal right in both divisor and dividend until the divisor is a whole number.`
      };
    }
  }

  // --- Ratios, Rates & Proportions ---

  /**
   * Generates Ratios & Proportions problems
   */
  function generateRatiosAndProportions() {
    const subType = pickRandom(['proportion_solve', 'ratio_simplify', 'unit_rate']);

    if (subType === 'proportion_solve') {
      // a / b = c / x or a:b = c:x
      const a = randomInt(2, 9);
      const b = randomInt(3, 12);
      const scale = randomInt(2, 8);
      const c = a * scale;
      const x = b * scale;

      const formats = [
        { q: `${a} : ${b} = ${c} : x`, text: `Solve for x: ${a} : ${b} = ${c} : x` },
        { q: `\\frac{${a}}{${b}} = \\frac{${c}}{x}`, text: `Solve for x: ${a}/${b} = ${c}/x` }
      ];
      const selected = formats[0];

      const steps = [
        `Set up cross-multiplication: ${a} × x = ${b} × ${c}`,
        `Multiply the known terms: ${b} × ${c} = ${b * c}`,
        `Divide by ${a}: x = ${b * c} ÷ ${a} = ${x}.`
      ];

      return {
        type: 'proportion_solve',
        category: 'Ratios & Proportions',
        topic: 'Solving Proportions',
        prompt: selected.text,
        htmlQuestion: `<div class="math-expr"><span class="whole-num">${a}</span> : <span class="whole-num">${b}</span> = <span class="whole-num">${c}</span> : <span class="math-var">x</span> &nbsp;&nbsp;(x = ?)</div>`,
        answer: x.toString(),
        altAnswers: [x.toString(), `x=${x}`, `x = ${x}`],
        steps,
        hint: `Use cross multiplication (${a} × x = ${b} × ${c}) or find the scale factor from ${a} to ${c} (multiply by ${scale}).`
      };
    } else if (subType === 'ratio_simplify') {
      const divisor = pickRandom([2, 3, 4, 5, 6, 8]);
      const s1 = randomInt(2, 9);
      let s2 = randomInt(2, 9);
      while (gcd(s1, s2) > 1 || s1 === s2) {
        s2 = randomInt(2, 9);
      }
      const r1 = s1 * divisor;
      const r2 = s2 * divisor;

      const steps = [
        `Find the Greatest Common Factor (GCF) of ${r1} and ${r2}, which is ${divisor}.`,
        `Divide both terms by ${divisor}: ${r1} ÷ ${divisor} = ${s1}, and ${r2} ÷ ${divisor} = ${s2}.`,
        `Simplified ratio: ${s1}:${s2}.`
      ];

      return {
        type: 'ratio_simplify',
        category: 'Ratios & Proportions',
        topic: 'Simplifying Ratios',
        prompt: `Simplify the ratio ${r1} : ${r2} to lowest terms`,
        htmlQuestion: `<div class="math-expr">Simplify: <span class="whole-num">${r1}</span> : <span class="whole-num">${r2}</span> = </div>`,
        answer: `${s1}:${s2}`,
        altAnswers: [`${s1}:${s2}`, `${s1} : ${s2}`, `${s1}/${s2}`],
        steps,
        hint: `Divide both numbers in the ratio by their greatest common factor (GCF = ${divisor}).`
      };
    } else {
      // Unit rate
      const rateItems = [
        { unit: 'miles per hour', entity: 'car', action: 'travels', item1: 'miles', item2: 'hours', rate: randomInt(35, 75), count: randomInt(2, 6) },
        { unit: 'dollars per book', entity: 'bookstore', action: 'sells', item1: 'dollars', item2: 'books', rate: randomInt(4, 18), count: randomInt(3, 8) },
        { unit: 'pages per hour', entity: 'Sophia', action: 'reads', item1: 'pages', item2: 'hours', rate: randomInt(20, 45), count: randomInt(2, 5) },
        { unit: 'words per minute', entity: 'student', action: 'types', item1: 'words', item2: 'minutes', rate: randomInt(30, 60), count: randomInt(2, 5) }
      ];
      const r = pickRandom(rateItems);
      const totalAmount = r.rate * r.count;

      const steps = [
        `Identify the total amount (${totalAmount} ${r.item1}) and the number of units (${r.count} ${r.item2}).`,
        `Divide total by units: ${totalAmount} ÷ ${r.count} = ${r.rate}.`,
        `Unit rate: ${r.rate} ${r.unit}.`
      ];

      return {
        type: 'unit_rate',
        category: 'Ratios & Proportions',
        topic: 'Unit Rates',
        prompt: `If a ${r.entity} ${r.action} ${totalAmount} ${r.item1} in ${r.count} ${r.item2}, what is the unit rate?`,
        htmlQuestion: `<div class="math-expr"><span class="whole-num">${totalAmount} ${r.item1}</span> in <span class="whole-num">${r.count} ${r.item2}</span> = &nbsp;<span class="unit-box">? ${r.unit}</span></div>`,
        answer: r.rate.toString(),
        altAnswers: [r.rate.toString(), `${r.rate} ${r.unit}`],
        steps,
        hint: `Divide the total ${r.item1} (${totalAmount}) by the number of ${r.item2} (${r.count}).`
      };
    }
  }

  // --- Percentages ---

  /**
   * Generates Percentage Problems
   */
  function generatePercentages() {
    const subType = pickRandom(['percent_of_number', 'find_percent', 'discount_tax']);

    if (subType === 'percent_of_number') {
      const percents = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90, 120];
      const p = pickRandom(percents);
      const baseChoices = [20, 30, 40, 50, 60, 80, 100, 120, 150, 160, 200, 240, 300, 400, 500];
      const base = pickRandom(baseChoices);
      const result = parseFloat(((p / 100) * base).toFixed(2));

      const steps = [
        `Convert ${p}% to a fraction or decimal: ${p}% = ${p}/100 = ${p / 100}.`,
        `Multiply by the base amount: ${p / 100} × ${base} = ${result}.`
      ];

      return {
        type: 'percent_of_number',
        category: 'Percentages',
        topic: 'Percent of a Quantity',
        prompt: `What is ${p}% of ${base}?`,
        htmlQuestion: `<div class="math-expr">What is <span class="whole-num">${p}%</span> of <span class="whole-num">${base}</span>?</div>`,
        answer: result.toString(),
        altAnswers: [result.toString()],
        steps,
        hint: `Change ${p}% to a decimal (${p / 100}) and multiply by ${base}.`
      };
    } else if (subType === 'find_percent') {
      const bases = [10, 20, 25, 40, 50, 80, 100, 200];
      const base = pickRandom(bases);
      const pChoices = [10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90];
      const p = pickRandom(pChoices);
      const part = (p / 100) * base;

      const steps = [
        `Write as a fraction: ${part} / ${base}.`,
        `Convert to decimal: ${part} ÷ ${base} = ${p / 100}.`,
        `Multiply by 100 to get percent: ${p / 100} × 100 = ${p}%.`
      ];

      return {
        type: 'find_percent',
        category: 'Percentages',
        topic: 'Finding the Percentage',
        prompt: `${part} is what percent of ${base}?`,
        htmlQuestion: `<div class="math-expr"><span class="whole-num">${part}</span> is what % of <span class="whole-num">${base}</span>?</div>`,
        answer: `${p}%`,
        altAnswers: [`${p}%`, `${p}`],
        steps,
        hint: `Divide the part (${part}) by the whole (${base}), then multiply by 100.`
      };
    } else {
      // Discount / Sales Tax
      const isDiscount = Math.random() < 0.5;
      const originalPrice = randomInt(3, 20) * 10; // 30 to 200
      const percent = pickRandom([10, 15, 20, 25, 30, 40, 50]);
      const diff = parseFloat(((percent / 100) * originalPrice).toFixed(2));
      const finalPrice = isDiscount ? (originalPrice - diff) : (originalPrice + diff);

      const steps = [
        `Calculate the ${isDiscount ? 'discount' : 'tax'} amount: ${percent}% of \$${originalPrice} = 0.${percent < 10 ? '0' + percent : percent} × \$${originalPrice} = \$${diff}.`,
        `${isDiscount ? 'Subtract discount from' : 'Add tax to'} original price: \$${originalPrice} ${isDiscount ? '−' : '+'} \$${diff} = \$${finalPrice}.`
      ];

      return {
        type: 'discount_tax',
        category: 'Percentages',
        topic: isDiscount ? 'Discounts & Sale Price' : 'Sales Tax & Total Price',
        prompt: `An item costs \$${originalPrice}. If there is a ${percent}% ${isDiscount ? 'discount' : 'sales tax'}, what is the final price?`,
        htmlQuestion: `<div class="math-expr">Original: <span class="whole-num">\$${originalPrice}</span> with <span class="whole-num">${percent}% ${isDiscount ? 'OFF' : 'tax'}</span> = <span class="math-blank">\$?</span></div>`,
        answer: `\$${finalPrice}`,
        altAnswers: [`\$${finalPrice}`, `${finalPrice}`, `${finalPrice.toFixed(2)}`, `\$${finalPrice.toFixed(2)}`],
        steps,
        hint: `Find ${percent}% of \$${originalPrice} (\$${diff}), then ${isDiscount ? 'subtract it' : 'add it'}.`
      };
    }
  }

  // --- Order of Operations (PEMDAS) ---

  /**
   * Generates Order of Operations (PEMDAS) problems
   */
  function generatePEMDAS() {
    const templates = [
      // 1. Parentheses + Mult + Add
      () => {
        const a = randomInt(2, 8);
        const b = randomInt(2, 6);
        const c = randomInt(3, 9);
        const d = randomInt(2, 7);
        const expr = `${a} + ${b} × (${c} + ${d})`;
        const ans = a + b * (c + d);
        const steps = [
          `Parentheses first: (${c} + ${d}) = ${c + d}`,
          `Multiplication next: ${b} × ${c + d} = ${b * (c + d)}`,
          `Addition last: ${a} + ${b * (c + d)} = ${ans}`
        ];
        return { expr, ans, steps };
      },
      // 2. Exponent + Subtraction + Division
      () => {
        const base = pickRandom([2, 3, 4, 5]);
        const exp = pickRandom([2, 3]);
        const powVal = Math.pow(base, exp);
        const mult = randomInt(2, 4);
        const sub = randomInt(3, 8);
        const expr = `${base}^${exp} + ${mult * 6} ÷ 3 − ${sub}`;
        const ans = powVal + (mult * 6) / 3 - sub;
        const steps = [
          `Exponents first: ${base}^${exp} = ${powVal}`,
          `Division next: ${mult * 6} ÷ 3 = ${(mult * 6) / 3}`,
          `Addition & Subtraction from left to right: ${powVal} + ${(mult * 6) / 3} − ${sub} = ${ans}`
        ];
        return { expr, ans, steps };
      },
      // 3. Nested operations with brackets
      () => {
        const a = randomInt(3, 8);
        const b = randomInt(2, 5);
        const c = randomInt(1, 4);
        const inner = b * c;
        const numerator = a + inner;
        const cleanD = (numerator % 2 === 0) ? 2 : (numerator % 3 === 0 ? 3 : 1);
        const actualExpr = `( ${a} + ${b} × ${c} ) ÷ ${cleanD}`;
        const ans = (a + inner) / cleanD;
        const steps = [
          `Inside parentheses, do multiplication first: ${b} × ${c} = ${inner}`,
          `Finish parentheses: ${a} + ${inner} = ${a + inner}`,
          `Divide: ${a + inner} ÷ ${cleanD} = ${ans}`
        ];
        return { expr: actualExpr, ans, steps };
      },
      // 4. Two operations with division and multiplication
      () => {
        const a = randomInt(20, 60);
        const b = pickRandom([2, 3, 4, 5]);
        const cleanA = a - (a % b); // divisible
        const c = randomInt(2, 6);
        const d = randomInt(5, 15);
        const expr = `${cleanA} ÷ ${b} × ${c} + ${d}`;
        const divRes = cleanA / b;
        const multRes = divRes * c;
        const ans = multRes + d;
        const steps = [
          `Multiplication and division have equal priority, perform left-to-right:`,
          `1. Division: ${cleanA} ÷ ${b} = ${divRes}`,
          `2. Multiplication: ${divRes} × ${c} = ${multRes}`,
          `3. Addition: ${multRes} + ${d} = ${ans}`
        ];
        return { expr, ans, steps };
      }
    ];

    const chosen = pickRandom(templates)();
    const formattedHtml = chosen.expr
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/x/g, '×')
      .replace(/\*/g, '×')
      .replace(/\//g, '÷');

    return {
      type: 'pemdas',
      category: 'Order of Operations',
      topic: 'PEMDAS / Numerical Expressions',
      prompt: `Evaluate: ${chosen.expr}`,
      htmlQuestion: `<div class="math-expr">${formattedHtml} = </div>`,
      answer: chosen.ans.toString(),
      altAnswers: [chosen.ans.toString()],
      steps: chosen.steps,
      hint: `Follow PEMDAS order: 1. Parentheses, 2. Exponents, 3. Multiply & Divide (left to right), 4. Add & Subtract (left to right).`
    };
  }

  // --- Integers & Negative Numbers ---

  /**
   * Generates Integers Operations
   */
  function generateIntegers() {
    const op = pickRandom(['add', 'sub', 'mult', 'div', 'abs_val']);

    if (op === 'add') {
      const a = randomInt(-25, 25);
      const b = randomInt(-25, 25);
      const ans = a + b;
      const steps = [
        `Adding signed numbers: ${a} + (${b})`,
        a * b < 0 ? `Different signs: subtract absolute values (|${Math.abs(a)}| and |${Math.abs(b)}|) and take the sign of the number with larger absolute value.` : `Same signs: add absolute values and keep the common sign.`,
        `Result: ${ans}.`
      ];
      return {
        type: 'integers_add',
        category: 'Integers',
        topic: 'Adding Positive and Negative Numbers',
        prompt: `${a} + (${b}) = ?`,
        htmlQuestion: `<div class="math-expr"><span class="whole-num">${a}</span> <span class="math-op">+</span> <span class="whole-num">(${b})</span> = </div>`,
        answer: ans.toString(),
        altAnswers: [ans.toString()],
        steps,
        hint: `When signs are opposite, subtract the smaller absolute value from the larger and keep the sign of the larger.`
      };
    } else if (op === 'sub') {
      const a = randomInt(-20, 20);
      const b = randomInt(-20, 20);
      const ans = a - b;
      const steps = [
        `Rewrite subtraction as adding the opposite: ${a} − (${b}) = ${a} + (${-b})`,
        `Perform addition: ${a} + (${-b}) = ${ans}.`
      ];
      return {
        type: 'integers_sub',
        category: 'Integers',
        topic: 'Subtracting Integers',
        prompt: `${a} − (${b}) = ?`,
        htmlQuestion: `<div class="math-expr"><span class="whole-num">${a}</span> <span class="math-op">−</span> <span class="whole-num">(${b})</span> = </div>`,
        answer: ans.toString(),
        altAnswers: [ans.toString()],
        steps,
        hint: `Subtracting a number is the same as adding its opposite (e.g. subtracting a negative is like adding a positive!).`
      };
    } else if (op === 'mult' || op === 'div') {
      if (op === 'mult') {
        const sign1 = Math.random() < 0.5 ? -1 : 1;
        const sign2 = Math.random() < 0.5 ? -1 : 1;
        const a = randomInt(2, 12) * sign1;
        const b = randomInt(2, 12) * sign2;
        const ans = a * b;
        const steps = [
          `Multiply absolute values: |${a}| × |${b}| = ${Math.abs(ans)}.`,
          `Sign rule: ${a < 0 && b < 0 ? 'Negative × Negative = Positive' : (a < 0 || b < 0 ? 'Negative × Positive = Negative' : 'Positive × Positive = Positive')}.`,
          `Final answer: ${ans}.`
        ];
        return {
          type: 'integers_mult',
          category: 'Integers',
          topic: 'Multiplying Integers',
          prompt: `${a} × (${b}) = ?`,
          htmlQuestion: `<div class="math-expr"><span class="whole-num">${a}</span> <span class="math-op">×</span> <span class="whole-num">(${b})</span> = </div>`,
          answer: ans.toString(),
          altAnswers: [ans.toString()],
          steps,
          hint: `Same signs multiply to positive; different signs multiply to negative.`
        };
      } else {
        const sign1 = Math.random() < 0.5 ? -1 : 1;
        const sign2 = Math.random() < 0.5 ? -1 : 1;
        const quotient = randomInt(2, 12) * sign1;
        const divisor = randomInt(2, 10) * sign2;
        const dividend = quotient * divisor;
        const ans = quotient;
        const steps = [
          `Divide absolute values: |${dividend}| ÷ |${divisor}| = ${Math.abs(ans)}.`,
          `Sign rule: ${dividend < 0 && divisor < 0 ? 'Negative ÷ Negative = Positive' : (dividend < 0 || divisor < 0 ? 'Negative ÷ Positive = Negative' : 'Positive ÷ Positive = Positive')}.`,
          `Final answer: ${ans}.`
        ];
        return {
          type: 'integers_div',
          category: 'Integers',
          topic: 'Dividing Integers',
          prompt: `${dividend} ÷ (${divisor}) = ?`,
          htmlQuestion: `<div class="math-expr"><span class="whole-num">${dividend}</span> <span class="math-op">÷</span> <span class="whole-num">(${divisor})</span> = </div>`,
          answer: ans.toString(),
          altAnswers: [ans.toString()],
          steps,
          hint: `Same signs give a positive quotient; different signs give a negative quotient.`
        };
      }
    } else {
      // Absolute value
      const n = randomInt(-45, 45);
      const extra = randomInt(2, 15);
      const isExpr = Math.random() < 0.5;
      if (isExpr) {
        const ans = Math.abs(n) + extra;
        return {
          type: 'integers_abs',
          category: 'Integers',
          topic: 'Absolute Value',
          prompt: `Evaluate: |${n}| + ${extra}`,
          htmlQuestion: `<div class="math-expr">|${n}| + ${extra} = </div>`,
          answer: ans.toString(),
          altAnswers: [ans.toString()],
          steps: [`Find the absolute value of ${n}: |${n}| = ${Math.abs(n)}.`, `Add ${extra}: ${Math.abs(n)} + ${extra} = ${ans}.`],
          hint: `Absolute value is the distance from 0, so |${n}| is always positive (${Math.abs(n)}).`
        };
      } else {
        return {
          type: 'integers_abs',
          category: 'Integers',
          topic: 'Absolute Value',
          prompt: `Find the value of |${n}|`,
          htmlQuestion: `<div class="math-expr">|${n}| = </div>`,
          answer: Math.abs(n).toString(),
          altAnswers: [Math.abs(n).toString()],
          steps: [`Absolute value measures distance from 0 on the number line.`, `|${n}| = ${Math.abs(n)}.`],
          hint: `The absolute value of a number is its non-negative distance from zero.`
        };
      }
    }
  }

  // --- Pre-Algebra & Equations ---

  /**
   * Generates One-Step and Two-Step Equations & Algebraic Expressions
   */
  function generateAlgebra() {
    const subType = pickRandom(['one_step', 'two_step', 'eval_expr', 'combining_terms']);
    const variable = pickRandom(['x', 'y', 'n', 'a', 'm']);

    if (subType === 'one_step') {
      const op = pickRandom(['add', 'sub', 'mult', 'div']);
      if (op === 'add') {
        const a = randomInt(5, 45);
        const x = randomInt(4, 50);
        const b = x + a;
        return {
          type: 'algebra_one_step',
          category: 'Algebra',
          topic: 'One-Step Equations (+)',
          prompt: `Solve for ${variable}: ${variable} + ${a} = ${b}`,
          htmlQuestion: `<div class="math-expr"><span class="math-var">${variable}</span> + <span class="whole-num">${a}</span> = <span class="whole-num">${b}</span></div>`,
          answer: x.toString(),
          altAnswers: [x.toString(), `${variable}=${x}`, `${variable} = ${x}`],
          steps: [
            `Subtract ${a} from both sides to isolate ${variable}:`,
            `${variable} + ${a} − ${a} = ${b} − ${a}`,
            `${variable} = ${x}.`
          ],
          hint: `Use the inverse operation: subtract ${a} from both sides.`
        };
      } else if (op === 'sub') {
        const a = randomInt(5, 35);
        const x = randomInt(15, 60);
        const b = x - a;
        return {
          type: 'algebra_one_step',
          category: 'Algebra',
          topic: 'One-Step Equations (−)',
          prompt: `Solve for ${variable}: ${variable} − ${a} = ${b}`,
          htmlQuestion: `<div class="math-expr"><span class="math-var">${variable}</span> − <span class="whole-num">${a}</span> = <span class="whole-num">${b}</span></div>`,
          answer: x.toString(),
          altAnswers: [x.toString(), `${variable}=${x}`, `${variable} = ${x}`],
          steps: [
            `Add ${a} to both sides to isolate ${variable}:`,
            `${variable} − ${a} + ${a} = ${b} + ${a}`,
            `${variable} = ${x}.`
          ],
          hint: `Use the inverse operation: add ${a} to both sides.`
        };
      } else if (op === 'mult') {
        const a = randomInt(3, 12);
        const x = randomInt(3, 15);
        const b = a * x;
        return {
          type: 'algebra_one_step',
          category: 'Algebra',
          topic: 'One-Step Equations (×)',
          prompt: `Solve for ${variable}: ${a}${variable} = ${b}`,
          htmlQuestion: `<div class="math-expr"><span class="whole-num">${a}</span><span class="math-var">${variable}</span> = <span class="whole-num">${b}</span></div>`,
          answer: x.toString(),
          altAnswers: [x.toString(), `${variable}=${x}`, `${variable} = ${x}`],
          steps: [
            `Divide both sides by ${a} to isolate ${variable}:`,
            `${a}${variable} ÷ ${a} = ${b} ÷ ${a}`,
            `${variable} = ${x}.`
          ],
          hint: `Divide both sides by ${a}.`
        };
      } else {
        const a = randomInt(2, 9);
        const b = randomInt(3, 12);
        const x = a * b;
        return {
          type: 'algebra_one_step',
          category: 'Algebra',
          topic: 'One-Step Equations (÷)',
          prompt: `Solve for ${variable}: ${variable} ÷ ${a} = ${b}`,
          htmlQuestion: `<div class="math-expr"><span class="fraction"><span class="numerator math-var">${variable}</span><span class="fraction-line"></span><span class="denominator">${a}</span></span> = <span class="whole-num">${b}</span></div>`,
          answer: x.toString(),
          altAnswers: [x.toString(), `${variable}=${x}`, `${variable} = ${x}`],
          steps: [
            `Multiply both sides by ${a} to isolate ${variable}:`,
            `(${variable} / ${a}) × ${a} = ${b} × ${a}`,
            `${variable} = ${x}.`
          ],
          hint: `Multiply both sides by ${a}.`
        };
      }
    } else if (subType === 'two_step') {
      const a = randomInt(2, 8);
      const x = randomInt(2, 12);
      const isAdd = Math.random() < 0.5;
      const b = randomInt(3, 20);
      const c = isAdd ? (a * x + b) : (a * x - b);
      const sign = isAdd ? '+' : '−';

      const steps = [
        `Step 1: ${isAdd ? `Subtract ${b} from` : `Add ${b} to`} both sides:`,
        `${a}${variable} = ${c} ${isAdd ? '−' : '+'} ${b} = ${a * x}`,
        `Step 2: Divide both sides by ${a}:`,
        `${variable} = ${a * x} ÷ ${a} = ${x}.`
      ];

      return {
        type: 'algebra_two_step',
        category: 'Algebra',
        topic: 'Two-Step Equations',
        prompt: `Solve for ${variable}: ${a}${variable} ${sign} ${b} = ${c}`,
        htmlQuestion: `<div class="math-expr"><span class="whole-num">${a}</span><span class="math-var">${variable}</span> <span class="math-op">${sign}</span> <span class="whole-num">${b}</span> = <span class="whole-num">${c}</span></div>`,
        answer: x.toString(),
        altAnswers: [x.toString(), `${variable}=${x}`, `${variable} = ${x}`],
        steps,
        hint: `First isolate the variable term by ${isAdd ? 'subtracting' : 'adding'} ${b}, then divide by ${a}.`
      };
    } else if (subType === 'eval_expr') {
      const v1Val = randomInt(2, 8);
      const v2Val = randomInt(2, 6);
      const c1 = randomInt(2, 5);
      const c2 = randomInt(2, 4);
      const c3 = randomInt(1, 10);
      const isMinus = Math.random() < 0.5;
      const result = isMinus ? (c1 * v1Val + c2 * v2Val - c3) : (c1 * v1Val - c2 * v2Val + c3);
      const sign1 = '+';
      const sign2 = isMinus ? '−' : '+';

      return {
        type: 'algebra_eval',
        category: 'Algebra',
        topic: 'Evaluating Expressions',
        prompt: `Evaluate ${c1}a ${sign1} ${c2}b ${sign2} ${c3} when a = ${v1Val} and b = ${v2Val}`,
        htmlQuestion: `<div class="math-expr">Evaluate: <span class="whole-num">${c1}</span><span class="math-var">a</span> ${sign1} <span class="whole-num">${c2}</span><span class="math-var">b</span> ${sign2} <span class="whole-num">${c3}</span> &nbsp;(a = ${v1Val}, b = ${v2Val})</div>`,
        answer: result.toString(),
        altAnswers: [result.toString()],
        steps: [
          `Substitute values into expression: ${c1}(${v1Val}) + ${c2}(${v2Val}) ${sign2} ${c3}`,
          `Multiply terms: ${c1 * v1Val} + ${c2 * v2Val} ${sign2} ${c3}`,
          `Combine: ${result}.`
        ],
        hint: `Replace 'a' with ${v1Val} and 'b' with ${v2Val}, then calculate using PEMDAS.`
      };
    } else {
      // Combining like terms
      const c1 = randomInt(3, 9);
      const c2 = randomInt(2, 7);
      const c3 = randomInt(1, 5);
      const ansCoeff = c1 + c2 - c3;
      return {
        type: 'algebra_combine',
        category: 'Algebra',
        topic: 'Combining Like Terms',
        prompt: `Simplify: ${c1}${variable} + ${c2}${variable} − ${c3}${variable}`,
        htmlQuestion: `<div class="math-expr">Simplify: <span class="whole-num">${c1}</span><span class="math-var">${variable}</span> + <span class="whole-num">${c2}</span><span class="math-var">${variable}</span> − <span class="whole-num">${c3}</span><span class="math-var">${variable}</span> = </div>`,
        answer: `${ansCoeff}${variable}`,
        altAnswers: [`${ansCoeff}${variable}`, `${ansCoeff} * ${variable}`, `${ansCoeff} ${variable}`],
        steps: [
          `Identify like terms with variable ${variable}.`,
          `Combine coefficients: (${c1} + ${c2} − ${c3})${variable} = ${ansCoeff}${variable}.`
        ],
        hint: `Add and subtract the coefficients (${c1} + ${c2} − ${c3}) and attach the variable ${variable}.`
      };
    }
  }

  // --- Exponents, Factors, GCF & LCM ---

  /**
   * Generates Exponents, GCF, LCM, and Square Roots
   */
  function generateExponentsAndFactors() {
    const subType = pickRandom(['exponents', 'gcf', 'lcm', 'square_roots']);

    if (subType === 'exponents') {
      const base = randomInt(2, 9);
      const exp = randomInt(2, 4);
      const val = Math.pow(base, exp);
      return {
        type: 'exponents',
        category: 'Exponents & Factors',
        topic: 'Powers and Exponents',
        prompt: `Evaluate: ${base}^${exp}`,
        htmlQuestion: `<div class="math-expr"><span class="whole-num">${base}</span><sup class="exp">${exp}</sup> = </div>`,
        answer: val.toString(),
        altAnswers: [val.toString()],
        steps: [
          `The exponent indicates multiplying the base ${base} by itself ${exp} times:`,
          `${Array(exp).fill(base).join(' × ')} = ${val}.`
        ],
        hint: `Multiply ${base} by itself ${exp} times.`
      };
    } else if (subType === 'gcf') {
      const g = pickRandom([2, 3, 4, 5, 6, 8, 9]);
      const m1 = randomInt(2, 7);
      let m2 = randomInt(2, 7);
      while (gcd(m1, m2) > 1 || m1 === m2) {
        m2 = randomInt(2, 7);
      }
      const n1 = g * m1;
      const n2 = g * m2;
      return {
        type: 'gcf',
        category: 'Exponents & Factors',
        topic: 'Greatest Common Factor (GCF)',
        prompt: `Find the Greatest Common Factor (GCF) of ${n1} and ${n2}`,
        htmlQuestion: `<div class="math-expr">GCF(${n1}, ${n2}) = </div>`,
        answer: g.toString(),
        altAnswers: [g.toString()],
        steps: [
          `List the factors of ${n1}: and ${n2}.`,
          `Prime factorization of ${n1} and ${n2}.`,
          `The largest factor they both share is ${g}.`
        ],
        hint: `Find the largest whole number that divides evenly into both ${n1} and ${n2}.`
      };
    } else if (subType === 'lcm') {
      const n1 = pickRandom([4, 6, 8, 9, 10, 12, 15]);
      let n2 = pickRandom([4, 6, 8, 9, 10, 12, 15]);
      while (n1 === n2) {
        n2 = pickRandom([4, 6, 8, 9, 10, 12, 15]);
      }
      const l = lcm(n1, n2);
      return {
        type: 'lcm',
        category: 'Exponents & Factors',
        topic: 'Least Common Multiple (LCM)',
        prompt: `Find the Least Common Multiple (LCM) of ${n1} and ${n2}`,
        htmlQuestion: `<div class="math-expr">LCM(${n1}, ${n2}) = </div>`,
        answer: l.toString(),
        altAnswers: [l.toString()],
        steps: [
          `List multiples of ${n1} and ${n2}.`,
          `The smallest common multiple greater than 0 is ${l}.`
        ],
        hint: `Find the smallest multiple that is in both times tables.`
      };
    } else {
      // Square roots
      const root = randomInt(3, 16);
      const square = root * root;
      return {
        type: 'square_roots',
        category: 'Exponents & Factors',
        topic: 'Square Roots of Perfect Squares',
        prompt: `Find the square root: √${square}`,
        htmlQuestion: `<div class="math-expr"><span class="sqrt-sym">√</span><span class="sqrt-num">${square}</span> = </div>`,
        answer: root.toString(),
        altAnswers: [root.toString()],
        steps: [
          `Find the number which, when multiplied by itself, equals ${square}.`,
          `${root} × ${root} = ${square}, so √${square} = ${root}.`
        ],
        hint: `What number multiplied by itself equals ${square}?`
      };
    }
  }

  // --- Geometry & Measurement ---

  /**
   * Generates Geometry & Measurement problems (Ontario Spatial Sense)
   */
  function generateGeometry(specificType) {
    const subTypes = [
      'area_triangle',
      'area_parallelogram',
      'area_trapezoid',
      'area_rhombus_kite',
      'area_circle',
      'area_ring',
      'area_composite',
      'area_missing_dimension',
      'volume_prism',
      'surface_area_prism',
      'triangle_angle'
    ];

    const subType = specificType || pickRandom(subTypes);

    if (subType === 'area_triangle') {
      const triangleKind = pickRandom(['right', 'acute', 'obtuse']);
      const b = randomInt(6, 24);
      const h = randomInt(4, 18);
      const area = (b * h) / 2;
      const unit = pickRandom(['cm', 'm']);
      const desc = triangleKind === 'obtuse' ? `(obtuse triangle with external height)` : `(base = ${b} ${unit}, height = ${h} ${unit})`;

      return {
        type: 'area_triangle',
        category: 'Geometry',
        topic: 'Area of a Triangle',
        prompt: `Find the area of a ${triangleKind} triangle with base = ${b} ${unit} and perpendicular height = ${h} ${unit}.`,
        htmlQuestion: `<div class="math-expr">Triangle ${desc}: <span class="whole-num">b = ${b} ${unit}</span>, <span class="whole-num">h = ${h} ${unit}</span> &nbsp;➔ Area = <span class="math-blank">? ${unit}²</span></div>`,
        answer: area.toString(),
        altAnswers: [area.toString(), `${area} ${unit}^2`, `${area} ${unit}²`, `${area} sq ${unit}`],
        steps: [
          `Formula for area of any triangle: A = (1/2) × base × height`,
          `Substitute values: A = (1/2) × ${b} × ${h}`,
          `Calculate: (1/2) × ${b * h} = ${area} ${unit}²`
        ],
        hint: `Multiply base times perpendicular height, then divide by 2.`
      };
    } else if (subType === 'area_parallelogram') {
      const b = randomInt(5, 20);
      const h = randomInt(4, 15);
      const area = b * h;
      const unit = pickRandom(['cm', 'm']);
      return {
        type: 'area_parallelogram',
        category: 'Geometry',
        topic: 'Area of a Parallelogram',
        prompt: `Find the area of a parallelogram with base = ${b} ${unit} and perpendicular height = ${h} ${unit}.`,
        htmlQuestion: `<div class="math-expr">Parallelogram: <span class="whole-num">b = ${b} ${unit}</span>, <span class="whole-num">h = ${h} ${unit}</span> &nbsp;➔ Area = <span class="math-blank">? ${unit}²</span></div>`,
        answer: area.toString(),
        altAnswers: [area.toString(), `${area} ${unit}²`, `${area} ${unit}^2`],
        steps: [
          `Formula: A = base × perpendicular height`,
          `Calculate: ${b} × ${h} = ${area} ${unit}² (Cut and slide the triangular corner to make a rectangle).`
        ],
        hint: `Multiply base by the perpendicular height (ignore any slanted sides for area).`
      };
    } else if (subType === 'area_trapezoid') {
      const b1 = randomInt(4, 16);
      const b2 = randomInt(b1 + 2, b1 + 14);
      const h = randomInt(2, 8) * 2; // Even height ensures integer area
      const area = ((b1 + b2) / 2) * h;
      const unit = pickRandom(['cm', 'm']);
      return {
        type: 'area_trapezoid',
        category: 'Geometry',
        topic: 'Area of a Trapezoid',
        prompt: `Find the area of a trapezoid with parallel bases ${b1} ${unit} and ${b2} ${unit}, and perpendicular height ${h} ${unit}.`,
        htmlQuestion: `<div class="math-expr">Trapezoid: <span class="whole-num">a = ${b1} ${unit}</span>, <span class="whole-num">b = ${b2} ${unit}</span>, <span class="whole-num">h = ${h} ${unit}</span> &nbsp;➔ Area = <span class="math-blank">? ${unit}²</span></div>`,
        answer: area.toString(),
        altAnswers: [area.toString(), `${area} ${unit}²`, `${area} ${unit}^2`, `${area} sq ${unit}`],
        steps: [
          `Formula: A = ((a + b) / 2) × h`,
          `Average the parallel bases: (${b1} + ${b2}) / 2 = ${(b1 + b2) / 2}`,
          `Multiply by height: ${(b1 + b2) / 2} × ${h} = ${area} ${unit}²`
        ],
        hint: `Add the two parallel bases together, divide by 2, and multiply by the height.`
      };
    } else if (subType === 'area_rhombus_kite') {
      const d1 = randomInt(4, 16) * 2;
      const d2 = randomInt(3, 12) * 2;
      const area = (d1 * d2) / 2;
      const shape = pickRandom(['rhombus', 'kite']);
      return {
        type: 'area_rhombus_kite',
        category: 'Geometry',
        topic: `Area of a ${shape === 'rhombus' ? 'Rhombus' : 'Kite'}`,
        prompt: `Find the area of a ${shape} whose intersecting perpendicular diagonals measure ${d1} cm and ${d2} cm.`,
        htmlQuestion: `<div class="math-expr">${shape === 'rhombus' ? 'Rhombus' : 'Kite'}: <span class="whole-num">d₁ = ${d1} cm</span>, <span class="whole-num">d₂ = ${d2} cm</span> &nbsp;➔ Area = <span class="math-blank">? cm²</span></div>`,
        answer: area.toString(),
        altAnswers: [area.toString(), `${area} cm²`, `${area} cm^2`],
        steps: [
          `Formula for a ${shape}: A = (d₁ × d₂) / 2`,
          `Multiply diagonals: ${d1} × ${d2} = ${d1 * d2}`,
          `Divide by 2: ${d1 * d2} / 2 = ${area} cm²`
        ],
        hint: `Multiply the lengths of both perpendicular diagonals and divide by 2.`
      };
    } else if (subType === 'area_circle') {
      const r = randomInt(2, 10);
      const d = r * 2;
      const useDiameter = Math.random() < 0.5;
      const areaVal = Math.round(3.14 * r * r * 100) / 100;
      return {
        type: 'area_circle',
        category: 'Geometry',
        topic: 'Area of a Circle',
        prompt: useDiameter
          ? `Find the area of a circle with diameter d = ${d} m (use π ≈ 3.14).`
          : `Find the area of a circle with radius r = ${r} m (use π ≈ 3.14).`,
        htmlQuestion: `<div class="math-expr">Circle: <span class="whole-num">${useDiameter ? `d = ${d} m` : `r = ${r} m`}</span> (π ≈ 3.14) &nbsp;➔ Area = <span class="math-blank">? m²</span></div>`,
        answer: areaVal.toString(),
        altAnswers: [areaVal.toString(), `${areaVal} m²`, `${areaVal} m^2`],
        steps: [
          useDiameter ? `First find radius: r = d / 2 = ${d} / 2 = ${r} m` : `Radius r = ${r} m`,
          `Formula: A = π × r²`,
          `Calculate: 3.14 × ${r}² = 3.14 × ${r * r} = ${areaVal} m²`
        ],
        hint: `Square the radius (r × r) and multiply by 3.14. If diameter is given, divide it by 2 first!`
      };
    } else if (subType === 'area_ring') {
      const rInner = randomInt(2, 6);
      const rOuter = rInner + randomInt(1, 4);
      const areaVal = Math.round(3.14 * (rOuter * rOuter - rInner * rInner) * 100) / 100;
      return {
        type: 'area_ring',
        category: 'Geometry',
        topic: 'Area of a Circular Ring (Annulus)',
        prompt: `A circular walking path has inner radius ${rInner} m and outer radius ${rOuter} m. Find the path's area (use π ≈ 3.14).`,
        htmlQuestion: `<div class="math-expr">Ring: <span class="whole-num">r = ${rInner} m</span>, <span class="whole-num">R = ${rOuter} m</span> &nbsp;➔ Area = <span class="math-blank">? m²</span></div>`,
        answer: areaVal.toString(),
        altAnswers: [areaVal.toString(), `${areaVal} m²`, `${areaVal} m^2`],
        steps: [
          `Outer circle area: A_outer = π × ${rOuter}² = 3.14 × ${rOuter * rOuter} = ${Math.round(3.14 * rOuter * rOuter * 100) / 100} m²`,
          `Inner circle area: A_inner = π × ${rInner}² = 3.14 × ${rInner * rInner} = ${Math.round(3.14 * rInner * rInner * 100) / 100} m²`,
          `Ring area = A_outer − A_inner = π(R² − r²) = 3.14 × (${rOuter * rOuter} − ${rInner * rInner}) = ${areaVal} m²`
        ],
        hint: `Subtract the inner circle's area from the outer circle's area: π(R² − r²).`
      };
    } else if (subType === 'area_composite') {
      const isLshape = Math.random() < 0.5;
      if (isLshape) {
        const outerW = randomInt(7, 14);
        const outerH = randomInt(8, 16);
        const cutW = randomInt(3, outerW - 2);
        const cutH = randomInt(3, outerH - 2);
        const area = outerW * outerH - cutW * cutH;
        return {
          type: 'area_composite',
          category: 'Geometry',
          topic: 'Area of L-Shaped Composite Figure',
          prompt: `An L-shaped room fits inside a ${outerW} m × ${outerH} m boundary, with an empty corner of ${cutW} m × ${cutH} m cut away. Find the room's area.`,
          htmlQuestion: `<div class="math-expr">L-Shape: <span class="whole-num">${outerW} × ${outerH} m box</span> − <span class="whole-num">${cutW} × ${cutH} m corner</span> &nbsp;➔ Area = <span class="math-blank">? m²</span></div>`,
          answer: area.toString(),
          altAnswers: [area.toString(), `${area} m²`, `${area} m^2`],
          steps: [
            `Total outer bounding area: ${outerW} × ${outerH} = ${outerW * outerH} m²`,
            `Cutout corner area: ${cutW} × ${cutH} = ${cutW * cutH} m²`,
            `Net composite area: ${outerW * outerH} − ${cutW * cutH} = ${area} m²`
          ],
          hint: `Use the subtractive method: Outer bounding rectangle minus the missing corner.`
        };
      } else {
        const baseW = randomInt(6, 14);
        const wallH = randomInt(4, 10);
        const roofH = randomInt(3, 8) * 2;
        const rectArea = baseW * wallH;
        const triArea = (baseW * roofH) / 2;
        const totalArea = rectArea + triArea;
        return {
          type: 'area_composite',
          category: 'Geometry',
          topic: 'Area of House Profile (Composite)',
          prompt: `A garage silhouette has a rectangular wall ${baseW} m wide by ${wallH} m tall, topped with a triangular roof of base ${baseW} m and peak height ${roofH} m. Find total area.`,
          htmlQuestion: `<div class="math-expr">House Profile: <span class="whole-num">${baseW} × ${wallH} m wall</span> + <span class="whole-num">roof (b=${baseW}, h=${roofH})</span> &nbsp;➔ Area = <span class="math-blank">? m²</span></div>`,
          answer: totalArea.toString(),
          altAnswers: [totalArea.toString(), `${totalArea} m²`, `${totalArea} m^2`],
          steps: [
            `Rectangle wall area: ${baseW} × ${wallH} = ${rectArea} m²`,
            `Triangle roof area: (1/2) × ${baseW} × ${roofH} = ${triArea} m²`,
            `Total composite area: ${rectArea} + ${triArea} = ${totalArea} m²`
          ],
          hint: `Split the house into a rectangle and a triangle, calculate each area, and add them together.`
        };
      }
    } else if (subType === 'area_missing_dimension') {
      const isTriangle = Math.random() < 0.5;
      if (isTriangle) {
        const b = randomInt(6, 20);
        const h = randomInt(5, 15);
        const area = (b * h) / 2;
        return {
          type: 'area_missing_dimension',
          category: 'Geometry',
          topic: 'Missing Height of a Triangle',
          prompt: `A triangle has an area of ${area} cm² and a base of ${b} cm. What is its perpendicular height?`,
          htmlQuestion: `<div class="math-expr">Triangle: <span class="whole-num">Area = ${area} cm²</span>, <span class="whole-num">base = ${b} cm</span> &nbsp;➔ height = <span class="math-blank">? cm</span></div>`,
          answer: h.toString(),
          altAnswers: [h.toString(), `${h} cm`],
          steps: [
            `Area formula: A = (1/2) × b × h`,
            `Rearrange for height: h = (2 × Area) / b`,
            `Calculate: (2 × ${area}) / ${b} = ${2 * area} / ${b} = ${h} cm`
          ],
          hint: `Multiply the area by 2 first, then divide by the base.`
        };
      } else {
        const b = randomInt(5, 18);
        const h = randomInt(4, 14);
        const area = b * h;
        return {
          type: 'area_missing_dimension',
          category: 'Geometry',
          topic: 'Missing Height of a Parallelogram',
          prompt: `A parallelogram has an area of ${area} m² and a base of ${b} m. What is its perpendicular height?`,
          htmlQuestion: `<div class="math-expr">Parallelogram: <span class="whole-num">Area = ${area} m²</span>, <span class="whole-num">base = ${b} m</span> &nbsp;➔ height = <span class="math-blank">? m</span></div>`,
          answer: h.toString(),
          altAnswers: [h.toString(), `${h} m`],
          steps: [
            `Area formula: A = base × height`,
            `Rearrange for height: h = Area / base`,
            `Calculate: ${area} / ${b} = ${h} m`
          ],
          hint: `Divide the total area by the base length.`
        };
      }
    } else if (subType === 'volume_prism') {
      const l = randomInt(3, 12);
      const w = randomInt(2, 8);
      const h = randomInt(2, 9);
      const vol = l * w * h;
      return {
        type: 'volume_prism',
        category: 'Geometry',
        topic: 'Volume of Rectangular Prism',
        prompt: `Find the volume of a rectangular prism with length = ${l} m, width = ${w} m, and height = ${h} m.`,
        htmlQuestion: `<div class="math-expr">Box: <span class="whole-num">${l} × ${w} × ${h} m</span> &nbsp;➔ Volume = <span class="math-blank">? m³</span></div>`,
        answer: vol.toString(),
        altAnswers: [vol.toString(), `${vol} m^3`, `${vol} m³`, `${vol} cubic m`],
        steps: [
          `Formula for volume of a rectangular prism: V = length × width × height`,
          `Calculate: ${l} × ${w} × ${h} = ${vol} m³.`
        ],
        hint: `Multiply length × width × height.`
      };
    } else if (subType === 'surface_area_prism') {
      const l = randomInt(3, 8);
      const w = randomInt(2, 6);
      const h = randomInt(2, 6);
      const sa = 2 * (l * w + l * h + w * h);
      return {
        type: 'surface_area_prism',
        category: 'Geometry',
        topic: 'Surface Area of Rectangular Prism',
        prompt: `Find the total surface area of a box with dimensions ${l} cm × ${w} cm × ${h} cm.`,
        htmlQuestion: `<div class="math-expr">Prism: <span class="whole-num">${l} cm × ${w} cm × ${h} cm</span> &nbsp;➔ Surface Area = <span class="math-blank">? cm²</span></div>`,
        answer: sa.toString(),
        altAnswers: [sa.toString(), `${sa} cm²`, `${sa} sq cm`],
        steps: [
          `Surface Area formula: SA = 2(lw + lh + wh)`,
          `Calculate face areas: lw = ${l * w}, lh = ${l * h}, wh = ${w * h}`,
          `Sum faces and multiply by 2: 2 × (${l * w} + ${l * h} + ${w * h}) = 2 × ${l * w + l * h + w * h} = ${sa} cm².`
        ],
        hint: `Calculate the area of all 6 faces (2 of each pair) and add them together.`
      };
    } else {
      const a1 = randomInt(30, 85);
      const a2 = randomInt(30, 85);
      const a3 = 180 - a1 - a2;
      return {
        type: 'triangle_angle',
        category: 'Geometry',
        topic: 'Missing Angle in a Triangle',
        prompt: `Two angles in a triangle measure ${a1}° and ${a2}°. Find the third angle.`,
        htmlQuestion: `<div class="math-expr">Triangle Angles: <span class="whole-num">${a1}°</span>, <span class="whole-num">${a2}°</span>, <span class="math-var">x°</span> &nbsp;➔ x = <span class="math-blank">?°</span></div>`,
        answer: a3.toString(),
        altAnswers: [a3.toString(), `${a3}°`, `${a3} degrees`],
        steps: [
          `The sum of all three angles inside any triangle is always 180°.`,
          `Calculate: 180° − (${a1}° + ${a2}°) = 180° − ${a1 + a2}° = ${a3}°.`
        ],
        hint: `Angles in a triangle always add up to 180°.`
      };
    }
  }

  // --- Statistics & Data ---

  /**
   * Generates Statistics problems (Mean, Median, Mode, Range)
   */
  function generateStatistics() {
    const subType = pickRandom(['mean', 'median', 'mode', 'range']);
    const count = pickRandom([5, 7]);
    
    // Generate clean numbers
    let dataset = [];
    if (subType === 'mean') {
      // Ensure mean is a clean whole number or .5
      const targetMean = randomInt(10, 30);
      let sum = targetMean * count;
      dataset = [];
      for (let i = 0; i < count - 1; i++) {
        const val = targetMean + randomInt(-8, 8);
        dataset.push(val);
        sum -= val;
      }
      dataset.push(sum);
      dataset = shuffle(dataset);
    } else {
      for (let i = 0; i < count; i++) {
        dataset.push(randomInt(5, 35));
      }
    }

    const sorted = [...dataset].sort((a, b) => a - b);
    const sumVal = dataset.reduce((acc, curr) => acc + curr, 0);
    const meanVal = parseFloat((sumVal / count).toFixed(2));
    const midIdx = Math.floor(sorted.length / 2);
    const medianVal = sorted[midIdx];
    const rangeVal = sorted[sorted.length - 1] - sorted[0];

    // Find mode
    const freq = {};
    let maxFreq = 0;
    dataset.forEach(n => {
      freq[n] = (freq[n] || 0) + 1;
      if (freq[n] > maxFreq) maxFreq = freq[n];
    });
    let modeVals = Object.keys(freq).filter(k => freq[k] === maxFreq && maxFreq > 1).map(Number);
    let modeText = modeVals.length === 0 ? 'no mode' : modeVals.join(', ');

    if (subType === 'mean') {
      return {
        type: 'stats_mean',
        category: 'Statistics',
        topic: 'Mean (Average)',
        prompt: `Find the mean of the data set: [ ${dataset.join(', ')} ]`,
        htmlQuestion: `<div class="math-expr">Data: <span class="whole-num">${dataset.join(', ')}</span> &nbsp;➔ Mean = </div>`,
        answer: meanVal.toString(),
        altAnswers: [meanVal.toString()],
        steps: [
          `Add all numbers in the set: ${dataset.join(' + ')} = ${sumVal}.`,
          `Divide the sum by the total number of values (${count}): ${sumVal} ÷ ${count} = ${meanVal}.`
        ],
        hint: `Add up all the values and divide by the count (${count}).`
      };
    } else if (subType === 'median') {
      return {
        type: 'stats_median',
        category: 'Statistics',
        topic: 'Median (Middle Value)',
        prompt: `Find the median of the data set: [ ${dataset.join(', ')} ]`,
        htmlQuestion: `<div class="math-expr">Data: <span class="whole-num">${dataset.join(', ')}</span> &nbsp;➔ Median = </div>`,
        answer: medianVal.toString(),
        altAnswers: [medianVal.toString()],
        steps: [
          `Sort the numbers in ascending order: ${sorted.join(', ')}.`,
          `Identify the exact middle number: ${medianVal}.`
        ],
        hint: `First put the numbers in order from least to greatest, then pick the middle number.`
      };
    } else if (subType === 'range') {
      return {
        type: 'stats_range',
        category: 'Statistics',
        topic: 'Range',
        prompt: `Find the range of the data set: [ ${dataset.join(', ')} ]`,
        htmlQuestion: `<div class="math-expr">Data: <span class="whole-num">${dataset.join(', ')}</span> &nbsp;➔ Range = </div>`,
        answer: rangeVal.toString(),
        altAnswers: [rangeVal.toString()],
        steps: [
          `Find the maximum value (${sorted[sorted.length - 1]}) and minimum value (${sorted[0]}).`,
          `Subtract minimum from maximum: ${sorted[sorted.length - 1]} − ${sorted[0]} = ${rangeVal}.`
        ],
        hint: `Subtract the lowest number from the highest number.`
      };
    } else {
      // Ensure there is a mode
      if (modeVals.length === 0) {
        // inject mode
        dataset[0] = dataset[1];
        modeText = dataset[0].toString();
      }
      return {
        type: 'stats_mode',
        category: 'Statistics',
        topic: 'Mode',
        prompt: `Find the mode of the data set: [ ${dataset.join(', ')} ]`,
        htmlQuestion: `<div class="math-expr">Data: <span class="whole-num">${dataset.join(', ')}</span> &nbsp;➔ Mode = </div>`,
        answer: modeText,
        altAnswers: [modeText],
        steps: [
          `Count the frequency of each number in the set: [ ${dataset.join(', ')} ].`,
          `The number that appears most frequently is ${modeText}.`
        ],
        hint: `Look for the number that occurs most frequently.`
      };
    }
  }

  // --- Master Problem Dispatcher ---

  /**
   * Generates a single problem based on topic category & configuration
   */
  function generateProblem(config = {}) {
    const category = config.category || 'fractions';

    switch (category) {
      case 'fractions_all':
      case 'fractions': {
        const sub = pickRandom(['add_sub', 'mult', 'div']);
        if (sub === 'add_sub') return generateFractionAddSub(config);
        if (sub === 'mult') return generateFractionMult(config);
        return generateFractionDiv(config);
      }
      case 'fractions_add_sub':
        return generateFractionAddSub(config);
      case 'fractions_mult':
        return generateFractionMult(config);
      case 'fractions_div':
        return generateFractionDiv(config);

      case 'decimals':
        return generateDecimals(config);

      case 'ratios':
      case 'proportions':
        return generateRatiosAndProportions();

      case 'percentages':
        return generatePercentages();

      case 'pemdas':
        return generatePEMDAS();

      case 'integers':
        return generateIntegers();

      case 'algebra':
        return generateAlgebra();

      case 'exponents':
      case 'factors':
        return generateExponentsAndFactors();

      case 'geometry':
        return generateGeometry();

      case 'geometry_area':
        return generateGeometry(pickRandom(['area_triangle', 'area_parallelogram', 'area_trapezoid', 'area_rhombus_kite', 'area_circle', 'area_ring', 'area_composite', 'area_missing_dimension']));

      case 'geometry_triangles':
        return generateGeometry('area_triangle');

      case 'geometry_quadrilaterals':
        return generateGeometry(pickRandom(['area_parallelogram', 'area_trapezoid', 'area_rhombus_kite']));

      case 'geometry_circles':
        return generateGeometry(pickRandom(['area_circle', 'area_ring']));

      case 'geometry_composite':
        return generateGeometry('area_composite');

      case 'geometry_missing':
        return generateGeometry('area_missing_dimension');

      case 'statistics':
        return generateStatistics();

      case 'grade5_mixed': {
        const g5Categories = ['fractions', 'decimals', 'pemdas', 'geometry'];
        return generateProblem({ category: pickRandom(g5Categories) });
      }

      case 'grade6_mixed': {
        const g6Categories = ['ratios', 'percentages', 'integers', 'algebra', 'exponents', 'statistics'];
        return generateProblem({ category: pickRandom(g6Categories) });
      }

      case 'all_mixed':
      default: {
        const allCategories = ['fractions', 'decimals', 'ratios', 'percentages', 'pemdas', 'integers', 'algebra', 'exponents', 'geometry', 'statistics'];
        return generateProblem({ category: pickRandom(allCategories) });
      }
    }
  }

  return {
    generateProblem,
    generateFractionAddSub,
    generateFractionMult,
    generateFractionDiv,
    generateDecimals,
    generateRatiosAndProportions,
    generatePercentages,
    generatePEMDAS,
    generateIntegers,
    generateAlgebra,
    generateExponentsAndFactors,
    generateGeometry,
    generateStatistics,
    simplifyFraction,
    formatFraction,
    renderFractionHTML,
    gcd,
    lcm
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MathEngine;
}
