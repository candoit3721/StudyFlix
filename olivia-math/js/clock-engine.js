/**
 * Olivia's Clock & Elapsed Time Course Engine
 * Interactive SVG Clocks, Mountain Jump Builder, Canadian Schedules & Waterloo Contest Puzzles
 */

// Global State
const clockState = {
  score: 0,
  streak: 0,
  badges: [],
  currentMode: 'course_lessons',
  precision: 'five_min', // 'hour_half', 'quarters', 'five_min', 'one_min'
  
  // Read Clock State
  currentReadTime: { h: 3, m: 15 },

  // Set Clock State
  setTargetTime: { h: 4, m: 25 },
  setUserTime: { h: 12, m: 0 },

  // Jump Builder State
  jumpBuilder: {
    startH: 2, startM: 15,
    endH: 4, endM: 45,
    currentH: 2, currentM: 15,
    jumpsList: []
  },

  // Elapsed Time State
  currentElapsed: {
    startH: 1, startM: 15,
    endH: 3, endM: 45,
    diffH: 2, diffM: 30
  },

  // Story Problems State
  currentStoryProblem: null,

  // Waterloo Contest State
  contestIndex: 0,

  showPrintAnswers: false
};

// Waterloo CEMC & Kangaroo Contest Logic Puzzles (Tier 3 Advanced)
const WATERLOO_CONTEST_PUZZLES = [
  {
    num: 1,
    title: "The Mirror Reflection Clock Mystery 🪞",
    desc: "Olivia looks into a bathroom mirror and sees the reflection of an analog clock behind her. In the mirror reflection, the hands look like they show 3:40. What is the ACTUAL real time shown on the clock?",
    options: ["8:20", "9:20", "8:40", "9:40"],
    ans: 0,
    exp: "In a mirror, left and right flip across the 12-6 axis! The minute hand at 8 (40m) reflects to 4 (20m). The hour hand reflecting near 4 is actually near 8. Real time is 8:20!"
  },
  {
    num: 2,
    title: "The Faulty Ottawa Museum Clock 🕰️⚡",
    desc: "An antique clock in Ottawa runs slow and loses 4 minutes every hour. It is set to the exact time at 8:00 AM. When the true time is 1:00 PM (5 hours later), what time does this faulty clock display?",
    options: ["1:20 PM", "12:40 PM", "12:20 PM", "12:56 PM"],
    ans: 1,
    exp: "5 hours × 4 minutes lost/hour = 20 minutes lost. True time 1:00 PM − 20 minutes = 12:40 PM!"
  },
  {
    num: 3,
    title: "The Cross-Canada Flight Time Zone ✈️🍁",
    desc: "Olivia boards a flight at Toronto Pearson (EST) departing at 10:00 AM. The flight to Vancouver (PST) takes 5 hours and 15 minutes. Vancouver time is 3 hours behind Toronto. What local time does Olivia land in Vancouver?",
    options: ["3:15 PM PST", "12:15 PM PST", "1:15 PM PST", "11:15 AM PST"],
    ans: 1,
    exp: "10:00 AM EST + 5h 15m = 3:15 PM EST. Subtract 3 hours for Vancouver time = 12:15 PM PST!"
  },
  {
    num: 4,
    title: "The Overlapping Clock Hands 🕛",
    desc: "At 12:00, the hour and minute hands point straight up together. Between 1:00 PM and 2:00 PM, at approximately what time will the two hands overlap directly on top of each other again?",
    options: ["Exactly 1:05 PM", "Around 1:05 and a half PM", "Exactly 1:10 PM", "They never overlap"],
    ans: 1,
    exp: "At 1:05, the hour hand has moved 5/60 (1/12th) toward the 2, so they overlap just past 1:05 (~1:05:27 PM)!"
  }
];

