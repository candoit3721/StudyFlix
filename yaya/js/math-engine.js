/**
 * Yaya's Math Studio - Math Engine & Helper Utilities
 * Provides math generation, parameter randomized variations, 
 * KaTeX rendering wrappers, and loose/strict answer evaluation.
 */

window.MathEngine = (function () {
  // Utility: Random integer between [min, max]
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Utility: Random choice from an array
  function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Greatest Common Divisor
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

  // Format fraction nicely in LaTeX
  function formatFraction(num, den) {
    if (den === 0) return '0';
    if (den < 0) {
      num = -num;
      den = -den;
    }
    const g = gcd(num, den);
    num /= g;
    den /= g;
    if (den === 1) return `${num}`;
    return `\\frac{${num}}{${den}}`;
  }

  // Safe KaTeX renderer for dynamic DOM elements
  function renderMath(element) {
    if (window.renderMathInElement && element) {
      try {
        window.renderMathInElement(element, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn('KaTeX rendering error:', err);
      }
    }
  }

  // Normalize user answer strings for comparison
  function normalizeAnswer(str) {
    if (str === null || str === undefined) return '';
    return str
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\$]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/x\s*=\s*/g, '')
      .replace(/y\s*=\s*/g, '')
      .replace(/a\s*=\s*/g, '')
      .replace(/k\s*=\s*/g, '')
      .replace(/元|件|人|度|%|％/g, '')
      .trim();
  }

  // Evaluate if user answer matches target answer
  function checkAnswer(userAnswer, expectedAnswer) {
    const uNorm = normalizeAnswer(userAnswer);
    const eNorm = normalizeAnswer(expectedAnswer);

    if (uNorm === eNorm) return true;

    // Numerical float comparison tolerance (for statistics, decimal approximations)
    const uNum = parseFloat(uNorm);
    const eNum = parseFloat(eNorm);
    if (!isNaN(uNum) && !isNaN(eNum)) {
      if (Math.abs(uNum - eNum) < 0.05) return true;
    }

    // Fraction evaluation
    const uFrac = parseFraction(uNorm);
    const eFrac = parseFraction(eNorm);
    if (!isNaN(uFrac) && !isNaN(eFrac)) {
      if (Math.abs(uFrac - eFrac) < 1e-4) return true;
    }

    return false;
  }

  function parseFraction(str) {
    if (!str) return NaN;
    const parts = str.split('/');
    if (parts.length === 2) {
      const n = parseFloat(parts[0]);
      const d = parseFloat(parts[1]);
      if (!isNaN(n) && !isNaN(d) && d !== 0) {
        return n / d;
      }
    }
    return parseFloat(str);
  }

  // Dynamic Question Generators for additional variety
  const DynamicGenerators = {
    // 1. Derivative of Polynomial/Exponential
    derivativeExtremum() {
      const a = randChoice([1, 2, 3, 4]);
      const b = randChoice([2, 4, 6]);
      return {
        id: `dyn_deriv_${Date.now()}_${randInt(100, 999)}`,
        category: 'calc_derivatives',
        topicName: '导数与切线极值',
        difficulty: 3,
        type: 'analytical',
        title: '导数切线与单调区间求解',
        content: `已知函数 $f(x) = x^3 - ${3 * a} x^2 + ${b}$。`,
        subQuestions: [
          `求曲线 $y = f(x)$ 在点 $(0, ${b})$ 处的切线方程；`,
          `求函数 $f(x)$ 的单调递减区间及极小值。`
        ],
        hint: `求导后得 $f'(x) = 3x^2 - ${6 * a}x$。令 $f'(x) < 0$ 确定单调减区间。`,
        expectedAnswer: `(1) y = ${b}; (2) 减区间 (0, ${2 * a})，极小值 ${b - 4 * a * a * a}`,
        solution: `
          <p><strong>(1) 切线方程：</strong></p>
          <p>求导得 $f'(x) = 3x^2 - ${6 * a}x$。在 $x = 0$ 处，$f'(0) = 0$。</p>
          <p>因此在点 $(0, ${b})$ 处的切线方程为 $y - ${b} = 0(x - 0) \\implies y = ${b}$。</p>
          <p><strong>(2) 单调性与极小值：</strong></p>
          <p>令 $f'(x) = 3x(x - ${2 * a}) = 0$，解得驻点 $x_1 = 0, x_2 = ${2 * a}$。</p>
          <p>当 $x \\in (0, ${2 * a})$ 时，$f'(x) < 0$，函数 $f(x)$ 单调递减；</p>
          <p>极小值为 $f(${2 * a}) = (${2 * a})^3 - ${3 * a}(${2 * a})^2 + ${b} = ${b - 4 * a * a * a}$。</p>
        `
      };
    },

    // 2. Normal Distribution Standard Quality Check
    normalDistributionQuality() {
      const mu = randChoice([50, 100, 200]);
      const sigma = randChoice([2, 5, 10]);
      const k = randChoice([1, 2, 3]);
      const lower = mu - k * sigma;
      const upper = mu + k * sigma;
      const probs = { 1: '0.6826', 2: '0.9544', 3: '0.9974' };

      return {
        id: `dyn_norm_${Date.now()}_${randInt(100, 999)}`,
        category: 'prob_normal',
        topicName: '正态分布与质量控制',
        difficulty: 3,
        type: 'input',
        title: '正态分布 $3\\sigma$ 准则与合格率评估',
        content: `某零件生产流水线生产的零件指标 $X$ 服从正态分布 $N(${mu}, ${sigma * sigma})$。若合格品要求指标在区间 $[${lower}, ${upper}]$ 之间。`,
        subQuestions: [
          `已知标准正态分布 $\\Phi(${k}) \\approx ${ (0.5 + parseFloat(probs[k])/2).toFixed(4) }$，求抽取一件产品为合格品的概率；`,
          `若该批次共生产 $10000$ 件产品，求次品（不合格品）的期望数量。`
        ],
        hint: `根据标准化变量 $Z = \\frac{X - \\mu}{\\sigma}$，计算 $P(${ -k } \\le Z \\le ${k}) = 2\\Phi(${k}) - 1$。`,
        expectedAnswer: `${probs[k]}`,
        solution: `
          <p><strong>(1) 合格品概率：</strong></p>
          <p>标准化变量 $Z = \\frac{X - ${mu}}{${sigma}}$。区间 $[${lower}, ${upper}]$ 对应 $-${k} \\le Z \\le ${k}$。</p>
          <p>$$P(${lower} \\le X \\le ${upper}) = \\Phi(${k}) - \\Phi(-${k}) = 2\\Phi(${k}) - 1 = ${probs[k]}$$</p>
          <p><strong>(2) 次品期望数：</strong></p>
          <p>次品概率为 $1 - ${probs[k]} = ${(1 - parseFloat(probs[k])).toFixed(4)}$。</p>
          <p>期望次品数 $E = 10000 \\times ${(1 - parseFloat(probs[k])).toFixed(4)} = ${Math.round(10000 * (1 - parseFloat(probs[k])))} \\text{ 件}$。</p>
        `
      };
    }
  };

  return {
    randInt,
    randChoice,
    gcd,
    formatFraction,
    renderMath,
    normalizeAnswer,
    checkAnswer,
    DynamicGenerators
  };
})();
