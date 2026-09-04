import { test, expect } from '@playwright/test';

/**
 * Sophia worksheet print layout.
 *
 * This spec used to assert `boundingBox().height <= 1040` at whatever viewport
 * it happened to have -- in practice 816px, the full page width *including*
 * the @page margins. Text therefore wrapped 77px wider than it really would,
 * cards measured shorter than they really were, and every sheet looked like it
 * fit. It passed while real printing overflowed. See tests/print/BASELINE.md.
 *
 * The thorough coverage now lives in tests/print/ (run with
 * `--project=print`), which measures at the true printable width and checks
 * the result against a real PDF render. What remains here is the quick,
 * cross-browser sanity check that the studio renders a sane worksheet at all,
 * so it still catches a blank page or a broken preset on Firefox and WebKit
 * where page.pdf() is unavailable.
 */

test.describe('Sophia Math Worksheet Print Layout & Pagination', () => {
  /** Letter at 0.4in margins: 8.5in - 0.8in wide, 11in - 0.8in tall. */
  const PRINT_W = 8.5 * 96 - 2 * 0.4 * 96; // 739.2
  const PRINT_H = 11 * 96 - 2 * 0.4 * 96;  // 979.2
  const EPS = 1.5;

  /** Excludes the paginator's off-screen scratch sheet. */
  const SHEETS = '.sf-sheet:not(.sf-measuring)';

  async function open(page: import('@playwright/test').Page, url: string) {
    await page.goto(url, { waitUntil: 'load' });
    // Measured pagination is asynchronous; the studio publishes this once it
    // has settled. Sampling the DOM earlier catches a half-built page.
    await page.waitForFunction(
      () => document.documentElement.dataset.sfPrintReady === '1',
      null,
      { timeout: 10_000 },
    );
    await page.setViewportSize({ width: Math.ceil(PRINT_W), height: 1400 });
    await page.emulateMedia({ media: 'print' });
  }

  test('worksheet sheets fit the printable page box', async ({ page }) => {
    await open(page, '/sophia-math/index.html?preset=g5_6_geometry_area');

    const sheets = await page.$$eval(SHEETS, (els) =>
      els.map((el) => ({
        h: el.getBoundingClientRect().height,
        w: el.getBoundingClientRect().width,
        overflow: el.scrollHeight - el.clientHeight,
      })),
    );

    expect(sheets.length).toBeGreaterThan(0);
    for (const [i, s] of sheets.entries()) {
      expect(s.h, `sheet ${i + 1} height`).toBeLessThanOrEqual(PRINT_H + EPS);
      expect(s.w, `sheet ${i + 1} width`).toBeLessThanOrEqual(PRINT_W + EPS);
      expect(s.overflow, `sheet ${i + 1} content overflows the page`).toBeLessThanOrEqual(EPS);
    }
  });

  test('every preset paginates without overflow', async ({ page }) => {
    const presets = ['grade5_mixed', 'g6_composite_shapes', 'g5_6_geometry_area', 'grade6_mixed'];

    for (const preset of presets) {
      await open(page, `/sophia-math/index.html?preset=${preset}`);

      const report = await page.evaluate((sel) => {
        const els = Array.from(document.querySelectorAll<HTMLElement>(sel));
        return {
          sf: (window as any).__sfPrint,
          sheets: els.map((el) => ({
            h: el.getBoundingClientRect().height,
            overflow: el.scrollHeight - el.clientHeight,
            cards: el.querySelectorAll('.problem-card, .key-item').length,
          })),
        };
      }, SHEETS);

      for (const [i, s] of report.sheets.entries()) {
        expect(s.h, `${preset} sheet ${i + 1} height`).toBeLessThanOrEqual(PRINT_H + EPS);
        expect(s.overflow, `${preset} sheet ${i + 1} overflows`).toBeLessThanOrEqual(EPS);
        expect(s.cards, `${preset} sheet ${i + 1} is blank`).toBeGreaterThan(0);
      }

      // No question was too tall to place anywhere.
      expect(report.sf.overflowRows, `${preset} had an unfittable row`).toBe(0);
    }
  });

  test('"pages of questions" means exactly that many question pages', async ({ page }) => {
    // The contract the old `pageCount * densityCap` arithmetic could not keep:
    // it derived a question count from a guessed cap, so the actual page count
    // drifted and the last page could come out two thirds empty.
    for (const pages of [1, 3, 5]) {
      await open(page, `/sophia-math/index.html?category=fractions&cols=3&pages=${pages}&answerkey=0`);
      const sf = await page.evaluate(() => (window as any).__sfPrint);
      expect(sf.worksheetPages, `requested ${pages} pages`).toBe(pages);
    }
  });
});
