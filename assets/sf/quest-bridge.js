/**
 * StudyFlix Quest Bridge
 * ---------------------------------------------------------------------------
 * Connects a studio's own scoring to the ONE shared progress record, and
 * paints the shared shell's stat cluster.
 *
 * Rationale (design review): the hub showed 120 XP / 3-day streak, and the
 * quest two clicks later showed 0 / 0. Two causes:
 *   1. The counters were genuinely separate stores.
 *   2. "Streak" meant different things: days studied in the hub, correct
 *      answers in a row inside the quest. Same word, same pill, same place.
 * The shell now always shows the profile-wide XP and DAY streak. A studio's
 * own answer streak is labelled for what it is, next to the quiz.
 */
(function (global) {
  'use strict';

  var cfg = { module: null, profileId: null, badgeTotal: 8 };

  function el(id) { return document.getElementById(id); }

  /** Paint the shared shell pills from the canonical record. */
  function renderStats(badgesUnlocked) {
    if (!cfg.profileId) return;
    var rec = SFProgress.get(cfg.profileId);
    var xp = el('sf-xp-count');
    var streak = el('sf-streak-count');
    var badges = el('sf-badge-count');
    if (xp) xp.textContent = rec.xp;
    if (streak) streak.textContent = rec.streak;
    if (badges) {
      var n = (typeof badgesUnlocked === 'number')
        ? badgesUnlocked
        : SFProgress.badgeCount(cfg.profileId, cfg.module);
      badges.textContent = n + '/' + cfg.badgeTotal;
    }
  }

  /**
   * @param {object} options {module, profileId, badgeTotal}
   */
  function init(options) {
    cfg.module = options.module;
    cfg.badgeTotal = options.badgeTotal || 8;
    // Studios are usually embedded in the hub, but they also work standalone.
    cfg.profileId = SFProgress.activeProfileId(options.profileId);

    SFProgress.touch(cfg.profileId);
    renderStats();
    SFProgress.onChange(function (id) {
      if (id === cfg.profileId) renderStats();
    });
    SFIcons.upgrade();
  }

  /** Award XP to the profile, attributed to this studio. */
  function award(amount) {
    if (!cfg.profileId) return;
    SFProgress.award(cfg.profileId, amount, cfg.module);
  }

  /** Mirror a badge unlock into the shared record. Returns true if it was new. */
  function unlockBadge(badgeId) {
    if (!cfg.profileId) return false;
    return SFProgress.unlockBadge(cfg.profileId, cfg.module, badgeId);
  }

  /** This studio's own XP subtotal, for "Roman XP"-style copy. */
  function moduleXp() {
    return cfg.profileId ? SFProgress.moduleXp(cfg.profileId, cfg.module) : 0;
  }

  /** Return to the hub, whether embedded in the viewer or opened standalone. */
  function backToHub() {
    if (global.parent && global.parent !== global) {
      global.parent.postMessage({ source: 'studyflix-nav', action: 'close-studio' }, '*');
    } else {
      global.location.href = '../index.html';
    }
  }

  global.SFQuest = {
    init: init, award: award, unlockBadge: unlockBadge,
    moduleXp: moduleXp, renderStats: renderStats, backToHub: backToHub,
    get profileId() { return cfg.profileId; }
  };
})(window);
