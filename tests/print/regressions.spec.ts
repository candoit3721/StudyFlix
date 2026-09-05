import { test, expect } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { PRINTABLES } from './manifest';
import { gotoPrintable, inspect, EPS } from './helpers';

/**
 * One test per defect that was actually reported or measured, named after the
 * defect rather than the feature, so a future failure says what broke.
 *
 * The before-fix measurements these pin are recorded in tests/print/BASELINE.md.
 */

const P = (id: string) => PRINTABLES.find((x) => x.id === id)!;

test.describe('print regressions', () => {
  test('@print-smoke olivia horizontal at 4 columns fits the page', async ({ page }) => {
    /*
     * THE REPORTED BUG. Olivia's density cap was `cols * 7` for horizontal and
     * `cols * 4` for vertical (olivia-math/js/app.js). Vertical at 2 columns
     * measured 954px and fit; horizontal at 4 columns measured 1016.3px and
     * 983.6px against a 979.2px printable page and ran off the paper -- the
     * same worksheet paginating correctly in one format and overflowing in the
     * other. The constant packed four cards per page too many.
     */
    const p = P('olivia-math');
    const geo = await gotoPrintable(
      page,
      '/olivia-math/index.html?type=all_mixed&format=horizontal&cols=4&pages=2',
    );
    const r = await inspect(page, p);

    for (const s of r.sheets) {
      expect(s.height, `sheet ${s.index + 1}`).toBeLessThanOrEqual(geo.printH + EPS);
      expect(s.scrollHeight, `sheet ${s.index + 1} overflows`).toBeLessThanOrEqual(
        s.clientHeight + EPS,
      );
    }
    expect(r.overflowRows).toBe(0);
  });

  test('@print-smoke every format x column combination fits', async ({ page }) => {
    // The asymmetry above was only visible because someone tried one specific
    // combination. Sweep the whole axis so the next mistuned constant cannot
    // hide in a corner of it.
    const p = P('olivia-math');
    for (const format of ['vertical', 'horizontal']) {
      for (const cols of [2, 3, 4]) {
        const geo = await gotoPrintable(
          page,
          `/olivia-math/index.html?type=all_mixed&format=${format}&cols=${cols}&pages=2`,
        );
        const r = await inspect(page, p);
        for (const s of r.sheets) {
          expect(s.scrollHeight, `${format}/${cols}col sheet ${s.index + 1}`).toBeLessThanOrEqual(
            s.clientHeight + EPS,
          );
          expect(s.height, `${format}/${cols}col sheet ${s.index + 1}`).toBeLessThanOrEqual(
            geo.printH + EPS,
          );
        }
        expect(r.overflowRows, `${format}/${cols}col`).toBe(0);
      }
    }
  });

  test('@print-smoke sophia answer key paginates instead of overflowing', async ({ page }) => {
    /*
     * The answer key was never paginated: every answer went onto one sheet
     * whatever the count. Six pages of questions put 168 answers on a single
     * page measuring 1304px against a 979.2px page -- 325px off the paper.
     */
    const p = P('sophia-math');
    const geo = await gotoPrintable(
      page,
      '/sophia-math/index.html?category=grade5_mixed&cols=3&pages=6&answerkey=1',
    );
    const r = await inspect(page, p);

    const keys = r.sheets.filter((s) => s.className.includes('answer-key-sheet'));
    expect(keys.length, 'a 6-page worksheet needs more than one key sheet').toBeGreaterThan(1);
    for (const s of keys) {
      expect(s.height).toBeLessThanOrEqual(geo.printH + EPS);
      expect(s.scrollHeight, 'key sheet overflows').toBeLessThanOrEqual(s.clientHeight + EPS);
    }
  });

  test('@print-smoke only the first answer-key sheet forces a page break', async ({ page }) => {
    // Now that keys span several sheets, a blanket `break-before: page` on the
    // answer-key class would insert a blank page between every one of them.
    await gotoPrintable(
      page,
      '/sophia-math/index.html?category=grade5_mixed&cols=3&pages=6&answerkey=1',
    );
    const breaks = await page.$$eval('.answer-key-sheet', (els) =>
      els.map((el) => ({
        first: el.classList.contains('sf-break-before'),
        breakBefore: getComputedStyle(el).breakBefore,
      })),
    );
    expect(breaks.length).toBeGreaterThan(1);
    expect(breaks[0].first, 'first key sheet starts a new page').toBe(true);
    for (const b of breaks.slice(1)) {
      expect(b.first, 'later key sheets must not force a break').toBe(false);
      expect(b.breakBefore).not.toBe('page');
    }
  });

  test('@print-smoke the clock worksheet is never blank when printed from the top bar', async ({ page }) => {
    /*
     * The clocks were only generated on entering the worksheet view, but the
     * print stylesheet force-shows that view from anywhere. Printing without
     * first opening the tab produced a header, a footer and no clocks.
     * Note the route deliberately does NOT open the worksheet view.
     */
    await page.goto('/olivia-math/clock-time.html', { waitUntil: 'load' });
    await page.waitForFunction(
      () => document.documentElement.dataset.sfPrintReady === '1',
      null,
      { timeout: 8000 },
    );
    await page.emulateMedia({ media: 'print' });
    const clocks = await page.locator('.printable-clock-item').count();
    expect(clocks, 'printing from the top bar must not yield a blank worksheet').toBeGreaterThan(0);
  });

  for (const id of ['workbook-rome', 'workbook-mama', 'workbook-science']) {
    test(`@print-smoke ${id} emits no trailing blank page`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'print', 'page.pdf() is Chromium-headless only');
      /*
       * sophia-science carried a local `:last-of-type { page-break-after: auto }`
       * fix; rome and mama never did, so each printed a blank final page. The
       * reset now comes from .sf-sheet in assets/sf/print.css, which is why all
       * three are asserted together -- the fix is shared, so the test is too.
       */
      const p = P(id);
      await gotoPrintable(page, p.route);
      const sheets = await page.locator(p.sheetSelector).count();

      await page.emulateMedia({ media: null });
      const doc = await PDFDocument.load(
        await page.pdf({ preferCSSPageSize: true, printBackground: true }),
      );
      expect(doc.getPageCount(), `${id}: PDF pages must equal sheet count`).toBe(sheets);
    });
  }

  for (const [id, url] of [
    ['olivia-clock', '/olivia-math/clock-time.html?view=worksheet_gen&count=32&cols=3&answers=1'],
    ['sophia-math', '/sophia-math/index.html?category=grade6_mixed&cols=3&pages=6&answerkey=1'],
    ['olivia-math', '/olivia-math/index.html?type=all_mixed&format=horizontal&cols=4&pages=3&answerkey=1'],
    ['yaya-exam', '/yaya/index.html?category=all_mixed&count=12&cols=2&perpage=auto&font=compact&answerkey=1'],
  ] as const) {
    test(`@print-smoke ${id} prints correctly from a normal browser window`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'print', 'page.pdf() is Chromium-headless only');
      /*
       * The rest of the suite measures at the printable content width, which
       * is the only viewport where `emulateMedia` geometry is meaningful. But
       * nobody prints from a 739px window, and the real print render is not
       * the emulated one: Chromium re-lays-out at the paper width and comes
       * out around 10px taller per sheet.
       *
       * That blind spot was not theoretical. The clock worksheet emitted a
       * blank fifth page in 9 of 10 prints from a normal window while every
       * in-page measurement said it was fine. This asserts the thing the user
       * actually experiences: sheets on screen, pages out of the printer, at a
       * window size someone would really use.
       */
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(url, { waitUntil: 'load' });
      await page
        .waitForFunction(() => document.documentElement.dataset.sfPrintReady === '1', null, {
          timeout: 15000,
        })
        .catch(() => {});

      const sheets = await page.locator('.sf-sheet:not(.sf-measuring)').count();
      expect(sheets).toBeGreaterThan(0);

      const doc = await PDFDocument.load(
        await page.pdf({ preferCSSPageSize: true, printBackground: true }),
      );
      expect(doc.getPageCount(), `${id}: printed pages must equal sheets on screen`).toBe(sheets);
    });
  }

  test('@print-smoke yaya typesets its mathematics with no network', async ({ page }) => {
    /*
     * KaTeX used to come from a CDN. Offline, every formula printed as raw
     * `$...$` source at a completely different height from the typeset
     * version, so the page breaks were computed for one document and the paper
     * carried another. These worksheets get printed at a kitchen table, so
     * that is a real failure mode, not just a CI inconvenience.
     */
    await page.route('**/*', (route) => {
      const u = new URL(route.request().url());
      const local = u.hostname === '127.0.0.1' || u.hostname === 'localhost';
      return local ? route.continue() : route.abort();
    });

    await page.setViewportSize({ width: 681, height: 1400 });
    await page.goto('/yaya/index.html?category=calc_all&count=8&cols=1&perpage=auto', {
      waitUntil: 'load',
    });
    await page.waitForFunction(
      () => document.documentElement.dataset.sfPrintReady === '1',
      null,
      { timeout: 20000 },
    );

    const r = await page.evaluate(() => ({
      typeset: document.querySelectorAll('.katex').length,
      rawDollars: (document.body.innerText.match(/\$[^$]+\$/g) || []).length,
    }));
    expect(r.typeset, 'formulas must typeset from the vendored copy').toBeGreaterThan(0);
    expect(r.rawDollars, 'no untypeset $...$ may reach the page').toBe(0);
  });

  test('@print-smoke a money question measures as the question it prints', async ({ page }) => {
    /*
     * MEASURED, in the money studio: the item renderer drew a fresh random
     * pile of coins every time it was called, and assets/sf/paginate.js calls
     * it twice -- once to measure, once to emit. So the page breaks were
     * computed for a worksheet nobody would ever see. A pile of six notes
     * measured where a pile of two was emitted left 300px of empty paper on a
     * page whose tallest question was 180px tall, and the opposite draw would
     * have overflowed instead.
     *
     * The check is the general one rather than a check for the specific cause:
     * a page that is not the last must be packed to within one question of
     * full. That is only true when the thing measured is the thing printed.
     */
    const p = P('olivia-money');
    // Seeded, so the packing this asserts on is the same worksheet every run.
    await gotoPrintable(
      page,
      '/olivia-math/money-coins.html?view=worksheet_gen&mode=count&level=with_bills&cols=3&count=16&seed=7',
    );

    /*
     * The contract itself: rendering one question twice must produce the same
     * markup, because the paginator does exactly that. Asserted directly as
     * well as through the packing below, since the packing symptom depends on
     * which way the random draw happened to go.
     */
    const pure = await page.evaluate(() => {
      const make = (window as any).makeMoneyQuestion;
      const build = (window as any).buildMoneyItem;
      // Indices 1, 2 and 3 cover all three question kinds in a mixed test.
      return [1, 2, 3].every((i) => {
        const q = make(i);
        return build(q).outerHTML === build(q).outerHTML;
      });
    });
    expect(pure, 'rendering the same question twice must produce the same markup').toBe(true);

    const layout = await page.evaluate((sel) => {
      const sheets = Array.from(document.querySelectorAll<HTMLElement>(sel));
      let tallestCard = 0;
      const pages = sheets.map((sheet) => {
        const grid = sheet.querySelector('[data-sf-grid]') as HTMLElement;
        const cards = Array.from(grid.children) as HTMLElement[];
        for (const c of cards) {
          tallestCard = Math.max(tallestCard, c.getBoundingClientRect().height);
        }
        const gridBottom = grid.getBoundingClientRect().bottom;
        const lastBottom = cards[cards.length - 1].getBoundingClientRect().bottom;
        return { cards: cards.length, free: gridBottom - lastBottom };
      });
      return { pages, tallestCard };
    }, p.sheetSelector);

    expect(layout.pages.length, 'this configuration should span several pages').toBeGreaterThan(1);

    // The row gap the grid puts between questions, plus subpixel slack.
    const GAP = 20;
    layout.pages.slice(0, -1).forEach((pg, i) => {
      expect(
        pg.free,
        `page ${i + 1} left ${Math.round(pg.free)}px unused, more than a whole ` +
          `${Math.round(layout.tallestCard)}px question: the page was packed against ` +
          'content other than what it printed',
      ).toBeLessThanOrEqual(layout.tallestCard + GAP + EPS);
    });
  });

  test('@print-smoke a reuse render keeps the same questions', async ({ page }) => {
    /*
     * Measured pagination generates questions through an itemFactory, so a
     * careless wiring makes every re-render produce a brand new worksheet.
     * Retyping the student's name must not swap the questions out from under
     * a child halfway through them.
     */
    await gotoPrintable(page, '/sophia-math/index.html?category=fractions&cols=3&pages=2');
    const before = await page.$$eval('.problem-card .math-expr, .problem-card', (els) =>
      els.slice(0, 5).map((e) => e.textContent?.trim()),
    );

    // The sidebar is hidden in print media, so drive the control on screen.
    await page.emulateMedia({ media: 'screen' });
    await page.fill('#student-name-input', 'Somebody Else');
    await page.waitForFunction(
      () => document.documentElement.dataset.sfPrintReady === '1',
      null,
      { timeout: 8000 },
    );

    const after = await page.$$eval('.problem-card .math-expr, .problem-card', (els) =>
      els.slice(0, 5).map((e) => e.textContent?.trim()),
    );
    expect(after, 'renaming the student changed the questions').toEqual(before);
  });
});
