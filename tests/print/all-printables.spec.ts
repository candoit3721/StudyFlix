import { test, expect } from '@playwright/test';
import { PRINTABLES } from './manifest';
import { gotoPrintable, assertPrintable, inspect } from './helpers';
import { allCases, Case } from './matrix';

/**
 * The generic print suite: every printable, every layout combination.
 *
 * This is one spec rather than one per studio on purpose. Adding a studio
 * means adding an entry to manifest.ts and a case generator to matrix.ts, and
 * it is print-tested automatically -- there is no per-studio spec to remember
 * to write. tests/print/manifest-coverage.spec.ts closes the loop by failing
 * CI if a printable exists that the manifest does not know about.
 *
 * Tagging: `@print-smoke` cases run on every push; the full matrix runs
 * nightly and on main. See .github/workflows/playwright.yml.
 */

const CASES = allCases();
const byPrintable = new Map<string, Case[]>();
for (const c of CASES) {
  if (!byPrintable.has(c.printable)) byPrintable.set(c.printable, []);
  byPrintable.get(c.printable)!.push(c);
}

for (const [printableId, cases] of byPrintable) {
  const printable = PRINTABLES.find((p) => p.id === printableId);
  if (!printable) {
    throw new Error(
      `matrix.ts produces cases for "${printableId}", which is not in manifest.ts`,
    );
  }

  test.describe(`print: ${printableId}`, () => {
    for (const c of cases) {
      const title = `${c.smoke ? '@print-smoke ' : ''}${c.label}`;

      test(title, async ({ page }, testInfo) => {
        const geo = await gotoPrintable(page, c.url);

        // PDF verification is the ground truth but costs a full render, so it
        // is reserved for the smoke subset -- enough to keep the cheap
        // assertions honest without paying for it 400 times.
        const wantPdf = !!c.smoke && testInfo.project.name === 'print';

        const report = await assertPrintable(page, printable, geo, {
          label: c.label,
          pdf: wantPdf,
        });

        if (c.expectedWorksheetPages !== undefined) {
          const sf = await page.evaluate(() => (window as any).__sfPrint);
          expect(sf.worksheetPages, `${c.label}: requested page count`).toBe(
            c.expectedWorksheetPages,
          );
        }

        // An explicit items-per-page request may legitimately need splitting;
        // report it rather than failing, so the user's number is honoured
        // where it fits and the compromise is visible where it does not.
        if (c.allowChunkSplits && report.chunkSplits > 0) {
          testInfo.annotations.push({
            type: 'chunk-split',
            description: `${c.label}: explicit per-page request split across ${report.chunkSplits} extra page(s)`,
          });
        }
      });
    }
  });
}

test.describe('matrix coverage', () => {
  test('@print-smoke every manifest entry has at least one case', async () => {
    // A printable in the manifest with no cases is untested but looks covered.
    for (const p of PRINTABLES) {
      expect(
        byPrintable.has(p.id),
        `${p.id} is in the manifest but matrix.ts generates no cases for it`,
      ).toBe(true);
    }
  });
});
