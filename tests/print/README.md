# Print testing

Everything that reaches a printer is verified here.

## Why this exists

Pagination used to be decided by hard-coded constants derived from one-off
manual measurements:

```js
sophia:  cols * (workspace ? 3 : 4)
olivia:  layoutFormat === 'horizontal' ? cols * 7 : cols * 4
yaya:    workspace ? 3 : 4
```

Nothing measured anything, so every constant expired the moment a card, a font
or a padding changed, and nothing could notice.
Olivia's horizontal layout at four columns overflowed a Letter page by 37px
while vertical at two columns fit, which is the asymmetry that was reported.
The answer keys were never paginated at all.
`BASELINE.md` records the measurements taken before the fix.

The studios now delegate to `assets/sf/paginate.js`, which lays the real cards
out in the real print box and cuts pages where the content says to.

## Running

```bash
npx playwright test --project=print                      # the full matrix (~505 cases, ~60s)
npx playwright test --project=print --grep "@print-smoke"  # the fast set (~62 cases, ~15s)
```

CI runs the smoke set on every push and the full matrix nightly and on `main`.

The matrix runs **unseeded on purpose**.
Measurement-based pagination is supposed to be correct for any content, so
every run is a fresh fuzz of the question space.
Pass `?seed=<int>` on any studio URL to reproduce a specific worksheet.

## Files

| File | Role |
| --- | --- |
| `manifest.ts` | Every printable artifact. One entry enrols a page in the whole suite. |
| `matrix.ts` | Which layout combinations to test, per printable. |
| `helpers.ts` | Viewport setup, measurement, and the shared assertions. |
| `00-calibration.spec.ts` | Pins what Chromium actually does in print media. Read this first. |
| `all-printables.spec.ts` | The generic suite: every printable, every combination. |
| `css-contract.spec.ts` | Pins `@page` against the geometry variables, and the break rules. |
| `manifest-coverage.spec.ts` | Fails CI if a printable exists that the manifest does not know about. |
| `paginator.spec.ts` | `assets/sf/paginate.js` in isolation, against ragged synthetic content. |
| `regressions.spec.ts` | One test per defect that was actually reported or measured. |
| `BASELINE.md` | The before-fix measurements. |

## Adding a printable

1. Add an entry to `PRINTABLES` in `manifest.ts`.
2. Add a case generator to `matrix.ts` and call it from `allCases()`.

That is all: `all-printables.spec.ts` and `css-contract.spec.ts` pick it up
automatically. If you skip step 1, `manifest-coverage.spec.ts` fails the build.

## The two rules a printable must follow

**1. The sheet box is identical on screen and in print.**
Load `assets/sf/print.css`, put `.sf-sheet` on each page element, and let it
own the box model.
Pagination measures on screen, so a print-only size override means the page
breaks were computed for a document that is not the one being printed.
That was a real defect: `margin-bottom: 16px` applied only in print made every
yaya card 16px taller on paper than when it was measured.
Declare geometry once, for both media; `css-contract.spec.ts` enforces it.

**2. Nothing atomic is bigger than a page.**
`break-inside: avoid` belongs on cards (`.sf-card`, `.sf-key-item`), never on a
sheet.
An unbreakable full-page element that overflows gets pushed whole to the next
page and leaves a blank one behind, which is where the reported blank pages
came from.

## How the assertions decide a page is correct

Per sheet: it fits the printable box, its content does not overflow it, no card
crosses the boundary, it is not blank, and it is splittable.
Per document: the sheet count matches what was requested, the last sheet forces
no break, and `__sfPrint.overflowRows` is zero.

On the smoke subset, `page.pdf()` provides ground truth: the PDF must have
exactly one page per sheet.
Together with the per-sheet height check that is sufficient by pigeonhole -- if
every sheet fits one page and the counts match, nothing spilled and nothing was
left blank.
