/**
 * Olivia's Clock & Elapsed Time Studio Engine
 * Interactive SVG Clocks, Timeline Jumps, Story Problems & Printable Generator
 */

// Global State
const clockState = {
  score: 0,
  streak: 0,
  currentMode: 'read_clock',
  precision: 'five_min', // 'hour_half', 'quarters', 'five_min', 'one_min'
  
  // Read Clock State
  currentReadTime: { h: 3, m: 15 },

  // Set Clock State
  setTargetTime: { h: 4, m: 25 },
  setUserTime: { h: 12, m: 0 },

  // Elapsed Time State
  currentElapsed: {
    startH: 1, startM: 15,
    endH: 3, endM: 45,
    diffH: 2, diffM: 30
  },

  // Story Problems State
  currentStoryProblem: null,
  showPrintAnswers: false
};

// Story Problems Database
const TIME_STORY_PROBLEMS = [
  {
    icon: "🧁",
    text: "Olivia put a batch of blueberry muffins in the oven at 3:20 PM. They need to bake for 35 minutes. What time will the muffins be ready?",
    options: ["3:45 PM", "3:55 PM", "4:05 PM", "4:15 PM"],
    ans: 1,
    exp: "3:20 PM + 35 minutes = 3:55 PM! (20 + 35 = 55 minutes)."
  },
  {
    icon: "⚽",
    text: "Soccer practice starts at 4:15 PM and lasts for 1 hour and 15 minutes. What time does practice end?",
    options: ["5:15 PM", "5:30 PM", "5:45 PM", "6:00 PM"],
    ans: 1,
    exp: "4:15 PM + 1 hour = 5:15 PM. 5:15 PM + 15 minutes = 5:30 PM!"
  },
  {
    icon: "🎬",
    text: "A family movie starts at 6:40 PM and finishes at 8:10 PM. How long was the movie?",
    options: ["1 hour 10 minutes", "1 hour 20 minutes", "1 hour 30 minutes", "2 hours"],
    ans: 2,
    exp: "6:40 to 7:00 is 20 mins. 7:00 to 8:10 is 1 hr 10 mins. Total = 1 hour 30 minutes!"
  },
  {
    icon: "📚",
    text: "Olivia started reading her favorite book at 2:30 PM and read until 3:15 PM. How many minutes did she read?",
    options: ["30 minutes", "40 minutes", "45 minutes", "50 minutes"],
    ans: 2,
    exp: "From 2:30 PM to 3:00 PM is 30 mins. 3:00 PM to 3:15 PM is 15 mins. 30 + 15 = 45 minutes!"
  },
  {
    icon: "🍕",
    text: "The pizza delivery driver said the pizza will arrive in 40 minutes. If Olivia ordered it at 5:35 PM, when will it arrive?",
    options: ["6:05 PM", "6:15 PM", "6:20 PM", "6:25 PM"],
    ans: 1,
    exp: "5:35 + 25 mins = 6:00 PM. 15 mins remaining = 6:15 PM!"
  },
  {
    icon: "🎨",
    text: "Art class began at 10:05 AM and ended at 11:20 AM. How long did Olivia spend painting?",
    options: ["1 hour 5 minutes", "1 hour 15 minutes", "1 hour 25 minutes", "1 hour 35 minutes"],
    ans: 1,
    exp: "10:05 AM to 11:05 AM is 1 hour. 11:05 AM to 11:20 AM is 15 mins. Total = 1 hour 15 minutes!"
  }
];

