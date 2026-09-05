import { defineConfig, devices } from '@playwright/test';

/**
 * StudyFlix test configuration.
 *
 * Two families of tests live here:
 *  - the general UI specs (tests/*.spec.ts), run across all three engines;
 *  - the print specs (tests/print/*.spec.ts), run on Chromium only, because
 *    `page.pdf()` -- our ground truth for "how many pages did this actually
 *    print?" -- is Chromium-headless-only.
 *
 * See tests/print/README.md for the print architecture.
 */

/** The static server the whole suite runs against. */
export const PORT = Number(process.env.SF_PORT || 8080);
export const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  /*
   * Plain `http.server` rather than start_studyflix.py: the launcher opens a
   * browser window on every run and hops to the next free port when 8080 is
   * taken, so the URL a test connects to would not be predictable.
   */
  webServer: {
    command: `python3 -m http.server ${PORT} --bind 127.0.0.1`,
    url: `${BASE_URL}/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  projects: [
    // General UI specs. The print specs are excluded: they need the fixed
    // print viewport and PDF support that only the `print` project sets up.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /print\//,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /print\//,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /print\//,
    },

    /*
     * Print geometry project.
     *
     * deviceScaleFactor 1 and --hide-scrollbars keep CSS pixels honest: a
     * scrollbar stealing 15px of viewport width changes text wrapping, which
     * changes card heights, which changes where pages break.
     * --font-render-hinting=none keeps glyph metrics stable across machines.
     */
    {
      name: 'print',
      testMatch: /print\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: 1,
        launchOptions: {
          args: ['--hide-scrollbars', '--font-render-hinting=none'],
        },
      },
    },
  ],
});