// Canadian Story Problems Database
const TIME_STORY_PROBLEMS = [
  {
    icon: "🧁",
    text: "Olivia put a batch of maple butter tarts in the oven at 3:20 PM in Ottawa. They need to bake for 35 minutes. What time will the tarts be ready?",
    options: ["3:45 PM", "3:55 PM", "4:05 PM", "4:15 PM"],
    ans: 1,
    exp: "3:20 PM + 35 minutes = 3:55 PM! (20 + 35 = 55 minutes)."
  },
  {
    icon: "⚾",
    text: "The Toronto Blue Jays baseball game starts at 1:05 PM and lasts for 2 hours and 40 minutes. What time does the final inning finish?",
    options: ["3:35 PM", "3:45 PM", "4:05 PM", "4:15 PM"],
    ans: 1,
    exp: "1:05 PM + 2 hours = 3:05 PM. 3:05 PM + 40 minutes = 3:45 PM!"
  },
  {
    icon: "⛸️",
    text: "Olivia started ice skating on the frozen Rideau Canal at 2:15 PM and finished at 4:30 PM. How long did she skate?",
    options: ["1 hour 45 minutes", "2 hours 15 minutes", "2 hours 30 minutes", "2 hours 45 minutes"],
    ans: 1,
    exp: "2:15 PM to 4:15 PM is 2 hours. 4:15 PM to 4:30 PM is 15 mins. Total = 2 hours and 15 minutes!"
  },
  {
    icon: "🌲",
    text: "Olivia hiked the Lookout Trail in Algonquin Park from 9:15 AM to 12:30 PM. How long was her wilderness hike?",
    options: ["2 hours 45 minutes", "3 hours 15 minutes", "3 hours 30 minutes", "3 hours 45 minutes"],
    ans: 1,
    exp: "9:15 to 12:15 is 3 hours. 12:15 to 12:30 is 15 mins. Total = 3 hours and 15 minutes!"
  },
  {
    icon: "🚆",
    text: "A VIA Rail passenger train leaves Montreal at 10:45 AM and arrives in Toronto at 3:50 PM. What is the total travel time?",
    options: ["4 hours 5 minutes", "4 hours 50 minutes", "5 hours 5 minutes", "5 hours 15 minutes"],
    ans: 2,
    exp: "10:45 AM to 2:45 PM is 4 hours. 2:45 to 3:45 is 1 hr (5 hrs total). 3:45 to 3:50 is 5 mins. Total = 5 hours 5 minutes!"
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
  if (container) {
    container.innerHTML = createClockSVG(clockState.currentReadTime.h, clockState.currentReadTime.m, 280);
  }

  const hInp = document.getElementById('read-hour-input');
  const mInp = document.getElementById('read-minute-input');
  const fb = document.getElementById('read-clock-feedback');

  if (hInp) hInp.value = '';
  if (mInp) mInp.value = '';
  if (fb) fb.className = 'feedback-msg hidden';
  if (hInp) hInp.focus();
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
    unlockBadge('clock_apprentice', 'Clock Apprentice');
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

  const targetDisp = document.getElementById('set-target-time-display');
  if (targetDisp) {
    targetDisp.textContent = `${clockState.setTargetTime.h}:${clockState.setTargetTime.m.toString().padStart(2, '0')}`;
  }

  renderUserClock();
  const fb = document.getElementById('set-clock-feedback');
  if (fb) fb.className = 'feedback-msg hidden';
}

function renderUserClock() {
  const container = document.getElementById('set-clock-svg-container');
  if (container) {
    container.innerHTML = createClockSVG(clockState.setUserTime.h, clockState.setUserTime.m, 280);
  }

  const hVal = document.getElementById('ctrl-hour-val');
  const mVal = document.getElementById('ctrl-minute-val');
  if (hVal) hVal.textContent = clockState.setUserTime.h;
  if (mVal) mVal.textContent = clockState.setUserTime.m.toString().padStart(2, '0');
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
    unlockBadge('quarter_master', 'Quarter Master');
    fb.className = 'feedback-msg success';
    fb.innerHTML = `🎉 <strong>PERFECT HAND PLACEMENT!</strong> You matched ${clockState.setTargetTime.h}:${clockState.setTargetTime.m.toString().padStart(2, '0')}! 🌟`;
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
// 3. MOUNTAIN JUMP BUILDER ACTIVITY
// =========================================================================
function generateNewJumpBuilderChallenge() {
  const startH = Math.floor(Math.random() * 7) + 1; // 1 to 7
  const startM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

  const jumpH = Math.floor(Math.random() * 2) + 1; // 1 to 2 hrs
  const jumpM = [15, 30, 45][Math.floor(Math.random() * 3)];

  const totalMin = (startH * 60 + startM) + (jumpH * 60 + jumpM);
  let endH = Math.floor(totalMin / 60);
  let endM = totalMin % 60;
  if (endH > 12) endH -= 12;

  clockState.jumpBuilder = {
    startH, startM,
    endH, endM,
    currentH: startH,
    currentM: startM,
    totalMinutesTarget: (jumpH * 60 + jumpM),
    jumpsList: []
  };

  const bStart = document.getElementById('builder-start-text');
  const bEnd = document.getElementById('builder-end-text');
  const bCur = document.getElementById('builder-current-time');
  const bTot = document.getElementById('builder-total-jumped');
  const track = document.getElementById('jump-timeline-track');
  const fb = document.getElementById('jump-builder-feedback');

  if (bStart) bStart.textContent = `${startH}:${startM.toString().padStart(2, '0')} PM`;
  if (bEnd) bEnd.textContent = `${endH}:${endM.toString().padStart(2, '0')} PM`;
  if (bCur) bCur.textContent = `${startH}:${startM.toString().padStart(2, '0')} PM`;
  if (bTot) bTot.textContent = `0h 0m`;
  if (track) track.innerHTML = `<span class="jump-bubble">🚩 Start: ${startH}:${startM.toString().padStart(2, '0')} PM</span>`;
  if (fb) fb.className = 'feedback-msg hidden';
}

function addTimelineJump(minutes, label) {
  const jb = clockState.jumpBuilder;
  jb.jumpsList.push({ minutes, label });

  let totalM = (jb.currentH * 60 + jb.currentM) + minutes;
  let newH = Math.floor(totalM / 60);
  let newM = totalM % 60;
  if (newH > 12) newH -= 12;

  jb.currentH = newH;
  jb.currentM = newM;

  let totalJumpedM = jb.jumpsList.reduce((acc, j) => acc + j.minutes, 0);
  let jH = Math.floor(totalJumpedM / 60);
  let jM = totalJumpedM % 60;

  const bCur = document.getElementById('builder-current-time');
  const bTot = document.getElementById('builder-total-jumped');
  const track = document.getElementById('jump-timeline-track');

  if (bCur) bCur.textContent = `${newH}:${newM.toString().padStart(2, '0')} PM`;
  if (bTot) bTot.textContent = `${jH}h ${jM}m`;

  if (track) {
    const span = document.createElement('span');
    span.className = 'jump-bubble';
    span.style.background = minutes >= 60 ? '#dcfce7' : (minutes >= 15 ? '#fef3c7' : '#fee2e2');
    span.style.borderColor = minutes >= 60 ? '#86efac' : (minutes >= 15 ? '#fde68a' : '#fca5a5');
    span.style.color = minutes >= 60 ? '#15803d' : (minutes >= 15 ? '#92400e' : '#991b1b');
    span.textContent = `➔ ${label} (${newH}:${newM.toString().padStart(2, '0')} PM)`;
    track.appendChild(span);
  }
}

function resetTimelineJumps() {
  const jb = clockState.jumpBuilder;
  jb.currentH = jb.startH;
  jb.currentM = jb.startM;
  jb.jumpsList = [];

  const bCur = document.getElementById('builder-current-time');
  const bTot = document.getElementById('builder-total-jumped');
  const track = document.getElementById('jump-timeline-track');
  const fb = document.getElementById('jump-builder-feedback');

  if (bCur) bCur.textContent = `${jb.startH}:${jb.startM.toString().padStart(2, '0')} PM`;
  if (bTot) bTot.textContent = `0h 0m`;
  if (track) track.innerHTML = `<span class="jump-bubble">🚩 Start: ${jb.startH}:${jb.startM.toString().padStart(2, '0')} PM</span>`;
  if (fb) fb.className = 'feedback-msg hidden';
}

function checkJumpBuilderCompletion() {
  const jb = clockState.jumpBuilder;
  const fb = document.getElementById('jump-builder-feedback');
  const isReached = (jb.currentH === jb.endH && jb.currentM === jb.endM);

  if (isReached) {
    clockState.score += 20;
    clockState.streak++;
    unlockBadge('mountain_jumper', 'Mountain Jumper');
    fb.className = 'feedback-msg success';
    fb.innerHTML = `🎉 <strong>TARGET REACHED!</strong> You built a perfect timeline jump path to <strong>${jb.endH}:${jb.endM.toString().padStart(2, '0')} PM</strong>! 🏔️✨`;
    fb.classList.remove('hidden');
    updateStats();
    launchConfetti();
  } else {
    fb.className = 'feedback-msg error';
    fb.innerHTML = `You are currently at <strong>${jb.currentH}:${jb.currentM.toString().padStart(2, '0')} PM</strong>. Keep jumping until you reach <strong>${jb.endH}:${jb.endM.toString().padStart(2, '0')} PM</strong>!`;
    fb.classList.remove('hidden');
  }
}

// =========================================================================
// 4. ELAPSED TIME CHALLENGE ACTIVITY
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

  let diffTotal = (jumpH * 60 + jumpM);
  clockState.currentElapsed = {
    startH, startM,
    endH, endM,
    diffH: Math.floor(diffTotal / 60),
    diffM: diffTotal % 60
  };

  const startClock = document.getElementById('elapsed-start-clock');
  const endClock = document.getElementById('elapsed-end-clock');
  const startText = document.getElementById('elapsed-start-text');
  const endText = document.getElementById('elapsed-end-text');
  const jumpsContainer = document.getElementById('timeline-visual-jumps');
  const hrsInp = document.getElementById('elapsed-hrs-input');
  const minsInp = document.getElementById('elapsed-mins-input');
  const fb = document.getElementById('elapsed-feedback');

  if (startClock) startClock.innerHTML = createClockSVG(startH, startM, 140);
  if (endClock) endClock.innerHTML = createClockSVG(endH, endM, 140);
  if (startText) startText.textContent = `${startH}:${startM.toString().padStart(2, '0')} PM`;
  if (endText) endText.textContent = `${endH}:${endM.toString().padStart(2, '0')} PM`;

  if (jumpsContainer) {
    jumpsContainer.innerHTML = `
      <span class="jump-bubble">Start at ${startH}:${startM.toString().padStart(2, '0')}</span>
      ${jumpH > 0 ? `<span class="jump-bubble">➔ Jump +${jumpH} hr</span>` : ''}
      ${jumpM > 0 ? `<span class="jump-bubble">➔ Jump +${jumpM} min</span>` : ''}
      <span class="jump-bubble">➔ Arrive at ${endH}:${endM.toString().padStart(2, '0')}</span>
    `;
  }

  if (hrsInp) hrsInp.value = '';
  if (minsInp) minsInp.value = '';
  if (fb) fb.className = 'feedback-msg hidden';
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
    unlockBadge('elapsed_wizard', 'Elapsed Time Wizard');
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
// 5. STORY WORD PROBLEMS
// =========================================================================
function generateNewStoryProblem() {
  const item = TIME_STORY_PROBLEMS[Math.floor(Math.random() * TIME_STORY_PROBLEMS.length)];
  clockState.currentStoryProblem = item;

  const iconEl = document.getElementById('story-icon');
  const textEl = document.getElementById('story-problem-text');
  const container = document.getElementById('story-options-container');
  const fb = document.getElementById('story-feedback');

  if (iconEl) iconEl.textContent = item.icon;
  if (textEl) textEl.textContent = item.text;
  if (container) {
    container.innerHTML = '';
    item.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'story-option-btn';
      btn.textContent = opt;
      btn.onclick = () => selectStoryOption(idx, btn);
      container.appendChild(btn);
    });
  }

  if (fb) fb.className = 'feedback-msg hidden';
}

