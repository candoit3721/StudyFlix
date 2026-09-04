import { test, expect, Page } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { readGeometry, EPS } from './helpers';

/**
 * assets/sf/paginate.js, exercised in isolation against a synthetic fixture
 * whose cards have deliberately ragged heights (40px to 160px, cycling).
 *
 * Isolation is the point: if these pass, any later failure in a real studio is
 * that studio's wiring, not the pagination algorithm. And ragged heights are
 * the point too -- uniform cards are exactly the case the old hard-coded
 * `cols * rows` constants got right, and the case real worksheets never are.
 */

const FIXTURE = '/tests/print/fixtures/paginator.html';

interface Result {
  sheets: number;
  overflowRows: number;
  chunkSplits: number;
  usedItems: number;
  perPage: number[];
}

async function build(page: Page, cfg: Record<string, unknown>): Promise<Result> {
  return page.evaluate((c) => (window as any).buildFixture(c), cfg) as Promise<Result>;
}

/** Every sheet must fit the printable box and not overhang its own bounds. */
async function assertNoOverflow(page: Page, printH: number, label: string) {
  const sheets = await page.$$eval('.sf-sheet', (els) =>
    els.map((el) => ({
      h: el.getBoundingClientRect().height,
      scroll: el.scrollHeight,
      client: el.clientHeight,
      cards: el.querySelectorAll('.card').length,
    })),
  );
  expect(sheets.length, `${label}: no sheets`).toBeGreaterThan(0);
  for (const [i, s] of sheets.entries()) {
    expect(s.h, `${label} sheet ${i + 1} height`).toBeLessThanOrEqual(printH + EPS);
    expect(s.scroll, `${label} sheet ${i + 1} content overflows`).toBeLessThanOrEqual(
      s.client + EPS,
    );
    expect(s.cards, `${label} sheet ${i + 1} is blank`).toBeGreaterThan(0);
  }
  return sheets;
}

