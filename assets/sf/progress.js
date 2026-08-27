/**
 * StudyFlix Progress Store
 * ---------------------------------------------------------------------------
 * ONE canonical XP / streak / badge record per profile, shared by the hub and
 * every studio.
 *
 * Rationale (design review): the hub showed 120 XP and a 3-day streak while a
 * quest opened two clicks later showed 0 and 0. They were separate counters
 * (`studyflix_<id>_xp` vs `sophia_rome_xp`) and the hub's numbers were
 * hardcoded placeholder defaults. Studios run same-origin in an iframe, so a
 * single localStorage record plus postMessage/storage sync keeps every surface
 * showing the same truth.
 */
(function (global) {
  'use strict';

  var KEY = 'studyflix_progress_v1';
  var LEGACY = [
    { store: 'sophia', xp: 'sophia_rome_xp', streak: 'sophia_rome_streak', badges: 'sophia_rome_badges', module: 'rome' },
    { store: 'sophia', xp: 'sophia_science_xp', badges: 'sophia_science_badges', module: 'science' },
    { store: 'mama', xp: 'mama_coffee_xp', badges: 'mama_coffee_badges', module: 'coffee' }
  ];

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  function daysBetween(a, b) {
    var pa = a.split('-').map(Number), pb = b.split('-').map(Number);
    var ta = Date.UTC(pa[0], pa[1] - 1, pa[2]), tb = Date.UTC(pb[0], pb[1] - 1, pb[2]);
    return Math.round((tb - ta) / 86400000);
  }

  function blank() {
    return { xp: 0, streak: 0, lastActive: null, badges: {}, modules: {} };
  }

  function readAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }

  function writeAll(all) {
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) { /* quota / private mode */ }
  }

  /** One-time import of the old per-studio keys so existing learners keep their XP. */
  function migrate() {
    var all = readAll();
    if (all.__migrated) return all;
    for (var i = 0; i < LEGACY.length; i++) {
      var m = LEGACY[i];
      var rec = all[m.store] || blank();
      var xp = parseInt(localStorage.getItem(m.xp) || '0', 10);
      if (xp > 0) {
        rec.xp += xp;
        rec.modules[m.module] = (rec.modules[m.module] || 0) + xp;
      }
      if (m.streak) {
        var st = parseInt(localStorage.getItem(m.streak) || '0', 10);
        if (st > rec.streak) rec.streak = st;
      }
      if (m.badges) {
        try {
          var b = JSON.parse(localStorage.getItem(m.badges) || '[]');
          if (Array.isArray(b)) b.forEach(function (id) { rec.badges[m.module + ':' + id] = true; });
        } catch (e) { /* ignore malformed legacy badge list */ }
      }
      all[m.store] = rec;
    }
    all.__migrated = true;
    writeAll(all);
    return all;
  }

  function get(profileId) {
    var all = migrate();
    var rec = all[profileId];
    if (!rec) return blank();
    // A streak only survives if the learner was here today or yesterday.
    if (rec.lastActive) {
      var gap = daysBetween(rec.lastActive, today());
      if (gap > 1) rec.streak = 0;
    }
    return rec;
  }

  var listeners = [];

  function emit(profileId) {
    var rec = get(profileId);
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](profileId, rec); } catch (e) { /* a bad listener must not break the rest */ }
    }
    // Tell the hub (or an embedded studio) to refresh its own chrome.
    var msg = { source: 'studyflix-progress', profileId: profileId, progress: rec };
    try { if (global.parent && global.parent !== global) global.parent.postMessage(msg, '*'); } catch (e) { /* cross-origin */ }
    try {
      var frames = document.querySelectorAll('iframe');
      for (var f = 0; f < frames.length; f++) {
        if (frames[f].contentWindow) frames[f].contentWindow.postMessage(msg, '*');
      }
    } catch (e) { /* no frames */ }
  }

  /** Record a study session: bumps the streak at most once per day. */
  function touch(profileId) {
    var all = migrate();
    var rec = all[profileId] || blank();
    var day = today();
    if (rec.lastActive !== day) {
      var gap = rec.lastActive ? daysBetween(rec.lastActive, day) : null;
      rec.streak = (gap === 1) ? rec.streak + 1 : 1;
      rec.lastActive = day;
      all[profileId] = rec;
      writeAll(all);
      emit(profileId);
    }
    return rec;
  }

  /** Award XP, attributed to a module so a studio can still show its own total. */
  function award(profileId, amount, module) {
    amount = parseInt(amount, 10) || 0;
    if (!amount) return get(profileId);
    var all = migrate();
    var rec = all[profileId] || blank();
    rec.xp += amount;
    if (module) rec.modules[module] = (rec.modules[module] || 0) + amount;
    rec.lastActive = today();
    if (!rec.streak) rec.streak = 1;
    all[profileId] = rec;
    writeAll(all);
    emit(profileId);
    return rec;
  }

  function unlockBadge(profileId, module, badgeId) {
    var all = migrate();
    var rec = all[profileId] || blank();
    var key = module + ':' + badgeId;
    if (rec.badges[key]) return false;
    rec.badges[key] = true;
    all[profileId] = rec;
    writeAll(all);
    emit(profileId);
    return true;
  }

  function badgeCount(profileId, module) {
    var rec = get(profileId), n = 0;
    for (var k in rec.badges) {
      if (Object.prototype.hasOwnProperty.call(rec.badges, k) && (!module || k.indexOf(module + ':') === 0)) n++;
    }
    return n;
  }

  function moduleXp(profileId, module) {
    return get(profileId).modules[module] || 0;
  }

  function onChange(fn) {
    listeners.push(fn);
    return function () {
      var i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  /** Which profile is active, so a studio opened directly still attributes XP. */
  function activeProfileId(fallback) {
    try { return localStorage.getItem('studyflix_active_profile_id') || fallback || null; }
    catch (e) { return fallback || null; }
  }

  // Another tab changed the record.
  global.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    var id = activeProfileId();
    if (id) {
      var rec = get(id);
      for (var i = 0; i < listeners.length; i++) {
        try { listeners[i](id, rec); } catch (err) { /* ignore */ }
      }
    }
  });

  // A studio in an iframe (or the hub around us) changed the record.
  global.addEventListener('message', function (e) {
    var d = e && e.data;
    if (!d || d.source !== 'studyflix-progress') return;
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](d.profileId, get(d.profileId)); } catch (err) { /* ignore */ }
    }
  });

  global.SFProgress = {
    get: get, award: award, touch: touch, onChange: onChange,
    unlockBadge: unlockBadge, badgeCount: badgeCount, moduleXp: moduleXp,
    activeProfileId: activeProfileId, STORAGE_KEY: KEY
  };
})(window);