function selectStoryOption(idx, btnEl) {
  const item = clockState.currentStoryProblem;
  const fb = document.getElementById('story-feedback');
  const allBtns = document.querySelectorAll('.story-option-btn');

  if (idx === item.ans) {
    btnEl.classList.add('correct');
    clockState.score += 15;
    clockState.streak++;
    unlockBadge('canadian_schedule_pro', 'Canadian Schedule Pro');
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
// 6. WATERLOO CONTEST LOGIC ARENA
// =========================================================================
function renderContestPuzzle() {
  const puzzle = WATERLOO_CONTEST_PUZZLES[clockState.contestIndex];
  const numEl = document.getElementById('contest-num');
  const titleEl = document.getElementById('contest-title');
  const descEl = document.getElementById('contest-desc');
  const container = document.getElementById('contest-options-grid');
  const fb = document.getElementById('contest-feedback');

  if (numEl) numEl.textContent = puzzle.num;
  if (titleEl) titleEl.textContent = puzzle.title;
  if (descEl) descEl.textContent = puzzle.desc;

  if (container) {
    container.innerHTML = '';
    puzzle.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'contest-opt-btn';
      btn.textContent = opt;
      btn.onclick = () => selectContestOption(idx, btn);
      container.appendChild(btn);
    });
  }

  if (fb) fb.className = 'feedback-msg hidden';
}