test.describe('SFPaginate', () => {
  let printH = 0;

  test.beforeEach(async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });
    const geo = await readGeometry(page);
    printH = geo.printH;
    await page.setViewportSize({ width: Math.ceil(geo.printW), height: 1400 });
    await page.emulateMedia({ media: 'print' });
  });

  test('reads the true print geometry from the stylesheet', async ({ page }) => {
    const geo = await page.evaluate(() => (window as any).SFPaginate.geometry());
    // Letter at 0.4in margins: 739.2 x 979.2 printable.
    expect(geo.printW).toBeCloseTo(739.2, 0);
    expect(geo.printH).toBeCloseTo(979.2, 0);

    // The sheet is shorter than the page by --sf-sheet-cushion. The exact
    // value is a tuning decision documented in assets/sf/print.css; what must
    // hold is that a sheet always leaves the page some headroom and never
    // exceeds it.
    expect(geo.sheetH).toBeLessThan(geo.printH);
    expect(geo.sheetH).toBeGreaterThan(geo.printH - 40);
  });

  for (const cols of [1, 2, 3, 4]) {
    test(`fill mode packs ragged cards without overflow at ${cols} column(s)`, async ({ page }) => {
      const res = await build(page, { mode: 'fill', cols, count: 40 });
      await assertNoOverflow(page, printH, `${cols} cols`);
      expect(res.overflowRows).toBe(0);
      expect(res.usedItems).toBe(40);
      // Every item made it onto some page.
      expect(res.perPage.reduce((a, b) => a + b, 0)).toBe(40);
    });
  }

  for (const pages of [1, 2, 3, 4, 5, 6]) {
    test(`exactPages honours a request for exactly ${pages} page(s)`, async ({ page }) => {
      const res = await build(page, { mode: 'exactPages', cols: 3, pages });
      expect(res.sheets, 'sheet count must equal the requested page count').toBe(pages);
      expect(res.overflowRows).toBe(0);
      await assertNoOverflow(page, printH, `exactPages ${pages}`);
    });
  }

  test('exactPages fills the last page as fully as the first', async ({ page }) => {
    // The failure this guards against: the old `pages * cap` arithmetic could
    // leave a trailing page two thirds empty (9 + 9 + 2 rather than 7 + 7 + 6).
    await build(page, { mode: 'exactPages', cols: 3, pages: 3, uniform: 60 });
    const fill = await page.$$eval('.sf-sheet', (els) =>
      els.map((el) => {
        const grid = el.querySelector('.grid') as HTMLElement;
        const last = grid.lastElementChild as HTMLElement;
        if (!last) return 0;
        return last.getBoundingClientRect().bottom - grid.getBoundingClientRect().top;
      }),
    );
    const first = fill[0];
    for (const [i, f] of fill.entries()) {
      // Within one card-height of the first page's fill.
      expect(f, `page ${i + 1} is under-filled`).toBeGreaterThan(first * 0.8);
    }
  });

  test('a full-width spanning card shares no row with its neighbours', async ({ page }) => {
    // Rows are derived from geometry, not index % columns. A card with
    // `grid-column: 1 / -1` must be measured as its own row, or the page
    // budget is over-counted and the sheet overflows.
    const res = await build(page, { mode: 'fill', cols: 3, count: 28, wide: true });
    expect(res.overflowRows).toBe(0);
    await assertNoOverflow(page, printH, 'spanning cards');
  });

  test('the row gap is charged to the page budget', async ({ page }) => {
    // If gaps were ignored, a page would over-fill by (rows - 1) * gap and
    // this would overflow rather than break earlier.
    const res = await build(page, { mode: 'fill', cols: 2, count: 60, uniform: 100 });
    expect(res.overflowRows).toBe(0);
    await assertNoOverflow(page, printH, 'gap accounting');
  });

  test('the first page gets less room than the continuation pages', async ({ page }) => {
    // The first sheet carries a taller name/date/score header. If both used
    // one budget the first page would over-fill and the rest would run short.
    const res = await build(page, { mode: 'fill', cols: 3, count: 60, uniform: 80 });
    await assertNoOverflow(page, printH, 'header budget');
    expect(res.perPage.length).toBeGreaterThan(2);
    expect(res.perPage[0], 'first page must hold no more than a later one').toBeLessThanOrEqual(
      res.perPage[1],
    );
  });

  test('fixedChunk honours the requested items per page when they fit', async ({ page }) => {
    const res = await build(page, { mode: 'fixedChunk', cols: 2, count: 24, chunkSize: 6, uniform: 60 });
    expect(res.chunkSplits, 'no chunk should have needed splitting').toBe(0);
    expect(res.perPage.every((n) => n === 6)).toBe(true);
    await assertNoOverflow(page, printH, 'fixedChunk');
  });

  test('fixedChunk splits rather than overflows, and says so', async ({ page }) => {
    // A deliberately impossible request: 20 tall cards on one page. The
    // paginator must protect the paper and report the compromise rather than
    // silently honouring the number and printing off the edge.
    const res = await build(page, { mode: 'fixedChunk', cols: 1, count: 20, chunkSize: 20, uniform: 200 });
    expect(res.chunkSplits, 'the impossible chunk must be reported as split').toBeGreaterThan(0);
    await assertNoOverflow(page, printH, 'fixedChunk split');
  });

  test('a card taller than a whole page is reported, not swallowed', async ({ page }) => {
    // This is the future-proofing net: a new question type that cannot
    // physically fit must fail loudly on the day it is written.
    const res = await build(page, { mode: 'fill', cols: 1, count: 3, uniform: 1400 });
    expect(res.overflowRows, 'an unfittable row must be counted').toBeGreaterThan(0);
    const published = await page.evaluate(() => (window as any).__sfPrint.overflowRows);
    expect(published, 'and published for the test suite to fail on').toBeGreaterThan(0);
  });

  test('publishes the readiness signal only once pagination has settled', async ({ page }) => {
    await page.goto(FIXTURE, { waitUntil: 'load' });
    const before = await page.evaluate(() => document.documentElement.dataset.sfPrintReady);
    expect(before).toBeUndefined();
    await build(page, { mode: 'exactPages', cols: 3, pages: 2 });
    const after = await page.evaluate(() => document.documentElement.dataset.sfPrintReady);
    expect(after).toBe('1');
  });

  test('the measurement host stays laid out in print media', async ({ page }) => {
    /*
     * Regression guard for a real defect: print.css used to hide
     * .sf-measure-host with `display: none` inside @media print. An element
     * with `display: none` has no layout, so every row measured zero height
     * and the paginator concluded the entire worksheet fit on one page.
     * Browsers re-render when print preview opens, so this could strike in
     * production, not only under test.
     */
    const display = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.className = 'sf-measure-host';
      document.body.appendChild(probe);
      const d = getComputedStyle(probe).display;
      probe.remove();
      return d;
    });
    expect(display, 'the measurement host must remain laid out').not.toBe('none');

    // Same trap, second door: the `sf-measuring` marker that lets callers
    // exclude a half-built sheet must be selector-only. Giving it
    // `display: none` in print media collapses measurement just as thoroughly
    // as hiding the host does.
    const measuringDisplay = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.className = 'sf-sheet sf-measuring';
      document.body.appendChild(probe);
      const d = getComputedStyle(probe).display;
      probe.remove();
      return d;
    });
    expect(measuringDisplay, 'the sf-measuring marker must not affect layout').not.toBe('none');

    // And it must be empty at rest, so it can never add a page of its own.
    await build(page, { mode: 'exactPages', cols: 3, pages: 2 });
    // The host keeps one permanent inner wrapper (it mirrors the destination
    // container's classes); what must not survive is a measured sheet.
    const leftovers = await page.evaluate(
      () => document.querySelectorAll('.sf-measure-host .sf-sheet').length,
    );
    expect(leftovers, 'measurement leaves no sheet behind').toBe(0);
  });

  test('corrects itself when emitted pages turn out taller than measured', async ({ page }) => {
    /*
     * Measuring off-screen and emitting into a live page are not quite the
     * same experiment: elastic cards (a `flex: 1` box inside a grid row) can
     * settle a few pixels taller once placed, which is enough to push the last
     * row off the paper. Rather than predict every such case, the paginator
     * measures what it produced and repacks.
     *
     * The fixture cards carry a `flex: 1` filler so they stretch exactly that
     * way; the assertion is simply that nothing ends up overflowing.
     */
    const res = await build(page, { mode: 'fill', cols: 2, count: 30, elastic: true });
    expect(res.overflowRows).toBe(0);
    await assertNoOverflow(page, printH, 'elastic cards');
  });

  test('ground truth: the PDF has exactly one page per sheet', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'print', 'page.pdf() is Chromium-headless only');
    const res = await build(page, { mode: 'exactPages', cols: 3, pages: 4 });
    expect(res.sheets).toBe(4);
    await page.emulateMedia({ media: null });
    const doc = await PDFDocument.load(await page.pdf({ preferCSSPageSize: true, printBackground: true }));
    expect(doc.getPageCount()).toBe(4);
  });
});
