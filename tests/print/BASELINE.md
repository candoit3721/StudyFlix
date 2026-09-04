# Print defect baseline

Captured before the measurement-based paginator landed, by
`tests/print/baseline-evidence.spec.ts` run at the **true printable width**
(739.2px = 8.5in - 2 x 0.4in margin), which `00-calibration.spec.ts` proved is
the only viewport at which print geometry can be measured honestly.

Printable page box for US Letter at 0.4in margins: **739.2 x 979.2 px**.

| Case | Measured | Verdict |
| --- | --- | --- |
| Olivia, horizontal, 4 columns, 2 pages | sheet 1 = **1016.3px**, sheet 2 = **983.6px** | **OVER** by 37.1px and 4.4px |
| Olivia, vertical, 2 columns, 3 pages | 954.3 / 921.6 / 921.6px | fits |
| Sophia, answer key, 6 pages of questions | **1304px** | **OVER** by 324.8px |
| Sophia, 4 pages + answer key | 5 sheets, 5 PDF pages | fits |
| Sophia Rome workbook | 2 sheets, **3 PDF pages** | **trailing blank page** |
| Mama workbook | 2 sheets, 2 PDF pages | fits |
| Olivia clock, print from the top bar without opening the worksheet view | **0 clocks rendered** | **prints a blank worksheet** |

## Why the pre-existing test suite missed all of this

`tests/sophia_print.spec.ts` measures whatever viewport it is handed. In
practice that is 816px -- the *full page width*, margins included. Text
therefore wraps 77px wider than it really will, cards come out shorter than
they really are, and every sheet looks like it fits. The suite passed while
real printing overflowed.

The same run also shows sheet heights of 802 / 758 / **444**px for a single
worksheet, which is the ragged trailing page the even-spread heuristic in
`getEffectiveQuestionsPerPage()` was supposed to prevent.

## What this proves about the root cause

The vertical/horizontal asymmetry the user reported is not a CSS break-rule
problem. Olivia's horizontal density cap is `cols * 7` and its vertical cap is
`cols * 4` (`olivia-math/js/app.js:291`). Vertical fits at 954px; horizontal
overshoots at 1016px. The constant `7` is simply wrong for 4 columns, and
nothing in the system can notice -- because nothing measures.
