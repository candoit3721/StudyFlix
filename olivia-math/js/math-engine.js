/**
 * Olivia's Math Worksheet - Grade 3 Math Generation Engine
 * Handles arithmetic generation with strict Grade 3 pedagogical constraints:
 * - Digit ranges (1-digit, 2-digit, 3-digit)
 * - Regrouping (carrying) and borrowing controls
 * - Multiplication facts (0-12, target tables, multiples of 10, 2-digit x 1-digit)
 * - Division facts (clean dividends, optional remainders)
 * - Missing operand problems
 * - Comparison problems (<, >, =)
 */

const MathEngine = (function () {
  /**
   * Helper: Random integer between min and max (inclusive)
   */
  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Helper: Pick a random element from an array
   */
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Checks if adding two numbers requires regrouping (carrying) in base 10
   */
  function checkAdditionRegrouping(num1, num2) {
    let s1 = num1.toString();
    let s2 = num2.toString();
    let maxLen = Math.max(s1.length, s2.length);
    s1 = s1.padStart(maxLen, '0');
    s2 = s2.padStart(maxLen, '0');

    let carry = 0;
    let hasRegrouping = false;
    for (let i = maxLen - 1; i >= 0; i--) {
      let sum = parseInt(s1[i], 10) + parseInt(s2[i], 10) + carry;
      if (sum >= 10) {
        hasRegrouping = true;
        carry = 1;
      } else {
        carry = 0;
      }
    }
    return hasRegrouping;
  }

  /**
   * Checks if subtracting num2 from num1 (num1 >= num2) requires borrowing
   */
  function checkSubtractionBorrowing(num1, num2) {
    let s1 = num1.toString();
    let s2 = num2.toString();
    let maxLen = Math.max(s1.length, s2.length);
    s1 = s1.padStart(maxLen, '0');
    s2 = s2.padStart(maxLen, '0');

    let borrow = 0;
    let hasBorrowing = false;
    for (let i = maxLen - 1; i >= 0; i--) {
      let top = parseInt(s1[i], 10) - borrow;
      let bottom = parseInt(s2[i], 10);
      if (top < bottom) {
        hasBorrowing = true;
        borrow = 1;
      } else {
        borrow = 0;
      }
    }
    return hasBorrowing;
  }

  /**
   * Generate an addition problem
   */
  function generateAddition(options = {}) {
    const digitType = options.digitType || options.digitRange || '2digit';
    const regrouping = options.regrouping || 'any';
    const missingOperand = options.missingOperand || false;

    let min1 = 10, max1 = 99, min2 = 10, max2 = 99;
    if (digitType === '3digit') {
      min1 = 100; max1 = 999;
      min2 = 100; max2 = 999;
    } else if (digitType === '3digit_2digit') {
      min1 = 100; max1 = 999;
      min2 = 10; max2 = 99;
    } else if (digitType === 'mixed') {
      if (Math.random() < 0.5) {
        min1 = 10; max1 = 99;
        min2 = 10; max2 = 99;
      } else {
        min1 = 100; max1 = 999;
        min2 = 10; max2 = 999;
      }
    }

    let num1 = 10, num2 = 10, attempts = 0;
    while (attempts < 100) {
      attempts++;
      num1 = randomInt(min1, max1);
      num2 = randomInt(min2, max2);
      if (num2 > num1) {
        const tmp = num1;
        num1 = num2;
        num2 = tmp;
      }
      const hasRegroup = checkAdditionRegrouping(num1, num2);
      if (regrouping === 'none' && hasRegroup) continue;
      if (regrouping === 'force' && !hasRegroup) continue;
      break;
    }

    const answer = num1 + num2;
    let missingPos = null;
    let promptQuestion = `${num1} + ${num2} = ?`;
    let expectedAnswer = answer;

    if (missingOperand) {
      const pos = Math.random() < 0.5 ? 'left' : 'right';
      missingPos = pos;
      if (pos === 'left') {
        promptQuestion = `___ + ${num2} = ${answer}`;
        expectedAnswer = num1;
      } else {
        promptQuestion = `${num1} + ___ = ${answer}`;
        expectedAnswer = num2;
      }
    }

    return {
      type: 'addition',
      operator: '+',
      num1,
      num2,
      answer,
      expectedAnswer,
      missingPos,
      promptQuestion,
      hasRegrouping: checkAdditionRegrouping(num1, num2)
    };
  }

  /**
   * Generate a subtraction problem
   */
  function generateSubtraction(options = {}) {
    const digitType = options.digitType || options.digitRange || '2digit';
    const borrowing = options.borrowing || 'any';
    const missingOperand = options.missingOperand || false;

    let min1 = 15, max1 = 99, min2 = 10, max2 = 90;
    if (digitType === '3digit') {
      min1 = 150; max1 = 999;
      min2 = 100; max2 = 899;
    } else if (digitType === '3digit_2digit') {
      min1 = 100; max1 = 999;
      min2 = 10; max2 = 99;
    } else if (digitType === 'mixed') {
      if (Math.random() < 0.5) {
        min1 = 20; max1 = 99;
        min2 = 10; max2 = 80;
      } else {
        min1 = 150; max1 = 999;
        min2 = 20; max2 = 800;
      }
    }

    let num1 = 50, num2 = 20, attempts = 0;
    while (attempts < 100) {
      attempts++;
      num1 = randomInt(min1, max1);
      num2 = randomInt(min2, Math.min(num1 - 2, max2));
      if (num1 <= num2) continue;

      const hasBorrow = checkSubtractionBorrowing(num1, num2);
      if (borrowing === 'none' && hasBorrow) continue;
      if (borrowing === 'force' && !hasBorrow) continue;
      break;
    }

    const answer = num1 - num2;
    let missingPos = null;
    let promptQuestion = `${num1} − ${num2} = ?`;
    let expectedAnswer = answer;

    if (missingOperand) {
      const pos = Math.random() < 0.5 ? 'left' : 'right';
      missingPos = pos;
      if (pos === 'left') {
        promptQuestion = `___ − ${num2} = ${answer}`;
        expectedAnswer = num1;
      } else {
        promptQuestion = `${num1} − ___ = ${answer}`;
        expectedAnswer = num2;
      }
    }

    return {
      type: 'subtraction',
      operator: '−',
      num1,
      num2,
      answer,
      expectedAnswer,
      missingPos,
      promptQuestion,
      hasBorrowing: checkSubtractionBorrowing(num1, num2)
    };
  }

  /**
   * Generate a multiplication problem
   */
  function generateMultiplication(options = {}) {
    const tableRange = options.tableRange || '0-10';
    const customTables = options.customTables && options.customTables.length > 0 ? options.customTables : [2, 3, 4, 5, 6, 7, 8, 9, 10];
    const missingOperand = options.missingOperand || false;

    let num1, num2;

    if (tableRange === 'multiples_10') {
      num1 = randomInt(1, 9) * 10;
      num2 = randomInt(2, 9);
    } else if (tableRange === '2digit_1digit') {
      num1 = randomInt(11, 49);
      num2 = randomInt(2, 5);
    } else if (tableRange === 'custom') {
      num1 = pickRandom(customTables);
      num2 = randomInt(0, 12);
      if (Math.random() < 0.5) {
        const tmp = num1;
        num1 = num2;
        num2 = tmp;
      }
    } else if (tableRange === '0-12') {
      num1 = randomInt(0, 12);
      num2 = randomInt(0, 12);
    } else {
      num1 = randomInt(0, 10);
      num2 = randomInt(0, 10);
    }

    const answer = num1 * num2;
    let missingPos = null;
    let promptQuestion = `${num1} × ${num2} = ?`;
    let expectedAnswer = answer;

    if (missingOperand && num1 > 0 && num2 > 0) {
      const pos = Math.random() < 0.5 ? 'left' : 'right';
      missingPos = pos;
      if (pos === 'left') {
        promptQuestion = `___ × ${num2} = ${answer}`;
        expectedAnswer = num1;
      } else {
        promptQuestion = `${num1} × ___ = ${answer}`;
        expectedAnswer = num2;
      }
    }

    return {
      type: 'multiplication',
      operator: '×',
      num1,
      num2,
      answer,
      expectedAnswer,
      missingPos,
      promptQuestion
    };
  }

  /**
   * Generate a division problem
   */
  function generateDivision(options = {}) {
    const maxDivisor = options.maxDivisor || 10;
    const customDivisors = options.customDivisors && options.customDivisors.length > 0 ? options.customDivisors : null;
    const allowRemainders = options.allowRemainders || false;
    const missingOperand = options.missingOperand || false;

    let divisor, quotient, remainder = 0;

    if (customDivisors) {
      divisor = pickRandom(customDivisors);
    } else {
      divisor = randomInt(2, maxDivisor);
    }

    quotient = randomInt(1, 10);

    if (allowRemainders && Math.random() < 0.35) {
      remainder = randomInt(1, divisor - 1);
    }

    const dividend = (divisor * quotient) + remainder;
    const answer = remainder === 0 ? quotient : `${quotient} R ${remainder}`;
    let missingPos = null;
    let promptQuestion = `${dividend} ÷ ${divisor} = ?`;
    let expectedAnswer = remainder === 0 ? quotient : answer;

    if (missingOperand && remainder === 0) {
      const pos = Math.random() < 0.5 ? 'dividend' : 'divisor';
      missingPos = pos;
      if (pos === 'dividend') {
        promptQuestion = `___ ÷ ${divisor} = ${quotient}`;
        expectedAnswer = dividend;
      } else {
        promptQuestion = `${dividend} ÷ ___ = ${quotient}`;
        expectedAnswer = divisor;
      }
    }

    return {
      type: 'division',
      operator: '÷',
      num1: dividend,
      num2: divisor,
      answer,
      expectedAnswer,
      remainder,
      missingPos,
      promptQuestion
    };
  }

  /**
   * Generate a comparison problem (<, >, =)
   */
  function generateComparison(options = {}) {
    const compType = options.compType || 'expressions';
    let leftText, rightText, leftVal, rightVal;

    if (compType === 'numbers') {
      leftVal = randomInt(100, 999);
      if (Math.random() < 0.25) {
        rightVal = leftVal;
      } else {
        rightVal = randomInt(100, 999);
      }
      leftText = `${leftVal}`;
      rightText = `${rightVal}`;
    } else {
      const op = pickRandom(['+', '−', '×']);
      if (op === '+') {
        const a = randomInt(10, 50), b = randomInt(10, 50);
        leftVal = a + b;
        leftText = `${a} + ${b}`;
        if (Math.random() < 0.3) {
          const c = randomInt(5, leftVal - 1);
          rightVal = leftVal;
          rightText = `${c} + ${leftVal - c}`;
        } else {
          const c = randomInt(10, 50), d = randomInt(10, 50);
          rightVal = c + d;
          rightText = `${c} + ${d}`;
        }
      } else if (op === '−') {
        const a = randomInt(40, 90), b = randomInt(10, 30);
        leftVal = a - b;
        leftText = `${a} − ${b}`;
        const c = randomInt(40, 90), d = randomInt(10, 30);
        rightVal = c - d;
        rightText = `${c} − ${d}`;
      } else {
        const a = randomInt(2, 9), b = randomInt(2, 9);
        leftVal = a * b;
        leftText = `${a} × ${b}`;
        if (Math.random() < 0.3) {
          const factors = [];
          for (let f = 1; f <= 10; f++) {
            if (leftVal % f === 0 && (leftVal / f) <= 10) {
              factors.push([f, leftVal / f]);
            }
          }
          if (factors.length > 0) {
            const pair = pickRandom(factors);
            rightVal = leftVal;
            rightText = `${pair[0]} × ${pair[1]}`;
          } else {
            const c = randomInt(2, 9), d = randomInt(2, 9);
            rightVal = c * d;
            rightText = `${c} × ${d}`;
          }
        } else {
          const c = randomInt(2, 9), d = randomInt(2, 9);
          rightVal = c * d;
          rightText = `${c} × ${d}`;
        }
      }
    }

    let symbol = '=';
    if (leftVal < rightVal) symbol = '<';
    else if (leftVal > rightVal) symbol = '>';

    return {
      type: 'comparison',
      operator: '⭘',
      leftText,
      rightText,
      leftVal,
      rightVal,
      answer: symbol,
      expectedAnswer: symbol,
      promptQuestion: `${leftText}  [ ? ]  ${rightText}`
    };
  }

  /**
   * Main Generator Router
   */
  function generateProblem(config) {
    const type = config.type || 'addition';

    switch (type) {
      case 'addition':
        return generateAddition(config);
      case 'subtraction':
        return generateSubtraction(config);
      case 'add_sub_mixed':
        return Math.random() < 0.5 ? generateAddition(config) : generateSubtraction(config);
      case 'multiplication':
        return generateMultiplication(config);
      case 'division':
        return generateDivision(config);
      case 'mult_div_mixed':
        return Math.random() < 0.5 ? generateMultiplication(config) : generateDivision(config);
      case 'all_mixed': {
        const r = Math.random();
        if (r < 0.25) return generateAddition(config);
        if (r < 0.50) return generateSubtraction(config);
        if (r < 0.75) return generateMultiplication(config);
        return generateDivision(config);
      }
      case 'comparison':
        return generateComparison(config);
      default:
        return generateAddition(config);
    }
  }

  /**
   * Generate an entire worksheet with a specified question count
   */
  function generateWorksheet(config) {
    const count = parseInt(config.count, 10) || 20;
    const problems = [];
    const seenSignatures = new Set();

    for (let i = 0; i < count; i++) {
      let problem;
      let signature;
      let tries = 0;

      do {
        problem = generateProblem(config);
        signature = `${problem.type}:${problem.num1}:${problem.operator}:${problem.num2}:${problem.missingPos}:${problem.leftText}`;
        tries++;
      } while (seenSignatures.has(signature) && tries < 20);

      seenSignatures.add(signature);
      problem.index = i + 1;
      problems.push(problem);
    }

    return problems;
  }

  return {
    generateAddition,
    generateSubtraction,
    generateMultiplication,
    generateDivision,
    generateComparison,
    generateProblem,
    generateWorksheet
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MathEngine;
}