function selectContestOption(idx, btnEl) {
  const puzzle = WATERLOO_CONTEST_PUZZLES[clockState.contestIndex];
  const fb = document.getElementById('contest-feedback');
  const allBtns = document.querySelectorAll('.contest-opt-btn');

  if (idx === puzzle.ans) {
    btnEl.classList.add('correct');
    clockState.score += 25;
    clockState.streak++;
    unlockBadge('waterloo_time_champ', 'Waterloo Time Champion');
    fb.className = 'feedback-msg success';
    fb.innerHTML = `🏆 <strong>BRILLIANT WATERLOO CONTEST THINKING!</strong> ${puzzle.exp}`;
    fb.classList.remove('hidden');
    updateStats();
    launchConfetti();
  } else {
    btnEl.classList.add('wrong');
    allBtns[puzzle.ans].classList.add('correct');
    clockState.streak = 0;
    fb.className = 'feedback-msg error';
    fb.innerHTML = `💡 <strong>Contest Hint:</strong> ${puzzle.exp}`;
    fb.classList.remove('hidden');
    updateStats();
  }
}

function nextContestPuzzle() {
  clockState.contestIndex = (clockState.contestIndex + 1) % WATERLOO_CONTEST_PUZZLES.length;
  renderContestPuzzle();
}

