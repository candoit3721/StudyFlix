/**
 * Olivia's Math Studio - Main Application Logic
 */

(function () {
  // Application State
  const state = {
    currentConfig: {
      type: 'multiplication',
      digitRange: '2digit',
      regrouping: 'any',
      borrowing: 'any',
      tableRange: '0-10',
      customTables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxDivisor: 10,
      missingOperand: false,
      count: 20,
      layoutFormat: 'vertical', // 'vertical' or 'horizontal'
      gridCols: 3,
      pageCount: 2,
      studentName: 'Olivia',
      worksheetTitle: 'Grade 3 Math Practice',
      includeAnswerKey: true
    },
    problems: [],
    mode: 'print-preview', // 'print-preview' or 'interactive'
    showAnswers: false,
    timerInterval: null,
    timerSeconds: 0
  };

  // DOM Elements
  const els = {
    opType: document.getElementById('operation-type'),
    fieldDigitRange: document.getElementById('field-digit-range'),
    fieldRegrouping: document.getElementById('field-regrouping'),
    fieldBorrowing: document.getElementById('field-borrowing'),
    fieldMultRange: document.getElementById('field-multiplication-range'),
    fieldCustomTables: document.getElementById('field-custom-tables'),
    fieldDivRange: document.getElementById('field-division-range'),
    fieldMissingOp: document.getElementById('field-missing-operand'),
    fieldLayoutFormat: document.getElementById('field-layout-format'),
    fieldColumns: document.getElementById('field-columns'),
    multRangeSelect: document.getElementById('mult-range-select'),
    divRangeSelect: document.getElementById('div-range-select'),
    missingOpCheckbox: document.getElementById('missing-operand-checkbox'),
    pageCountSelect: document.getElementById('page-count-select'),
    studentName: document.getElementById('student-name'),
    worksheetTitle: document.getElementById('worksheet-title'),
    includeAnswerKey: document.getElementById('include-answer-key'),

    // Buttons
    btnGenerate: document.getElementById('btn-generate'),
    btnPrintSidebar: document.getElementById('btn-print-sidebar'),
    btnPrintTop: document.getElementById('btn-print-top'),
    btnToggleAnswers: document.getElementById('btn-toggle-answers'),
    modePrintPreview: document.getElementById('mode-print-preview'),
    modeInteractive: document.getElementById('mode-interactive'),
    btnCheckAnswers: document.getElementById('btn-check-answers'),
    btnResetInteractive: document.getElementById('btn-reset-interactive'),

    // Render Targets
    pagesContainer: document.getElementById('pages-container'),

    // Interactive
    interactiveToolbar: document.getElementById('interactive-toolbar'),
    interactiveScoreDisplay: document.getElementById('interactive-score-display'),
    interactiveTimer: document.getElementById('interactive-timer'),
    confettiCanvas: document.getElementById('confetti-canvas')
  };

  // Presets Dictionary
  const presets = {
    mult_core: {
      type: 'multiplication',
      tableRange: '0-10',
      pageCount: 2,
      layoutFormat: 'vertical',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: 'Multiplication Facts (0–10)'
    },
    add_3digit: {
      type: 'addition',
      digitRange: '3digit',
      regrouping: 'force',
      pageCount: 2,
      layoutFormat: 'vertical',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: '3-Digit Addition with Regrouping'
    },
    sub_3digit: {
      type: 'subtraction',
      digitRange: '3digit',
      borrowing: 'force',
      pageCount: 2,
      layoutFormat: 'vertical',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: '3-Digit Subtraction with Borrowing'
    },
    all_mixed: {
      type: 'all_mixed',
      pageCount: 1,
      layoutFormat: 'horizontal',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: 'Mixed 4 Operations Sprint'
    },
    missing_ops: {
      type: 'add_sub_mixed',
      digitRange: '2digit',
      missingOperand: true,
      pageCount: 1,
      layoutFormat: 'horizontal',
      gridCols: 2,
      worksheetTitle: 'Missing Numbers & Fact Families'
    },
    word_problems: {
      type: 'word_problems',
      pageCount: 1,
      gridCols: 2,
      missingOperand: false,
      worksheetTitle: 'Grade 3 Math Word Problems'
    }
  };

  /**
   * Update visibility of form fields based on selected operation
   */
  function syncFormFields() {
    const type = els.opType.value;

    // Reset default visibilities
    els.fieldDigitRange.style.display = 'none';
    els.fieldRegrouping.style.display = 'none';
    els.fieldBorrowing.style.display = 'none';
    els.fieldMultRange.style.display = 'none';
    els.fieldCustomTables.style.display = 'none';
    els.fieldDivRange.style.display = 'none';
    els.fieldMissingOp.style.display = 'block';
    els.fieldLayoutFormat.style.display = 'block';
    els.fieldColumns.style.display = 'block';

    if (type === 'addition') {
      els.fieldDigitRange.style.display = 'block';
      els.fieldRegrouping.style.display = 'block';
    } else if (type === 'subtraction') {
      els.fieldDigitRange.style.display = 'block';
      els.fieldBorrowing.style.display = 'block';
    } else if (type === 'add_sub_mixed') {
      els.fieldDigitRange.style.display = 'block';
    } else if (type === 'multiplication') {
      els.fieldMultRange.style.display = 'block';
      if (els.multRangeSelect.value === 'custom') {
        els.fieldCustomTables.style.display = 'block';
      }
    } else if (type === 'division') {
      els.fieldDivRange.style.display = 'block';
    } else if (type === 'mult_div_mixed') {
      els.fieldMultRange.style.display = 'block';
    } else if (type === 'comparison') {
      els.fieldLayoutFormat.style.display = 'none';
      els.fieldMissingOp.style.display = 'none';
    } else if (type === 'word_problems') {
      els.fieldDigitRange.style.display = 'none';
      els.fieldMissingOp.style.display = 'none';
      els.fieldLayoutFormat.style.display = 'none';
      els.fieldColumns.style.display = 'none';
    }
  }

  /**
   * Read full configuration from UI
   */
  function readConfigFromUI() {
    const type = els.opType.value;
    const digitRange = document.querySelector('input[name="digitRange"]:checked')?.value || '2digit';
    const regrouping = document.querySelector('input[name="regrouping"]:checked')?.value || 'any';
    const borrowing = document.querySelector('input[name="borrowing"]:checked')?.value || 'any';
    const tableRange = els.multRangeSelect.value;
    const maxDivisor = parseInt(els.divRangeSelect.value, 10) || 10;
    const missingOperand = els.missingOpCheckbox.checked;
    const pageCount = parseInt(els.pageCountSelect.value, 10) || 2;
    const layoutFormat = document.querySelector('input[name="layoutFormat"]:checked')?.value || 'vertical';
    const gridCols = parseInt(document.querySelector('input[name="gridCols"]:checked')?.value, 10) || 3;
    const studentName = els.studentName.value.trim() || 'Olivia';
    const worksheetTitle = els.worksheetTitle.value.trim() || 'Grade 3 Math Practice';
    const includeAnswerKey = els.includeAnswerKey.checked;

    // Custom tables
    const customTables = Array.from(document.querySelectorAll('input[name="customTable"]:checked')).map(cb => parseInt(cb.value, 10));

    state.currentConfig = {
      type,
      digitRange,
      regrouping,
      borrowing,
      tableRange,
      customTables,
      maxDivisor,
      missingOperand,
      count: state.currentConfig.count,
      pageCount,
      layoutFormat,
      gridCols,
      studentName,
      worksheetTitle,
      includeAnswerKey
    };
  }

  /**
   * Apply a preset configuration to UI controls
   */
  function applyPreset(presetKey) {
    const p = presets[presetKey];
    if (!p) return;

    if (p.type) els.opType.value = p.type;
    if (p.digitRange) {
      const radio = document.querySelector(`input[name="digitRange"][value="${p.digitRange}"]`);
      if (radio) radio.checked = true;
    }
    if (p.regrouping) {
      const radio = document.querySelector(`input[name="regrouping"][value="${p.regrouping}"]`);
      if (radio) radio.checked = true;
    }
    if (p.borrowing) {
      const radio = document.querySelector(`input[name="borrowing"][value="${p.borrowing}"]`);
      if (radio) radio.checked = true;
    }
    if (p.tableRange) els.multRangeSelect.value = p.tableRange;
    if (p.missingOperand !== undefined) els.missingOpCheckbox.checked = p.missingOperand;
    if (p.pageCount) els.pageCountSelect.value = p.pageCount;
    if (p.layoutFormat) {
      const radio = document.querySelector(`input[name="layoutFormat"][value="${p.layoutFormat}"]`);
      if (radio) radio.checked = true;
    }
    if (p.gridCols) {
      const radio = document.querySelector(`input[name="gridCols"][value="${p.gridCols}"]`);
      if (radio) radio.checked = true;
    }
    if (p.worksheetTitle) els.worksheetTitle.value = p.worksheetTitle;

    syncFormFields();
    generateAndRender();
  }

  /**
   * Generate Problem Set and Render to DOM
   */
  function buildSubtitle(config) {
    if (config.type === 'addition') return `Addition Drill (${config.digitRange === '3digit' ? '3-Digit' : '2-Digit'})`;
    if (config.type === 'subtraction') return `Subtraction Drill (${config.digitRange === '3digit' ? '3-Digit' : '2-Digit'})`;
    if (config.type === 'add_sub_mixed') return 'Addition & Subtraction Mixed';
    if (config.type === 'multiplication') return `Multiplication Facts (${config.tableRange})`;
    if (config.type === 'division') return `Division Facts (÷ up to ${config.maxDivisor})`;
    if (config.type === 'mult_div_mixed') return 'Multiplication & Division Mixed';
    if (config.type === 'all_mixed') return 'Mixed 4 Operations Review';
    if (config.type === 'comparison') return 'Compare Expressions (<, >, =)';
    if (config.type === 'word_problems') return 'Grade 3 Story Problems';
    return '';
  }

  function getMaxDensityCap(config) {
    if (config.type === 'word_problems') return 4;
    const cols = config.gridCols || 3;

    // Comparison problems are their own card shape: they always render a
    // .comparison-box, ignoring the vertical/horizontal switch (which is why
    // syncFormFields hides that control for them). They also get TALLER as the
    // columns narrow, because the two expressions wrap - measured against the
    // same printable box as below: 82px at 2 cols, 94px at 3, 118px at 4,
    // leaving room for 8, 7 and 6 rows. Without this branch a 4-column sheet
    // was packed to 7 rows and spilled onto an extra physical page.
    if (config.type === 'comparison') {
      const rows = cols >= 4 ? 6 : (cols === 3 ? 7 : 8);
      return cols * rows;
    }

    // Measured directly off the rendered DOM (with the on-screen 11in
    // stretch neutralized, since a flexed grid otherwise inflates card
    // height when a page has few rows) against the real printed content
    // box - 11in page minus the 0.4in @page margin and the sheet's own
    // 0.3in padding, minus header+footer, leaves ~814px: a vertical
    // arithmetic card row measures ~192px (4 rows fit), a single-line
    // horizontal-equation row ~102px (7 rows fit). This is the "fit"
    // Smart Layout packs every page to, exactly, with no manual override.
    return config.layoutFormat === 'horizontal' ? cols * 7 : cols * 4;
  }

  /**
   * Smart Layout: the user picks how many PAGES of questions they want
   * (for double-sided printing + one answer sheet); the question count is
   * derived so every page comes out completely full - pageCount * cap -
   * rather than the user picking a count and hoping it divides evenly.
   */
  function getEffectiveQuestionsPerPage(config, total) {
    const cap = getMaxDensityCap(config);
    if (!total) return cap;
    const pageCount = Math.max(1, Math.ceil(total / cap));
    return Math.ceil(total / pageCount);
  }

  /**
   * Generate Problem Set and Render to DOM
   */
  function generateAndRender() {
    readConfigFromUI();
    const config = state.currentConfig;
    const cap = getMaxDensityCap(config);
    config.count = Math.max(cap, (config.pageCount || 2) * cap);

    if (config.type === 'word_problems') {
      state.problems = WordProblems.generateWordProblemsList(config.count);
    } else {
      state.problems = MathEngine.generateWorksheet(config);
    }

    renderWorksheet();
    if (state.mode !== 'interactive') renderAnswerKey();

    if (state.mode === 'interactive') {
      resetInteractiveState();
    }
  }

  function buildPageHeader(config, subtitle, pageNum, totalPages) {
    const header = document.createElement('div');
    if (pageNum === 1) {
      header.className = 'ws-header';
      header.innerHTML = `
        <div class="ws-title-row">
          <h2 class="ws-title">${config.worksheetTitle}</h2>
          <span class="ws-subtitle">${subtitle}${totalPages > 1 ? ` • Page ${pageNum} of ${totalPages}` : ''}</span>
        </div>
        <div class="ws-meta-row">
          <div class="meta-field"><span>Name:</span><span class="meta-line" style="padding-left: 6px;">${config.studentName}</span></div>
          <div class="meta-field"><span>Date:</span><span class="meta-line"></span></div>
          <div class="meta-field"><span>Score:</span><span class="meta-line" style="min-width: 80px;"></span></div>
          <div class="meta-field"><span>Time:</span><span class="meta-line" style="min-width: 80px;"></span></div>
        </div>
      `;
    } else {
      header.className = 'ws-header ws-header-compact';
      header.innerHTML = `
        <div class="ws-title-row">
          <h2 class="ws-title" style="font-size: 1.15rem;">${config.worksheetTitle} <span style="font-size:0.78rem; color:#4f46e5; font-weight:600;">(Page ${pageNum} of ${totalPages})</span></h2>
        </div>
        <div class="ws-meta-row" style="font-size: 0.82rem;">
          <span>Name: <strong>${config.studentName}</strong></span>
        </div>
      `;
    }
    return header;
  }

  function buildPageFooter() {
    const footer = document.createElement('div');
    footer.className = 'ws-footer';
    footer.innerHTML = `
      <span>Olivia's Math Studio • Grade 3 Curricula</span>
      <span class="ws-footer-quote">⭐ Great job! Keep up the fantastic effort! ⭐</span>
    `;
    return footer;
  }

  function buildProblemCard(p, idx, isAnswerKey) {
    const config = state.currentConfig;
    if (p.type === 'word_problem') return renderWordProblemCard(p, idx, isAnswerKey);
    if (p.type === 'comparison') return renderComparisonCard(p, idx, isAnswerKey);
    if (config.layoutFormat === 'vertical' && !p.missingPos) return renderVerticalCard(p, idx, isAnswerKey);
    return renderHorizontalCard(p, idx, isAnswerKey);
  }

  /**
   * Render the worksheet as one or more physical pages, splitting the
   * question set intelligently (see getEffectiveQuestionsPerPage) instead
   * of dumping everything into a single ever-growing container.
   */
  function renderWorksheet() {
    const config = state.currentConfig;
    const isWordProblem = config.type === 'word_problems';
    const total = state.problems.length;
    const subtitle = buildSubtitle(config);
    const gridClass = `problems-container grid-cols-${isWordProblem ? '1' : config.gridCols}`;

    els.pagesContainer.innerHTML = '';

    if (state.mode === 'interactive') {
      // Not a simulated paper page: a plain practice sheet that sizes to
      // its real content instead of a fixed 11in page box.
      const page = document.createElement('div');
      page.className = 'practice-container';
      page.appendChild(buildPageHeader(config, subtitle, 1, 1));
      const grid = document.createElement('div');
      grid.className = gridClass;
      state.problems.forEach((p, idx) => grid.appendChild(buildProblemCard(p, idx, false)));
      page.appendChild(grid);
      page.appendChild(buildPageFooter());
      els.pagesContainer.appendChild(page);
      return;
    }

    const perPage = getEffectiveQuestionsPerPage(config, total);
    const chunks = [];
    for (let i = 0; i < total; i += perPage) chunks.push(state.problems.slice(i, i + perPage));
    const totalPages = chunks.length || 1;

    let globalIdx = 0;
    chunks.forEach((chunk, chunkIdx) => {
      const page = document.createElement('div');
      page.className = 'worksheet-page';
      page.appendChild(buildPageHeader(config, subtitle, chunkIdx + 1, totalPages));
      const grid = document.createElement('div');
      grid.className = gridClass;
      chunk.forEach((p) => {
        grid.appendChild(buildProblemCard(p, globalIdx, false));
        globalIdx++;
      });
      page.appendChild(grid);
      page.appendChild(buildPageFooter());
      els.pagesContainer.appendChild(page);
    });
  }

  /**
   * Render Simplified, Paper-Saving Answer Key (Strictly Question ID and Answer)
   */
  function renderAnswerKey() {
    const config = state.currentConfig;
    if (!config.includeAnswerKey || !state.problems.length) return;

    const isWordProblem = config.type === 'word_problems';
    let cols = 5;
    if (isWordProblem) {
      cols = 2;
    } else if (config.count <= 10) {
      cols = 2;
    } else if (config.count <= 20) {
      cols = 4;
    } else {
      cols = 5;
    }

    const page = document.createElement('div');
    page.className = 'worksheet-page answer-key-page';
    page.innerHTML = `
      <div class="ws-header" style="margin-bottom: 12px; padding-bottom: 8px;">
        <div class="ws-title-row" style="margin-bottom: 6px;">
          <h2 class="ws-title" style="font-size: 1.3rem;">Answer Key</h2>
          <span class="answer-key-badge">PARENT / TEACHER QUICK KEY (PAPER SAVER)</span>
        </div>
        <div class="ws-meta-row" style="font-size: 0.85rem;">
          <div class="meta-field"><span>Student:</span><span style="font-weight: 700; color: #1e293b;">${config.studentName}</span></div>
          <div class="meta-field"><span>Subject:</span><span style="font-weight: 700; color: #1e293b;">${config.worksheetTitle}</span></div>
          <div class="meta-field"><span>Total Questions:</span><span style="font-weight: 700; color: #1e293b;">${config.count}</span></div>
        </div>
      </div>
    `;

    const grid = document.createElement('div');
    grid.className = `compact-answers-container grid-cols-${cols}`;

    state.problems.forEach((p) => {
      const item = document.createElement('div');
      item.className = 'compact-answer-item';

      const idSpan = document.createElement('span');
      idSpan.className = 'compact-q-id';
      idSpan.textContent = `${p.index}.`;
      item.appendChild(idSpan);

      const ansSpan = document.createElement('span');
      ansSpan.className = 'compact-q-ans';

      if (p.type === 'word_problem') {
        ansSpan.innerHTML = `<span class="answer-highlight">${p.answer} ${p.unit || ''}</span>`;
      } else if (p.type === 'comparison') {
        ansSpan.innerHTML = `<span class="answer-highlight" style="font-size: 1.15rem; font-weight: 900;">${p.answer}</span>`;
      } else if (p.missingPos) {
        ansSpan.innerHTML = `<span class="answer-highlight">${p.expectedAnswer}</span>`;
      } else {
        ansSpan.innerHTML = `<span class="answer-highlight">${p.answer}</span>`;
      }
      item.appendChild(ansSpan);

      grid.appendChild(item);
    });
    page.appendChild(grid);

    const footer = document.createElement('div');
    footer.className = 'ws-footer';
    footer.style.marginTop = '14px';
    footer.style.paddingTop = '6px';
    footer.innerHTML = `
      <span>Olivia's Math Studio • Quick Answer Key</span>
      <span>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
    `;
    page.appendChild(footer);

    els.pagesContainer.appendChild(page);
  }

  /**
   * Render Vertical Arithmetic Card (Stacked Column)
   */
  function renderVerticalCard(p, idx, isAnswerKey) {
    const card = document.createElement('div');
    card.className = 'problem-card';

    const numSpan = document.createElement('span');
    numSpan.className = 'problem-number';
    numSpan.textContent = `${p.index}.`;
    card.appendChild(numSpan);

    const vBox = document.createElement('div');
    vBox.className = 'vertical-math-box';

    // Regrouping box on top (if addition/subtraction and not answer key)
    if (!isAnswerKey && (p.type === 'addition' || p.type === 'subtraction')) {
      const carryRow = document.createElement('div');
      carryRow.className = 'carry-box-row';
      carryRow.innerHTML = `<div class="carry-box"></div>`;
      vBox.appendChild(carryRow);
    }

    // Top number
    const row1 = document.createElement('div');
    row1.className = 'math-row';
    row1.innerHTML = `<span></span><span class="math-num">${p.num1}</span>`;
    vBox.appendChild(row1);

    // Operator + Bottom number
    const row2 = document.createElement('div');
    row2.className = 'math-row';
    row2.innerHTML = `<span class="math-op">${p.operator}</span><span class="math-num">${p.num2}</span>`;
    vBox.appendChild(row2);

    // Divider Line
    const line = document.createElement('div');
    line.className = 'math-line';
    vBox.appendChild(line);

    // Answer Line / Input
    const ansSpace = document.createElement('div');
    ansSpace.className = 'math-answer-space';

    if (isAnswerKey || state.showAnswers) {
      ansSpace.innerHTML = `<span class="answer-highlight">${p.answer}</span>`;
    } else if (state.mode === 'interactive') {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'interactive-input';
      input.dataset.index = idx;
      input.dataset.expected = p.expectedAnswer;
      input.addEventListener('keydown', handleInputKeydown);
      ansSpace.appendChild(input);
    }

    vBox.appendChild(ansSpace);
    card.appendChild(vBox);
    return card;
  }

  /**
   * Render Horizontal Equation Card
   */
  function renderHorizontalCard(p, idx, isAnswerKey) {
    const card = document.createElement('div');
    card.className = 'problem-card';

    const numSpan = document.createElement('span');
    numSpan.className = 'problem-number';
    numSpan.textContent = `${p.index}.`;
    card.appendChild(numSpan);

    const hBox = document.createElement('div');
    hBox.className = 'horizontal-math-box';

    let content = '';
    if (p.missingPos === 'left') {
      if (isAnswerKey || state.showAnswers) {
        content = `<span class="answer-highlight">${p.expectedAnswer}</span> ${p.operator} ${p.num2} = ${p.answer}`;
      } else if (state.mode === 'interactive') {
        content = `<input type="text" class="interactive-input" data-index="${idx}" data-expected="${p.expectedAnswer}"> ${p.operator} ${p.num2} = ${p.answer}`;
      } else {
        content = `<span class="blank-box"></span> ${p.operator} ${p.num2} = ${p.answer}`;
      }
    } else if (p.missingPos === 'right' || p.missingPos === 'divisor') {
      if (isAnswerKey || state.showAnswers) {
        content = `${p.num1} ${p.operator} <span class="answer-highlight">${p.expectedAnswer}</span> = ${p.answer || p.quotient}`;
      } else if (state.mode === 'interactive') {
        content = `${p.num1} ${p.operator} <input type="text" class="interactive-input" data-index="${idx}" data-expected="${p.expectedAnswer}"> = ${p.answer || p.quotient}`;
      } else {
        content = `${p.num1} ${p.operator} <span class="blank-box"></span> = ${p.answer || p.quotient}`;
      }
    } else if (p.missingPos === 'dividend') {
      if (isAnswerKey || state.showAnswers) {
        content = `<span class="answer-highlight">${p.expectedAnswer}</span> ÷ ${p.num2} = ${p.expectedAnswer / p.num2}`;
      } else if (state.mode === 'interactive') {
        content = `<input type="text" class="interactive-input" data-index="${idx}" data-expected="${p.expectedAnswer}"> ÷ ${p.num2} = ${p.expectedAnswer / p.num2}`;
      } else {
        content = `<span class="blank-box"></span> ÷ ${p.num2} = ${p.expectedAnswer / p.num2}`;
      }
    } else {
      // Standard equation A op B = ___
      if (isAnswerKey || state.showAnswers) {
        content = `${p.num1} ${p.operator} ${p.num2} = <span class="answer-highlight">${p.answer}</span>`;
      } else if (state.mode === 'interactive') {
        content = `${p.num1} ${p.operator} ${p.num2} = <input type="text" class="interactive-input" data-index="${idx}" data-expected="${p.expectedAnswer}">`;
      } else {
        content = `${p.num1} ${p.operator} ${p.num2} = <span class="blank-box"></span>`;
      }
    }

    hBox.innerHTML = content;
    card.appendChild(hBox);

    // Attach listener if interactive
    if (state.mode === 'interactive' && !isAnswerKey) {
      const input = card.querySelector('.interactive-input');
      if (input) input.addEventListener('keydown', handleInputKeydown);
    }

    return card;
  }

  /**
   * Render Comparison Card (<, >, =)
   */
  function renderComparisonCard(p, idx, isAnswerKey) {
    const card = document.createElement('div');
    card.className = 'problem-card';

    const numSpan = document.createElement('span');
    numSpan.className = 'problem-number';
    numSpan.textContent = `${p.index}.`;
    card.appendChild(numSpan);

    const cBox = document.createElement('div');
    cBox.className = 'comparison-box';

    if (isAnswerKey || state.showAnswers) {
      cBox.innerHTML = `<span>${p.leftText}</span> <div class="circle-target"><span class="answer-highlight">${p.answer}</span></div> <span>${p.rightText}</span>`;
    } else if (state.mode === 'interactive') {
      cBox.innerHTML = `<span>${p.leftText}</span> <input type="text" maxlength="1" class="interactive-input" style="width: 44px; border-radius: 50%;" data-index="${idx}" data-expected="${p.expectedAnswer}"> <span>${p.rightText}</span>`;
      const input = cBox.querySelector('.interactive-input');
      if (input) input.addEventListener('keydown', handleInputKeydown);
    } else {
      cBox.innerHTML = `<span>${p.leftText}</span> <div class="circle-target"></div> <span>${p.rightText}</span>`;
    }

    card.appendChild(cBox);
    return card;
  }

  /**
   * Render Word Problem Card
   */
  function renderWordProblemCard(p, idx, isAnswerKey) {
    const card = document.createElement('div');
    card.className = 'word-problem-card';

    const text = document.createElement('div');
    text.className = 'wp-text';
    text.innerHTML = `<strong>${p.index}.</strong> ${p.question}`;
    card.appendChild(text);

    if (isAnswerKey || state.showAnswers) {
      const sol = document.createElement('div');
      sol.style.padding = '8px 12px';
      sol.style.background = '#fef3c7';
      sol.style.borderRadius = '4px';
      sol.style.fontSize = '0.95rem';
      sol.innerHTML = `<strong>Work / Equation:</strong> ${p.equation} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Answer:</strong> <span class="answer-highlight">${p.answer} ${p.unit || ''}</span>`;
      card.appendChild(sol);
    } else {
      const workSpace = document.createElement('div');
      workSpace.className = 'wp-work-space';
      workSpace.innerHTML = `<span style="font-size: 0.75rem; color: #94a3b8; margin-right: auto;">Show your work here:</span>`;
      card.appendChild(workSpace);

      const ansLine = document.createElement('div');
      ansLine.className = 'wp-answer-line';
      if (state.mode === 'interactive') {
        ansLine.innerHTML = `<span>Answer:</span> <input type="text" class="interactive-input" style="width: 100px;" data-index="${idx}" data-expected="${p.expectedAnswer}"> <span>${p.unit || ''}</span>`;
        const input = ansLine.querySelector('.interactive-input');
        if (input) input.addEventListener('keydown', handleInputKeydown);
      } else {
        ansLine.innerHTML = `<span>Answer:</span> <span class="meta-line" style="min-width: 120px;"></span> <span>${p.unit || ''}</span>`;
      }
      card.appendChild(ansLine);
    }

    return card;
  }

  /**
   * Handle Enter key to jump to next input in Interactive mode
   */
  function handleInputKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentIdx = parseInt(e.target.dataset.index, 10);
      const nextInput = document.querySelector(`.interactive-input[data-index="${currentIdx + 1}"]`);
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        checkInteractiveAnswers();
      }
    }
  }

  /**
   * Interactive Mode Switching
   */
  function setMode(newMode) {
    state.mode = newMode;
    if (newMode === 'interactive') {
      els.modeInteractive.classList.add('active');
      els.modePrintPreview.classList.remove('active');
      els.interactiveToolbar.style.display = 'flex';
      els.interactiveTimer.style.display = 'block';
      startTimer();
    } else {
      els.modePrintPreview.classList.add('active');
      els.modeInteractive.classList.remove('active');
      els.interactiveToolbar.style.display = 'none';
      els.interactiveTimer.style.display = 'none';
      stopTimer();
    }
    renderWorksheet();
    if (newMode !== 'interactive') renderAnswerKey();
  }

  /**
   * Timer Functions
   */
  function startTimer() {
    stopTimer();
    state.timerSeconds = 0;
    updateTimerDisplay();
    state.timerInterval = setInterval(() => {
      state.timerSeconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const mins = Math.floor(state.timerSeconds / 60).toString().padStart(2, '0');
    const secs = (state.timerSeconds % 60).toString().padStart(2, '0');
    els.interactiveTimer.textContent = `⏱️ ${mins}:${secs}`;
  }

  /**
   * Reset interactive inputs
   */
  function resetInteractiveState() {
    document.querySelectorAll('.interactive-input').forEach(inp => {
      inp.value = '';
      inp.classList.remove('correct', 'incorrect');
    });
    els.interactiveScoreDisplay.textContent = 'Enter answers above and click Check!';
    startTimer();
  }

  /**
   * Check Interactive Answers
   */
  function checkInteractiveAnswers() {
    stopTimer();
    const inputs = document.querySelectorAll('#pages-container .interactive-input');
    let correctCount = 0;
    let totalCount = inputs.length;

    inputs.forEach(inp => {
      const val = inp.value.trim().toLowerCase().replace(/\s+/g, '');
      const expected = (inp.dataset.expected || '').trim().toLowerCase().replace(/\s+/g, '');

      // Normalize match (handles $ signs or spaces)
      const cleanVal = val.replace('$', '');
      const cleanExpected = expected.replace('$', '');

      if (cleanVal === cleanExpected && cleanVal !== '') {
        inp.classList.add('correct');
        inp.classList.remove('incorrect');
        correctCount++;
      } else {
        inp.classList.add('incorrect');
        inp.classList.remove('correct');
      }
    });

    const percent = Math.round((correctCount / totalCount) * 100);
    const mins = Math.floor(state.timerSeconds / 60);
    const secs = state.timerSeconds % 60;
    const timeStr = `${mins > 0 ? mins + 'm ' : ''}${secs}s`;

    els.interactiveScoreDisplay.innerHTML = `Score: <strong>${correctCount} / ${totalCount}</strong> (${percent}%) in ${timeStr} ${percent === 100 ? '🎉 Perfect!' : '💪 Keep going!'}`;

    if (percent === 100) {
      triggerConfetti();
    }
  }

  /**
   * Confetti Celebration Animation
   */
  function triggerConfetti() {
    const canvas = els.confettiCanvas;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        gravity: 0.3,
        opacity: 1
      });
    }

    let animId;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.opacity -= 0.012;
        if (p.opacity > 0) {
          alive = true;
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(renderConfetti);
      } else {
        canvas.style.display = 'none';
        cancelAnimationFrame(animId);
      }
    }
    renderConfetti();
  }

  /**
   * Initialize Event Listeners
   */
  function initEvents() {
    // Operation Select Change
    els.opType.addEventListener('change', () => {
      syncFormFields();
      generateAndRender();
    });

    els.multRangeSelect.addEventListener('change', () => {
      syncFormFields();
      generateAndRender();
    });

    // Option radios & checkboxes
    document.querySelectorAll('.sidebar input[type="radio"], .sidebar input[type="checkbox"]').forEach(el => {
      el.addEventListener('change', () => {
        syncFormFields();
        generateAndRender();
      });
    });

    els.divRangeSelect.addEventListener('change', generateAndRender);
    els.pageCountSelect.addEventListener('change', generateAndRender);
    els.studentName.addEventListener('input', () => {
      readConfigFromUI();
      renderWorksheet();
      if (state.mode !== 'interactive') renderAnswerKey();
    });
    els.worksheetTitle.addEventListener('input', () => {
      readConfigFromUI();
      renderWorksheet();
      if (state.mode !== 'interactive') renderAnswerKey();
    });

    // Preset Buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyPreset(btn.dataset.preset);
      });
    });

    // Generate & Print Buttons
    els.btnGenerate.addEventListener('click', generateAndRender);
    els.btnPrintSidebar.addEventListener('click', () => window.print());
    els.btnPrintTop.addEventListener('click', () => window.print());

    // Answer toggle
    els.btnToggleAnswers.addEventListener('click', () => {
      state.showAnswers = !state.showAnswers;
      els.btnToggleAnswers.textContent = state.showAnswers ? '🙈 Hide Answers' : '👁️ Show Answers';
      renderWorksheet();
      if (state.mode !== 'interactive') renderAnswerKey();
    });

    // Mode Buttons
    els.modePrintPreview.addEventListener('click', () => setMode('print-preview'));
    els.modeInteractive.addEventListener('click', () => setMode('interactive'));

    // Interactive Actions
    els.btnCheckAnswers.addEventListener('click', checkInteractiveAnswers);
    els.btnResetInteractive.addEventListener('click', resetInteractiveState);
  }

  // Initialization
  syncFormFields();
  initEvents();
  generateAndRender();
})();
