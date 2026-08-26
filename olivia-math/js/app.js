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
    questionCount: document.getElementById('question-count'),
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
    problemsContainer: document.getElementById('problems-container'),
    answersContainer: document.getElementById('answers-container'),
    worksheetPage: document.getElementById('worksheet-page'),
    answerKeyPage: document.getElementById('answer-key-page'),
    renderedWsTitle: document.getElementById('rendered-ws-title'),
    renderedWsSubtitle: document.getElementById('rendered-ws-subtitle'),
    renderedStudentName: document.getElementById('rendered-student-name'),
    renderedKeyStudent: document.getElementById('rendered-key-student'),
    renderedKeyTitle: document.getElementById('rendered-key-title'),
    renderedKeyCount: document.getElementById('rendered-key-count'),
    keyDateStamp: document.getElementById('key-date-stamp'),

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
      count: 20,
      layoutFormat: 'vertical',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: 'Multiplication Facts (0–10)'
    },
    add_3digit: {
      type: 'addition',
      digitRange: '3digit',
      regrouping: 'force',
      count: 20,
      layoutFormat: 'vertical',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: '3-Digit Addition with Regrouping'
    },
    sub_3digit: {
      type: 'subtraction',
      digitRange: '3digit',
      borrowing: 'force',
      count: 20,
      layoutFormat: 'vertical',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: '3-Digit Subtraction with Borrowing'
    },
    all_mixed: {
      type: 'all_mixed',
      count: 25,
      layoutFormat: 'horizontal',
      gridCols: 3,
      missingOperand: false,
      worksheetTitle: 'Mixed 4 Operations Sprint'
    },
    missing_ops: {
      type: 'add_sub_mixed',
      digitRange: '2digit',
      missingOperand: true,
      count: 20,
      layoutFormat: 'horizontal',
      gridCols: 2,
      worksheetTitle: 'Missing Numbers & Fact Families'
    },
    word_problems: {
      type: 'word_problems',
      count: 5,
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
    const count = parseInt(els.questionCount.value, 10) || 20;
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
      count,
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
    if (p.count) els.questionCount.value = p.count;
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
  function generateAndRender() {
    readConfigFromUI();
    const config = state.currentConfig;

    // Subtitle helper text
    let subtitle = '';
    if (config.type === 'addition') subtitle = `Addition Drill (${config.digitRange === '3digit' ? '3-Digit' : '2-Digit'})`;
    else if (config.type === 'subtraction') subtitle = `Subtraction Drill (${config.digitRange === '3digit' ? '3-Digit' : '2-Digit'})`;
    else if (config.type === 'add_sub_mixed') subtitle = 'Addition & Subtraction Mixed';
    else if (config.type === 'multiplication') subtitle = `Multiplication Facts (${config.tableRange})`;
    else if (config.type === 'division') subtitle = `Division Facts (÷ up to ${config.maxDivisor})`;
    else if (config.type === 'mult_div_mixed') subtitle = 'Multiplication & Division Mixed';
    else if (config.type === 'all_mixed') subtitle = 'Mixed 4 Operations Review';
    else if (config.type === 'comparison') subtitle = 'Compare Expressions (<, >, =)';
    else if (config.type === 'word_problems') subtitle = 'Grade 3 Story Problems';

    // Update Header Text
    els.renderedWsTitle.textContent = config.worksheetTitle;
    els.renderedWsSubtitle.textContent = subtitle;
    els.renderedStudentName.textContent = config.studentName;
    els.renderedKeyStudent.textContent = config.studentName;
    els.renderedKeyTitle.textContent = config.worksheetTitle;
    els.renderedKeyCount.textContent = config.count;
    els.keyDateStamp.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    // Generate Problems
    if (config.type === 'word_problems') {
      state.problems = WordProblems.generateWordProblemsList(config.count);
    } else {
      state.problems = MathEngine.generateWorksheet(config);
    }

    renderWorksheet();
    renderAnswerKey();

    if (state.mode === 'interactive') {
      resetInteractiveState();
    }
  }

  /**
   * Render Worksheet Problems Grid
   */
  function renderWorksheet() {
    const config = state.currentConfig;
    const isWordProblem = config.type === 'word_problems';

    // Set grid columns class
    els.problemsContainer.className = `problems-container grid-cols-${isWordProblem ? '1' : config.gridCols}`;
    els.problemsContainer.innerHTML = '';

    state.problems.forEach((p, idx) => {
      let card;
      if (p.type === 'word_problem') {
        card = renderWordProblemCard(p, idx, false);
      } else if (p.type === 'comparison') {
        card = renderComparisonCard(p, idx, false);
      } else if (config.layoutFormat === 'vertical' && !p.missingPos) {
        card = renderVerticalCard(p, idx, false);
      } else {
        card = renderHorizontalCard(p, idx, false);
      }
      els.problemsContainer.appendChild(card);
    });
  }

  /**
   * Render Simplified, Paper-Saving Answer Key (Strictly Question ID and Answer)
   */
  function renderAnswerKey() {
    const config = state.currentConfig;
    if (!config.includeAnswerKey) {
      els.answerKeyPage.style.display = 'none';
      return;
    }
    els.answerKeyPage.style.display = 'flex';

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

    els.answersContainer.className = `compact-answers-container grid-cols-${cols}`;
    els.answersContainer.innerHTML = '';

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

      els.answersContainer.appendChild(item);
    });
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
    const inputs = document.querySelectorAll('#problems-container .interactive-input');
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

    els.questionCount.addEventListener('change', generateAndRender);
    els.divRangeSelect.addEventListener('change', generateAndRender);
    els.studentName.addEventListener('input', () => {
      els.renderedStudentName.textContent = els.studentName.value.trim() || 'Olivia';
      els.renderedKeyStudent.textContent = els.studentName.value.trim() || 'Olivia';
    });
    els.worksheetTitle.addEventListener('input', () => {
      els.renderedWsTitle.textContent = els.worksheetTitle.value.trim() || 'Grade 3 Math Practice';
      els.renderedKeyTitle.textContent = els.worksheetTitle.value.trim() || 'Grade 3 Math Practice';
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
