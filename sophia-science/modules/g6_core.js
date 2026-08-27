/**
 * StudyFlix - Grade 6 Ontario Strand Core
 * ---------------------------------------------------------------------------
 * One engine, four strands. Every Grade 6 Ontario strand (Biodiversity,
 * Flight, Space, Electricity) is a self-contained module that calls
 * SFG6.register() with its lab stations and its three question tiers. This
 * file owns everything the four have in common:
 *
 *   1. Mounting  - builds the shell tab, the tab section, the station
 *                  switcher and the arena markup, so a strand module only
 *                  ever writes the science that makes it different.
 *   2. Arena     - the 3-tier engine from CURRICULUM_STYLE_GUIDE.md section 4:
 *                  Tier 1 Ontario Benchmark, Tier 2 Enriched Deep Thinker,
 *                  Tier 3 Waterloo CEMC Challenge, each with a hint and a
 *                  worked step-by-step solution.
 *   3. Rewards   - XP and badges go through the studio's own addXP() and
 *                  unlockBadge(), which already write to the ONE shared
 *                  SFProgress record. A strand must never invent a counter.
 *
 * Mounting happens synchronously at script-execution time, not on
 * DOMContentLoaded, so that app.js's initUI() sees these tabs when it binds
 * tab clicks and resolves the deep link in handleHashNavigation().
 */
