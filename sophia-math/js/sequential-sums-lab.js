/**
 * Sophia's Sequential Sums & Gauss Magic Masterclass Interactive Engine
 * ---------------------------------------------------------------------------
 * Features:
 * 1. Visual Pairing Arc & Staircase Block SVG Visualizer
 * 2. Live Arbitrary Range ($A$ to $B$) Solver with Dual-Proof Verification
 * 3. Step-by-Step Arithmetic Breakdown (KaTeX / Space Mono)
 * 4. 3-Tier Gamified Challenge Arena with Waterloo CEMC Gauss Contest Problems
 * 5. Full Confetti Celebration & XP System
 */

(function () {
  'use strict';

  // --- Confetti Particle System ---
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#06b6d4', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          active = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      });

      if (active) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(render);
  }

  // --- Number Formatting Helper ---
  function formatNum(n) {
    return Number(n).toLocaleString('en-US');
  }

  // --- State Management ---
  const state = {
    currentStation: 'gauss_1_to_n',
    startNum: 1,
    endNum: 10,
    step: 1,
    showProof: false,
    activeTier: 1,
    currentQuizIndex: 0,
    xp: parseInt(localStorage.getItem('studyflix_sophia_xp') || '0', 10)
  };

  // Station Configurations
  const STATIONS = {
    gauss_1_to_n: {
      name: "⚡ 1 to N Gauss Magic",
      badge: "S = N(N+1)/2",
      formula: "S = \\frac{N \\times (N + 1)}{2}",
      formulaText: "Sum = (N × (N + 1)) / 2",
      defaultStart: 1,
      defaultEnd: 10,
      defaultStep: 1,
      minEnd: 2,
      maxEnd: 100,
      ruleName: "Young Gauss 1 to N Shortcut",
      insight: "<strong>Why the formula works:</strong> Pairing 1 with N, 2 with (N-1), etc. gives pairs that all equal <strong>(N + 1)</strong>. Since there are <strong>N / 2</strong> pairs, the sum is exactly <strong>N(N+1)/2</strong>.",
      trap: "<strong>Common Trap:</strong> Don't forget to divide by 2! 10 × 11 = 110, but the true sum is half: <strong>55</strong>."
    },
    range_a_to_b: {
      name: "🚀 Any Range (A to B)",
      badge: "S = N(A+B)/2",
      formula: "S = \\frac{N \\times (A + B)}{2} \\quad \\text{where } N = B - A + 1",
      formulaText: "Sum = (N × (A + B)) / 2  [N = B - A + 1]",
      defaultStart: 5,
      defaultEnd: 25,
      defaultStep: 1,
      minEnd: 6,
      maxEnd: 100,
      ruleName: "Universal Gauss Formula & Fencepost Rule",
      insight: "<strong>The Fencepost Rule:</strong> To count how many numbers are between A and B inclusive, always calculate <strong>N = B - A + 1</strong>. For 5 to 25: 25 - 5 + 1 = <strong>21 numbers</strong>!",
      trap: "<strong>Common Trap:</strong> Subtracting without adding 1 (e.g. 25 - 5 = 20) misses the starting number and causes a wrong answer!"
    },
    evens_odds_steps: {
      name: "⚖️ Evens, Odds & Step Jumps",
      badge: "k(k+1) & k²",
      formula: "\\text{Evens: } k(k+1) \\quad \\text{Odds: } k^2",
      formulaText: "Evens = k(k + 1)  |  Odds = k²",
      defaultStart: 2,
      defaultEnd: 20,
      defaultStep: 2,
      minEnd: 4,
      maxEnd: 100,
      ruleName: "Patterned Step Sequences",
      insight: "<strong>Square Proof for Odds:</strong> The sum of the first k odd numbers ($1 + 3 + 5 + \\dots$) always forms a perfect geometric square of area <strong>k²</strong>!",
      trap: "<strong>Common Trap:</strong> For evens, k is the number of terms, not the last number. For 2 to 20, there are 10 terms ($k=10$), so sum = 10 × 11 = <strong>110</strong>."
    },
    contest_problems: {
      name: "🧩 Waterloo Gauss Contest Arena",
      badge: "Contest Logic",
      formula: "\\text{Handshakes: } \\frac{N(N-1)}{2}",
      formulaText: "Handshakes = N(N - 1) / 2",
      defaultStart: 1,
      defaultEnd: 15,
      defaultStep: 1,
      minEnd: 2,
      maxEnd: 50,
      ruleName: "Gauss Contest Applications",
      insight: "<strong>The Handshake Secret:</strong> In a room of N people, person 1 shakes (N-1) hands, person 2 shakes (N-2), down to 1. Total handshakes is the sum of 1 to (N-1): <strong>N(N-1)/2</strong>.",
      trap: "<strong>Contest Trap:</strong> 16 people shake 15 + 14 + ... + 1 = <strong>120 handshakes</strong>, not 16 × 16!"
    },
    live_calculator: {
      name: "🧮 Live Instant Range Calculator",
      badge: "Universal Solver",
      formula: "S = \\frac{N \\times (A + B)}{2}",
      formulaText: "Sum = (N × (First + Last)) / 2",
      defaultStart: 5,
      defaultEnd: 10000,
      defaultStep: 1,
      minEnd: 2,
      maxEnd: 100000,
      ruleName: "Instant Arithmetic Sequence Solver",
      insight: "<strong>Massive Numbers:</strong> For 5 to 10,000: N = 9,996, Pair Sum = 10,005. Total = 9,996 × 10,005 / 2 = <strong>50,004,990</strong> in under 2 seconds!",
      trap: "<strong>Check:</strong> You can double check via Subtraction: Sum(1..10000) - Sum(1..4) = 50,005,000 - 10 = <strong>50,004,990</strong>."
    }
  };

  // 3-Tier Quiz Arena Question Bank
  const QUIZ_QUESTIONS = {
    1: [
      {
        badge: "TIER 1 • SPEED SPRINT",
        prompt: "What is the sum of all whole numbers from 1 to 10?",
        options: ["45", "50", "55", "60"],
        correct: 2,
        solution: "Using the Gauss formula: Sum = (10 × 11) / 2 = 5 × 11 = 55."
      },
      {
        badge: "TIER 1 • SPEED SPRINT",
        prompt: "What is the sum of all whole numbers from 1 to 20?",
        options: ["190", "200", "210", "220"],
        correct: 2,
        solution: "Using the Gauss formula: Sum = (20 × 21) / 2 = 10 × 21 = 210."
      },
      {
        badge: "TIER 1 • CENTURY SUM",
        prompt: "What is the sum of all whole numbers from 1 to 100 (young Gauss's original problem)?",
        options: ["5000", "5050", "5100", "5500"],
        correct: 1,
        solution: "Young Gauss paired (1+100)=101 with 50 pairs: 50 × 101 = 5,050!"
      },
      {
        badge: "TIER 1 • THOUSAND SPRINT",
        prompt: "What is the sum of all whole numbers from 1 to 1,000?",
        options: ["500,000", "500,500", "501,000", "505,000"],
        correct: 1,
        solution: "Sum = (1,000 × 1,001) / 2 = 500 × 1,001 = 500,500."
      },
      {
        badge: "TIER 1 • 10-THOUSAND SPRINT",
        prompt: "What is the sum of all whole numbers from 1 to 10,000?",
        options: ["50,000,000", "50,005,000", "50,050,000", "50,500,000"],
        correct: 1,
        solution: "Sum = (10,000 × 10,001) / 2 = 5,000 × 10,001 = 50,005,000."
      }
    ],
    2: [
      {
        badge: "TIER 2 • ARBITRARY RANGE",
        prompt: "What is the sum of all whole numbers from 5 to 25?",
        options: ["300", "310", "315", "325"],
        correct: 2,
        solution: "1. Term count N = 25 - 5 + 1 = 21 numbers.<br>2. Pair sum = 5 + 25 = 30.<br>3. Total Sum = (21 × 30) / 2 = 21 × 15 = 315.<br>(Or Subtraction: Sum(1..25) - Sum(1..4) = 325 - 10 = 315)."
      },
      {
        badge: "TIER 2 • MASSIVE RANGE",
        prompt: "What is the sum of all whole numbers from 5 to 10,000?",
        options: ["50,004,990", "50,005,000", "50,000,000", "49,995,000"],
        correct: 0,
        solution: "1. N = 10,000 - 5 + 1 = 9,996.<br>2. Pair sum = 5 + 10,000 = 10,005.<br>3. Sum = (9,996 × 10,005) / 2 = 4,998 × 10,005 = 50,004,990.<br>(Or: 50,005,000 - 10 = 50,004,990)."
      },
      {
        badge: "TIER 2 • MASSIVE RANGE + 1",
        prompt: "What is the sum of all whole numbers from 5 to 10,001?",
        options: ["50,004,990", "50,014,991", "50,015,000", "50,020,000"],
        correct: 1,
        solution: "Sum(5..10,001) = Sum(5..10,000) + 10,001 = 50,004,990 + 10,001 = 50,014,991.<br>(Or: N = 9,997, Pair = 10,006 → 9,997 × 5,003 = 50,014,991)."
      },
      {
        badge: "TIER 2 • EVEN NUMBERS",
        prompt: "What is the sum of the first 25 consecutive even numbers (2 + 4 + 6 + ... + 50)?",
        options: ["600", "625", "650", "675"],
        correct: 2,
        solution: "Formula for sum of first k even numbers is k(k + 1). Here k = 25, so Sum = 25 × 26 = 650."
      },
      {
        badge: "TIER 2 • ODD NUMBERS",
        prompt: "What is the sum of the first 30 consecutive odd numbers (1 + 3 + 5 + ... + 59)?",
        options: ["870", "900", "930", "960"],
        correct: 1,
        solution: "Formula for sum of first k odd numbers is k². Here k = 30, so Sum = 30² = 900!"
      }
    ],
    3: [
      {
        badge: "TIER 3 • WATERLOO GAUSS CONTEST",
        prompt: "At a math olympiad, 16 students meet and every student shakes hands with every other student exactly once. How many total handshakes occur?",
        options: ["112", "120", "128", "136"],
        correct: 1,
        solution: "Total handshakes = Sum from 1 to 15 = (16 × 15) / 2 = 8 × 15 = 120 handshakes."
      },
      {
        badge: "TIER 3 • WATERLOO REVERSE SUM",
        prompt: "If the sum of whole numbers from 1 to n is 210 (1 + 2 + ... + n = 210), what is the value of n?",
        options: ["18", "19", "20", "21"],
        correct: 2,
        solution: "n(n + 1) / 2 = 210 ⇒ n(n + 1) = 420. Since 20 × 21 = 420, n = 20."
      },
      {
        badge: "TIER 3 • CONSECUTIVE INTEGERS",
        prompt: "The sum of 5 consecutive whole numbers is 165. What is the smallest of the 5 numbers?",
        options: ["30", "31", "32", "33"],
        correct: 1,
        solution: "The average (middle number) is 165 / 5 = 33. The 5 numbers are 31, 32, 33, 34, 35. The smallest is 31."
      },
      {
        badge: "TIER 3 • MISSING PAGE RIDDLE",
        prompt: "Sophia sums all page numbers in a booklet from 1 to n. She accidentally counts one page number twice and gets 410. Which page did she count twice?",
        options: ["Page 3", "Page 4", "Page 5", "Page 6"],
        correct: 1,
        solution: "The largest triangular sum below 410 is for n = 28: Sum(1..28) = (28 × 29) / 2 = 406. The repeated page is 410 - 406 = Page 4!"
      }
    ]
  };

  // --- SVG Visualizer Rendering ---
  function renderVisualizer() {
    const svg = document.getElementById('gauss-svg-canvas');
    if (!svg) return;

    const start = state.startNum;
    const end = state.endNum;
    const step = state.step;
    const isProof = state.showProof;

    // Clear canvas
    svg.innerHTML = '';

    // Calculate series numbers
    const numbers = [];
    for (let x = start; x <= end; x += step) {
      numbers.push(x);
      if (numbers.length > 20) break; // cap rendering for SVG visual clarity
    }

    const count = numbers.length;
    const N = Math.floor((end - start) / step) + 1;
    const pairSum = start + end;

    if (isProof) {
      // Render Staircase Dual-Triangle Proof
      renderStaircaseProof(svg, Math.min(N, 8));
      return;
    }

    // Default: Render Pairing Arcs
    renderPairingArcs(svg, numbers, N, pairSum, start, end);
  }

  function renderPairingArcs(svg, numbers, totalCount, pairSum, start, end) {
    const svgWidth = 500;
    const svgHeight = 260;
    const count = numbers.length;

    // Display numbers along horizontal axis
    const marginX = 40;
    const availWidth = svgWidth - marginX * 2;
    const stepX = totalCount > 10 ? availWidth / (Math.min(count, 10) + 1) : availWidth / (count - 1 || 1);
    const baselineY = 190;

    // Defs for gradients & glow
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06b6d4" />
        <stop offset="50%" stop-color="#3b82f6" />
        <stop offset="100%" stop-color="#10b981" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    `;
    svg.appendChild(defs);

    // Number nodes
    const displayItems = [];
    if (totalCount <= 10) {
      for (let i = 0; i < totalCount; i++) {
        displayItems.push({
          val: numbers[i],
          x: marginX + i * stepX,
          idx: i
        });
      }
    } else {
      // Show first 4, ellipsis, last 4
      const first4 = numbers.slice(0, 4);
      const last4 = [end - 3 * state.step, end - 2 * state.step, end - state.step, end];
      const spacing = availWidth / 9;

      first4.forEach((val, i) => {
        displayItems.push({ val, x: marginX + i * spacing, idx: i, isEdge: 'left' });
      });
      displayItems.push({ val: '...', x: marginX + 4.5 * spacing, idx: -1, isDot: true });
      last4.forEach((val, i) => {
        displayItems.push({ val, x: marginX + (5.5 + i) * spacing, idx: totalCount - 4 + i, isEdge: 'right' });
      });
    }

    // Render Pairing Arcs
    const numPairsToDraw = Math.min(Math.floor(displayItems.filter(d => !d.isDot).length / 2), 4);
    for (let p = 0; p < numPairsToDraw; p++) {
      const leftNode = displayItems[p];
      const rightNode = displayItems[displayItems.length - 1 - p];

      if (leftNode && rightNode && !leftNode.isDot && !rightNode.isDot) {
        const x1 = leftNode.x;
        const x2 = rightNode.x;
        const midX = (x1 + x2) / 2;
        const arcHeight = 40 + (p * 28);
        const yTop = baselineY - 20 - arcHeight;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${baselineY - 18} Q ${midX} ${yTop} ${x2} ${baselineY - 18}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', p === 0 ? 'url(#arcGrad)' : 'rgba(6, 182, 212, 0.45)');
        path.setAttribute('stroke-width', p === 0 ? '3' : '2');
        path.setAttribute('stroke-linecap', 'round');
        if (p === 0) path.setAttribute('filter', 'url(#glow)');
        svg.appendChild(path);

        // Label on outer arc
        if (p === 0) {
          const badge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          badge.innerHTML = `
            <rect x="${midX - 50}" y="${yTop - 16}" width="100" height="22" rx="11" fill="#0f172a" stroke="#06b6d4" stroke-width="1.5"/>
            <text x="${midX}" y="${yTop - 1}" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#38bdf8">Pair = ${formatNum(pairSum)}</text>
          `;
          svg.appendChild(badge);
        }
      }
    }

    // Draw Number Circles & Text
    displayItems.forEach(item => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      if (item.isDot) {
        g.innerHTML = `<text x="${item.x}" y="${baselineY + 6}" text-anchor="middle" font-family="Space Mono, monospace" font-size="20" font-weight="800" fill="#94a3b8">···</text>`;
      } else {
        g.innerHTML = `
          <circle cx="${item.x}" cy="${baselineY}" r="16" fill="#1e293b" stroke="#334155" stroke-width="2"/>
          <text x="${item.x}" y="${baselineY + 5}" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#f8fafc">${item.val > 9999 ? formatNum(item.val) : item.val}</text>
        `;
      }
      svg.appendChild(g);
    });

    // Summary footer text inside SVG
    const summaryText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    summaryText.setAttribute('x', '250');
    summaryText.setAttribute('y', '242');
    summaryText.setAttribute('text-anchor', 'middle');
    summaryText.setAttribute('font-family', 'Montserrat, sans-serif');
    summaryText.setAttribute('font-size', '12');
    summaryText.setAttribute('font-weight', '700');
    summaryText.setAttribute('fill', '#94a3b8');
    summaryText.innerHTML = `Total Numbers (N) = <tspan fill="#38bdf8">${formatNum(totalCount)}</tspan> &bull; Pair Sum = <tspan fill="#34d399">${formatNum(pairSum)}</tspan>`;
    svg.appendChild(summaryText);
  }

  function renderStaircaseProof(svg, n) {
    const blockSize = Math.min(26, Math.floor(180 / n));
    const startX = 140;
    const startY = 30;

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '250');
    title.setAttribute('y', '22');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-family', 'Montserrat, sans-serif');
    title.setAttribute('font-size', '12');
    title.setAttribute('font-weight', '800');
    title.setAttribute('fill', '#06b6d4');
    title.textContent = `2 Triangular Staircases = Rectangle of ${n} × ${n + 1}`;
    svg.appendChild(title);

    // Draw combined grid
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n + 1; c++) {
        const x = startX + c * blockSize;
        const y = startY + r * blockSize;
        const isStair1 = c <= r; // original staircase

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', blockSize - 2);
        rect.setAttribute('height', blockSize - 2);
        rect.setAttribute('rx', '3');
        rect.setAttribute('fill', isStair1 ? '#06b6d4' : '#10b981');
        rect.setAttribute('opacity', isStair1 ? '0.9' : '0.6');
        svg.appendChild(rect);
      }
    }

    // Annotations
    const dimText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    dimText.setAttribute('x', '250');
    dimText.setAttribute('y', startY + n * blockSize + 24);
    dimText.setAttribute('text-anchor', 'middle');
    dimText.setAttribute('font-family', 'Space Mono, monospace');
    dimText.setAttribute('font-size', '12');
    dimText.setAttribute('font-weight', '700');
    dimText.setAttribute('fill', '#f8fafc');
    dimText.innerHTML = `Rectangle Area = ${n} × ${n + 1} = ${n * (n + 1)} ⇒ 1 Staircase = <tspan fill="#34d399">${(n * (n + 1)) / 2}</tspan>`;
    svg.appendChild(dimText);
  }

  // --- Live Calculation & Steps Breakdown ---
  function updateCalculationSteps() {
    const start = state.startNum;
    const end = state.endNum;
    const step = state.step;

    const N = Math.floor((end - start) / step) + 1;
    const pairSum = start + end;
    const totalSum = (N * pairSum) / 2;

    const container = document.getElementById('calculation-steps-container');
    if (!container) return;

    let html = `
      <div class="calc-step-item">
        <span class="step-name">1. Count of Terms (N):</span>
        <span class="step-math">${step === 1 ? `(${formatNum(end)} - ${formatNum(start)}) + 1 = ` : `((${formatNum(end)} - ${formatNum(start)}) / ${step}) + 1 = `}<strong>${formatNum(N)}</strong></span>
      </div>
      <div class="calc-step-item">
        <span class="step-name">2. First + Last (Pair Sum):</span>
        <span class="step-math">${formatNum(start)} + ${formatNum(end)} = <strong>${formatNum(pairSum)}</strong></span>
      </div>
      <div class="calc-step-item">
        <span class="step-name">3. Multiply &amp; Halve:</span>
        <span class="step-math">(${formatNum(N)} × ${formatNum(pairSum)}) / 2 = <strong>${formatNum(totalSum)}</strong></span>
      </div>
    `;

    // Add prefix subtraction check if start > 1 and step == 1
    if (start > 1 && step === 1) {
      const sumToEnd = (end * (end + 1)) / 2;
      const sumToPrefix = ((start - 1) * start) / 2;
      html += `
        <div class="calc-step-item" style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 4px; padding-top: 8px;">
          <span class="step-name">🛡️ Subtraction Check:</span>
          <span class="step-math">${formatNum(sumToEnd)} - ${formatNum(sumToPrefix)} = <strong>${formatNum(totalSum)}</strong> ✓</span>
        </div>
      `;
    }

    html += `
      <div class="result-hero-row">
        <span class="result-hero-label">⚡ Final Total Sum:</span>
        <span class="result-hero-val">${formatNum(totalSum)}</span>
      </div>
    `;

    container.innerHTML = html;
  }

  // --- Update Station UI ---
  function setStation(stationKey) {
    if (!STATIONS[stationKey]) return;
    state.currentStation = stationKey;
    const cfg = STATIONS[stationKey];

    // Highlight active tab
    document.querySelectorAll('.station-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.station === stationKey);
    });

    // Update Formula Display
    const formulaDisplay = document.getElementById('station-formula-display');
    if (formulaDisplay) {
      formulaDisplay.textContent = cfg.formulaText;
    }

    // Update Insight & Trap Boxes
    const insightBox = document.getElementById('station-insight-box');
    if (insightBox) insightBox.innerHTML = cfg.insight;

    const trapBox = document.getElementById('station-trap-box');
    if (trapBox) trapBox.innerHTML = cfg.trap;

    // Apply default values
    state.startNum = cfg.defaultStart;
    state.endNum = cfg.defaultEnd;
    state.step = cfg.defaultStep;
    state.showProof = false;

    // Update inputs
    const inputStart = document.getElementById('input-start-num');
    const inputEnd = document.getElementById('input-end-num');
    const inputStep = document.getElementById('input-step-num');

    if (inputStart) inputStart.value = state.startNum;
    if (inputEnd) inputEnd.value = state.endNum;
    if (inputStep) inputStep.value = state.step;

    // Update Proof button
    const proofBtn = document.getElementById('proof-action-btn');
    if (proofBtn) proofBtn.classList.remove('active');

    renderVisualizer();
    updateCalculationSteps();
  }

  // --- Quiz Arena Engine ---
  function renderQuiz() {
    const tier = state.activeTier;
    const questions = QUIZ_QUESTIONS[tier] || QUIZ_QUESTIONS[1];
    const q = questions[state.currentQuizIndex % questions.length];

    const badge = document.getElementById('arena-q-badge');
    const prompt = document.getElementById('arena-q-prompt');
    const optionsGrid = document.getElementById('arena-options-grid');
    const feedbackBox = document.getElementById('arena-feedback-container');

    if (badge) badge.textContent = q.badge;
    if (prompt) prompt.innerHTML = q.prompt;
    if (feedbackBox) feedbackBox.className = 'feedback-container';

    if (optionsGrid) {
      optionsGrid.innerHTML = '';
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = opt;
        btn.addEventListener('click', () => handleQuizAnswer(idx, q.correct, q.solution));
        optionsGrid.appendChild(btn);
      });
    }
  }

  function handleQuizAnswer(selectedIdx, correctIdx, solutionText) {
    const options = document.querySelectorAll('#arena-options-grid .option-btn');
    options.forEach(btn => btn.disabled = true);

    const feedbackBox = document.getElementById('arena-feedback-container');
    const feedbackTitle = document.getElementById('feedback-title-text');
    const feedbackSol = document.getElementById('feedback-solution-text');

    if (selectedIdx === correctIdx) {
      options[selectedIdx].classList.add('correct');
      feedbackBox.className = 'feedback-container correct-feedback show';
      feedbackTitle.innerHTML = '✨ Correct! Outstanding Gauss Logic!';
      feedbackSol.innerHTML = solutionText;

      // Award XP
      state.xp += 15;
      localStorage.setItem('studyflix_sophia_xp', state.xp);
      const xpEl = document.getElementById('global-user-xp');
      if (xpEl) xpEl.textContent = `${state.xp} XP`;

      triggerConfetti();
    } else {
      options[selectedIdx].classList.add('wrong');
      options[correctIdx].classList.add('correct');
      feedbackBox.className = 'feedback-container wrong-feedback show';
      feedbackTitle.innerHTML = '💡 Nice try! Here is how to solve it:';
      feedbackSol.innerHTML = solutionText;
    }
  }

  // --- Initialization & Event Listeners ---
  function init() {
    // XP display
    const xpEl = document.getElementById('global-user-xp');
    if (xpEl) xpEl.textContent = `${state.xp} XP`;

    // Station Navigation Buttons
    document.querySelectorAll('.station-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setStation(btn.dataset.station);
      });
    });

    // Preset Chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        state.startNum = parseInt(chip.dataset.start, 10);
        state.endNum = parseInt(chip.dataset.end, 10);
        state.step = parseInt(chip.dataset.step || '1', 10);

        const inputStart = document.getElementById('input-start-num');
        const inputEnd = document.getElementById('input-end-num');
        const inputStep = document.getElementById('input-step-num');

        if (inputStart) inputStart.value = state.startNum;
        if (inputEnd) inputEnd.value = state.endNum;
        if (inputStep) inputStep.value = state.step;

        renderVisualizer();
        updateCalculationSteps();
      });
    });

    // Solve Now Button
    const btnSolve = document.getElementById('btn-solve-now');
    if (btnSolve) {
      btnSolve.addEventListener('click', () => {
        const inputStart = document.getElementById('input-start-num');
        const inputEnd = document.getElementById('input-end-num');
        const inputStep = document.getElementById('input-step-num');

        state.startNum = parseInt(inputStart.value, 10) || 1;
        state.endNum = parseInt(inputEnd.value, 10) || 10;
        state.step = parseInt(inputStep.value, 10) || 1;

        if (state.endNum < state.startNum) {
          state.endNum = state.startNum + 1;
          inputEnd.value = state.endNum;
        }

        renderVisualizer();
        updateCalculationSteps();
      });
    }

    // Proof Animation Toggle Button
    const proofBtn = document.getElementById('proof-action-btn');
    if (proofBtn) {
      proofBtn.addEventListener('click', () => {
        state.showProof = !state.showProof;
        proofBtn.classList.toggle('active', state.showProof);
        proofBtn.querySelector('span').textContent = state.showProof
          ? '🔍 Switch to Pairing Arcs View'
          : '✨ Animate Stepped Staircase Proof';
        renderVisualizer();
      });
    }

    // Quiz Tier Tabs
    document.querySelectorAll('.tier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTier = parseInt(btn.dataset.tier, 10);
        state.currentQuizIndex = 0;
        renderQuiz();
      });
    });

    // Next Question Button
    const btnNextQ = document.getElementById('btn-next-question');
    if (btnNextQ) {
      btnNextQ.addEventListener('click', () => {
        state.currentQuizIndex++;
        renderQuiz();
      });
    }

    // Check URL parameters for preset
    const params = new URLSearchParams(window.location.search);
    const stationParam = params.get('station');
    if (stationParam && STATIONS[stationParam]) {
      setStation(stationParam);
    } else {
      setStation('gauss_1_to_n');
    }

    renderQuiz();
  }

  // Launch on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
