/* =========================================================================
   SFUrl -- one way to read a studio's configuration out of the URL
   =========================================================================

   Two jobs.

   1. Deep links. A hub card or a lesson page can hand someone a worksheet
      already set up: /olivia-math/?type=multiplication&format=horizontal&cols=4.

   2. Testability, which is the reason this exists now. The print test matrix
      has to drive every layout combination -- 23 sophia categories x 3 column
      counts x workspace on/off, olivia's vertical/horizontal x 2/3/4 columns,
      yaya's three font sizes -- and it can only do that if each combination
      has a URL. Before this, olivia and yaya parsed no parameters at all, so
      the overflowing layouts a user hits by clicking around were literally
      unreachable from a test.

   Requires nothing. Load before the studio's app.js.
   ========================================================================= */

(function (global) {
  'use strict';

  /**
   * Read and validate parameters against a schema.
   *
   * A schema entry is { type, values?, min?, max?, apply }, where `apply`
   * writes the parsed value into the studio's own config object. Unknown
   * parameters and out-of-range values are ignored with a console warning
   * rather than throwing: a bad deep link should still produce a worksheet.
   */
  function read(schema, config) {
    var params;
    try {
      params = new URLSearchParams(global.location.search);
    } catch (e) {
      return { applied: [], seed: null };
    }

    var applied = [];

    Object.keys(schema).forEach(function (key) {
      if (!params.has(key)) return;
      var raw = params.get(key);
      var def = schema[key];
      var value;

      switch (def.type) {
        case 'int':
          value = parseInt(raw, 10);
          if (isNaN(value)) return warn(key, raw, 'not a number');
          if (def.min !== undefined && value < def.min) return warn(key, raw, 'below minimum');
          if (def.max !== undefined && value > def.max) return warn(key, raw, 'above maximum');
          break;
        case 'bool':
          // Accept the forms a human might type in an address bar.
          value = raw === '1' || raw === 'true' || raw === 'yes' || raw === 'on';
          break;
        case 'enum':
          if (def.values.indexOf(raw) === -1) return warn(key, raw, 'not one of ' + def.values.join('/'));
          value = raw;
          break;
        default:
          value = raw;
      }

      def.apply(config, value);
      applied.push(key);
    });

    return { applied: applied, seed: installSeed(params) };
  }

  function warn(key, raw, why) {
    if (global.console && console.warn) {
      console.warn('[SFUrl] ignoring ?' + key + '=' + raw + ' (' + why + ')');
    }
  }

  /**
   * Optional deterministic randomness.
   *
   * The print matrix runs UNSEEDED on purpose: pagination based on real
   * measurement is supposed to be correct for any content, so every run is a
   * fresh fuzz of the question space and that is a feature. The seed exists so
   * that when a run does fail, the exact worksheet can be reproduced from the
   * URL in the failure report.
   */
  function installSeed(params) {
    if (!params.has('seed')) return null;
    var seed = parseInt(params.get('seed'), 10);
    if (isNaN(seed)) return null;

    // mulberry32: small, fast, and good enough for laying out practice sums.
    var a = seed >>> 0;
    global.Math.random = function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return seed;
  }

  /**
   * Reflect a value back into the sidebar so the controls agree with what was
   * rendered. Without this a deep-linked worksheet shows one layout while the
   * form claims another, and the next Generate click silently reverts it.
   */
  function syncControl(name, value) {
    var radio = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (radio) {
      radio.checked = true;
      return true;
    }
    var el = document.getElementById(name);
    if (!el) return false;
    if (el.type === 'checkbox') el.checked = !!value;
    else el.value = value;
    return true;
  }

  global.SFUrl = {
    read: read,
    syncControl: syncControl,
    /** True when the URL asks for print-preview mode explicitly. */
    wantsPrint: function () {
      try {
        var p = new URLSearchParams(global.location.search);
        return p.get('print') === '1';
      } catch (e) {
        return false;
      }
    }
  };
})(window);