(function (global) {
  'use strict';

  var GROUP_LABEL = 'Grade 6 Ontario';
  var PROGRESS_KEY = 'sophia_science_g6_progress';

  var topics = {};
  var groupMarked = false;

  /* -----------------------------------------------------------------------
     Small helpers
     -------------------------------------------------------------------- */

  function el(id) { return document.getElementById(id); }

  function icon(name, size) {
    return (global.SFIcons && SFIcons.has(name))
      ? SFIcons.icon(name, { size: size || 16 })
      : '';
  }

  /** Studio hooks. Guarded so a strand module still renders if opened alone. */
  function awardXp(n) { if (typeof global.addXP === 'function') global.addXP(n); }
  function sound(kind) { if (typeof global.playSound === 'function') global.playSound(kind); }
  function confetti() { if (typeof global.launchConfetti === 'function') global.launchConfetti(); }
  function badge(id) { if (typeof global.unlockBadge === 'function') global.unlockBadge(id); }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /** Fisher-Yates, so a retry does not replay the same order. */
  function shuffled(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* -----------------------------------------------------------------------
     Best-score record, so a badge means "mastered every tier", not
     "clicked through every tier".
     -------------------------------------------------------------------- */

  function readProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function writeBest(topicId, tierIndex, pct) {
    var all = readProgress();
    var rec = all[topicId] || {};
    var key = 't' + (tierIndex + 1);
    if (!(rec[key] >= pct)) rec[key] = pct;
    all[topicId] = rec;
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); }
    catch (e) { /* quota / private mode: the run still counted for XP */ }
    return rec;
  }

  function bestFor(topicId, tierIndex) {
    var rec = readProgress()[topicId] || {};
    return rec['t' + (tierIndex + 1)] || 0;
  }

  /* -----------------------------------------------------------------------
     Mounting
     -------------------------------------------------------------------- */

  /** A labelled divider so eleven tabs still read as two groups, not a wall. */
  function markGroup(bar) {
    if (groupMarked) return;
    var mark = document.createElement('span');
    mark.className = 'sf-tab-group-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.innerHTML = '<span class="sf-tab-group-rule"></span><span>' + GROUP_LABEL + '</span>';
    bar.appendChild(mark);
    groupMarked = true;
  }

  function buildTab(topic) {
    var bar = document.querySelector('.sf-shell-tabs');
    if (!bar) return;
    markGroup(bar);

    var btn = document.createElement('button');
    btn.className = 'sf-shell-tab sf-shell-tab--g6';
    btn.type = 'button';
    btn.setAttribute('data-tab', topic.tabId);
    btn.innerHTML = '<span data-sf-icon="' + topic.icon + '" data-sf-size="17"></span>' +
      '<span>' + escapeHtml(topic.tabLabel) + '</span>';
    // Bound here as well as in app.js's initUI, so the tab works no matter
    // which script ran first.
    btn.addEventListener('click', function () { activate(topic.tabId); });
    bar.appendChild(btn);
  }

  function activate(tabId) {
    if (typeof global.switchTab === 'function') { global.switchTab(tabId); return; }
    var i, tabs = document.querySelectorAll('.sf-shell-tab');
    for (i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].getAttribute('data-tab') === tabId);
    }
    var panes = document.querySelectorAll('.tab-content');
    for (i = 0; i < panes.length; i++) {
      panes[i].classList.toggle('active', panes[i].id === tabId);
    }
  }

  function stationNavMarkup(topic) {
    var out = '<div class="g6-station-nav" role="tablist">';
    for (var i = 0; i < topic.stations.length; i++) {
      var st = topic.stations[i];
      out += '<button type="button" class="g6-station-btn' + (i === 0 ? ' active' : '') +
        '" data-station="' + st.id + '">' +
        '<span data-sf-icon="' + (st.icon || 'microscope') + '" data-sf-size="16"></span>' +
        '<span>' + (i + 1) + '. ' + escapeHtml(st.label) + '</span></button>';
    }
    return out + '</div>';
  }

  function stationPanesMarkup(topic) {
    var out = '<div class="g6-stations">';
    for (var i = 0; i < topic.stations.length; i++) {
      var st = topic.stations[i];
      out += '<div class="g6-station' + (i === 0 ? ' active' : '') +
        '" id="' + topic.prefix + '-station-' + st.id + '">' +
        '<div class="g6-station-head">' +
        '<span class="g6-station-tag">' + escapeHtml(st.tag || 'INTERACTIVE LAB') + '</span>' +
        '<h3>' + escapeHtml(st.title || st.label) + '</h3>' +
        (st.blurb ? '<p>' + st.blurb + '</p>' : '') +
        '</div>' +
        '<div class="g6-station-body" id="' + topic.prefix + '-body-' + st.id + '"></div>' +
        '</div>';
    }
    return out + '</div>';
  }

  function arenaMarkup(topic) {
    var p = topic.prefix;
    var cards = '';
    for (var i = 0; i < topic.tiers.length; i++) {
      var tier = topic.tiers[i];
      cards += '<button type="button" class="g6-tier-card g6-tier-' + (i + 1) + '" data-tier="' + i + '">' +
        '<span class="g6-tier-stars">' + new Array(i + 2).join('*') + '</span>' +
        '<span class="g6-tier-name">Tier ' + (i + 1) + ': ' + escapeHtml(tier.name) + '</span>' +
        '<span class="g6-tier-desc">' + escapeHtml(tier.desc) + '</span>' +
        '<span class="g6-tier-meta">' + tier.questions.length + ' questions &bull; ' +
        tier.xp + ' XP each</span>' +
        '<span class="g6-tier-best" id="' + p + '-best-' + i + '"></span>' +
        '</button>';
    }

    return '' +
      '<div class="g6-arena" id="' + p + '-arena">' +
        '<div class="g6-arena-head">' +
          '<h3>' + escapeHtml(topic.title) + ' Challenge Arena</h3>' +
          '<p>Three tiers, straight out of the StudyFlix difficulty ladder. Clear all three ' +
            'to unlock the ' + escapeHtml(topic.badgeName) + ' trophy.</p>' +
        '</div>' +
        '<div class="g6-tier-grid" id="' + p + '-tiers">' + cards + '</div>' +

        '<div class="g6-play hidden" id="' + p + '-play">' +
          '<div class="g6-play-top">' +
            '<span class="g6-play-tier" id="' + p + '-play-tier"></span>' +
            '<span class="g6-play-step" id="' + p + '-play-step"></span>' +
          '</div>' +
          '<div class="g6-progress"><div class="g6-progress-fill" id="' + p + '-play-fill"></div></div>' +
          '<p class="g6-question" id="' + p + '-question"></p>' +
          '<div class="g6-options" id="' + p + '-options"></div>' +
          '<div class="g6-hint hidden" id="' + p + '-hint"></div>' +
          '<div class="g6-feedback hidden" id="' + p + '-feedback"></div>' +
          '<div class="g6-play-actions">' +
            '<button type="button" class="sf-btn sf-btn--explore g6-hint-btn" id="' + p + '-hint-btn">' +
              '<span data-sf-icon="lightbulb" data-sf-size="17"></span><span>Show a Hint</span></button>' +
            '<button type="button" class="sf-btn sf-btn--play hidden" id="' + p + '-next-btn">' +
              '<span>Next Question</span><span data-sf-icon="chevronRight" data-sf-size="17"></span></button>' +
            '<button type="button" class="g6-quit-btn" id="' + p + '-quit-btn">Leave the arena</button>' +
          '</div>' +
        '</div>' +

        '<div class="g6-result hidden" id="' + p + '-result"></div>' +
      '</div>';
  }

  function buildSection(topic) {
    var main = document.querySelector('.main-container');
    if (!main) return;

    var section = document.createElement('section');
    section.id = topic.tabId;
    section.className = 'tab-content g6-tab';

    var expectations = '';
    for (var i = 0; i < topic.expectations.length; i++) {
      expectations += '<li>' + escapeHtml(topic.expectations[i]) + '</li>';
    }

    section.innerHTML = '' +
      '<div class="section-header-box g6-header">' +
        '<span class="g6-strand-tag">' + escapeHtml(topic.strandTag) + '</span>' +
        '<h2>' + escapeHtml(topic.title) + '</h2>' +
        '<p>' + topic.intro + '</p>' +
        '<details class="g6-expectations">' +
          '<summary>Ontario curriculum expectations covered here</summary>' +
          '<ul>' + expectations + '</ul>' +
          '<p class="g6-expectations-note">Ontario Science and Technology, Grades 1-8 (2022), Grade 6.</p>' +
        '</details>' +
      '</div>' +
      stationNavMarkup(topic) +
      stationPanesMarkup(topic) +
      arenaMarkup(topic);

    main.appendChild(section);
  }

  function wireStations(topic) {
    var section = el(topic.tabId);
    var buttons = section.querySelectorAll('.g6-station-btn');
    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          showStation(topic, btn.getAttribute('data-station'));
        });
      })(buttons[i]);
    }
  }

  function showStation(topic, stationId) {
    var section = el(topic.tabId);
    var buttons = section.querySelectorAll('.g6-station-btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('active', buttons[i].getAttribute('data-station') === stationId);
    }
    var panes = section.querySelectorAll('.g6-station');
    for (var j = 0; j < panes.length; j++) {
      panes[j].classList.toggle('active', panes[j].id === topic.prefix + '-station-' + stationId);
    }
    var st = topic.stationById[stationId];
    if (st && typeof st.onShow === 'function') st.onShow();
  }

  /* -----------------------------------------------------------------------
     The 3-tier arena
     -------------------------------------------------------------------- */

  function refreshTierCards(topic) {
    for (var i = 0; i < topic.tiers.length; i++) {
      var node = el(topic.prefix + '-best-' + i);
      if (!node) continue;
      var best = bestFor(topic.id, i);
      if (best >= 80) {
        node.className = 'g6-tier-best cleared';
        node.innerHTML = icon('check', 14) + '<span>Cleared &bull; best ' + best + '%</span>';
      } else if (best > 0) {
        node.className = 'g6-tier-best tried';
        node.innerHTML = '<span>Best so far ' + best + '% &bull; reach 80% to clear</span>';
      } else {
        node.className = 'g6-tier-best';
        node.innerHTML = '<span>Not attempted yet</span>';
      }
    }
  }

  function startTier(topic, tierIndex) {
    var tier = topic.tiers[tierIndex];
    topic.run = {
      tierIndex: tierIndex,
      questions: shuffled(tier.questions),
      index: 0,
      score: 0,
      answered: false
    };

    el(topic.prefix + '-tiers').classList.add('hidden');
    el(topic.prefix + '-result').classList.add('hidden');
    el(topic.prefix + '-play').classList.remove('hidden');
    renderQuestion(topic);
  }

  function renderQuestion(topic) {
    var p = topic.prefix;
    var run = topic.run;
    var tier = topic.tiers[run.tierIndex];
    var q = run.questions[run.index];
    run.answered = false;

    el(p + '-play-tier').textContent = 'Tier ' + (run.tierIndex + 1) + ': ' + tier.name;
    el(p + '-play-step').textContent = 'Question ' + (run.index + 1) + ' of ' + run.questions.length;
    el(p + '-play-fill').style.width = (run.index / run.questions.length * 100) + '%';
    el(p + '-question').innerHTML = q.q;

    var hint = el(p + '-hint');
    hint.classList.add('hidden');
    hint.innerHTML = '';
    var feedback = el(p + '-feedback');
    feedback.classList.add('hidden');
    feedback.innerHTML = '';
    el(p + '-next-btn').classList.add('hidden');
    el(p + '-hint-btn').classList.remove('hidden');

    var box = el(p + '-options');
    box.innerHTML = '';
    for (var i = 0; i < q.options.length; i++) {
      (function (idx, text) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'g6-option';
        btn.innerHTML = '<span class="g6-option-key">' + 'ABCD'.charAt(idx) + '</span>' +
          '<span class="g6-option-text">' + text + '</span>';
        btn.addEventListener('click', function () { answer(topic, idx); });
        box.appendChild(btn);
      })(i, q.options[i]);
    }

    if (global.SFIcons) SFIcons.upgrade(el(p + '-play'));
  }

  function answer(topic, choice) {
    var p = topic.prefix;
    var run = topic.run;
    if (run.answered) return;
    run.answered = true;

    var q = run.questions[run.index];
    var tier = topic.tiers[run.tierIndex];
    var correct = (choice === q.ans);
    var buttons = el(p + '-options').querySelectorAll('.g6-option');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      if (i === q.ans) buttons[i].classList.add('correct');
      else if (i === choice) buttons[i].classList.add('wrong');
    }

    if (correct) {
      run.score++;
      awardXp(tier.xp);
      sound('correct');
    } else {
      sound('wrong');
    }

    var steps = '';
    for (var s = 0; s < q.solution.length; s++) {
      steps += '<li>' + q.solution[s] + '</li>';
    }

    var feedback = el(p + '-feedback');
    feedback.className = 'g6-feedback ' + (correct ? 'is-correct' : 'is-wrong');
    feedback.innerHTML =
      '<p class="g6-feedback-title">' +
        (correct
          ? icon('check', 18) + '<span>Correct, Sophia! +' + tier.xp + ' XP</span>'
          : icon('lightbulb', 18) + '<span>Not quite. The answer is ' +
            'ABCD'.charAt(q.ans) + ': ' + q.options[q.ans] + '</span>') +
      '</p>' +
      '<p class="g6-feedback-lead">Step by step:</p>' +
      '<ol class="g6-solution">' + steps + '</ol>';
    feedback.classList.remove('hidden');

    el(p + '-hint-btn').classList.add('hidden');
    var next = el(p + '-next-btn');
    next.querySelector('span').textContent =
      (run.index === run.questions.length - 1) ? 'See My Results' : 'Next Question';
    next.classList.remove('hidden');

    if (global.SFIcons) SFIcons.upgrade(feedback);
  }

  function showHint(topic) {
    var p = topic.prefix;
    var q = topic.run.questions[topic.run.index];
    var hint = el(p + '-hint');
    hint.innerHTML = icon('lightbulb', 16) + '<span><strong>Hint:</strong> ' + q.hint + '</span>';
    hint.classList.remove('hidden');
    el(p + '-hint-btn').classList.add('hidden');
    if (global.SFIcons) SFIcons.upgrade(hint);
  }

  function nextQuestion(topic) {
    var run = topic.run;
    if (run.index < run.questions.length - 1) {
      run.index++;
      renderQuestion(topic);
    } else {
      finishTier(topic);
    }
  }

  /** A topic badge is earned only once every tier has been cleared at 80%+. */
  function checkBadge(topic) {
    for (var i = 0; i < topic.tiers.length; i++) {
      if (bestFor(topic.id, i) < 80) return false;
    }
    badge(topic.badgeId);
    return true;
  }

  function finishTier(topic) {
    var p = topic.prefix;
    var run = topic.run;
    var total = run.questions.length;
    var pct = Math.round(run.score / total * 100);
    var tier = topic.tiers[run.tierIndex];

    writeBest(topic.id, run.tierIndex, pct);
    refreshTierCards(topic);

    var cleared = pct >= 80;
    var earnedBadge = cleared ? checkBadge(topic) : false;

    if (cleared) { confetti(); sound('fanfare'); }

    var headline = pct === 100
      ? 'Flawless run!'
      : cleared ? 'Tier cleared!' : 'Good effort - one more run will do it.';

    el(p + '-play').classList.add('hidden');
    var result = el(p + '-result');
    result.className = 'g6-result ' + (cleared ? 'is-cleared' : 'is-retry');
    result.innerHTML =
      '<div class="g6-result-score">' + pct + '%</div>' +
      '<h3>' + headline + '</h3>' +
      '<p>You answered <strong>' + run.score + ' of ' + total + '</strong> correctly on ' +
        'Tier ' + (run.tierIndex + 1) + ': ' + escapeHtml(tier.name) + ', earning ' +
        '<strong>' + (run.score * tier.xp) + ' XP</strong>.</p>' +
      (earnedBadge
        ? '<p class="g6-result-badge">' + icon('trophy', 18) +
          '<span>Trophy unlocked: ' + escapeHtml(topic.badgeName) + '</span></p>'
        : cleared
          ? '<p class="g6-result-note">Clear all three tiers at 80% or better to unlock the ' +
            escapeHtml(topic.badgeName) + ' trophy.</p>'
          : '<p class="g6-result-note">Reach 80% to clear this tier. Every hint and worked ' +
            'solution stays available while you practise.</p>') +
      '<div class="g6-result-actions">' +
        '<button type="button" class="sf-btn sf-btn--play" data-act="retry">' +
          '<span data-sf-icon="refresh" data-sf-size="17"></span><span>Try This Tier Again</span></button>' +
        '<button type="button" class="sf-btn sf-btn--explore" data-act="menu">' +
          '<span data-sf-icon="grid" data-sf-size="17"></span><span>Choose Another Tier</span></button>' +
      '</div>';
    result.classList.remove('hidden');

    var retry = result.querySelector('[data-act="retry"]');
    retry.addEventListener('click', function () { startTier(topic, run.tierIndex); });
    result.querySelector('[data-act="menu"]').addEventListener('click', function () {
      showTierMenu(topic);
    });

    if (global.SFIcons) SFIcons.upgrade(result);
  }

  function showTierMenu(topic) {
    el(topic.prefix + '-play').classList.add('hidden');
    el(topic.prefix + '-result').classList.add('hidden');
    el(topic.prefix + '-tiers').classList.remove('hidden');
    refreshTierCards(topic);
  }

  function wireArena(topic) {
    var p = topic.prefix;
    var cards = el(p + '-tiers').querySelectorAll('.g6-tier-card');
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        card.addEventListener('click', function () {
          startTier(topic, parseInt(card.getAttribute('data-tier'), 10));
        });
      })(cards[i]);
    }
    el(p + '-hint-btn').addEventListener('click', function () { showHint(topic); });
    el(p + '-next-btn').addEventListener('click', function () { nextQuestion(topic); });
    el(p + '-quit-btn').addEventListener('click', function () { showTierMenu(topic); });
    refreshTierCards(topic);
  }

  /* -----------------------------------------------------------------------
     Shared lab controls
     Every strand builds the same range sliders and readout tiles, so the
     markup lives here once rather than three times over.
     -------------------------------------------------------------------- */

  /** A labelled range input whose current value is echoed beside the label. */
  function slider(id, label, value, min, max, step, unit) {
    return '<div class="g6-control">' +
      '<label for="' + id + '"><span>' + label + '</span>' +
      '<span class="g6-control-value" id="' + id + '-out">' + value + ' ' + unit + '</span></label>' +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step +
      '" value="' + value + '" data-unit="' + unit + '"></div>';
  }

  /** Wire a slider built by slider(): keeps the echo in sync, then calls fn. */
  function bindSlider(id, fn) {
    var input = el(id);
    if (!input) return;
    input.addEventListener('input', function () {
      var v = parseFloat(input.value);
      var out = el(id + '-out');
      if (out) out.textContent = v + ' ' + input.getAttribute('data-unit');
      fn(v);
    });
  }

  /** Move a slider from code, e.g. from a preset button. */
  function setSlider(id, value) {
    var input = el(id);
    if (!input) return;
    input.value = value;
    var out = el(id + '-out');
    if (out) out.textContent = value + ' ' + input.getAttribute('data-unit');
  }

  function stat(id, label) {
    return '<div class="g6-stat" id="' + id + '-box"><span class="g6-stat-label">' +
      label + '</span><span class="g6-stat-value" id="' + id + '">-</span></div>';
  }

  /** @param {string} tone '' | 'good' | 'warn' | 'bad' */
  function setStat(id, value, tone) {
    var v = el(id);
    if (!v) return;
    v.textContent = value;
    var box = el(id + '-box');
    if (box) box.className = 'g6-stat' + (tone ? ' g6-stat--' + tone : '');
  }

  /** SVG-safe text. Station labels come from data, so they get escaped. */
  function svgText(t) {
    return String(t).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  }

  /* -----------------------------------------------------------------------
     Public API
     -------------------------------------------------------------------- */

  /**
   * @param {object} topic
   *   id            short strand id, e.g. 'biodiversity'
   *   tabLabel      text on the shell tab
   *   icon          SFIcons glyph name
   *   strandTag     e.g. 'STRAND B - LIFE SYSTEMS'
   *   title, intro  section heading and lead paragraph
   *   expectations  array of verbatim Ontario overall expectations
   *   badgeId       badge key, matching an entry in app.js BADGES
   *   badgeName     human title of that badge
   *   stations      [{id, label, icon, tag, title, blurb, render(el), onShow}]
   *   tiers         [{name, desc, xp, questions:[{q, options, ans, hint, solution}]}]
   */
  function register(topic) {
    topic.tabId = 'tab-' + topic.id;
    topic.prefix = 'g6-' + topic.id;
    topic.stationById = {};
    for (var i = 0; i < topic.stations.length; i++) {
      topic.stationById[topic.stations[i].id] = topic.stations[i];
    }
    topics[topic.id] = topic;

    buildTab(topic);
    buildSection(topic);
    wireStations(topic);
    wireArena(topic);

    // Each station draws itself once, into the body element the core made.
    for (var s = 0; s < topic.stations.length; s++) {
      var st = topic.stations[s];
      var body = el(topic.prefix + '-body-' + st.id);
      if (body && typeof st.render === 'function') st.render(body);
    }
    if (global.SFIcons) SFIcons.upgrade(el(topic.tabId));
  }

  global.SFG6 = {
    register: register,
    ui: {
      slider: slider, bind: bindSlider, setSlider: setSlider,
      stat: stat, setStat: setStat, svgText: svgText
    },
    open: activate,
    showStation: function (topicId, stationId) {
      var t = topics[topicId];
      if (t) { activate(t.tabId); showStation(t, stationId); }
    },
    get topics() { return topics; },
    bestFor: bestFor,
    PROGRESS_KEY: PROGRESS_KEY
  };
})(window);
