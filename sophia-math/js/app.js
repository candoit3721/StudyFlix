/**
 * Sophia's Math Studio - Main Application Controller
 * Handles UI interactions, presets, dynamic multi-page pagination,
 * smart answer evaluation, interactive practice with timer, hints, step-by-step solutions,
 * and multi-page print layout.
 */

(function () {
  // Application State
  const state = {
    config: {
      category: 'grade5_mixed',
      count: 20,
      gridCols: 2,
      questionsPerPage: 'auto',
      studentName: 'Sophia',
      worksheetTitle: 'Grade 5 & 6 Math Challenge',
      showHints: true,
      includeAnswerKey: true,
      includeWorkSpace: true
    },
    problems: [],
    mode: 'print-preview', // 'print-preview' or 'interactive'
    timerInterval: null,
    timerSeconds: 0
  };

  // Presets definition
  const presets = {
    g5_fractions: {
      category: 'fractions',
      count: 16,
      gridCols: 2,
      questionsPerPage: '8',
      worksheetTitle: 'Grade 5: Fraction Mastery (Add, Sub, Mult, Div)',
      includeWorkSpace: true
    },
    g5_decimals: {
      category: 'decimals',
      count: 16,
      gridCols: 2,
      questionsPerPage: '8',
      worksheetTitle: 'Grade 5: Decimal Operations & Long Division',
      includeWorkSpace: true
    },
    g5_pemdas: {
      category: 'pemdas',
      count: 16,
      gridCols: 2,
      questionsPerPage: '8',
      worksheetTitle: 'Grade 5: Order of Operations (PEMDAS)',
      includeWorkSpace: true
    },
    g6_ratios: {
      category: 'ratios',
      count: 16,
      gridCols: 2,
      questionsPerPage: '8',
      worksheetTitle: 'Grade 6: Ratios, Rates & Proportions',
      includeWorkSpace: true
    },
    g6_percentages: {
      category: 'percentages',
      count: 16,
      gridCols: 2,
      questionsPerPage: '8',
      worksheetTitle: 'Grade 6: Percentages, Discounts & Sales Tax',
      includeWorkSpace: true
    },
    g6_equations: {
      category: 'algebra',
      count: 16,
      gridCols: 2,
      questionsPerPage: '8',
      worksheetTitle: 'Grade 6: One-Step & Two-Step Equations',
      includeWorkSpace: true
    },
    g6_integers: {
      category: 'integers',
      count: 24,
      gridCols: 3,
      questionsPerPage: '12',
      worksheetTitle: 'Grade 6: Positive & Negative Integers Sprint',
      includeWorkSpace: false
    },
    g5_6_word_problems: {
      category: 'word_problems',
      count: 8,
      gridCols: 1,
      questionsPerPage: '4',
      worksheetTitle: 'Grade 5/6: Multi-Step Real World Word Problems',
      includeWorkSpace: true
    },
    g5_6_assessment: {
      category: 'all_mixed',
      count: 20,
      gridCols: 2,
      questionsPerPage: '8',
      worksheetTitle: 'Grade 5 & 6 Comprehensive Math Assessment',
      includeWorkSpace: true
    }
  };

  // DOM Elements
  const els = {
    topicSelect: document.getElementById('topic-select'),
    questionCount: document.getElementById('question-count'),
    gridColsSelect: document.getElementById('grid-cols-select'),
    perPageSelect: document.getElementById('per-page-select'),
    studentNameInput: document.getElementById('student-name-input'),
    worksheetTitleInput: document.getElementById('worksheet-title-input'),
    includeAnswerKeyCheck: document.getElementById('include-answer-key-check'),
    includeWorkSpaceCheck: document.getElementById('include-workspace-check'),
    btnGenerate: document.getElementById('btn-generate'),
    btnPrintSidebar: document.getElementById('btn-print-sidebar'),
    btnPrintTop: document.getElementById('btn-print-top'),
    modePrintBtn: document.getElementById('mode-print-btn'),
    modeInteractiveBtn: document.getElementById('mode-interactive-btn'),
    btnCheckAnswers: document.getElementById('btn-check-answers'),
    btnResetInteractive: document.getElementById('btn-reset-interactive'),

    // Views
    pagesContainer: document.getElementById('pages-container'),
    interactiveToolbar: document.getElementById('interactive-toolbar'),
    interactiveScore: document.getElementById('interactive-score'),
    interactiveTimer: document.getElementById('interactive-timer'),
    confettiCanvas: document.getElementById('confetti-canvas')
  };

  // Normalize string for math answers
  function normalizeAnswer(str) {
    if (str === null || str === undefined) return '';
    return str
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\$/g, '')
      .replace(/\s+/g, ' ')
      .replace(/x\s*=\s*/g, '')
      .replace(/y\s*=\s*/g, '')
      .replace(/n\s*=\s*/g, '')
      .replace(/a\s*=\s*/g, '')
      .replace(/m\s*=\s*/g, '')
      .replace(/°/g, '')
      .replace(/degrees?/g, '')
      .replace(/cm²|cm\^2|sq cm/g, '')
      .replace(/m²|m\^2|sq m/g, '')
      .replace(/in²|in\^2|sq in/g, '')
      .replace(/m³|m\^3|cubic m/g, '')
      .replace(/cups?|pizzas?|dollars?|books?|miles?|ounces?|oz/g, '')
      .trim();
  }

  // Parse fraction or mixed number string to float value for loose comparison
  function parseFractionValue(str) {
    str = normalizeAnswer(str);
    if (!str) return NaN;

    const mixedMatch = str.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      const whole = parseInt(mixedMatch[1], 10);
      const num = parseInt(mixedMatch[2], 10);
      const den = parseInt(mixedMatch[3], 10);
      if (den === 0) return NaN;
      return whole >= 0 ? whole + num / den : whole - num / den;
    }

    const fracMatch = str.match(/^(-?\d+)\/(\d+)$/);
    if (fracMatch) {
      const num = parseInt(fracMatch[1], 10);
      const den = parseInt(fracMatch[2], 10);
      if (den === 0) return NaN;
      return num / den;
    }

    return parseFloat(str);
  }

  // Compare student answer with correct answer
  function checkStudentAnswer(userVal, correctVal, altAnswers = []) {
    const normUser = normalizeAnswer(userVal);
    const normCorrect = normalizeAnswer(correctVal);

    if (normUser === '') return false;
    if (normUser === normCorrect) return true;

    for (let alt of altAnswers) {
      if (normUser === normalizeAnswer(alt)) return true;
    }

    const numUser = parseFractionValue(userVal);
    const numCorrect = parseFractionValue(correctVal);

    if (!isNaN(numUser) && !isNaN(numCorrect)) {
      if (Math.abs(numUser - numCorrect) < 0.001) {
        return true;
      }
    }

    return false;
  }

  // Generate problems set
  function generateProblems() {
    const problems = [];
    const count = parseInt(state.config.count, 10) || 20;
    const cat = state.config.category;

    for (let i = 0; i < count; i++) {
      let prob;
      if (cat === 'word_problems') {
        prob = WordProblems.generateWordProblem();
      } else {
        prob = MathEngine.generateProblem({ category: cat });
      }
      prob.id = i + 1;
      problems.push(prob);
    }

    state.problems = problems;
    renderWorksheet();
  }

  // Calculate items per page based on layout and settings
  function getEffectiveQuestionsPerPage() {
    if (state.config.questionsPerPage !== 'auto') {
      return parseInt(state.config.questionsPerPage, 10) || 8;
    }
    const cols = parseInt(state.config.gridCols, 10) || 2;
    const isWordProblem = state.config.category === 'word_problems';

    if (cols === 1 || isWordProblem) {
      return state.config.includeWorkSpace ? 4 : 5;
    } else if (cols === 2) {
      return state.config.includeWorkSpace ? 8 : 10;
    } else {
      // 3 columns
      return state.config.includeWorkSpace ? 9 : 12;
    }
  }

  // Create single problem card element
  function createProblemCard(p, isInteractive) {
    const card = document.createElement('div');
    card.className = 'problem-card';
    card.dataset.id = p.id;

    let cardHTML = `
      <div class="problem-header">
        <span class="q-number">#${p.id}</span>
        <span class="q-topic">${p.topic || p.category}</span>
      </div>
      ${p.htmlQuestion || `<div class="math-expr">${p.prompt}</div>`}
    `;

    if (isInteractive) {
      cardHTML += `
        <div class="interactive-answer-box">
          <div class="input-row">
            <input type="text" class="student-input" placeholder="Type answer..." data-id="${p.id}" autocomplete="off" />
            <span class="feedback-badge" id="badge-${p.id}" style="display: none;"></span>
          </div>
          <div class="hint-container">
            <button type="button" class="hint-toggle-btn" onclick="SophiaApp.toggleHint(${p.id})">💡 Hint</button>
            <div class="hint-box" id="hint-box-${p.id}">${p.hint || 'Carefully work through the steps.'}</div>
            <button type="button" class="hint-toggle-btn" style="color:#7c3aed;" onclick="SophiaApp.toggleSteps(${p.id})">📝 Step-by-Step Solution</button>
            <div class="steps-box" id="steps-box-${p.id}">
              <strong>Solution Steps:</strong>
              <ol>${(p.steps || []).map(s => `<li>${s}</li>`).join('')}</ol>
              <div style="margin-top:4px; font-weight:700; color:#1e293b;">Answer: ${p.answer}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      if (state.config.includeWorkSpace) {
        cardHTML += `
          <div class="workspace-box">
            <div class="answer-line-container">
              Answer: <span class="answer-blank-line"></span>
            </div>
          </div>
        `;
      } else {
        cardHTML += `
          <div style="margin-top:auto; display:flex; justify-content:flex-end; padding-top:4px;">
            <span style="font-size:0.82rem; font-weight:700; color:#334155;">Answer: _________________</span>
          </div>
        `;
      }
    }

    card.innerHTML = cardHTML;
    return card;
  }

  // Render multi-page worksheet and answer key
  function renderWorksheet() {
    if (!els.pagesContainer) return;
    els.pagesContainer.innerHTML = '';

    const title = state.config.worksheetTitle || 'Grade 5 & 6 Math Practice';
    const student = state.config.studentName || 'Sophia';
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const totalCount = state.problems.length;
    const cols = parseInt(state.config.gridCols, 10) || 2;

    if (state.mode === 'interactive') {
      // Interactive Mode: Continuous scrollable list
      const container = document.createElement('div');
      container.className = 'interactive-container';

      const grid = document.createElement('div');
      grid.className = `problems-grid cols-${cols}`;

      state.problems.forEach(p => {
        const card = createProblemCard(p, true);
        grid.appendChild(card);
      });

      container.appendChild(grid);
      els.pagesContainer.appendChild(container);

      attachInteractiveListeners();
      resetTimer();
      startTimer();
      updateScoreSummary(0, state.problems.length);
      return;
    }

    // Print Preview Mode: Multi-Page Pagination
    const perPage = getEffectiveQuestionsPerPage();
    const chunks = [];
    for (let i = 0; i < state.problems.length; i += perPage) {
      chunks.push(state.problems.slice(i, i + perPage));
    }

    const totalPages = chunks.length;

    // Render each chunk as its own distinct .paper-sheet
    chunks.forEach((chunk, idx) => {
      const pageNum = idx + 1;
      const pageSheet = document.createElement('div');
      pageSheet.className = 'paper-sheet worksheet-page';

      let headerHTML = '';
      if (pageNum === 1) {
        headerHTML = `
          <header class="sheet-header">
            <div class="header-info">
              <h2>${title}</h2>
              <p>Grade 5 &amp; 6 Math Drill • ${totalCount} Questions • Page ${pageNum} of ${totalPages}</p>
            </div>
            <div class="student-meta">
              <div class="meta-field">Name: <span class="meta-line">${student}</span></div>
              <div class="meta-field">Date: <span class="meta-line">${dateStr}</span></div>
              <div class="score-box">Score: <span class="score-blank"></span> / ${totalCount}</div>
            </div>
          </header>
        `;
      } else {
        headerHTML = `
          <header class="sheet-header sheet-header-compact">
            <div class="header-info">
              <h2 style="font-size: 1.15rem;">${title} <span style="font-size:0.8rem; color:#6366f1; font-weight:600;">(Page ${pageNum} of ${totalPages})</span></h2>
            </div>
            <div class="student-meta-compact">
              <span>Name: <strong>${student}</strong></span>
              <span>Date: <strong>${dateStr}</strong></span>
            </div>
          </header>
        `;
      }

      pageSheet.innerHTML = headerHTML;

      const grid = document.createElement('div');
      grid.className = `problems-grid cols-${cols}`;

      chunk.forEach(p => {
        const card = createProblemCard(p, false);
        grid.appendChild(card);
      });

      pageSheet.appendChild(grid);

      // Page Footer
      const footer = document.createElement('div');
      footer.className = 'sheet-footer';
      footer.innerHTML = `
        <span>Sophia's Math Studio</span>
        <span>Page ${pageNum} of ${totalPages}</span>
      `;
      pageSheet.appendChild(footer);

      els.pagesContainer.appendChild(pageSheet);
    });

    // Render Answer Key Sheet if enabled
    if (state.config.includeAnswerKey && state.problems.length > 0) {
      const keySheet = document.createElement('div');
      keySheet.className = 'paper-sheet answer-key-sheet';

      keySheet.innerHTML = `
        <header class="key-header">
          <div>
            <h3>Answer Key &amp; Solutions Guide</h3>
            <p style="font-size: 0.8rem; color: #64748b;">${title} • Total Questions: ${totalCount}</p>
          </div>
          <div style="font-size: 0.85rem; color: #475569; font-weight: 600; text-align: right;">
            <div>Student: <strong>${student}</strong></div>
            <div>Date: <span>${dateStr}</span></div>
          </div>
        </header>
      `;

      const compactGrid = document.createElement('div');
      compactGrid.className = 'compact-key-grid';

      state.problems.forEach(p => {
        const item = document.createElement('div');
        item.className = 'key-item';
        item.innerHTML = `
          <span class="key-num">${p.id}.</span>
          <div>
            <span class="key-val">${p.answer}</span>
            ${p.steps && p.steps.length > 0 ? `<div class="key-steps-text">${p.steps[p.steps.length - 1]}</div>` : ''}
          </div>
        `;
        compactGrid.appendChild(item);
      });

      keySheet.appendChild(compactGrid);

      const keyFooter = document.createElement('div');
      keyFooter.className = 'sheet-footer';
      keyFooter.innerHTML = `
        <span>Sophia's Math Studio • Answer Key</span>
        <span>${dateStr}</span>
      `;
      keySheet.appendChild(keyFooter);

      els.pagesContainer.appendChild(keySheet);
    }
  }

  // Interactive event listeners
  function attachInteractiveListeners() {
    const inputs = document.querySelectorAll('.student-input');
    inputs.forEach((inp, idx) => {
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkIndividualAnswer(inp);
          const nextInput = inputs[idx + 1];
          if (nextInput) {
            nextInput.focus();
          } else {
            checkAllAnswers();
          }
        }
      });

      inp.addEventListener('blur', () => {
        if (inp.value.trim()) {
          checkIndividualAnswer(inp);
        }
      });
    });
  }

  function checkIndividualAnswer(inputEl) {
    const probId = parseInt(inputEl.dataset.id, 10);
    const prob = state.problems.find(p => p.id === probId);
    if (!prob) return;

    const badge = document.getElementById(`badge-${probId}`);
    const userVal = inputEl.value.trim();

    if (!userVal) {
      inputEl.className = 'student-input';
      if (badge) badge.style.display = 'none';
      return;
    }

    const isCorrect = checkStudentAnswer(userVal, prob.answer, prob.altAnswers);
    if (isCorrect) {
      inputEl.className = 'student-input correct';
      if (badge) {
        badge.className = 'feedback-badge correct';
        badge.textContent = '✓ Correct!';
        badge.style.display = 'inline-block';
      }
    } else {
      inputEl.className = 'student-input incorrect';
      if (badge) {
        badge.className = 'feedback-badge incorrect';
        badge.textContent = '✗ Try again';
        badge.style.display = 'inline-block';
      }
    }
  }

  function checkAllAnswers() {
    const inputs = document.querySelectorAll('.student-input');
    let correctCount = 0;

    inputs.forEach(inp => {
      const probId = parseInt(inp.dataset.id, 10);
      const prob = state.problems.find(p => p.id === probId);
      const badge = document.getElementById(`badge-${probId}`);
      const userVal = inp.value.trim();

      const isCorrect = checkStudentAnswer(userVal, prob.answer, prob.altAnswers);
      if (isCorrect) {
        correctCount++;
        inp.className = 'student-input correct';
        if (badge) {
          badge.className = 'feedback-badge correct';
          badge.textContent = '✓ Correct!';
          badge.style.display = 'inline-block';
        }
      } else {
        inp.className = 'student-input incorrect';
        if (badge) {
          badge.className = 'feedback-badge incorrect';
          badge.textContent = `✗ Answer: ${prob.answer}`;
          badge.style.display = 'inline-block';
        }
      }
    });

    updateScoreSummary(correctCount, state.problems.length);

    if (correctCount === state.problems.length && state.problems.length > 0) {
      triggerConfetti();
      stopTimer();
    }
  }

  function resetInteractive() {
    const inputs = document.querySelectorAll('.student-input');
    inputs.forEach(inp => {
      inp.value = '';
      inp.className = 'student-input';
    });
    const badges = document.querySelectorAll('.feedback-badge');
    badges.forEach(b => b.style.display = 'none');
    resetTimer();
    startTimer();
    updateScoreSummary(0, state.problems.length);
  }

  function updateScoreSummary(score, total) {
    if (els.interactiveScore) {
      els.interactiveScore.textContent = `${score} / ${total}`;
    }
  }

  // Timer helpers
  function startTimer() {
    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      state.timerSeconds++;
      const mins = Math.floor(state.timerSeconds / 60).toString().padStart(2, '0');
      const secs = (state.timerSeconds % 60).toString().padStart(2, '0');
      if (els.interactiveTimer) {
        els.interactiveTimer.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(state.timerInterval);
  }

  function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerSeconds = 0;
    if (els.interactiveTimer) {
      els.interactiveTimer.textContent = '00:00';
    }
  }

  // Hints and Step-by-step solutions
  function toggleHint(id) {
    const hintBox = document.getElementById(`hint-box-${id}`);
    if (hintBox) {
      hintBox.style.display = hintBox.style.display === 'block' ? 'none' : 'block';
    }
  }

  function toggleSteps(id) {
    const stepsBox = document.getElementById(`steps-box-${id}`);
    if (stepsBox) {
      stepsBox.style.display = stepsBox.style.display === 'block' ? 'none' : 'block';
    }
  }

  // High-Performance Particle Confetti
  function triggerConfetti() {
    const canvas = els.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: Math.random() * 6 + 3,
        color: pickRandom(colors),
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16,
        gravity: 0.35,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    render();
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Setup Event Listeners
  function initEvents() {
    // Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.dataset.preset;
        if (presets[presetKey]) {
          const p = presets[presetKey];
          state.config.category = p.category;
          state.config.count = p.count;
          state.config.gridCols = p.gridCols;
          state.config.questionsPerPage = p.questionsPerPage || 'auto';
          state.config.worksheetTitle = p.worksheetTitle;
          state.config.includeWorkSpace = p.includeWorkSpace;

          // Sync sidebar UI
          if (els.topicSelect) els.topicSelect.value = p.category;
          if (els.questionCount) els.questionCount.value = p.count;
          if (els.gridColsSelect) els.gridColsSelect.value = p.gridCols;
          if (els.perPageSelect) els.perPageSelect.value = p.questionsPerPage || 'auto';
          if (els.worksheetTitleInput) els.worksheetTitleInput.value = p.worksheetTitle;
          if (els.includeWorkSpaceCheck) els.includeWorkSpaceCheck.checked = p.includeWorkSpace;

          generateProblems();
        }
      });
    });

    // Form inputs
    if (els.topicSelect) {
      els.topicSelect.addEventListener('change', e => {
        state.config.category = e.target.value;
      });
    }

    if (els.questionCount) {
      els.questionCount.addEventListener('change', e => {
        state.config.count = parseInt(e.target.value, 10);
      });
    }

    if (els.gridColsSelect) {
      els.gridColsSelect.addEventListener('change', e => {
        state.config.gridCols = parseInt(e.target.value, 10);
        renderWorksheet();
      });
    }

    if (els.perPageSelect) {
      els.perPageSelect.addEventListener('change', e => {
        state.config.questionsPerPage = e.target.value;
        renderWorksheet();
      });
    }

    if (els.studentNameInput) {
      els.studentNameInput.addEventListener('input', e => {
        state.config.studentName = e.target.value;
        renderWorksheet();
      });
    }

    if (els.worksheetTitleInput) {
      els.worksheetTitleInput.addEventListener('input', e => {
        state.config.worksheetTitle = e.target.value;
        renderWorksheet();
      });
    }

    if (els.includeAnswerKeyCheck) {
      els.includeAnswerKeyCheck.addEventListener('change', e => {
        state.config.includeAnswerKey = e.target.checked;
        renderWorksheet();
      });
    }

    if (els.includeWorkSpaceCheck) {
      els.includeWorkSpaceCheck.addEventListener('change', e => {
        state.config.includeWorkSpace = e.target.checked;
        renderWorksheet();
      });
    }

    // Generate Button
    if (els.btnGenerate) {
      els.btnGenerate.addEventListener('click', () => {
        generateProblems();
      });
    }

    // Print Buttons
    const printHandler = () => {
      window.print();
    };
    if (els.btnPrintSidebar) els.btnPrintSidebar.addEventListener('click', printHandler);
    if (els.btnPrintTop) els.btnPrintTop.addEventListener('click', printHandler);

    // Mode Toggle
    if (els.modePrintBtn) {
      els.modePrintBtn.addEventListener('click', () => {
        state.mode = 'print-preview';
        els.modePrintBtn.classList.add('active');
        els.modeInteractiveBtn.classList.remove('active');
        els.interactiveToolbar.style.display = 'none';
        stopTimer();
        renderWorksheet();
      });
    }

    if (els.modeInteractiveBtn) {
      els.modeInteractiveBtn.addEventListener('click', () => {
        state.mode = 'interactive';
        els.modeInteractiveBtn.classList.add('active');
        els.modePrintBtn.classList.remove('active');
        els.interactiveToolbar.style.display = 'flex';
        renderWorksheet();
      });
    }

    // Interactive Check & Reset
    if (els.btnCheckAnswers) els.btnCheckAnswers.addEventListener('click', checkAllAnswers);
    if (els.btnResetInteractive) els.btnResetInteractive.addEventListener('click', resetInteractive);
  }

  // Public Interface
  window.SophiaApp = {
    init: function () {
      initEvents();
      generateProblems();
    },
    toggleHint,
    toggleSteps,
    checkAllAnswers,
    resetInteractive
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.SophiaApp.init());
  } else {
    window.SophiaApp.init();
  }
})();
