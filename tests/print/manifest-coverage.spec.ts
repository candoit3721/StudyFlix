import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { PRINTABLES } from './manifest';

/**
 * The guard that makes "every test is print-tested" true rather than a habit.
 *
 * It scans the repository for anything that can reach a printer -- a
 * `window.print()` call, an `@media print` block, an `@page` rule -- and fails
 * if the page it belongs to is not registered in manifest.ts. Registering it
 * is what enrols it in all-printables.spec.ts and css-contract.spec.ts.
 *
 * Without this, the print suite only covers what someone remembered to add,
 * which is exactly how the clock worksheet ended up shipping with no page
 * structure at all and how yaya's answer sheet ended up 3307px tall. A new
 * studio now cannot be added without either registering it or deleting this
 * test, and deleting a test is a visible act.
 */

const ROOT = path.resolve(__dirname, '../..');

const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'test-results', 'playwright-report', 'tests',
  'assets', '__pycache__', '.github',
]);

/**
 * Pages that legitimately carry print CSS but are not themselves printable
 * documents. Each needs a reason -- an unexplained entry here is how coverage
 * quietly erodes.
 */
const NOT_PRINTABLE: Record<string, string> = {
  'index.html':
    'The hub. Its print block turns the browse rows into a catalogue listing; ' +
    'it paginates nothing and owns no sheets.',
  'sophia-science/index.html':
    'Studio shell. Its printable path is sophia-science/workbook.html.',
  'sophia-rome/index.html':
    'Studio shell. Its printable path is sophia-rome/workbook.html.',
  'mama/index.html':
    'Studio shell. Its printable path is mama/workbook.html.',
  'sophia-math/geometry.html':
    'Interactive lab. It links out to the worksheet studio rather than printing itself.',
};

async function walk(dir: string, out: string[] = []): Promise<string[]> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full);
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      await walk(full, out);
    } else if (/\.(html|css)$/.test(entry.name)) {
      out.push(rel);
    }
  }
  return out;
}

/** Route as it appears in the manifest, ignoring any query string. */
const routeOf = (p: { route: string }) => p.route.split('?')[0];

test.describe('manifest coverage', () => {
  test('@print-smoke every printable page is registered in the manifest', async () => {
    const files = await walk(ROOT);
    const registered = new Set(PRINTABLES.map((p) => routeOf(p).replace(/^\//, '')));

    // Which HTML page does a stylesheet belong to? Map each CSS file to the
    // pages that link it, so `@page` in a stylesheet implicates its pages.
    const htmlFiles = files.filter((f) => f.endsWith('.html'));
    const cssOwners = new Map<string, string[]>();
    for (const html of htmlFiles) {
      const body = await fs.readFile(path.join(ROOT, html), 'utf8');
      for (const m of body.matchAll(/<link[^>]+href="([^"]+\.css)[^"]*"/g)) {
        const resolved = path
          .normalize(path.join(path.dirname(html), m[1].split('?')[0]))
          .replace(/\\/g, '/');
        if (!cssOwners.has(resolved)) cssOwners.set(resolved, []);
        cssOwners.get(resolved)!.push(html);
      }
    }

    const unregistered: string[] = [];

    for (const file of files) {
      const body = await fs.readFile(path.join(ROOT, file), 'utf8');
      const prints =
        body.includes('window.print()') ||
        body.includes('@media print') ||
        /@page\s*\{/.test(body);
      if (!prints) continue;

      // Shared machinery is not a page; it is what pages are built from.
      if (file.startsWith('assets/')) continue;

      const pages = file.endsWith('.css') ? cssOwners.get(file) ?? [] : [file];
      for (const page of pages) {
        if (registered.has(page)) continue;
        if (NOT_PRINTABLE[page]) continue;
        unregistered.push(`${page} (print capability found in ${file})`);
      }
    }

    expect(
      Array.from(new Set(unregistered)).sort(),
      'These pages can print but are not in tests/print/manifest.ts, so nothing ' +
        'verifies their page breaks. Add an entry there (and a case generator in ' +
        'matrix.ts), or add them to NOT_PRINTABLE above with a reason.',
    ).toEqual([]);
  });

  test('@print-smoke every registered route exists on disk', async () => {
    // A manifest entry pointing at a moved or deleted page would silently stop
    // testing anything.
    for (const p of PRINTABLES) {
      const rel = routeOf(p).replace(/^\//, '');
      await expect(
        fs.access(path.join(ROOT, rel)).then(() => true),
        `${p.id} points at ${rel}, which does not exist`,
      ).resolves.toBe(true);
    }
  });
});
