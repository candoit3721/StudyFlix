/**
 * StudyFlix - Grade 6 Ontario Strand B: Life Systems, Biodiversity
 * ---------------------------------------------------------------------------
 * B1. assess the importance of biodiversity, and describe ways of protecting
 *     biodiversity
 * B2. demonstrate an understanding of biodiversity, its contributions to the
 *     stability of natural systems, and its benefits to humans
 *
 * Three hands-on stations, all built on Ontario and Great Lakes species so the
 * science lands somewhere Sophia can actually visit:
 *   1. Six Kingdoms Sorter        - classification by observable characteristics
 *   2. Dichotomous Key Explorer   - the paired either/or logic of a real key
 *   3. Food Web Collapse          - what an invasive species does to stability
 */
(function (global) {
  'use strict';

  /* =======================================================================
     STATION 1 - Six Kingdoms Sorter
     ======================================================================= */

  var KINGDOMS = [
    { id: 'animalia', name: 'Animalia', note: 'Many cells, no cell wall, eats other living things, usually moves' },
    { id: 'plantae', name: 'Plantae', note: 'Many cells, cell wall, makes its own food by photosynthesis' },
    { id: 'fungi', name: 'Fungi', note: 'Cell wall of chitin, absorbs food from dead or living matter' },
    { id: 'protista', name: 'Protista', note: 'Mostly one cell, has a nucleus, lives in water or damp places' },
    { id: 'eubacteria', name: 'Eubacteria', note: 'One cell, NO nucleus, the common bacteria all around us' },
    { id: 'archaebacteria', name: 'Archaebacteria', note: 'One cell, no nucleus, survives extreme heat, salt or acid' }
  ];

  var ORGANISMS = [
    { id: 'maple', label: 'Sugar maple', emoji: 'leaf', kingdom: 'plantae', why: 'A tree makes its own food with chlorophyll and has a cellulose cell wall.' },
    { id: 'trillium', label: 'White trillium', emoji: 'leaf', kingdom: 'plantae', why: 'Ontario\'s provincial flower is a flowering plant, so it photosynthesises.' },
    { id: 'moose', label: 'Moose', emoji: 'species', kingdom: 'animalia', why: 'Many cells, no cell wall, eats plants and moves on its own.' },
    { id: 'monarch', label: 'Monarch butterfly', emoji: 'species', kingdom: 'animalia', why: 'An insect is a many-celled consumer, so it belongs with the animals.' },
    { id: 'morel', label: 'Morel mushroom', emoji: 'cell', kingdom: 'fungi', why: 'It absorbs nutrients from decaying matter and has a chitin cell wall.' },
    { id: 'mould', label: 'Bread mould', emoji: 'cell', kingdom: 'fungi', why: 'Mould feeds by absorbing food through thread-like hyphae.' },
    { id: 'amoeba', label: 'Amoeba', emoji: 'cell', kingdom: 'protista', why: 'One cell WITH a nucleus, moving by stretching out pseudopods.' },
    { id: 'paramecium', label: 'Paramecium', emoji: 'cell', kingdom: 'protista', why: 'A single pond-water cell with a nucleus and beating cilia.' },
    { id: 'ecoli', label: 'E. coli bacterium', emoji: 'cell', kingdom: 'eubacteria', why: 'One cell with NO nucleus, the ordinary bacteria found in guts and soil.' },
    { id: 'cyano', label: 'Lake Erie cyanobacteria', emoji: 'droplet', kingdom: 'eubacteria', why: 'Blue-green algal blooms are bacteria: one cell, no nucleus.' },
    { id: 'thermo', label: 'Hot spring thermophile', emoji: 'flame', kingdom: 'archaebacteria', why: 'Archaebacteria are the extremophiles, thriving above 80 degrees C.' },
    { id: 'halo', label: 'Salt flat halophile', emoji: 'droplet', kingdom: 'archaebacteria', why: 'It survives salt concentrations that would kill ordinary bacteria.' }
  ];

  var sorter = { picked: null, placed: {}, wrong: 0 };

  function renderSorter(host) {
    var pool = '';
    for (var i = 0; i < ORGANISMS.length; i++) {
      var o = ORGANISMS[i];
      pool += '<button type="button" class="bio-org" data-org="' + o.id + '">' +
        '<span data-sf-icon="' + o.emoji + '" data-sf-size="16"></span>' +
        '<span>' + o.label + '</span></button>';
    }

    var bins = '';
    for (var k = 0; k < KINGDOMS.length; k++) {
      var kd = KINGDOMS[k];
      bins += '<button type="button" class="bio-bin" data-kingdom="' + kd.id + '">' +
        '<span class="bio-bin-name">' + kd.name + '</span>' +
        '<span class="bio-bin-note">' + kd.note + '</span>' +
        '<span class="bio-bin-slots" id="bio-slots-' + kd.id + '"></span>' +
        '</button>';
    }

    host.innerHTML =
      '<p class="g6-note"><strong>How to play:</strong> click an organism to pick it up, ' +
        'then click the kingdom it belongs to. Classification is always based on ' +
        '<strong>observable characteristics</strong>: how many cells, is there a nucleus, ' +
        'is there a cell wall, and how does it get its food?</p>' +
      '<div class="bio-pool" id="bio-pool">' + pool + '</div>' +
      '<div class="bio-bins">' + bins + '</div>' +
      '<div class="g6-readout" style="margin-top:18px">' +
        '<div class="g6-stat g6-stat--good"><span class="g6-stat-label">Correctly sorted</span>' +
          '<span class="g6-stat-value" id="bio-sorted">0 / 12</span></div>' +
        '<div class="g6-stat"><span class="g6-stat-label">Mis-sorts</span>' +
          '<span class="g6-stat-value" id="bio-wrong">0</span></div>' +
        '<div class="g6-stat"><span class="g6-stat-label">Now holding</span>' +
          '<span class="g6-stat-value" id="bio-holding">nothing</span></div>' +
      '</div>' +
      '<p class="bio-feedback" id="bio-feedback"></p>' +
      '<div class="g6-play-actions"><button type="button" class="sf-btn sf-btn--explore" id="bio-reset">' +
        '<span data-sf-icon="refresh" data-sf-size="17"></span><span>Reset the Sorter</span></button></div>';

    host.querySelectorAll('.bio-org').forEach(function (btn) {
      btn.addEventListener('click', function () { pickOrganism(btn.getAttribute('data-org')); });
    });
    host.querySelectorAll('.bio-bin').forEach(function (btn) {
      btn.addEventListener('click', function () { dropIn(btn.getAttribute('data-kingdom')); });
    });
    document.getElementById('bio-reset').addEventListener('click', function () { resetSorter(host); });
  }

  function organismById(id) {
    for (var i = 0; i < ORGANISMS.length; i++) if (ORGANISMS[i].id === id) return ORGANISMS[i];
    return null;
  }

  function pickOrganism(id) {
    if (sorter.placed[id]) return;
    sorter.picked = id;
    document.querySelectorAll('.bio-org').forEach(function (b) {
      b.classList.toggle('picked', b.getAttribute('data-org') === id);
    });
    var o = organismById(id);
    document.getElementById('bio-holding').textContent = o ? o.label : 'nothing';
    say('', '');
  }

  function say(kind, text) {
    var node = document.getElementById('bio-feedback');
    if (!node) return;
    node.className = 'bio-feedback' + (kind ? ' ' + kind : '');
    node.innerHTML = text;
  }

  function dropIn(kingdomId) {
    if (!sorter.picked) { say('is-warn', 'Pick up an organism first, then choose its kingdom.'); return; }
    var o = organismById(sorter.picked);
    var btn = document.querySelector('.bio-org[data-org="' + o.id + '"]');
    var bin = document.querySelector('.bio-bin[data-kingdom="' + kingdomId + '"]');

    if (o.kingdom === kingdomId) {
      sorter.placed[o.id] = kingdomId;
      sorter.picked = null;
      btn.classList.remove('picked');
      btn.classList.add('placed');
      btn.disabled = true;
      var slots = document.getElementById('bio-slots-' + kingdomId);
      slots.textContent = slots.textContent ? slots.textContent + ', ' + o.label : o.label;
      say('is-good', '<strong>' + o.label + ' is correct.</strong> ' + o.why);
      if (typeof global.playSound === 'function') global.playSound('correct');
      if (typeof global.addXP === 'function') global.addXP(5);
      document.getElementById('bio-holding').textContent = 'nothing';
      var done = Object.keys(sorter.placed).length;
      document.getElementById('bio-sorted').textContent = done + ' / 12';
      if (done === ORGANISMS.length) {
        say('is-good', '<strong>All six kingdoms filled.</strong> That is biodiversity ' +
          '<em>between species</em>: twelve organisms, six completely different ways of being alive.');
        if (typeof global.launchConfetti === 'function') global.launchConfetti();
        if (typeof global.playSound === 'function') global.playSound('fanfare');
      }
    } else {
      sorter.wrong++;
      document.getElementById('bio-wrong').textContent = sorter.wrong;
      bin.classList.add('shake');
      setTimeout(function () { bin.classList.remove('shake'); }, 420);
      say('is-bad', 'Not that one. <strong>' + o.label + '</strong> - ' + o.why);
      if (typeof global.playSound === 'function') global.playSound('wrong');
    }
  }

  function resetSorter(host) {
    sorter = { picked: null, placed: {}, wrong: 0 };
    renderSorter(host);
    if (global.SFIcons) SFIcons.upgrade(host);
  }

  /* =======================================================================
     STATION 2 - Dichotomous Key Explorer
     ======================================================================= */

  var KEY = {
    k1: {
      q: 'Does the organism have a backbone?',
      a: { text: 'Yes - it has a backbone (vertebrate)', go: 'k2' },
      b: { text: 'No - it has no backbone (invertebrate)', go: 'k5' }
    },
    k2: {
      q: 'Is the body covered in feathers?',
      a: { text: 'Yes - feathers and a beak', species: 'loon' },
      b: { text: 'No feathers', go: 'k3' }
    },
    k3: {
      q: 'Is the skin moist and bare, or covered in fur?',
      a: { text: 'Moist bare skin, lays eggs in water', species: 'salamander' },
      b: { text: 'Covered in fur, feeds its young milk', go: 'k4' }
    },
    k4: {
      q: 'Look at the tail and the teeth.',
      a: { text: 'Broad flat scaly tail, orange gnawing incisors', species: 'beaver' },
      b: { text: 'Very long legs, broad palmate antlers', species: 'moose' }
    },
    k5: {
      q: 'Is there a hard outer shell in two hinged halves?',
      a: { text: 'Yes - two hinged halves', species: 'mussel' },
      b: { text: 'No two-part shell', go: 'k6' }
    },
    k6: {
      q: 'Count the legs.',
      a: { text: 'Six legs and two pairs of wings', species: 'monarch' },
      b: { text: 'Eight legs, no wings, no antennae', species: 'spider' }
    }
  };

  var SPECIES = {
    loon: { name: 'Common Loon', group: 'Vertebrate - Bird', fact: 'On the Canadian one dollar coin. Solid bones let it dive 60 m deep for fish.' },
    salamander: { name: 'Blue-spotted Salamander', group: 'Vertebrate - Amphibian', fact: 'Breathes partly through its damp skin, so it needs Ontario vernal pools to survive.' },
    beaver: { name: 'North American Beaver', group: 'Vertebrate - Mammal', fact: 'A keystone species: its dams create wetlands that dozens of other species depend on.' },
    moose: { name: 'Moose', group: 'Vertebrate - Mammal', fact: 'The largest deer on Earth. A bull in Algonquin can mass over 500 kg.' },
    mussel: { name: 'Zebra Mussel', group: 'Invertebrate - Mollusc', fact: 'INVASIVE. Arrived in Great Lakes ballast water in 1988 and now filters out the plankton native fish need.' },
    monarch: { name: 'Monarch Butterfly', group: 'Invertebrate - Insect', fact: 'Migrates 4 000 km from Ontario to Mexico. Listed as endangered in Canada.' },
    spider: { name: 'Wolf Spider', group: 'Invertebrate - Arachnid', fact: 'Eight legs, no antennae. It hunts on foot instead of spinning a web.' }
  };

  var keyState = { node: 'k1', trail: [] };

  function renderKey(host) {
    host.innerHTML =
      '<p class="g6-note"><strong>A dichotomous key</strong> asks a chain of questions with exactly ' +
        '<strong>two</strong> answers each. "Di" means two. Every answer either names the ' +
        'organism or sends you to the next pair, so any species can be identified by a ' +
        'scientist who has never seen it before.</p>' +
      '<div class="g6-lab-grid">' +
        '<div class="g6-canvas"><svg id="bio-key-svg" viewBox="0 0 560 340" ' +
          'role="img" aria-label="The path taken through the dichotomous key"></svg></div>' +
        '<div class="g6-controls" id="bio-key-panel"></div>' +
      '</div>';
    stepKey();
  }

  function stepKey() {
    var panel = document.getElementById('bio-key-panel');
    if (!panel) return;

    if (keyState.node === null) {
      var sp = SPECIES[keyState.result];
      panel.innerHTML =
        '<div class="bio-result">' +
          '<span class="g6-station-tag">IDENTIFIED</span>' +
          '<h4>' + sp.name + '</h4>' +
          '<p class="bio-result-group">' + sp.group + '</p>' +
          '<p>' + sp.fact + '</p>' +
          '<p class="bio-result-steps">Reached in <strong>' + keyState.trail.length +
            '</strong> paired questions.</p>' +
        '</div>' +
        '<button type="button" class="sf-btn sf-btn--play" id="bio-key-restart" style="border-radius:50px">' +
          '<span data-sf-icon="refresh" data-sf-size="17"></span><span>Run the Key Again</span></button>';
      document.getElementById('bio-key-restart').addEventListener('click', restartKey);
      if (typeof global.playSound === 'function') global.playSound('correct');
      if (typeof global.addXP === 'function') global.addXP(8);
    } else {
      var n = KEY[keyState.node];
      panel.innerHTML =
        '<p class="bio-key-step">Step ' + (keyState.trail.length + 1) + '</p>' +
        '<p class="bio-key-q">' + n.q + '</p>' +
        '<button type="button" class="bio-key-choice" data-branch="a">' +
          '<span class="bio-key-letter">a</span><span>' + n.a.text + '</span></button>' +
        '<button type="button" class="bio-key-choice" data-branch="b">' +
          '<span class="bio-key-letter">b</span><span>' + n.b.text + '</span></button>' +
        (keyState.trail.length
          ? '<button type="button" class="g6-quit-btn" id="bio-key-back" style="margin:6px 0 0">Start over</button>'
          : '');
      panel.querySelectorAll('.bio-key-choice').forEach(function (btn) {
        btn.addEventListener('click', function () { chooseBranch(btn.getAttribute('data-branch')); });
      });
      var back = document.getElementById('bio-key-back');
      if (back) back.addEventListener('click', restartKey);
    }

    drawKeyTrail();
    if (global.SFIcons) SFIcons.upgrade(document.getElementById('bio-key-panel'));
  }

  function chooseBranch(branch) {
    var n = KEY[keyState.node];
    var pick = n[branch];
    keyState.trail.push({ q: n.q, choice: pick.text, letter: branch });
    if (pick.species) {
      keyState.result = pick.species;
      keyState.node = null;
    } else {
      keyState.node = pick.go;
    }
    stepKey();
  }

  function restartKey() {
    keyState = { node: 'k1', trail: [] };
    stepKey();
  }

  /** The trail drawn as a descending ladder, which is how a printed key reads. */
  function drawKeyTrail() {
    var svg = document.getElementById('bio-key-svg');
    if (!svg) return;
    var s = '<rect width="560" height="340" fill="#f8fafc"/>';
    var rows = keyState.trail.length + (keyState.node ? 1 : 0);
    var step = rows > 0 ? Math.min(66, 300 / Math.max(rows, 1)) : 66;

    for (var i = 0; i < keyState.trail.length; i++) {
      var y = 26 + i * step;
      s += '<line x1="46" y1="' + y + '" x2="46" y2="' + (y + step) + '" stroke="#06b6d4" stroke-width="3"/>';
      s += '<circle cx="46" cy="' + y + '" r="13" fill="#06b6d4"/>';
      s += '<text x="46" y="' + (y + 4.5) + '" text-anchor="middle" font-family="Montserrat,sans-serif" ' +
        'font-size="12" font-weight="800" fill="#ffffff">' + (i + 1) + '</text>';
      s += '<text x="72" y="' + (y - 3) + '" font-family="Nunito,sans-serif" font-size="12.5" ' +
        'font-weight="800" fill="#0e7490">' + esc(keyState.trail[i].letter) + '. ' +
        esc(shorten(keyState.trail[i].choice, 52)) + '</text>';
      s += '<text x="72" y="' + (y + 14) + '" font-family="Nunito,sans-serif" font-size="11.5" ' +
        'fill="#64748b">' + esc(shorten(keyState.trail[i].q, 58)) + '</text>';
    }

    var yEnd = 26 + keyState.trail.length * step;
    if (keyState.node) {
      s += '<circle cx="46" cy="' + yEnd + '" r="13" fill="#ffffff" stroke="#06b6d4" stroke-width="3"/>';
      s += '<text x="46" y="' + (yEnd + 5) + '" text-anchor="middle" font-family="Montserrat,sans-serif" ' +
        'font-size="12" font-weight="800" fill="#0e7490">?</text>';
      s += '<text x="72" y="' + (yEnd + 4) + '" font-family="Nunito,sans-serif" font-size="12.5" ' +
        'font-weight="800" fill="#334155">' + esc(shorten(KEY[keyState.node].q, 54)) + '</text>';
    } else {
      var sp = SPECIES[keyState.result];
      s += '<circle cx="46" cy="' + yEnd + '" r="15" fill="#10b981"/>';
      s += '<path d="M39 ' + yEnd + ' l5 5 9-10" stroke="#ffffff" stroke-width="3" fill="none" ' +
        'stroke-linecap="round" stroke-linejoin="round"/>';
      s += '<text x="74" y="' + (yEnd + 1) + '" font-family="Montserrat,sans-serif" font-size="15" ' +
        'font-weight="800" fill="#047857">' + esc(sp.name) + '</text>';
      s += '<text x="74" y="' + (yEnd + 18) + '" font-family="Nunito,sans-serif" font-size="12" ' +
        'fill="#64748b">' + esc(sp.group) + '</text>';
    }

    if (!keyState.trail.length && keyState.node) {
      s += '<text x="280" y="300" text-anchor="middle" font-family="Nunito,sans-serif" ' +
        'font-size="12.5" fill="#94a3b8">Answer the question on the right to start the key.</text>';
    }
    svg.innerHTML = s;
  }

  function shorten(t, n) { return t.length > n ? t.slice(0, n - 1) + '…' : t; }
  function esc(t) {
    return String(t).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  }

  /* =======================================================================
     STATION 3 - Great Lakes Food Web Collapse
     ======================================================================= */

  var WEB = [
    { id: 'phyto', name: 'Phytoplankton', role: 'Producer', colour: '#10b981' },
    { id: 'zoo', name: 'Zooplankton', role: 'Primary consumer', colour: '#06b6d4' },
    { id: 'perch', name: 'Yellow perch', role: 'Secondary consumer', colour: '#3b82f6' },
    { id: 'trout', name: 'Lake trout', role: 'Top predator', colour: '#8b5cf6' },
    { id: 'eagle', name: 'Bald eagle', role: 'Apex predator', colour: '#f59e0b' }
  ];

  // Each scenario states where the five populations settle, as a percentage of
  // the healthy baseline. The numbers follow the documented Great Lakes record.
  var SCENARIOS = {
    healthy: {
      label: 'Healthy Lake Ontario',
      levels: { phyto: 100, zoo: 100, perch: 100, trout: 100, eagle: 100 },
      story: 'A balanced food web. Energy flows from producers upward, and only about ' +
        '<strong>10%</strong> of the energy at each level passes to the next, which is why ' +
        'there are far fewer eagles than phytoplankton.'
    },
    mussel: {
      label: 'Zebra mussels introduced',
      levels: { phyto: 32, zoo: 41, perch: 48, trout: 44, eagle: 52 },
      story: 'Zebra mussels arrived in ballast water in 1988. A single mussel filters about ' +
        '<strong>1 L of water a day</strong>, stripping out phytoplankton. The producers ' +
        'crash first, and every level above them follows. This is a <strong>bottom-up ' +
        'collapse</strong>.'
    },
    lamprey: {
      label: 'Sea lamprey introduced',
      levels: { phyto: 128, zoo: 62, perch: 155, trout: 18, eagle: 46 },
      story: 'The sea lamprey is a parasite that latches onto lake trout. With the top ' +
        'predator gone, perch are released and boom, they eat more zooplankton, and with ' +
        'fewer grazers the phytoplankton overgrows. This is a <strong>trophic cascade</strong> ' +
        'running top-down.'
    },
    both: {
      label: 'Both invaders present',
      levels: { phyto: 44, zoo: 26, perch: 61, trout: 9, eagle: 24 },
      story: 'Two invasive species at once. The web still has five species on paper, but ' +
        'three of them sit below a quarter of their healthy numbers. Low biodiversity means ' +
        'low <strong>stability</strong>: one more shock and a species is gone for good.'
    },
    restored: {
      label: 'Lampricide + ballast rules',
      levels: { phyto: 88, zoo: 84, perch: 92, trout: 76, eagle: 81 },
      story: 'Canada and the United States treat spawning streams with lampricide and now ' +
        'require ocean ballast exchange. Lake trout are recovering. <strong>Protecting ' +
        'biodiversity works</strong>, but recovery takes decades longer than the invasion did.'
    }
  };

  var web = { scenario: 'healthy', shown: {}, timer: null };

  function renderWeb(host) {
    var chips = '';
    for (var key in SCENARIOS) {
      if (!Object.prototype.hasOwnProperty.call(SCENARIOS, key)) continue;
      chips += '<button type="button" class="g6-chip' + (key === 'healthy' ? ' active' : '') +
        '" data-scenario="' + key + '">' + SCENARIOS[key].label + '</button>';
    }

    host.innerHTML =
      '<p class="g6-note"><strong>Biodiversity is what makes a natural system stable.</strong> ' +
        'Introduce an invasive species below and watch how far the shock travels through the ' +
        'Great Lakes food web. Bars show each population as a percentage of its healthy level.</p>' +
      '<div class="g6-chips" style="margin-bottom:18px">' + chips + '</div>' +
      '<div class="g6-canvas"><svg id="bio-web-svg" viewBox="0 0 620 300" role="img" ' +
        'aria-label="Population levels of five Great Lakes species"></svg></div>' +
      '<div class="g6-readout" style="margin-top:16px">' +
        '<div class="g6-stat"><span class="g6-stat-label">Scenario</span>' +
          '<span class="g6-stat-value" id="bio-web-scenario" style="font-size:0.95rem">Healthy</span></div>' +
        '<div class="g6-stat"><span class="g6-stat-label">Species above 25%</span>' +
          '<span class="g6-stat-value" id="bio-web-count">5 / 5</span></div>' +
        '<div class="g6-stat"><span class="g6-stat-label">Stability rating</span>' +
          '<span class="g6-stat-value" id="bio-web-stability">Stable</span></div>' +
      '</div>' +
      '<p class="g6-note" id="bio-web-story" style="margin-top:16px"></p>';

    host.querySelectorAll('[data-scenario]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        host.querySelectorAll('[data-scenario]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        setScenario(btn.getAttribute('data-scenario'));
      });
    });

    for (var i = 0; i < WEB.length; i++) web.shown[WEB[i].id] = 100;
    setScenario('healthy');
  }

  function setScenario(key) {
    web.scenario = key;
    var sc = SCENARIOS[key];
    document.getElementById('bio-web-scenario').textContent = sc.label;
    document.getElementById('bio-web-story').innerHTML = sc.story;

    var above = 0;
    for (var i = 0; i < WEB.length; i++) if (sc.levels[WEB[i].id] >= 25) above++;
    document.getElementById('bio-web-count').textContent = above + ' / 5';

    var stability = above === 5 ? 'Stable' : above >= 4 ? 'Stressed' : 'Collapsing';
    var stat = document.getElementById('bio-web-stability');
    stat.textContent = stability;
    stat.parentNode.className = 'g6-stat ' +
      (above === 5 ? 'g6-stat--good' : above >= 4 ? 'g6-stat--warn' : 'g6-stat--bad');

    animateWeb(sc.levels);
    if (typeof global.playSound === 'function') global.playSound(above === 5 ? 'correct' : 'wrong');
  }

  /** Ease the bars toward their new levels so the cascade is visible, not instant. */
  function animateWeb(target) {
    if (web.timer) clearInterval(web.timer);
    web.timer = setInterval(function () {
      var moving = false;
      for (var i = 0; i < WEB.length; i++) {
        var id = WEB[i].id;
        var diff = target[id] - web.shown[id];
        if (Math.abs(diff) > 0.6) { web.shown[id] += diff * 0.18; moving = true; }
        else { web.shown[id] = target[id]; }
      }
      drawWeb();
      if (!moving) { clearInterval(web.timer); web.timer = null; }
    }, 32);
  }

  function drawWeb() {
    var svg = document.getElementById('bio-web-svg');
    if (!svg) return;
    var baseY = 236, maxH = 186, slot = 116, left = 48;
    var s = '<rect width="620" height="300" fill="#f8fafc"/>';

    // 100% reference line, so "below baseline" is readable at a glance.
    s += '<line x1="30" y1="' + (baseY - maxH * 100 / 160) + '" x2="600" y2="' +
      (baseY - maxH * 100 / 160) + '" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="5 5"/>';
    // Parked in the empty band above every bar. At the right it covered the
    // last bar's own percentage; level with the line it covered the first.
    s += '<text x="30" y="22" font-family="Nunito,sans-serif" ' +
      'font-size="10.5" font-weight="700" fill="#94a3b8">' +
      'dashed line = the healthy 100% level</text>';

    for (var i = 0; i < WEB.length; i++) {
      var sp = WEB[i];
      var v = Math.max(0, web.shown[sp.id]);
      var h = Math.min(maxH, v / 160 * maxH);
      var x = left + i * slot;
      var y = baseY - h;
      var faded = v < 25;

      s += '<rect x="' + x + '" y="' + y + '" width="62" height="' + h + '" rx="8" fill="' +
        sp.colour + '" opacity="' + (faded ? 0.42 : 0.92) + '"/>';
      s += '<text x="' + (x + 31) + '" y="' + (y - 8) + '" text-anchor="middle" ' +
        'font-family="Space Mono,monospace" font-size="13" font-weight="700" fill="' +
        (faded ? '#b91c1c' : '#334155') + '">' + Math.round(v) + '%</text>';
      s += '<text x="' + (x + 31) + '" y="' + (baseY + 20) + '" text-anchor="middle" ' +
        'font-family="Nunito,sans-serif" font-size="11.5" font-weight="800" fill="#334155">' +
        esc(sp.name) + '</text>';
      s += '<text x="' + (x + 31) + '" y="' + (baseY + 35) + '" text-anchor="middle" ' +
        'font-family="Nunito,sans-serif" font-size="10" fill="#94a3b8">' + esc(sp.role) + '</text>';
      if (i < WEB.length - 1) {
        s += '<path d="M' + (x + 66) + ' ' + (baseY - 12) + ' h' + (slot - 70) +
          ' m-7 -5 l7 5 l-7 5" stroke="#94a3b8" stroke-width="2" fill="none" ' +
          'stroke-linecap="round" stroke-linejoin="round"/>';
      }
    }

    s += '<line x1="30" y1="' + baseY + '" x2="600" y2="' + baseY + '" stroke="#334155" stroke-width="2"/>';
    s += '<text x="30" y="' + (baseY + 56) + '" font-family="Nunito,sans-serif" font-size="10.5" ' +
      'fill="#94a3b8">Energy flows left to right. Only about 10% carries to the next level.</text>';
    svg.innerHTML = s;
  }

  /* =======================================================================
     Registration
     ======================================================================= */

  SFG6.register({
    id: 'biodiversity',
    tabLabel: 'Biodiversity',
    icon: 'species',
    strandTag: 'STRAND B - LIFE SYSTEMS',
    title: 'Biodiversity & Classification of Living Things',
    intro: 'Biodiversity is the variety of life on Earth, measured three ways: ' +
      '<strong>within</strong> a species, <strong>between</strong> species, and across ' +
      '<strong>ecosystems</strong>. Sort six kingdoms, run a real dichotomous key on Ontario ' +
      'species, then find out what one invasive mussel does to an entire Great Lakes food web.',
    expectations: [
      'B1. assess the importance of biodiversity, and describe ways of protecting biodiversity',
      'B2. demonstrate an understanding of biodiversity, its contributions to the stability of natural systems, and its benefits to humans'
    ],
    badgeId: 'biodiversity_ranger',
    badgeName: 'Biodiversity Ranger',
    stations: [
      {
        id: 'kingdoms', label: 'Six Kingdoms Sorter', icon: 'species',
        tag: 'CLASSIFICATION LAB',
        title: 'Station 1: Sort Twelve Organisms into Six Kingdoms',
        blurb: 'Scientists group living things by observable characteristics, not by where they live. Test yourself on Ontario and Great Lakes organisms.',
        render: renderSorter
      },
      {
        id: 'key', label: 'Dichotomous Key', icon: 'quest',
        tag: 'IDENTIFICATION LAB',
        title: 'Station 2: Run a Dichotomous Key on Ontario Species',
        blurb: 'Two choices at every step, all the way down to a named species. This is the tool a field biologist actually carries.',
        render: renderKey
      },
      {
        id: 'web', label: 'Food Web Collapse', icon: 'chartLine',
        tag: 'STABILITY SIMULATOR',
        title: 'Station 3: Invasive Species & the Great Lakes Food Web',
        blurb: 'Release a zebra mussel or a sea lamprey into Lake Ontario and watch the shock travel through every trophic level.',
        render: renderWeb
      }
    ],
    tiers: [
      {
        name: 'Ontario Core',
        desc: 'The Grade 6 benchmark: kingdoms, vertebrates, invertebrates and what biodiversity means.',
        xp: 10,
        questions: [
          {
            q: 'Which kingdom contains organisms made of a single cell that has <strong>no nucleus</strong> and that survive in boiling, acidic hot springs?',
            options: ['Archaebacteria', 'Fungi', 'Protista', 'Plantae'],
            ans: 0,
            hint: 'The prefix "archae" means ancient. These are the extremophiles.',
            solution: [
              'Both Eubacteria and Archaebacteria are single cells with <strong>no nucleus</strong>.',
              'Eubacteria are the ordinary bacteria of soil, water and our own bodies.',
              'Archaebacteria are the ones adapted to extremes: boiling vents, high salt, strong acid.',
              'A hot spring at 85 degrees C is an extreme habitat, so the answer is <strong>Archaebacteria</strong>.'
            ]
          },
          {
            q: 'A moose, a common loon and a blue-spotted salamander are all <strong>vertebrates</strong>. What single feature puts them in that group?',
            options: ['They all have fur', 'They all have a backbone', 'They all lay eggs', 'They all live in water'],
            ans: 1,
            hint: 'Take the word apart. "Vertebra" is a single bone of the spine.',
            solution: [
              'Vertebrates are defined by one structure: an internal <strong>backbone</strong> made of vertebrae.',
              'Fur is only true of the moose, so it cannot be the shared feature.',
              'Only the loon and salamander lay eggs, so that fails too.',
              'The backbone is the only feature all three share: <strong>they all have a backbone</strong>.'
            ]
          },
          {
            q: 'Which of these Great Lakes organisms is an <strong>invertebrate</strong>?',
            options: ['Yellow perch', 'Zebra mussel', 'Lake trout', 'Bald eagle'],
            ans: 1,
            hint: 'Three of these are fish or birds. One has a shell instead of a skeleton.',
            solution: [
              'Perch and lake trout are fish, and fish are vertebrates.',
              'The bald eagle is a bird, also a vertebrate.',
              'The zebra mussel is a mollusc. It has a hard outer shell and <strong>no backbone at all</strong>.',
              'The answer is the <strong>zebra mussel</strong>.'
            ]
          },
          {
            q: 'A morel mushroom cannot photosynthesise, and it absorbs its food from decaying wood. Which kingdom is it in?',
            options: ['Plantae', 'Fungi', 'Protista', 'Animalia'],
            ans: 1,
            hint: 'It has a cell wall like a plant, but it eats like nothing else.',
            solution: [
              'Plants make their own food using chlorophyll. A morel has no chlorophyll, so it is not Plantae.',
              'Animals swallow their food. A morel does not.',
              'Fungi have a cell wall made of <strong>chitin</strong> and <strong>absorb</strong> nutrients from dead or living matter.',
              'That is exactly the morel, so the answer is <strong>Fungi</strong>.'
            ]
          },
          {
            q: 'Biodiversity is measured at three levels. Which list gives all three correctly?',
            options: [
              'Within a species, between species, and of ecosystems',
              'Plants, animals and bacteria',
              'Land, water and air',
              'Producers, consumers and decomposers'
            ],
            ans: 0,
            hint: 'Think small to large: one species, then many species, then whole habitats.',
            solution: [
              'The narrowest level is genetic variety <strong>within</strong> a single species, for example coat colour in wolves.',
              'The middle level is the number of different <strong>species</strong> sharing a place.',
              'The widest level is the variety of <strong>ecosystems</strong>, such as boreal forest, wetland and Great Lakes shoreline.',
              'So the answer is <strong>within a species, between species, and of ecosystems</strong>.'
            ]
          }
        ]
      },
      {
        name: 'Enriched Deep Thinker',
        desc: 'Combine two ideas at once: energy flow, symbiosis and how an invasion cascades.',
        xp: 15,
        questions: [
          {
            q: 'A patch of Lake Ontario phytoplankton captures <code>50 000 kJ</code> of energy. Using the 10% rule, how much energy reaches the <strong>lake trout</strong>, three levels up the chain (phytoplankton to zooplankton to perch to trout)?',
            options: ['<code>5 000 kJ</code>', '<code>500 kJ</code>', '<code>50 kJ</code>', '<code>5 kJ</code>'],
            ans: 2,
            hint: 'Three transfers means multiplying by 10% three separate times.',
            solution: [
              'Level 1 to 2: <code>50 000 kJ x 10% = 5 000 kJ</code> reaches the zooplankton.',
              'Level 2 to 3: <code>5 000 kJ x 10% = 500 kJ</code> reaches the perch.',
              'Level 3 to 4: <code>500 kJ x 10% = 50 kJ</code> reaches the lake trout.',
              'The answer is <strong>50 kJ</strong>. This is exactly why top predators are always rare.'
            ]
          },
          {
            q: 'Sea lampreys attach to lake trout, feed on their body fluids, and the trout is badly harmed but the lamprey benefits. What is this interrelationship called?',
            options: ['Mutualism', 'Commensalism', 'Parasitism', 'Competition'],
            ans: 2,
            hint: 'One organism gains, the other is harmed. Which word means that?',
            solution: [
              'In <strong>mutualism</strong> both species benefit, like a bee and a flower.',
              'In <strong>commensalism</strong> one benefits and the other is unaffected.',
              'In <strong>parasitism</strong> one benefits and the other is <strong>harmed</strong>.',
              'The lamprey gains a meal, the trout is injured, so this is <strong>parasitism</strong>.'
            ]
          },
          {
            q: 'Zebra mussels filter phytoplankton out of the water. In the simulator, phytoplankton fell to 32% and every level above it fell too. What kind of change is that?',
            options: [
              'A bottom-up collapse starting with the producers',
              'A top-down cascade starting with the predators',
              'A seasonal change that reverses each spring',
              'An increase in biodiversity'
            ],
            ans: 0,
            hint: 'Which trophic level was hit first? Follow the direction the damage travelled.',
            solution: [
              'The mussels remove <strong>phytoplankton</strong>, which are the producers at the bottom of the web.',
              'Zooplankton eat phytoplankton, so they fall next. Perch eat zooplankton, so they fall after that.',
              'The damage travelled <strong>upward</strong> from the base, which is a bottom-up collapse.',
              'A top-down cascade would have started with the lake trout instead. The answer is <strong>a bottom-up collapse starting with the producers</strong>.'
            ]
          },
          {
            q: 'When sea lampreys wiped out most lake trout, the <strong>yellow perch</strong> population rose to 155% of normal. What is the best explanation?',
            options: [
              'Perch began eating lampreys',
              'Perch were released from predation because their main predator was gone',
              'Perch started photosynthesising',
              'Warmer water made perch grow faster'
            ],
            ans: 1,
            hint: 'What was the lake trout doing to the perch before the lamprey arrived?',
            solution: [
              'The lake trout is the top predator that normally eats yellow perch.',
              'Remove that predator and far fewer perch get eaten each year.',
              'The perch population is then said to be <strong>released from predation</strong>, so it grows.',
              'The answer is <strong>perch were released from predation because their main predator was gone</strong>.'
            ]
          },
          {
            q: 'Which pair of actions genuinely protects biodiversity in the Great Lakes?',
            options: [
              'Releasing pet fish into the lake and feeding wild ducks',
              'Requiring ocean ballast water exchange and treating lamprey spawning streams',
              'Building more shoreline concrete and draining wetlands',
              'Introducing a new predator to eat the zebra mussels'
            ],
            ans: 1,
            hint: 'Real protection blocks the arrival route or removes the invader without adding a new one.',
            solution: [
              'Releasing pets is one of the main ways invasive species arrive, so that harms biodiversity.',
              'Concrete shorelines and drained wetlands destroy habitat, which lowers biodiversity.',
              'Adding a new predator is how many invasions started in the first place, and it usually backfires.',
              'Ballast exchange blocks the arrival route and lampricide targets the invader directly, so the answer is <strong>requiring ocean ballast water exchange and treating lamprey spawning streams</strong>.'
            ]
          }
        ]
      },
      {
        name: 'Waterloo CEMC Challenge',
        desc: 'Contest-style logic: key efficiency, population arithmetic and experimental design.',
        xp: 25,
        questions: [
          {
            q: 'A dichotomous key asks questions with exactly two answers. What is the <strong>largest</strong> number of species that a key of <strong>4</strong> questions in a row can tell apart?',
            options: ['8', '16', '4', '12'],
            ans: 1,
            hint: 'Each question doubles the number of paths. Start with 1 path and double four times.',
            solution: [
              'Before any question there is <code>1</code> path.',
              'Each question splits every path in two: <code>1 -> 2 -> 4 -> 8 -> 16</code>.',
              'After 4 questions there are <code>2^4 = 16</code> different end points.',
              'So a 4-question key can separate at most <strong>16</strong> species.'
            ]
          },
          {
            q: 'A lake holds <code>4 000</code> lake trout. Sea lampreys arrive and each year the population falls to <strong>half</strong> of the previous year. After how many whole years does it first drop <strong>below 300</strong>?',
            options: ['3 years', '4 years', '5 years', '6 years'],
            ans: 1,
            hint: 'Halve 4 000 over and over and count the steps until you pass under 300.',
            solution: [
              'Year 1: <code>4 000 / 2 = 2 000</code>.',
              'Year 2: <code>2 000 / 2 = 1 000</code>. Year 3: <code>1 000 / 2 = 500</code>.',
              'Year 4: <code>500 / 2 = 250</code>, and <code>250 &lt; 300</code>.',
              'Year 3 gave 500, which is still above 300, so the first year below 300 is <strong>4 years</strong>.'
            ]
          },
          {
            q: 'In a wetland survey, <strong>every</strong> organism with a backbone also had lungs. A biologist finds an organism <strong>with lungs</strong>. What can she conclude?',
            options: [
              'It definitely has a backbone',
              'It definitely has no backbone',
              'Nothing certain: it may or may not have a backbone',
              'It must be a mammal'
            ],
            ans: 2,
            hint: '"All A are B" does not let you run the arrow backwards from B to A.',
            solution: [
              'The rule says: backbone <code>-&gt;</code> lungs. Every vertebrate in the survey had lungs.',
              'It does <strong>not</strong> say that only vertebrates have lungs. A snail has a lung and no backbone.',
              'Reversing an "all A are B" statement is a logic error called affirming the consequent.',
              'So from lungs alone you can conclude <strong>nothing certain: it may or may not have a backbone</strong>.'
            ]
          },
          {
            q: 'Sophia tests whether road salt lowers frog egg hatching. She fills 5 tanks with <code>0, 2, 4, 6</code> and <code>8 g/L</code> of salt, uses 40 eggs per tank, and keeps all tanks at <code>18 degrees C</code>. What is the <strong>flaw</strong> if she puts only the <code>0 g/L</code> tank on a sunny windowsill?',
            options: [
              'The sample size is too small',
              'Light becomes a second variable, so salt is no longer the only thing changing',
              'She should have used 6 tanks',
              'There is no flaw'
            ],
            ans: 1,
            hint: 'In a fair test exactly one thing may differ between groups. Count how many things differ.',
            solution: [
              'The independent variable she means to test is <strong>salt concentration</strong>.',
              'Everything else, temperature, egg count, light, must be a <strong>controlled</strong> variable.',
              'Putting one tank in the sun changes light AND salt between that tank and the rest.',
              'Now she cannot tell which factor caused any difference, so the flaw is that <strong>light becomes a second variable, so salt is no longer the only thing changing</strong>.'
            ]
          },
          {
            q: 'A pond has 5 species. Species A eats B, B eats C, C eats D, and D eats E. If <strong>C</strong> is wiped out, which species is affected <strong>first</strong> and which is the most likely to increase?',
            options: [
              'B falls first, and D increases',
              'A falls first, and E increases',
              'D falls first, and B increases',
              'E falls first, and A increases'
            ],
            ans: 0,
            hint: 'Removing C takes away food from whoever ate C, and removes a predator from whoever C ate.',
            solution: [
              'C was the food of <strong>B</strong>, so B loses its meals immediately and falls first.',
              'C was the predator of <strong>D</strong>, so D is now released from predation and increases.',
              'A falls later, because it depends on B, which is one more step along the chain.',
              'The answer is <strong>B falls first, and D increases</strong>.'
            ]
          }
        ]
      }
    ]
  });
})(window);
