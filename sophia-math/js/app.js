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
      pageCount: 2,
      gridCols: getSmartDefaultCols('grade5_mixed'),
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
      pageCount: 2,
      gridCols: 2,
      worksheetTitle: 'Grade 5: Fraction Mastery (Add, Sub, Mult, Div)',
      includeWorkSpace: true
    },
    g5_decimals: {
      category: 'decimals',
      pageCount: 2,
      gridCols: 2,
      worksheetTitle: 'Grade 5: Decimal Operations & Long Division',
      includeWorkSpace: true
    },
    g5_pemdas: {
      category: 'pemdas',
      pageCount: 2,
      gridCols: 2,
      worksheetTitle: 'Grade 5: Order of Operations (PEMDAS)',
      includeWorkSpace: true
    },
    g6_ratios: {
      category: 'ratios',
      pageCount: 2,
      gridCols: 2,
      worksheetTitle: 'Grade 6: Ratios, Rates & Proportions',
      includeWorkSpace: true
    },
    g6_percentages: {
      category: 'percentages',
      pageCount: 2,
      gridCols: 2,
      worksheetTitle: 'Grade 6: Percentages, Discounts & Sales Tax',
      includeWorkSpace: true
    },
    g6_equations: {
      category: 'algebra',
      pageCount: 2,
      gridCols: 2,
      worksheetTitle: 'Grade 6: One-Step & Two-Step Equations',
      includeWorkSpace: true
    },
    g6_integers: {
      category: 'integers',
      pageCount: 2,
      gridCols: 3,
      worksheetTitle: 'Grade 6: Positive & Negative Integers Sprint',
      includeWorkSpace: false
    },
    g5_6_word_problems: {
      category: 'word_problems',
      pageCount: 2,
      gridCols: 1,
      worksheetTitle: 'Grade 5/6: Multi-Step Real World Word Problems',
      includeWorkSpace: true
    },
    g5_6_geometry_area: {
      category: 'geometry_area',
      pageCount: 2,
      gridCols: 2,
      worksheetTitle: 'Grade 5/6: Geometry & Area of Polygons & Circles',
      includeWorkSpace: true
    },
    g6_composite_shapes: {
      category: 'geometry_composite',
      pageCount: 2,
      gridCols: 2,
      worksheetTitle: 'Grade 6: Composite Shapes & Shaded Area Challenges',
      includeWorkSpace: true
    },
    g5_6_assessment: {
      category: 'all_mixed',
      pageCount: 3,
      gridCols: 2,
      worksheetTitle: 'Grade 5 & 6 Comprehensive Math Assessment',
      includeWorkSpace: true
    }
  };

  // DOM Elements
  const els = {
    topicSelect: document.getElementById('topic-select'),
    pageCountSelect: document.getElementById('page-count-select'),
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

  // Smart default column count based on the kind of question - word
  // problems need room to breathe (1 column), a few topics with longer
  // prompts or multi-line work (geometry, statistics, algebra, exponents)
  // get a bit more room (2), everything else defaults dense (3). The user
  // can always override with the Layout Columns chips.
  function getSmartDefaultCols(category) {
    if (category === 'word_problems') return 1;
    const spacious = [
      'geometry',
      'geometry_area',
      'geometry_triangles',
      'geometry_quadrilaterals',
      'geometry_circles',
      'geometry_composite',
      'geometry_missing',
      'statistics',
      'algebra',
      'exponents'
    ];
    return spacious.includes(category) ? 2 : 3;
  }

  // Build `count` fresh problems for the current category.
  function makeProblems(count) {
    const cat = state.config.category;
    const problems = [];
    for (let i = 0; i < count; i++) {
      const prob = cat === 'word_problems'
        ? WordProblems.generateWordProblem()
        : MathEngine.generateProblem({ category: cat });
      prob.id = i + 1;
      problems.push(prob);
    }
    return problems;
  }

  // Generate problems set
  function generateProblems() {
    return renderWorksheet();
  }

  /*
   * How many questions fit on a page is no longer guessed.
   *
   * This used to be getMaxDensityCap(), a hard-coded table -- `cols * (ws ? 3 : 4)`
   * -- derived from a one-off manual measurement, plus getEffectiveQuestionsPerPage()
   * to spread the total across pages. Both are gone. assets/sf/paginate.js
   * lays the real cards out in the real print box and cuts pages where the
   * content says to, so a longer word problem or a taller geometry figure
   * paginates correctly without anyone re-deriving a constant.
   *
   * SEED_PER_PAGE is only a starting guess for how many questions to generate
   * before measuring. Over-supplying costs one extra measurement pass and
   * nothing else; under-supplying makes the paginator generate more and try
   * again. It is not a density cap and no page break depends on it.
   */
  const SEED_PER_PAGE = 16;

  // Create single problem card element
  function createProblemCard(p, isInteractive) {
    const card = document.createElement('div');
    card.className = 'sf-card problem-card';
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
  function renderWorksheet(opts) {
    const reuse = !!(opts && opts.reuse);
    if (!els.pagesContainer) return Promise.resolve();

    const title = state.config.worksheetTitle || 'Grade 5 & 6 Math Practice';
    const student = state.config.studentName || 'Sophia';
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const cols = parseInt(state.config.gridCols, 10) || 2;
    const pages = Math.max(1, parseInt(state.config.pageCount, 10) || 2);

    SFPaginate.beginRender();

    if (state.mode === 'interactive') {
      // Interactive Mode: a continuous scrollable list, not paper. Nothing to
      // paginate, so the paginator is not involved.
      els.pagesContainer.innerHTML = '';
      if (!reuse || !state.problems.length) {
        state.problems = makeProblems(pages * SEED_PER_PAGE);
        state.config.count = state.problems.length;
      }

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
      publishPrintState([], 0, 0);
      return Promise.resolve();
    }

    // ---- Print preview: measured pagination -------------------------------
    //
    // "Pages of Questions = N" is honoured exactly. The paginator over-supplies
    // problems, measures the real cards in the real print box, then keeps
    // exactly N full pages. The question count therefore follows from what
    // actually fits, rather than a guessed cap deciding it in advance -- which
    // is what used to leave a page overflowing or two thirds empty.
    //
    // `totalCount` is only known after pagination, so the header and footer
    // are stamped in a second pass below.

    const headerFor = (pageIdx, totalPages, totalCount) => {
      const header = document.createElement('header');
      if (pageIdx === 0) {
        header.className = 'sheet-header';
        header.innerHTML = `
            <div class="header-info">
              <h2>${title}</h2>
              <p>Grade 5 &amp; 6 Math Drill • <span data-sf-count>${totalCount}</span> Questions • Page ${pageIdx + 1} of ${totalPages}</p>
            </div>
            <div class="student-meta">
              <div class="meta-field">Name: <span class="meta-line">${student}</span></div>
              <div class="meta-field">Date: <span class="meta-line">${dateStr}</span></div>
              <div class="score-box">Score: <span class="score-blank"></span> / <span data-sf-count>${totalCount}</span></div>
            </div>
        `;
      } else {
        header.className = 'sheet-header sheet-header-compact';
        header.innerHTML = `
            <div class="header-info">
              <h2 style="font-size: 1.15rem;">${title} <span style="font-size:0.8rem; color:#6366f1; font-weight:600;">(Page ${pageIdx + 1} of ${totalPages})</span></h2>
            </div>
            <div class="student-meta-compact">
              <span>Name: <strong>${student}</strong></span>
              <span>Date: <strong>${dateStr}</strong></span>
            </div>
        `;
      }
      return header;
    };

    const footerFor = (pageIdx, totalPages) => {
      const footer = document.createElement('div');
      footer.className = 'sheet-footer';
      footer.innerHTML = `
        <span>Sophia's Math Studio</span>
        <span>Page ${pageIdx + 1} of ${totalPages}</span>
      `;
      return footer;
    };

    /*
     * `reuse` re-paginates the questions already on the page rather than
     * generating new ones. Retyping the student's name or the worksheet title
     * must not silently swap every question out from under whoever is halfway
     * through it. Those questions were chosen to fill exactly `pages` pages,
     * so packing them again with 'fill' reproduces the same pages.
     */
    const paginationMode = reuse
      ? { mode: 'fill', items: state.problems }
      : { mode: 'exactPages', pages: pages, seedPerPage: SEED_PER_PAGE, itemFactory: makeProblems };

    return SFPaginate.paginate(Object.assign({
      target: els.pagesContainer,
      sheetClass: 'sf-sheet paper-sheet worksheet-page',
      gridClass: `problems-grid cols-${cols}`,
      cacheKey: `sophia|cols=${cols}|ws=${state.config.includeWorkSpace ? 1 : 0}|cat=${state.config.category}`,
      // Question numbers must stay contiguous after the surplus is trimmed.
      renumber: items => items.forEach((p, i) => { p.id = i + 1; }),
      renderItem: p => createProblemCard(p, false),
      renderHeader: (pageIdx, totalPages) => headerFor(pageIdx, totalPages, 0),
      renderFooter: footerFor
    }, paginationMode)).then(result => {
      if (result.items) {
        state.problems = result.items;
        state.config.count = result.items.length;
      }

      // Stamp the real question total now that pagination has decided it.
      const totalCount = state.problems.length;
      els.pagesContainer.querySelectorAll('[data-sf-count]').forEach(el => {
        el.textContent = String(totalCount);
      });

      return renderAnswerKey(title, student, dateStr, result.sheets.length).then(keySheets => {
        publishPrintState(
          result.sheets.concat(keySheets),
          result.overflowRows,
          result.sheets.length
        );
      });
    });
  }

  /**
   * The answer key, paginated.
   *
   * It never used to be. Every answer went onto a single sheet regardless of
   * how many there were, so a six-page worksheet put 168 answers on one page
   * and overran the paper by 325px. `mode: 'fill'` lets the key run to
   * however many sheets it needs.
   */
  function renderAnswerKey(title, student, dateStr, worksheetPages) {
    if (!state.config.includeAnswerKey || !state.problems.length) {
      return Promise.resolve([]);
    }

    const totalCount = state.problems.length;
    const keyTarget = document.createElement('div');
    els.pagesContainer.appendChild(keyTarget);

    return SFPaginate.paginate({
      target: keyTarget,
      // keyTarget is a bare wrapper; the styles that matter come from the
      // pages container it sits inside.
      measureContext: els.pagesContainer,
      mode: 'fill',
      items: state.problems,
      sheetClass: 'sf-sheet paper-sheet answer-key-sheet',
      gridClass: 'compact-key-grid',
      cacheKey: `sophia-key|n=${totalCount}`,
      renderItem: p => {
        const item = document.createElement('div');
        item.className = 'sf-key-item key-item';
        item.innerHTML = `
          <span class="key-num">${p.id}.</span>
          <div>
            <span class="key-val">${p.answer}</span>
            ${p.steps && p.steps.length > 0 ? `<div class="key-steps-text">${p.steps[p.steps.length - 1]}</div>` : ''}
          </div>
        `;
        return item;
      },
      renderHeader: (pageIdx, totalPages) => {
        const header = document.createElement('header');
        header.className = 'key-header';
        const continued = totalPages > 1 ? ` (${pageIdx + 1} of ${totalPages})` : '';
        header.innerHTML = `
          <div>
            <h3>Answer Key &amp; Solutions Guide${continued}</h3>
            <p style="font-size: 0.8rem; color: #64748b;">${title} • Total Questions: ${totalCount}</p>
          </div>
          <div style="font-size: 0.85rem; color: #475569; font-weight: 600; text-align: right;">
            <div>Student: <strong>${student}</strong></div>
            <div>Date: <span>${dateStr}</span></div>
          </div>
        `;
        return header;
      },
      renderFooter: (pageIdx, totalPages) => {
        const footer = document.createElement('div');
        footer.className = 'sheet-footer';
        footer.innerHTML = `
          <span>Sophia's Math Studio • Answer Key</span>
          <span>Page ${worksheetPages + pageIdx + 1} of ${worksheetPages + totalPages}</span>
        `;
        return footer;
      }
    }).then(result => {
      // Only the FIRST key sheet starts a new page. A blanket break-before on
      // every answer-key sheet would insert a blank page between each one.
      if (result.sheets.length) result.sheets[0].classList.add('sf-break-before');

      // The wrapper was only a paginator target; unwrap so the sheets are
      // direct children of the pages container, as the CSS expects.
      const parent = keyTarget.parentNode;
      while (keyTarget.firstChild) parent.insertBefore(keyTarget.firstChild, keyTarget);
      parent.removeChild(keyTarget);

      return result.sheets;
    });
  }

  /**
   * Publish the shared readiness contract.
   *
   * The print test suite waits on `data-sf-print-ready` instead of a timeout,
   * and fails the build on a non-zero `overflowRows` -- so a question type
   * that cannot physically fit on a page is caught the day it is written.
   */
  function publishPrintState(sheets, overflowRows, worksheetPages) {
    SFPaginate.publish({
      sheets: sheets.length,
      worksheetPages: worksheetPages,
      requestedPages: parseInt(state.config.pageCount, 10) || 2,
      overflowRows: overflowRows || 0,
      chunkSplits: 0,
      config: {
        category: state.config.category,
        gridCols: state.config.gridCols,
        includeWorkSpace: state.config.includeWorkSpace,
        includeAnswerKey: state.config.includeAnswerKey,
        count: state.config.count
      }
    });
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

  function applyPreset(presetKey) {
    if (!presets[presetKey]) return false;
    const p = presets[presetKey];
    state.config.category = p.category;
    state.config.pageCount = p.pageCount;
    state.config.gridCols = p.gridCols;
    state.config.worksheetTitle = p.worksheetTitle;
    state.config.includeWorkSpace = p.includeWorkSpace;

    // Sync sidebar UI
    if (els.topicSelect) els.topicSelect.value = p.category;
    if (els.pageCountSelect) els.pageCountSelect.value = p.pageCount;
    const colsRadio = document.querySelector(`input[name="gridCols"][value="${p.gridCols}"]`);
    if (colsRadio) colsRadio.checked = true;
    if (els.worksheetTitleInput) els.worksheetTitleInput.value = p.worksheetTitle;
    if (els.includeWorkSpaceCheck) els.includeWorkSpaceCheck.checked = p.includeWorkSpace;
    return true;
  }

  /**
   * Layout parameters, applied after any preset or category so an explicit
   * ?cols=3 always wins over the preset's own choice.
   *
   * These exist so every layout combination has a URL. The print test matrix
   * sweeps 23 categories x 3 column counts x workspace on/off, and can only
   * reach those combinations if they are addressable.
   */
  const URL_SCHEMA = {
    cols: {
      type: 'int', min: 1, max: 3,
      apply: (c, v) => { c.gridCols = v; SFUrl.syncControl('gridCols', v); }
    },
    pages: {
      type: 'int', min: 1, max: 6,
      apply: (c, v) => { c.pageCount = v; SFUrl.syncControl('page-count-select', v); }
    },
    workspace: {
      type: 'bool',
      apply: (c, v) => { c.includeWorkSpace = v; SFUrl.syncControl('include-workspace-check', v); }
    },
    answerkey: {
      type: 'bool',
      apply: (c, v) => { c.includeAnswerKey = v; SFUrl.syncControl('include-answer-key-check', v); }
    },
    name: {
      type: 'string',
      apply: (c, v) => { c.studentName = v; SFUrl.syncControl('student-name-input', v); }
    },
    title: {
      type: 'string',
      apply: (c, v) => { c.worksheetTitle = v; SFUrl.syncControl('worksheet-title-input', v); }
    }
  };

  function parseUrlParams() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
      
      const presetParam = urlParams.get('preset') || (presets[hash] ? hash : null);
      if (presetParam && applyPreset(presetParam)) {
        SFUrl.read(URL_SCHEMA, state.config);
        return;
      }

      const categoryParam = urlParams.get('category') || urlParams.get('topic') || (hash.startsWith('topic-') ? hash.replace('topic-', '') : hash);
      if (categoryParam) {
        state.config.category = categoryParam;
        state.config.gridCols = getSmartDefaultCols(categoryParam);
        if (categoryParam.startsWith('geometry')) {
          state.config.worksheetTitle = 'Grade 5 & 6 Geometry & Area Challenge';
        }
        if (els.topicSelect) els.topicSelect.value = categoryParam;
        if (els.worksheetTitleInput) els.worksheetTitleInput.value = state.config.worksheetTitle;
        const colsRadio = document.querySelector(`input[name="gridCols"][value="${state.config.gridCols}"]`);
        if (colsRadio) colsRadio.checked = true;
      }

      // Explicit layout parameters always win over a preset's defaults.
      SFUrl.read(URL_SCHEMA, state.config);
    } catch (e) {
      console.warn('Could not parse URL params', e);
    }
  }

  // Setup Event Listeners
  function initEvents() {
    // Presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.dataset.preset;
        if (applyPreset(presetKey)) {
          generateProblems();
        }
      });
    });

    // Form inputs
    if (els.topicSelect) {
      els.topicSelect.addEventListener('change', e => {
        state.config.category = e.target.value;
        const smartCols = getSmartDefaultCols(state.config.category);
        state.config.gridCols = smartCols;
        const radio = document.querySelector(`input[name="gridCols"][value="${smartCols}"]`);
        if (radio) radio.checked = true;
        generateProblems();
      });
    }

    document.querySelectorAll('input[name="gridCols"]').forEach(radio => {
      radio.addEventListener('change', e => {
        state.config.gridCols = parseInt(e.target.value, 10);
        generateProblems();
      });
    });

    if (els.pageCountSelect) {
      els.pageCountSelect.addEventListener('change', e => {
        state.config.pageCount = parseInt(e.target.value, 10) || 2;
        generateProblems();
      });
    }

    if (els.studentNameInput) {
      els.studentNameInput.addEventListener('input', e => {
        state.config.studentName = e.target.value;
        renderWorksheet({ reuse: true });
      });
    }

    if (els.worksheetTitleInput) {
      els.worksheetTitleInput.addEventListener('input', e => {
        state.config.worksheetTitle = e.target.value;
        renderWorksheet({ reuse: true });
      });
    }

    if (els.includeAnswerKeyCheck) {
      els.includeAnswerKeyCheck.addEventListener('change', e => {
        state.config.includeAnswerKey = e.target.checked;
        renderWorksheet({ reuse: true });
      });
    }

    if (els.includeWorkSpaceCheck) {
      els.includeWorkSpaceCheck.addEventListener('change', e => {
        state.config.includeWorkSpace = e.target.checked;
        // Not a reuse render: workspace boxes change how tall a card is, so
        // the number of questions has to be re-derived to still fill exactly
        // the requested number of pages.
        generateProblems();
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
        renderWorksheet({ reuse: true });
      });
    }

    if (els.modeInteractiveBtn) {
      els.modeInteractiveBtn.addEventListener('click', () => {
        state.mode = 'interactive';
        els.modeInteractiveBtn.classList.add('active');
        els.modePrintBtn.classList.remove('active');
        els.interactiveToolbar.style.display = 'flex';
        renderWorksheet({ reuse: true });
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
      parseUrlParams();
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