// =========================================================================
// SVG CLOCK GENERATOR
// =========================================================================
function createClockSVG(hours, minutes, size = 280, showHands = true) {
  const radius = size / 2;
  const center = radius;
  const clockR = radius * 0.88;

  // Calculate hand angles
  const minAngle = minutes * 6; // 360 / 60
  const hourAngle = (hours % 12) * 30 + (minutes * 0.5); // 360 / 12 = 30 deg/hr + 0.5 deg/min

  let numbersSVG = '';
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const numR = clockR * 0.78;
    const nx = center + numR * Math.cos(angle);
    const ny = center + numR * Math.sin(angle) + (size * 0.025);
    numbersSVG += `<text x="${nx}" y="${ny}" font-size="${size * 0.1}" font-family="'Nunito', sans-serif" font-weight="900" fill="#1e293b" text-anchor="middle" dominant-baseline="middle">${i}</text>`;
  }

  // 60 tick marks
  let ticksSVG = '';
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const isMajor = (i % 5 === 0);
    const outerX = center + clockR * Math.cos(angle);
    const outerY = center + clockR * Math.sin(angle);
    const innerR = isMajor ? clockR * 0.90 : clockR * 0.95;
    const innerX = center + innerR * Math.cos(angle);
    const innerY = center + innerR * Math.sin(angle);
    const strokeWidth = isMajor ? size * 0.015 : size * 0.008;
    const strokeColor = isMajor ? '#475569' : '#cbd5e1';
    ticksSVG += `<line x1="${outerX}" y1="${outerY}" x2="${innerX}" y2="${innerY}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" />`;
  }

  // Hands SVG
  let handsSVG = '';
  if (showHands) {
    // Hour Hand (Red, Thicker, Shorter)
    const hourLen = clockR * 0.52;
    const hourRad = (hourAngle - 90) * (Math.PI / 180);
    const hx = center + hourLen * Math.cos(hourRad);
    const hy = center + hourLen * Math.sin(hourRad);
    handsSVG += `<line x1="${center}" y1="${center}" x2="${hx}" y2="${hy}" stroke="#ef4444" stroke-width="${size * 0.04}" stroke-linecap="round" />`;

    // Minute Hand (Blue, Longer)
    const minLen = clockR * 0.76;
    const minRad = (minAngle - 90) * (Math.PI / 180);
    const mx = center + minLen * Math.cos(minRad);
    const my = center + minLen * Math.sin(minRad);
    handsSVG += `<line x1="${center}" y1="${center}" x2="${mx}" y2="${my}" stroke="#3b82f6" stroke-width="${size * 0.024}" stroke-linecap="round" />`;

    // Center pivot cap
    handsSVG += `<circle cx="${center}" cy="${center}" r="${size * 0.038}" fill="#f59e0b" stroke="#ffffff" stroke-width="${size * 0.01}" />`;
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Face -->
      <circle cx="${center}" cy="${center}" r="${clockR}" fill="#ffffff" stroke="#cbd5e1" stroke-width="${size * 0.02}" />
      <circle cx="${center}" cy="${center}" r="${clockR * 0.99}" fill="none" stroke="#f1f5f9" stroke-width="${size * 0.01}" />
      <!-- Ticks & Numbers -->
      ${ticksSVG}
      ${numbersSVG}
      <!-- Hands -->
      ${handsSVG}
    </svg>
  `;
}

// =========================================================================
// TIME GENERATORS BASED ON PRECISION
// =========================================================================
function generateRandomTime() {
  const h = Math.floor(Math.random() * 12) + 1;
  let m = 0;

  if (clockState.precision === 'hour_half') {
    m = Math.random() < 0.5 ? 0 : 30;
  } else if (clockState.precision === 'quarters') {
    const quarters = [0, 15, 30, 45];
    m = quarters[Math.floor(Math.random() * quarters.length)];
  } else if (clockState.precision === 'five_min') {
    m = Math.floor(Math.random() * 12) * 5;
  } else {
    m = Math.floor(Math.random() * 60);
  }

  return { h, m };
}

// =========================================================================
// 1. READ CLOCK ACTIVITY
// =========================================================================
function generateNewReadClockQuestion() {
  clockState.currentReadTime = generateRandomTime();
  const container = document.getElementById('read-clock-svg-container');
  container.innerHTML = createClockSVG(clockState.currentReadTime.h, clockState.currentReadTime.m, 280);

  document.getElementById('read-hour-input').value = '';
  document.getElementById('read-minute-input').value = '';
  document.getElementById('read-clock-feedback').className = 'feedback-msg hidden';
  document.getElementById('read-hour-input').focus();
}

function checkReadClockAnswer() {
  const hInput = parseInt(document.getElementById('read-hour-input').value);
  const mInput = parseInt(document.getElementById('read-minute-input').value);
  const fb = document.getElementById('read-clock-feedback');

  if (isNaN(hInput) || isNaN(mInput)) {
    fb.className = 'feedback-msg error';
    fb.textContent = "Please enter both the Hour (HH) and Minutes (MM)!";
    fb.classList.remove('hidden');
    return;
  }

  const isCorrect = (hInput === clockState.currentReadTime.h && mInput === clockState.currentReadTime.m);

  if (isCorrect) {
    clockState.score += 10;
    clockState.streak++;
    fb.className = 'feedback-msg success';
    fb.innerHTML = `🎉 <strong>SPOT ON, OLIVIA!</strong> The time is <strong>${hInput}:${mInput.toString().padStart(2, '0')}</strong>! ✨`;
    fb.classList.remove('hidden');
    updateStats();
    launchConfetti();
  } else {
    clockState.streak = 0;
    fb.className = 'feedback-msg error';
    fb.innerHTML = `💡 Good try! The hour hand points near <strong>${clockState.currentReadTime.h}</strong> and the minute hand is at <strong>${clockState.currentReadTime.m}</strong> (${clockState.currentReadTime.h}:${clockState.currentReadTime.m.toString().padStart(2, '0')}).`;
    fb.classList.remove('hidden');
    updateStats();
  }
}

// =========================================================================
// 2. SET CLOCK ACTIVITY
// =========================================================================
function generateNewSetClockQuestion() {
  clockState.setTargetTime = generateRandomTime();
  clockState.setUserTime = { h: 12, m: 0 };

  document.getElementById('set-target-time-display').textContent = 
    `${clockState.setTargetTime.h}:${clockState.setTargetTime.m.toString().padStart(2, '0')}`;

  renderUserClock();
  document.getElementById('set-clock-feedback').className = 'feedback-msg hidden';
}

function renderUserClock() {
  const container = document.getElementById('set-clock-svg-container');
  container.innerHTML = createClockSVG(clockState.setUserTime.h, clockState.setUserTime.m, 280);

  document.getElementById('ctrl-hour-val').textContent = clockState.setUserTime.h;
  document.getElementById('ctrl-minute-val').textContent = clockState.setUserTime.m.toString().padStart(2, '0');
}

function adjustHour(delta) {
  let newH = clockState.setUserTime.h + delta;
  if (newH > 12) newH = 1;
  if (newH < 1) newH = 12;
  clockState.setUserTime.h = newH;
  renderUserClock();
}

function adjustMinute(delta) {
  let newM = clockState.setUserTime.m + delta;
  if (newM >= 60) {
    newM = newM % 60;
    adjustHour(1);
  } else if (newM < 0) {
    newM = 60 + newM;
    adjustHour(-1);
  }
  clockState.setUserTime.m = newM;
  renderUserClock();
}

function checkSetClockAnswer() {
  const fb = document.getElementById('set-clock-feedback');
  const isCorrect = (clockState.setUserTime.h === clockState.setTargetTime.h && 
                     clockState.setUserTime.m === clockState.setTargetTime.m);

  if (isCorrect) {
    clockState.score += 10;
    clockState.streak++;
    fb.className = 'feedback-msg success';
    fb.innerHTML = `🎉 <strong>PERFECT SETTING!</strong> You matched ${clockState.setTargetTime.h}:${clockState.setTargetTime.m.toString().padStart(2, '0')}! 🌟`;
    fb.classList.remove('hidden');
    updateStats();
    launchConfetti();
  } else {
    clockState.streak = 0;
    fb.className = 'feedback-msg error';
    fb.innerHTML = `Not quite there yet! Move the hands to match <strong>${clockState.setTargetTime.h}:${clockState.setTargetTime.m.toString().padStart(2, '0')}</strong>.`;
    fb.classList.remove('hidden');
    updateStats();
  }
}

// =========================================================================
// 3. ELAPSED TIME ACTIVITY (TIMELINE JUMPS)
// =========================================================================
function generateNewElapsedQuestion() {
  const startH = Math.floor(Math.random() * 8) + 1; // 1 to 8
  const startM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

  const jumpH = Math.floor(Math.random() * 3) + 1; // 1 to 3 hours
  const jumpM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

  let totalMinutes = (startH * 60 + startM) + (jumpH * 60 + jumpM);
  let endH = Math.floor(totalMinutes / 60);
  let endM = totalMinutes % 60;
  if (endH > 12) endH = endH - 12;

  clockState.currentElapsed = {
    startH, startM,
    endH, endM,
    diffH: jumpH + (startM + jumpM >= 60 ? 1 : 0),
    diffM: (startM + jumpM) % 60 >= startM ? (startM + jumpM) % 60 - startM : (60 - startM + endM)
  };

  // Recalculate true diff
  let diffTotal = (jumpH * 60 + jumpM);
  clockState.currentElapsed.diffH = Math.floor(diffTotal / 60);
  clockState.currentElapsed.diffM = diffTotal % 60;

  // Render Start & End Clocks
  document.getElementById('elapsed-start-clock').innerHTML = createClockSVG(startH, startM, 140);
  document.getElementById('elapsed-end-clock').innerHTML = createClockSVG(endH, endM, 140);
  document.getElementById('elapsed-start-text').textContent = `${startH}:${startM.toString().padStart(2, '0')} PM`;
  document.getElementById('elapsed-end-text').textContent = `${endH}:${endM.toString().padStart(2, '0')} PM`;

  // Render Visual Timeline Jumps
  const jumpsContainer = document.getElementById('timeline-visual-jumps');
  jumpsContainer.innerHTML = `
    <span class="jump-bubble">Start at ${startH}:${startM.toString().padStart(2, '0')}</span>
    ${jumpH > 0 ? `<span class="jump-bubble">➔ Jump +${jumpH} hr</span>` : ''}
    ${jumpM > 0 ? `<span class="jump-bubble">➔ Jump +${jumpM} min</span>` : ''}
    <span class="jump-bubble">➔ Arrive at ${endH}:${endM.toString().padStart(2, '0')}</span>
  `;

  document.getElementById('elapsed-hrs-input').value = '';
  document.getElementById('elapsed-mins-input').value = '';
  document.getElementById('elapsed-feedback').className = 'feedback-msg hidden';
}

function checkElapsedTimeAnswer() {
  const userH = parseInt(document.getElementById('elapsed-hrs-input').value) || 0;
  const userM = parseInt(document.getElementById('elapsed-mins-input').value) || 0;
  const fb = document.getElementById('elapsed-feedback');

  const trueH = clockState.currentElapsed.diffH;
  const trueM = clockState.currentElapsed.diffM;

  if (userH === trueH && userM === trueM) {
    clockState.score += 15;
    clockState.streak++;
    fb.className = 'feedback-msg success';
    fb.innerHTML = `🎉 <strong>EXCELLENT TIME MATH!</strong> Exactly <strong>${trueH} hours and ${trueM} minutes</strong> passed! 🚀`;
    fb.classList.remove('hidden');
    updateStats();
    launchConfetti();
  } else {
    clockState.streak = 0;
    fb.className = 'feedback-msg error';
    fb.innerHTML = `💡 Almost! The total elapsed time is <strong>${trueH} hours and ${trueM} minutes</strong>.`;
    fb.classList.remove('hidden');
    updateStats();
  }
}

// =========================================================================
// 4. STORY WORD PROBLEMS
// =========================================================================
function generateNewStoryProblem() {
  const item = TIME_STORY_PROBLEMS[Math.floor(Math.random() * TIME_STORY_PROBLEMS.length)];
  clockState.currentStoryProblem = item;

  document.getElementById('story-problem-text').textContent = item.text;
  const container = document.getElementById('story-options-container');
  container.innerHTML = '';

  item.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'story-option-btn';
    btn.textContent = opt;
    btn.onclick = () => selectStoryOption(idx, btn);
    container.appendChild(btn);
  });

  document.getElementById('story-feedback').className = 'feedback-msg hidden';
}

function selectStoryOption(idx, btnEl) {
  const item = clockState.currentStoryProblem;
  const fb = document.getElementById('story-feedback');
  const allBtns = document.querySelectorAll('.story-option-btn');

  if (idx === item.ans) {
    btnEl.classList.add('correct');
    clockState.score += 15;
    clockState.streak++;
    fb.className = 'feedback-msg success';
    fb.innerHTML = `🎉 <strong>CORRECT!</strong> ${item.exp}`;
    fb.classList.remove('hidden');
    updateStats();
    launchConfetti();
  } else {
    btnEl.classList.add('wrong');
    allBtns[item.ans].classList.add('correct');
    clockState.streak = 0;
    fb.className = 'feedback-msg error';
    fb.innerHTML = `💡 ${item.exp}`;
    fb.classList.remove('hidden');
    updateStats();
  }
}

// =========================================================================
// 5. PRINTABLE WORKSHEETS GENERATOR
// =========================================================================
function generatePrintableClocks() {
  const grid = document.getElementById('printable-clocks-grid');
  grid.innerHTML = '';

  for (let i = 1; i <= 12; i++) {
    const time = generateRandomTime();
    const item = document.createElement('div');
    item.className = 'printable-clock-item';
    
    // Half are "Read the Clock", half are "Draw the Hands"
    const isDrawMode = (i % 2 === 0);

    if (isDrawMode) {
      item.innerHTML = `
        <span class="q-num">${i}. Draw hands for: <strong>${time.h}:${time.m.toString().padStart(2, '0')}</strong></span>
        ${createClockSVG(time.h, time.m, 130, clockState.showPrintAnswers)}
        <div style="margin-top:6px; font-weight:700; font-size:0.9rem;">
          ${clockState.showPrintAnswers ? `<span style="color:#059669;">[${time.h}:${time.m.toString().padStart(2, '0')}]</span>` : '&nbsp;'}
        </div>
      `;
    } else {
      item.innerHTML = `
        <span class="q-num">${i}. What time is it?</span>
        ${createClockSVG(time.h, time.m, 130, true)}
        <div style="margin-top:6px; font-weight:700; font-size:0.9rem;">
          Time: _________ 
          ${clockState.showPrintAnswers ? `<span style="color:#059669;">[${time.h}:${time.m.toString().padStart(2, '0')}]</span>` : ''}
        </div>
      `;
    }

    grid.appendChild(item);
  }
}

function togglePrintAnswers(isChecked) {
  clockState.showPrintAnswers = isChecked;
  generatePrintableClocks();
}

// =========================================================================
// UTILITIES & SWITCHERS
// =========================================================================
function setActivityMode(mode) {
  clockState.currentMode = mode;
  document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

  document.querySelectorAll('.activity-stage').forEach(s => s.classList.add('hidden'));

  if (mode === 'read_clock') {
    document.getElementById('view-read-clock').classList.remove('hidden');
    generateNewReadClockQuestion();
  } else if (mode === 'set_clock') {
    document.getElementById('view-set-clock').classList.remove('hidden');
    generateNewSetClockQuestion();
  } else if (mode === 'elapsed_time') {
    document.getElementById('view-elapsed-time').classList.remove('hidden');
    generateNewElapsedQuestion();
  } else if (mode === 'word_problems') {
    document.getElementById('view-word-problems').classList.remove('hidden');
    generateNewStoryProblem();
  } else if (mode === 'worksheet_gen') {
    document.getElementById('view-worksheet-gen').classList.remove('hidden');
    generatePrintableClocks();
  }
}

function updatePrecision(val) {
  clockState.precision = val;
  if (clockState.currentMode === 'read_clock') generateNewReadClockQuestion();
  if (clockState.currentMode === 'set_clock') generateNewSetClockQuestion();
  if (clockState.currentMode === 'worksheet_gen') generatePrintableClocks();
}

function updateStats() {
  document.getElementById('clock-score').textContent = clockState.score;
  document.getElementById('clock-streak').textContent = clockState.streak;
}

// Confetti Particle System
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  canvas.style.display = 'block';
  confettiParticles = [];
  const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6', '#10b981'];
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles = confettiParticles.filter(p => p.life > 0);
  confettiParticles.forEach(p => {
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

// Enter Key listeners for time inputs
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('read-minute-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') checkReadClockAnswer();
  });
  document.getElementById('read-hour-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') checkReadClockAnswer();
  });
  document.getElementById('elapsed-mins-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') checkElapsedTimeAnswer();
  });

  // Start with read clock
  setActivityMode('read_clock');
});