// =========================================================================
// 7. PRINTABLE WORKSHEETS GENERATOR
// =========================================================================
/**
 * Build the printable clock worksheet.
 *
 * Two defects fixed here.
 *
 * 1. It emitted no page structure at all: twelve clocks were poured into one
 *    unbounded grid with no sheet element and no page-break rules, so the
 *    browser split them wherever it liked. Asking for more than twelve
 *    (now possible) would have made that visible immediately.
 *
 * 2. Printing from the top bar produced an EMPTY worksheet. The clocks were
 *    only generated on entering the worksheet view, but the print stylesheet
 *    force-shows `#view-worksheet-gen` from any view -- so printing without
 *    first opening that tab yielded a header, a footer and nothing between
 *    them. Generation now happens on load, and a `beforeprint` guard
 *    regenerates if the grid is somehow still empty.
 */
function buildClockItem(index) {
  const time = generateRandomTime();
  const item = document.createElement('div');
  item.className = 'sf-card printable-clock-item';

  // Alternate between "draw the hands" and "read the clock".
  const isDrawMode = (index % 2 === 0);
  const stamp = `${time.h}:${time.m.toString().padStart(2, '0')}`;

  if (isDrawMode) {
    item.innerHTML = `
        <span class="q-num">${index}. Draw hands for: <strong>${stamp}</strong></span>
        ${createClockSVG(time.h, time.m, 130, clockState.showPrintAnswers)}
        <div style="margin-top:6px; font-weight:700; font-size:0.9rem;">
          ${clockState.showPrintAnswers ? `<span style="color:#059669;">[${stamp}]</span>` : '&nbsp;'}
        </div>
      `;
  } else {
    item.innerHTML = `
        <span class="q-num">${index}. What time is it?</span>
        ${createClockSVG(time.h, time.m, 130, true)}
        <div style="margin-top:6px; font-weight:700; font-size:0.9rem;">
          Time: _________
          ${clockState.showPrintAnswers ? `<span style="color:#059669;">[${stamp}]</span>` : ''}
        </div>
      `;
  }
  return item;
}

