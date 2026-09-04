import { test, expect } from '@playwright/test';
import { PRINTABLES, PAPER_SIZES } from './manifest';
import { readGeometry, EPS } from './helpers';

/**
 * Pagination is asynchronous -- it measures fonts and real card heights before
 * emitting anything -- so a spec that queries the DOM straight after
 * navigation sees either no sheets or a half-built one. Studios that paginate
 * publish `data-sf-print-ready` when they have settled; the hand-authored
 * workbooks never set it, hence the swallowed timeout.
 */
async function settled(page: import('@playwright/test').Page) {
  await page
    .waitForFunction(() => document.documentElement.dataset.sfPrintReady === '1', null, {
      timeout: 8000,
    })
    .catch(() => {});
}

/**
 * Pins the print CSS contract so it cannot silently rot.
 *
 * The load-bearing invariant is the one between `@page` and the `--sf-page-*`
 * custom properties. `@page` is document-global and cannot be scoped by
 * selector, so a shared stylesheet cannot declare it for a Letter studio and
 * an A4 studio at once; each studio declares its own literal and mirrors it
 * into variables that assets/sf/paginate.js measures against. If the two ever
 * disagree, the paginator packs pages for one paper size while the browser
 * prints another -- silently, and on every worksheet. So it is checked here
 * rather than trusted to a comment.
 */

for (const p of PRINTABLES) {
  test.describe(`css contract: ${p.id}`, () => {
    test('@page agrees with the --sf-page-* variables', async ({ page }) => {
      await page.goto(p.route, { waitUntil: 'load' });
      await settled(page);

      const declared = await page.evaluate(() => {
        // Same-origin only, so every sheet is readable.
        for (const sheet of Array.from(document.styleSheets)) {
          let rules: CSSRuleList;
          try {
            rules = (sheet as CSSStyleSheet).cssRules;
          } catch {
            continue;
          }
          const walk = (list: CSSRuleList): { size: string; margin: string } | null => {
            for (const rule of Array.from(list)) {
              if (rule.constructor.name === 'CSSPageRule' || rule.type === 6) {
                const st = (rule as any).style;
                return { size: st.size || st.getPropertyValue('size'), margin: st.margin };
              }
              const nested = (rule as any).cssRules as CSSRuleList | undefined;
              if (nested) {
                const found = walk(nested);
                if (found) return found;
              }
            }
            return null;
          };
          const found = walk(rules);
          if (found) return found;
        }
        return null;
      });

      expect(declared, `${p.id} declares no @page rule`).not.toBeNull();
      expect(declared!.size.toLowerCase(), `${p.id} @page size`).toContain(p.paper);

      const geo = await readGeometry(page);
      const expected = PAPER_SIZES[p.paper];
      expect(geo.pageW, `${p.id} --sf-page-w`).toBeCloseTo(expected.w, 0);
      expect(geo.pageH, `${p.id} --sf-page-h`).toBeCloseTo(expected.h, 0);

      // The margin implied by the variables must match the declared @page
      // margin, or the sheet is sized for a printable box the printer will
      // not give it.
      const marginX = (geo.pageW - geo.printW) / 2;
      const marginY = (geo.pageH - geo.printH) / 2;
      const declaredMargins = await page.evaluate((m) => {
        const probe = document.createElement('div');
        probe.style.cssText = 'position:absolute;visibility:hidden;';
        probe.style.margin = m;
        document.body.appendChild(probe);
        const cs = getComputedStyle(probe);
        const out = { top: parseFloat(cs.marginTop), left: parseFloat(cs.marginLeft) };
        probe.remove();
        return out;
      }, declared!.margin);

      expect(marginY, `${p.id} vertical margin`).toBeCloseTo(declaredMargins.top, 0);
      expect(marginX, `${p.id} horizontal margin`).toBeCloseTo(declaredMargins.left, 0);
    });

    test('sheets are splittable and cards are atomic in print media', async ({ page }) => {
      await page.goto(p.route, { waitUntil: 'load' });
      await settled(page);
      await page.emulateMedia({ media: 'print' });

      const found = await page.evaluate(
        ({ sheetSelector, cardSelector }) => {
          const sheet = document.querySelector(sheetSelector);
          const card = cardSelector ? document.querySelector(cardSelector) : null;
          return {
            hasSheet: !!sheet,
            sheetBreakInside: sheet ? getComputedStyle(sheet).breakInside : null,
            sheetBreakAfter: sheet ? getComputedStyle(sheet).breakAfter : null,
            cardBreakInside: card ? getComputedStyle(card).breakInside : null,
          };
        },
        { sheetSelector: p.sheetSelector, cardSelector: p.cardSelector ?? '' },
      );

      expect(found.hasSheet, `${p.id} renders no .sf-sheet`).toBe(true);

      // A full-page box that cannot split forces the browser to push the whole
      // sheet to the next page when it overflows, leaving a blank one behind.
      expect(found.sheetBreakInside, `${p.id} sheet must be splittable`).not.toBe('avoid');

      if (found.cardBreakInside !== null) {
        expect(found.cardBreakInside, `${p.id} cards must not split across pages`).toBe('avoid');
      }
    });

    test('the last sheet does not force a page break after it', async ({ page }) => {
      await page.goto(p.route, { waitUntil: 'load' });
      await settled(page);
      await page.emulateMedia({ media: 'print' });
      const breakAfter = await page.evaluate((sel) => {
        const sheets = document.querySelectorAll(sel);
        const last = sheets[sheets.length - 1];
        return last ? getComputedStyle(last).breakAfter : null;
      }, p.sheetSelector);
      expect(['auto', '', null], `${p.id} trailing blank page`).toContain(breakAfter);
    });

    test('the sheet box is identical on screen and in print', async ({ page }) => {
      // The whole measurement strategy rests on this: if the two media
      // disagree, the preview lies and the paginator measures the wrong box.
      await page.goto(p.route, { waitUntil: 'load' });
      await settled(page);
      const geo = await readGeometry(page);
      await page.setViewportSize({ width: Math.ceil(geo.printW), height: 1400 });

      const box = async () =>
        page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { w: r.width, h: r.height };
        }, p.sheetSelector);

      await page.emulateMedia({ media: 'screen' });
      const onScreen = await box();
      await page.emulateMedia({ media: 'print' });
      const inPrint = await box();

      expect(onScreen, `${p.id} has no sheet on screen`).not.toBeNull();

      /*
       * Padding too, not just the outer box. A sheet whose padding changes
       * between media has the same outer size but a different amount of room
       * inside it, so the paginator measures against one content box and the
       * printer uses another. yaya's answer sheet carried a print-only
       * `padding-top: 20px`, which was invisible to an outer-box comparison
       * and pushed the last worked solution off the bottom of every key page.
       */
      const padding = async () =>
        page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const cs = getComputedStyle(el);
          return [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].join(' ');
        }, p.sheetSelector);

      await page.emulateMedia({ media: 'screen' });
      const padScreen = await padding();
      await page.emulateMedia({ media: 'print' });
      const padPrint = await padding();
      expect(padPrint, `${p.id} sheet padding differs between media`).toBe(padScreen);
      expect(inPrint!.w, `${p.id} sheet width differs between media`).toBeCloseTo(onScreen!.w, 0);
      expect(inPrint!.h, `${p.id} sheet height differs between media`).toBeCloseTo(onScreen!.h, 0);
      expect(inPrint!.h, `${p.id} sheet must fit the printable page`).toBeLessThanOrEqual(
        geo.printH + EPS,
      );
    });
  });
}
