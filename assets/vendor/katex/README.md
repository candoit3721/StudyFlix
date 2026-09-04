# Vendored KaTeX 0.16.9

Copied from the `katex` npm package (`dist/katex.min.js`,
`dist/contrib/auto-render.min.js`, `dist/katex.min.css`, `dist/fonts/`).

## Why vendored rather than loaded from a CDN

Yaya's exam paper used to pull KaTeX from `cdn.jsdelivr.net`. That made print
fidelity depend on the network: with no connection every formula printed as
raw `$...$` source text at a completely different height from the typeset
version, so the page breaks were computed for one document and the printout
was another.

It also made pagination non-deterministic in CI. `assets/sf/paginate.js`
measures real rendered heights, and KaTeX ships its own fonts -- a run where
the CDN was slow or blocked measured fallback-font metrics and cut the pages
in the wrong places.

Serving it from the repo makes the printed page identical online and offline,
which is the point: these worksheets are printed at a kitchen table.

## Updating

Reinstall the package and re-copy the four paths above. Keep the version in
this file in step, and rerun `npx playwright test --project=print`, which
covers yaya with the network blocked.
