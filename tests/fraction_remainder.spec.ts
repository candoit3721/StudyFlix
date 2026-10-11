import { test, expect } from '@playwright/test';

/**
 * The "fraction of a remainder" generator (sophia-math/js/fraction-remainder.js).
 *
 * The fuzz test re-derives every answer with its own arithmetic from the
 * problem's structured facts (`meta`), so a bug in the generator's chain, its
 * number choice or its answer selection cannot hide behind text that merely
 * looks right.
 */

const STUDIO = '/sophia-math/index.html';

test.describe('Fraction of a remainder generator', () => {
  test('every generated problem is exact, clean and self-consistent', async ({ page }) => {
    await page.goto(`${STUDIO}?category=fraction_remainder`, { waitUntil: 'domcontentloaded' });

    const failures = await page.evaluate(() => {
      type R = { n: number; d: number };
      const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
      const r = (n: number, d = 1): R => {
        const g = gcd(n, d) || 1;
        return { n: n / g, d: d / g };
      };
      const mul = (a: R, b: R) => r(a.n * b.n, a.d * b.d);
      const sub = (a: R, b: R) => r(a.n * b.d - b.n * a.d, a.d * b.d);
      const add = (a: R, b: R) => r(a.n * b.d + b.n * a.d, a.d * b.d);
      const div = (a: R, b: R) => r(a.n * b.d, a.d * b.n);
      const same = (a: R, b: R) => a.n * b.d === b.n * a.d;
      const ONE = r(1);
      const text = (q: R) => {
        if (q.d === 1) return String(q.n);
        const w = Math.floor(q.n / q.d);
        return w ? `${w} ${q.n - w * q.d}/${q.d}` : `${q.n}/${q.d}`;
      };
      const parse = (s: string): R => {
        const m = s.match(/^(?:(\d+) )?(\d+)(?:\/(\d+))?$/);
        if (!m) return r(NaN);
        if (m[3] === undefined) return r(Number(m[2]));
        return add(r(Number(m[1] || 0)), r(Number(m[2]), Number(m[3])));
      };

      // A top-level `const` in a classic script is global but not on window.
      const FR = (window as any).eval('FractionRemainder');
      const out: string[] = [];
      const seen = new Set<string>();

      for (let i = 0; i < 4000 && out.length < 10; i++) {
        const p = FR.generate(i % 3 === 0 ? 'backwards' : 'all');
        const m = p.meta;
        seen.add(m.variant);
        const fail = (why: string) => out.push(`${m.variant}: ${why} :: ${p.prompt}`);

        // Re-run the chain independently.
        const [f1, f2, f3] = m.fractions;
        const S = m.start;
        const t1 = mul(S, f1);
        const r1 = sub(S, t1);
        const t2 = m.fixed ? m.fixed : mul(r1, f2);
        const r2 = sub(r1, t2);
        const t3 = mul(r2, f3);
        const r3 = sub(r2, t3);
        const chain = { t1, r1, t2, r2, t3, r3 };
        for (const [k, v] of Object.entries(chain)) {
          if (!same(v, m.amounts[k])) fail(`${k} is ${text(m.amounts[k])}, expected ${text(v)}`);
          if (v.n <= 0) fail(`${k} is not positive`);
          if (v.d > 12) fail(`${k} has denominator ${v.d}`);
          if (m.kind !== 'measure' && v.d !== 1) fail(`${k} is not a whole number`);
        }

        let expected: R;
        switch (m.variant) {
          case 'left': case 'repeat': expected = r3; break;
          case 'middle': expected = t2; break;
          case 'firstTwo': expected = add(t1, t2); break;
          case 'fraction': expected = div(r3, S); break;
          case 'backwards': expected = S; break;
          case 'twoPeople': {
            const other = mul(t1, sub(ONE, m.secondFraction));
            const d = sub(r3, other);
            expected = d.n < 0 ? r(-d.n, d.d) : d;
            break;
          }
          default: {
            const d = sub(r3, t1);
            expected = d.n < 0 ? r(-d.n, d.d) : d;
          }
        }
        if (!same(expected, m.answer)) fail(`answer ${text(m.answer)}, expected ${text(expected)}`);
        if (expected.n <= 0) fail('answer is not positive');
        if (m.variant !== 'fraction' && expected.d > 12) fail(`answer has denominator ${expected.d}`);
        if (!same(parse(p.answer), expected)) fail(`answer text "${p.answer}" does not equal ${text(expected)}`);
        if (m.variant === 'repeat' && !(same(f1, f2) && same(f2, f3))) fail('repeat uses different fractions');

        // The story states what the solver needs, and nothing leaked.
        const given = m.variant === 'backwards' ? r3 : S;
        if (!p.prompt.includes(text(given))) fail(`prompt does not state ${text(given)}`);
        const all = [p.prompt, p.htmlQuestion, p.answerDisplay, ...p.steps, ...p.keySteps, p.hint].join(' ');
        if (/undefined|NaN|null|\[object/.test(all)) fail('text contains a placeholder');
        if (!p.steps.length || !p.keySteps.length) fail('no worked solution');
        if (!p.altAnswers.includes(p.answer)) fail('altAnswers omit the answer');
      }

      const missing = FR.variants.filter((v: string) => !seen.has(v));
      if (missing.length) out.push(`variants never generated: ${missing.join(', ')}`);
      return out;
    });

    expect(failures).toEqual([]);
  });

  test('the preset prints a worksheet with a worked answer key', async ({ page }) => {
    await page.goto(`${STUDIO}?preset=g5_6_fraction_remainder`, { waitUntil: 'load' });
    await page.waitForFunction(() => document.documentElement.dataset.sfPrintReady === '1');

    const cards = page.locator('.sf-sheet:not(.sf-measuring) .problem-card');
    await expect(cards.first()).toBeVisible();
    await expect(cards.first().locator('.q-topic')).toHaveText(/Fraction of a Remainder|Working Backwards/);
    await expect(cards.first().locator('.fraction').first()).toBeVisible();

    const key = page.locator('.answer-key-sheet').first();
    await expect(key.locator('.compact-key-grid--worked')).toBeVisible();
    const firstKey = key.locator('.key-item').first();
    expect(await firstKey.locator('.key-worked-steps li').count()).toBeGreaterThanOrEqual(3);
  });

  test('practice mode accepts the generated answer, with or without units', async ({ page }) => {
    await page.goto(`${STUDIO}?preset=g5_6_fraction_backwards`, { waitUntil: 'load' });
    await page.waitForFunction(() => document.documentElement.dataset.sfPrintReady === '1');
    await page.getByText('Practice Online').click();

    const card = page.locator('.problem-card').first();
    await card.locator('button:has-text("Step-by-Step")').click();
    const answerLine = await card.locator('.steps-box div').last().textContent();
    const answer = answerLine!.replace(/^Answer:\s*/, '').replace(/ /g, ' ').trim();
    const bare = answer.replace(/^\$/, '').replace(/ (L|kg|m|[a-z ]+)$/, '');

    for (const typed of [answer, bare]) {
      await card.locator('.student-input').fill(typed);
      await card.locator('.student-input').press('Enter');
      await expect(card.locator('.feedback-badge')).toHaveText(/correct/i);
    }
  });
});

test.describe('Hub: random sets for fixed worksheets', () => {
  test('a fixed worksheet card offers a random set of the same kind', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'load' });
    await page.locator('.profile-name', { hasText: 'Sophia' }).click();
    const card = page.locator('#row-printable-slider .media-card', { hasText: 'Fraction Word Problems' });

    // The card itself still opens the fixed worksheet, even clicked dead centre.
    await card.click();
    await expect(page.locator('#studio-iframe')).toHaveAttribute('src', /reader\.html\?src=.*set2\.md/);
    await page.evaluate(() => (window as any).closeStudioViewer());

    await card.locator('.card-random').click();
    await expect(page.locator('#studio-iframe')).toHaveAttribute(
      'src',
      'sophia-math/index.html?preset=g5_6_fraction_remainder',
    );
    await expect(page.locator('#studio-viewer-title')).toContainText('Random Set');
    await expect(
      page.frameLocator('#studio-iframe').locator('.sf-sheet:not(.sf-measuring) .problem-card').first(),
    ).toBeVisible();
  });

  test('only cards with a generator get the random-set action', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'load' });
    await page.locator('.profile-name', { hasText: 'Sophia' }).click();
    const row = page.locator('#row-printable-slider');
    await expect(row.locator('.media-card', { hasText: 'Ancient Rome Workbook' }).locator('.card-random')).toHaveCount(0);
    await expect(row.locator('.media-card', { hasText: 'Statistics' }).locator('.card-random')).toHaveCount(1);
  });

  test('both card actions are reachable from the keyboard', async ({ page, browserName }) => {
    // WebKit (like Safari) only tabs to buttons when macOS Full Keyboard
    // Access is switched on, which a headless run cannot assume.
    test.skip(browserName === 'webkit', 'WebKit tabs to buttons only with Full Keyboard Access');
    await page.goto('/index.html', { waitUntil: 'load' });
    await page.locator('.profile-name', { hasText: 'Sophia' }).click();
    const card = page.locator('#row-printable-slider .media-card', { hasText: 'Fraction Word Problems' });
    await card.locator('.card-open').focus();
    await page.keyboard.press('Tab');
    await expect(card.locator('.card-random')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#studio-iframe')).toHaveAttribute('src', /preset=g5_6_fraction_remainder/);
  });
});