function clockSheetHeader(pageIdx, totalPages) {
  const header = document.createElement('div');
  header.className = 'doc-header';
  const page = totalPages > 1 ? ` • Page ${pageIdx + 1} of ${totalPages}` : '';
  header.innerHTML = `
            <div class="doc-title-row">
              <h2>Grade 3 Telling Time &amp; Clocks Practice</h2>
              <span class="doc-sub">Olivia's Learning Studio • Ontario Curricula${page}</span>
            </div>
            <div class="doc-meta-row">
              <div>Name: <span class="doc-line">Olivia</span></div>
              <div>Date: <span class="doc-line"></span></div>
              <div>Score: <span class="doc-line" style="min-width: 60px;"></span></div>
            </div>
  `;
  return header;
}

function clockSheetFooter() {
  const footer = document.createElement('div');
  footer.className = 'doc-footer';
  footer.innerHTML = `
            <span>Olivia's Math Studio • Grade 3 Curricula</span>
            <span>⭐ Draw the time or write the digital numbers below each clock! ⭐</span>
  `;
  return footer;
}

function generatePrintableClocks() {
  const target = document.getElementById('printable-clock-doc');
  if (!target || typeof SFPaginate === 'undefined') return Promise.resolve();

  const count = clockState.printCount || 12;
  const cols = clockState.printCols || 4;

  const items = [];
  for (let i = 1; i <= count; i++) items.push(i);

  SFPaginate.beginRender();

  return SFPaginate.paginate({
    target: target,
    mode: 'fill',
    items: items,
    sheetClass: 'sf-sheet printable-clock-doc',
    gridClass: `printable-clocks-grid cols-${cols}`,
    cacheKey: `clock|cols=${cols}`,
    renderItem: index => buildClockItem(index),
    renderHeader: clockSheetHeader,
    renderFooter: clockSheetFooter
  }).then(result => {
    SFPaginate.publish({
      sheets: result.sheets.length,
      requestedPages: null,
      overflowRows: result.overflowRows,
      chunkSplits: 0,
      config: { count: count, cols: cols, showAnswers: clockState.showPrintAnswers }
    });
    return result;
  });
}

/**
 * URL parameters for the printable worksheet.
 *
 * The count and column axes are what determine whether the clocks fit a page,
 * so they must be addressable for the print matrix to sweep them.
 */
const CLOCK_URL_SCHEMA = {
  count: {
    type: 'int', min: 4, max: 48,
    apply: (c, v) => {
      c.printCount = v;
      const sel = document.getElementById('clock-count-select');
      if (sel) sel.value = String(v);
    }
  },
  cols: {
    type: 'int', min: 2, max: 5,
    apply: (c, v) => {
      c.printCols = v;
      const sel = document.getElementById('clock-cols-select');
      if (sel) sel.value = String(v);
    }
  },
  answers: {
    type: 'bool',
    apply: (c, v) => {
      c.showPrintAnswers = v;
      const chk = document.getElementById('chk-show-answers-print');
      if (chk) chk.checked = v;
    }
  },
  /*
   * Open a particular activity directly. `?view=worksheet_gen` is how a deep
   * link (or a print test) lands on the printable worksheet rather than the
   * course lessons the page opens on by default. The worksheet is generated
   * either way -- printing must work from any view -- but it is only *visible*
   * on screen when its own tab is showing.
   */
  view: {
    type: 'string',
    apply: (c, v) => setActivityMode(v)
  }
};

function setPrintClockCount(value) {
  clockState.printCount = parseInt(value, 10) || 12;
  return generatePrintableClocks();
}

function setPrintClockCols(value) {
  clockState.printCols = parseInt(value, 10) || 4;
  return generatePrintableClocks();
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
  
  // Highlight active sidebar button
  document.querySelectorAll('.activity-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-mode') === mode);
  });

  // Hide all activity stages
  document.querySelectorAll('.activity-stage').forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });

  // Map mode to target view section
  const modeMap = {
    'course_lessons': 'view-course-lessons',
    'read_clock': 'view-read-clock',
    'set_clock': 'view-set-clock',
    'jump_builder': 'view-jump-builder',
    'elapsed_time': 'view-elapsed-time',
    'word_problems': 'view-word-problems',
    'waterloo_puzzles': 'view-waterloo-puzzles',
    'worksheet_gen': 'view-worksheet-gen'
  };

  const targetId = modeMap[mode];
  if (targetId) {
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.classList.remove('hidden');
      targetEl.classList.add('active');
    }
  }

  // Trigger generators for active mode
  if (mode === 'read_clock') generateNewReadClockQuestion();
  else if (mode === 'set_clock') generateNewSetClockQuestion();
  else if (mode === 'jump_builder') generateNewJumpBuilderChallenge();
  else if (mode === 'elapsed_time') generateNewElapsedQuestion();
  else if (mode === 'word_problems') generateNewStoryProblem();
  else if (mode === 'waterloo_puzzles') renderContestPuzzle();
  // The worksheet is generated on load, so entering this view need not
  // rebuild it -- and must not, or it would discard a sheet the user is
  // looking at. Regeneration is explicit: the Generate button, the answers
  // toggle, or a count/column change.
}

function updatePrecision(val) {
  clockState.precision = val;
  if (clockState.currentMode === 'read_clock') generateNewReadClockQuestion();
  if (clockState.currentMode === 'set_clock') generateNewSetClockQuestion();
  if (clockState.currentMode === 'worksheet_gen') generatePrintableClocks();
}

function unlockBadge(badgeId, badgeTitle) {
  if (!clockState.badges.includes(badgeId)) {
    clockState.badges.push(badgeId);
    const badgeEl = document.getElementById('clock-badge-count');
    if (badgeEl) badgeEl.textContent = `${clockState.badges.length}/6 Badges`;
  }
}

function updateStats() {
  const scoreEl = document.getElementById('clock-score');
  const streakEl = document.getElementById('clock-streak');
  if (scoreEl) scoreEl.textContent = clockState.score;
  if (streakEl) streakEl.textContent = clockState.streak;
}

// Confetti Particle System
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let confettiParticles = [];

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  if (!canvas || !ctx) return;
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
  if (!canvas || !ctx) return;
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
  const minInp = document.getElementById('read-minute-input');
  const hrInp = document.getElementById('read-hour-input');
  const elMinInp = document.getElementById('elapsed-mins-input');

  if (minInp) minInp.addEventListener('keyup', (e) => { if (e.key === 'Enter') checkReadClockAnswer(); });
  if (hrInp) hrInp.addEventListener('keyup', (e) => { if (e.key === 'Enter') checkReadClockAnswer(); });
  if (elMinInp) elMinInp.addEventListener('keyup', (e) => { if (e.key === 'Enter') checkElapsedTimeAnswer(); });

  // Start with course lessons
  setActivityMode('course_lessons');

  /*
   * Build the printable worksheet up front, whichever view is showing.
   * The print stylesheet force-shows #view-worksheet-gen, so the top-bar
   * Print button can be pressed from anywhere -- and used to produce a sheet
   * with a header, a footer and no clocks at all.
   */
  if (typeof SFUrl !== 'undefined') SFUrl.read(CLOCK_URL_SCHEMA, clockState);
  generatePrintableClocks();
});

/*
 * Last line of defence. If anything ever empties the grid, regenerate before
 * the print dialog rather than sending blank paper to the printer.
 */
window.addEventListener('beforeprint', () => {
  const grid = document.querySelector('#printable-clock-doc .printable-clocks-grid');
  if (!grid || !grid.children.length) generatePrintableClocks();
});
