/**
 * Sophia's Math Studio - Grade 5 & 6 Multi-Step Word Problems Engine
 * Curated scenarios for 10-12 year olds with dynamic numbers and step-by-step solutions:
 * - Fractions (recipes, portions, leftover sharing)
 * - Decimals & Money (shopping, sales tax, discounts, tips)
 * - Ratios & Proportions (mixing recipes, maps, scale models)
 * - Percentages (score increases, store discounts, interest)
 * - Pre-Algebra Word Problems (unknowns, age riddles, consecutive numbers)
 * - Geometry & Measurement (flooring, fencing, aquariums, gift boxes)
 * - Speed, Distance & Time (trips, bike rides, train travel)
 */

const WordProblems = (function () {
  const mathEngineRef = (typeof MathEngine !== 'undefined')
    ? MathEngine
    : (typeof require !== 'undefined' ? require('./math-engine') : {});

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const names = ['Sophia', 'Olivia', 'Emma', 'Lucas', 'Mia', 'Noah', 'Liam', 'Ava', 'Ethan', 'Chloe', 'Zoe', 'Alexander', 'Maya', 'Benjamin'];

  const templates = [
    // 1. Fractions: Recipe Scaling
    {
      category: 'fractions',
      topic: 'Fraction Recipe Scaling',
      generate: () => {
        const name = pickRandom(names);
        const cups = pickRandom([
          { text: '3/4', n: 3, d: 4 },
          { text: '2/3', n: 2, d: 3 },
          { text: '1/2', n: 1, d: 2 },
          { text: '3/5', n: 3, d: 5 }
        ]);
        const batches = randomInt(3, 6);
        const totalN = cups.n * batches;
        const sim = (mathEngineRef.simplifyFraction || MathEngine.simplifyFraction)(totalN, cups.d);
        const ans = (mathEngineRef.formatFraction || MathEngine.formatFraction)(sim.n, sim.d, true);

        return {
          question: `${name} is baking cookies for a school fair. Each batch requires ${cups.text} cup of sugar. If ${name} wants to make ${batches} batches, how many cups of sugar will be needed in total?`,
          equation: `${cups.text} × ${batches} = ${ans}`,
          answer: ans,
          altAnswers: [ans, `${sim.n}/${sim.d}`, `${totalN}/${cups.d}`],
          unit: 'cups',
          steps: [
            `Multiply the fraction of sugar per batch by the number of batches: (${cups.n}/${cups.d}) × ${batches}.`,
            `Multiply numerator by ${batches}: (${cups.n} × ${batches}) / ${cups.d} = ${totalN}/${cups.d}.`,
            `Simplify or convert to a mixed number: ${ans} cups.`
          ],
          hint: `Multiply the fraction (${cups.text}) by the number of batches (${batches}).`
        };
      }
    },

    // 2. Fractions: Leftover Fraction / Subtraction
    {
      category: 'fractions',
      topic: 'Fraction Subtraction (Sharing)',
      generate: () => {
        const name1 = pickRandom(names);
        const name2 = pickRandom(names.filter(n => n !== name1));
        const totalPizzas = randomInt(2, 4);
        const d = pickRandom([3, 4, 6, 8]);
        const eatenN = randomInt(d + 1, totalPizzas * d - 1);
        const remN = totalPizzas * d - eatenN;
        const sim = (mathEngineRef.simplifyFraction || MathEngine.simplifyFraction)(remN, d);
        const ans = (mathEngineRef.formatFraction || MathEngine.formatFraction)(sim.n, sim.d, true);

        return {
          question: `${name1} and ${name2} ordered ${totalPizzas} large pizzas. Together, they ate ${(mathEngineRef.formatFraction || MathEngine.formatFraction)(eatenN, d, true)} pizzas. How much pizza was left over?`,
          equation: `${totalPizzas} − ${(mathEngineRef.formatFraction || MathEngine.formatFraction)(eatenN, d, true)} = ${ans}`,
          answer: ans,
          altAnswers: [ans, `${sim.n}/${sim.d}`],
          unit: 'pizzas',
          steps: [
            `Convert ${totalPizzas} whole pizzas to fraction with denominator ${d}: ${totalPizzas * d}/${d}.`,
            `Subtract the fraction eaten (${eatenN}/${d}): (${totalPizzas * d} − ${eatenN}) / ${d} = ${remN}/${d}.`,
            `Simplify to mixed number: ${ans} pizzas.`
          ],
          hint: `Subtract the amount eaten from the total number of pizzas (${totalPizzas}).`
        };
      }
    },

    // 3. Decimals & Money: Shopping & Change
    {
      category: 'decimals',
      topic: 'Decimal Shopping & Change',
      generate: () => {
        const name = pickRandom(names);
        const item1Price = parseFloat((randomInt(5, 18) + randomInt(10, 95) / 100).toFixed(2));
        const item2Price = parseFloat((randomInt(3, 12) + randomInt(10, 95) / 100).toFixed(2));
        const billChoices = [30, 40, 50, 60, 100];
        const subtotal = parseFloat((item1Price + item2Price).toFixed(2));
        const bill = billChoices.find(b => b > subtotal + 5) || 50;
        const change = parseFloat((bill - subtotal).toFixed(2));

        return {
          question: `${name} went to the bookstore and bought a novel for \$${item1Price.toFixed(2)} and a sketchbook for \$${item2Price.toFixed(2)}. ${name} paid with a \$${bill} bill. How much change should ${name} receive?`,
          equation: `\$${bill} − (\$${item1Price.toFixed(2)} + \$${item2Price.toFixed(2)}) = \$${change.toFixed(2)}`,
          answer: `\$${change.toFixed(2)}`,
          altAnswers: [`\$${change.toFixed(2)}`, `${change.toFixed(2)}`, `${change}`],
          unit: 'dollars',
          steps: [
            `Calculate the total cost of the items: \$${item1Price.toFixed(2)} + \$${item2Price.toFixed(2)} = \$${subtotal.toFixed(2)}.`,
            `Subtract the total cost from the \$${bill} bill: \$${bill}.00 − \$${subtotal.toFixed(2)} = \$${change.toFixed(2)}.`
          ],
          hint: `First add the prices of the two items, then subtract that sum from \$${bill}.`
        };
      }
    },

    // 4. Percentages: Discount & Final Sale Price
    {
      category: 'percentages',
      topic: 'Store Discount & Final Price',
      generate: () => {
        const name = pickRandom(names);
        const items = ['backpack', 'pair of sneakers', 'jacket', 'bicycle helmet', 'science kit'];
        const item = pickRandom(items);
        const origPrice = randomInt(4, 18) * 10; // 40 to 180
        const discountPercent = pickRandom([15, 20, 25, 30, 40, 50]);
        const savings = (discountPercent / 100) * origPrice;
        const finalPrice = parseFloat((origPrice - savings).toFixed(2));

        return {
          question: `A ${item} originally costs \$${origPrice}. During a weekend sale, it is discounted by ${discountPercent}%. What is the sale price of the ${item}?`,
          equation: `\$${origPrice} − (${discountPercent}% of \$${origPrice}) = \$${finalPrice.toFixed(2)}`,
          answer: `\$${finalPrice.toFixed(2)}`,
          altAnswers: [`\$${finalPrice.toFixed(2)}`, `${finalPrice.toFixed(2)}`, `${finalPrice}`],
          unit: 'dollars',
          steps: [
            `Find the discount amount: ${discountPercent}% of \$${origPrice} = ( ${discountPercent} / 100 ) × \$${origPrice} = \$${savings.toFixed(2)}.`,
            `Subtract the discount from the original price: \$${origPrice} − \$${savings.toFixed(2)} = \$${finalPrice.toFixed(2)}.`
          ],
          hint: `Find ${discountPercent}% of \$${origPrice}, then subtract that amount from \$${origPrice}.`
        };
      }
    },

    // 5. Ratios & Proportions: Mixing / Recipe
    {
      category: 'ratios',
      topic: 'Ratio & Proportions (Paint Mixing)',
      generate: () => {
        const blueRatio = randomInt(2, 5);
        const yellowRatio = randomInt(3, 7);
        const multiplier = randomInt(3, 9);
        const totalBlue = blueRatio * multiplier;
        const targetYellow = yellowRatio * multiplier;

        return {
          question: `An artist mixes blue paint and yellow paint in a ratio of ${blueRatio} : ${yellowRatio} to make green paint. If the artist uses ${totalBlue} fluid ounces of blue paint, how many fluid ounces of yellow paint are needed?`,
          equation: `${blueRatio} : ${yellowRatio} = ${totalBlue} : ${targetYellow}`,
          answer: targetYellow.toString(),
          altAnswers: [targetYellow.toString(), `${targetYellow} ounces`, `${targetYellow} oz`],
          unit: 'fluid ounces',
          steps: [
            `Set up the proportion: ${blueRatio} / ${yellowRatio} = ${totalBlue} / x.`,
            `Find the scaling multiplier: ${totalBlue} ÷ ${blueRatio} = ${multiplier}.`,
            `Multiply the yellow paint ratio by ${multiplier}: ${yellowRatio} × ${multiplier} = ${targetYellow} fl oz.`
          ],
          hint: `Determine how many times ${blueRatio} goes into ${totalBlue} (${totalBlue} ÷ ${blueRatio}), then multiply by ${yellowRatio}.`
        };
      }
    },

    // 6. Pre-Algebra: Two-Step Word Riddle
    {
      category: 'algebra',
      topic: 'Two-Step Equation Word Problem',
      generate: () => {
        const name1 = pickRandom(names);
        const name2 = pickRandom(names.filter(n => n !== name1));
        const multiplier = randomInt(2, 4);
        const extra = randomInt(3, 12);
        const books2 = randomInt(8, 25);
        const totalBooks1 = multiplier * books2 + extra;

        return {
          question: `${name1} has ${totalBooks1} books in her collection. She has ${extra} more than ${multiplier} times the number of books ${name2} has. How many books does ${name2} have?`,
          equation: `${multiplier}x + ${extra} = ${totalBooks1} ➔ x = ${books2}`,
          answer: books2.toString(),
          altAnswers: [books2.toString(), `${books2} books`],
          unit: 'books',
          steps: [
            `Let x be the number of books ${name2} has.`,
            `Write the equation: ${multiplier}x + ${extra} = ${totalBooks1}.`,
            `Subtract ${extra} from both sides: ${multiplier}x = ${totalBooks1 - extra}.`,
            `Divide by ${multiplier}: x = ${totalBooks1 - extra} ÷ ${multiplier} = ${books2}.`
          ],
          hint: `First subtract ${extra} from ${totalBooks1}, then divide by ${multiplier}.`
        };
      }
    },

    // 7. Geometry: Area & Cost of Carpeting
    {
      category: 'geometry',
      topic: 'Area & Cost of Flooring',
      generate: () => {
        const name = pickRandom(names);
        const length = randomInt(10, 16);
        const width = randomInt(8, 14);
        const costPerSqFt = randomInt(3, 8);
        const area = length * width;
        const totalCost = area * costPerSqFt;

        return {
          question: `${name} wants to install new carpet in a rectangular room that is ${length} feet long and ${width} feet wide. If the carpet costs \$${costPerSqFt} per square foot, what is the total cost to carpet the room?`,
          equation: `(${length} × ${width}) × \$${costPerSqFt} = \$${totalCost}`,
          answer: `\$${totalCost}`,
          altAnswers: [`\$${totalCost}`, `${totalCost}`, `${totalCost.toFixed(2)}`],
          unit: 'dollars',
          steps: [
            `Calculate the area of the rectangular room: Area = length × width = ${length} ft × ${width} ft = ${area} sq ft.`,
            `Multiply the area by the price per square foot: ${area} sq ft × \$${costPerSqFt}/sq ft = \$${totalCost}.`
          ],
          hint: `First find the area (length × width), then multiply the area by \$${costPerSqFt}.`
        };
      }
    },

    // 8. Geometry: Aquarium Volume
    {
      category: 'geometry',
      topic: 'Volume of an Aquarium',
      generate: () => {
        const l = randomInt(20, 36);
        const w = randomInt(10, 18);
        const h = randomInt(12, 24);
        const vol = l * w * h;

        return {
          question: `An aquarium shaped like a rectangular prism measures ${l} inches long, ${w} inches wide, and ${h} inches deep. What is the total volume of the aquarium in cubic inches?`,
          equation: `${l} × ${w} × ${h} = ${vol}`,
          answer: vol.toString(),
          altAnswers: [vol.toString(), `${vol} cu in`, `${vol} cubic inches`, `${vol} in³`],
          unit: 'cubic inches',
          steps: [
            `Use the rectangular prism volume formula: V = length × width × height.`,
            `Calculate: ${l} × ${w} × ${h} = ${vol} cubic inches.`
          ],
          hint: `Multiply length × width × height.`
        };
      }
    },

    // 9. Speed, Distance & Time
    {
      category: 'rates',
      topic: 'Distance, Speed & Travel Time',
      generate: () => {
        const name = pickRandom(names);
        const speed = pickRandom([45, 50, 55, 60, 65]);
        const hours = randomInt(3, 7);
        const totalDistance = speed * hours;

        return {
          question: `${name}'s family went on a road trip. They drove at an average speed of ${speed} miles per hour for ${hours} hours without stopping. How many miles did they drive?`,
          equation: `${speed} mph × ${hours} hours = ${totalDistance} miles`,
          answer: totalDistance.toString(),
          altAnswers: [totalDistance.toString(), `${totalDistance} miles`],
          unit: 'miles',
          steps: [
            `Distance formula: Distance = Speed × Time.`,
            `Calculate: ${speed} miles/hour × ${hours} hours = ${totalDistance} miles.`
          ],
          hint: `Multiply the average speed (${speed}) by the travel time (${hours} hours).`
        };
      }
    },

    // 10. Unit Price Comparison (Better Buy)
    {
      category: 'decimals',
      topic: 'Unit Price Comparison',
      generate: () => {
        const name = pickRandom(names);
        const pack1Count = 6;
        const pack1Price = 7.20;
        const unit1 = pack1Price / pack1Count; // 1.20

        const pack2Count = 10;
        const pack2Price = 11.00;
        const unit2 = pack2Price / pack2Count; // 1.10

        return {
          question: `${name} is buying notebooks. Store A offers a pack of 6 notebooks for \$7.20. Store B offers a pack of 10 notebooks for \$11.00. What is the unit price per notebook at Store B?`,
          equation: `\$11.00 ÷ 10 = \$1.10 per notebook`,
          answer: '\$1.10',
          altAnswers: ['\$1.10', '1.10', '1.1', '\$1.1'],
          unit: 'dollars per notebook',
          steps: [
            `Calculate unit price at Store B: Total Price ÷ Number of Notebooks = \$11.00 ÷ 10 = \$1.10 per notebook.`
          ],
          hint: `Divide the total cost at Store B (\$11.00) by the number of notebooks (10).`
        };
      }
    },

    // 11. Statistics: Target Mean Quiz Score
    {
      category: 'statistics',
      topic: 'Target Mean Quiz Score',
      generate: () => {
        const name = pickRandom(names);
        const count = 4;
        const targetMean = randomInt(84, 92);
        const totalNeeded = targetMean * count;
        
        let score1 = targetMean + randomInt(-8, 8);
        let score2 = targetMean + randomInt(-8, 8);
        let score3 = targetMean + randomInt(-8, 8);
        let sumKnown = score1 + score2 + score3;
        let score4 = totalNeeded - sumKnown;

        if (score4 > 100 || score4 < 70) {
          score1 = targetMean - 2;
          score2 = targetMean + 4;
          score3 = targetMean - 6;
          sumKnown = score1 + score2 + score3;
          score4 = totalNeeded - sumKnown;
        }

        return {
          question: `${name} has taken 3 math quizzes this term with scores of ${score1}, ${score2}, and ${score3}. What score must ${name} earn on the 4th quiz to achieve an overall mean (average) score of ${targetMean}?`,
          equation: `(${score1} + ${score2} + ${score3} + x) ÷ 4 = ${targetMean} ➔ x = ${score4}`,
          answer: score4.toString(),
          altAnswers: [score4.toString(), `${score4} marks`, `${score4}%`],
          unit: 'marks',
          steps: [
            `Find the total points needed for all 4 quizzes: 4 × ${targetMean} = ${totalNeeded}.`,
            `Add the first 3 quiz scores: ${score1} + ${score2} + ${score3} = ${sumKnown}.`,
            `Subtract the current total from the needed total: ${totalNeeded} − ${sumKnown} = ${score4}.`
          ],
          hint: `Multiply the target average (${targetMean}) by 4, then subtract the sum of the first 3 quiz scores.`
        };
      }
    },

    // 12. Statistics: Median Running Times
    {
      category: 'statistics',
      topic: 'Median Race Times',
      generate: () => {
        const name = pickRandom(names);
        const rawTimes = [
          randomInt(18, 22),
          randomInt(23, 26),
          randomInt(27, 30),
          randomInt(31, 35),
          randomInt(36, 40)
        ];
        const shuffled = shuffle(rawTimes);
        const sorted = [...rawTimes].sort((a, b) => a - b);
        const medianTime = sorted[2];

        return {
          question: `${name} recorded 5 km training run times over 5 consecutive days: ${shuffled.join(' min, ')} min. What was ${name}'s median running time?`,
          equation: `Sorted: [ ${sorted.join(', ')} ] ➔ Median = ${medianTime} min`,
          answer: `${medianTime}`,
          altAnswers: [`${medianTime}`, `${medianTime} min`, `${medianTime} minutes`],
          unit: 'minutes',
          steps: [
            `Arrange the running times in ascending order: [ ${sorted.join(', ')} ].`,
            `Identify the middle value in the 5-number list: the 3rd number is ${medianTime} minutes.`
          ],
          hint: `Put the 5 times in order from shortest to longest, then select the middle time.`
        };
      }
    },

    // 13. Statistics: Temperature Range in Canadian Cities
    {
      category: 'statistics',
      topic: 'Canadian City Temperature Range',
      generate: () => {
        const cities = ['Ottawa', 'Toronto', 'Calgary', 'Montreal', 'Vancouver', 'Halifax'];
        const city = pickRandom(cities);
        const lowTemp = randomInt(-6, 12);
        const tempSpread = randomInt(9, 18);
        const highTemp = lowTemp + tempSpread;

        return {
          question: `During an autumn week in ${city}, the highest recorded daytime temperature was ${highTemp}°C and the lowest nighttime temperature was ${lowTemp}°C. What was the temperature range in ${city}?`,
          equation: `${highTemp}°C − (${lowTemp}°C) = ${tempSpread}°C`,
          answer: `${tempSpread}`,
          altAnswers: [`${tempSpread}`, `${tempSpread}°C`, `${tempSpread} degrees`],
          unit: '°C',
          steps: [
            `Range formula: Range = Maximum Value − Minimum Value.`,
            `Calculate: ${highTemp}°C − (${lowTemp}°C) = ${tempSpread}°C.`
          ],
          hint: `Subtract the lowest temperature (${lowTemp}°C) from the highest temperature (${highTemp}°C).`
        };
      }
    },

    // 14. Statistics: Mode of Soccer Goals
    {
      category: 'statistics',
      topic: 'Mode of Soccer Goals',
      generate: () => {
        const teamName = pickRandom(['Maple Leafs Junior', 'Ottawa Senators Youth', 'Hamilton Hornets', 'York United']);
        const modeVal = randomInt(2, 4);
        const games = [modeVal, modeVal, modeVal, modeVal + 1, modeVal - 1, modeVal + 2, 0];
        const shuffled = [...games].sort(() => Math.random() - 0.5);

        return {
          question: `The ${teamName} soccer team scored the following number of goals in their last 7 matches: [ ${shuffled.join(', ')} ]. What is the mode of goals scored?`,
          equation: `Mode of [ ${shuffled.join(', ')} ] = ${modeVal}`,
          answer: `${modeVal}`,
          altAnswers: [`${modeVal}`, `${modeVal} goals`],
          unit: 'goals',
          steps: [
            `Count the frequency of each goal tally:`,
            `Number ${modeVal} occurred 3 times, while all other numbers occurred once.`,
            `The mode is ${modeVal} goals.`
          ],
          hint: `Find the number of goals that occurred most frequently in the list.`
        };
      }
    },

    // 15. Enriched Fraction of Remainder (Singapore Math / Waterloo Challenge)
    {
      category: 'fractions',
      topic: 'Fraction of Remainder (Multi-Step)',
      generate: () => {
        const name = pickRandom(names);
        const relative = pickRandom(['brother', 'sister', 'cousin', 'friend']);
        const liquid = pickRandom(['fresh lemonade', 'maple iced tea', 'apple cider', 'fruit punch', 'blueberry juice']);
        
        // Choose parameters that yield clean fractional reductions:
        // Initial: 4 4/5 L = 24/5 L
        // Frac 1: 1/4 -> Person gets 6/5 L, Remainder 1 = 18/5 L
        // Frac 2: 1/9 of Remainder 1 -> Drank 2/5 L, Remainder 2 = 16/5 L
        // Frac 3: 1/2 of Remainder 2 -> Used 8/5 L, Final Left = 8/5 L
        // Diff = |8/5 - 6/5| = 2/5 L
        const scenarios = [
          {
            initWhole: 4, initNum: 4, initDen: 5, // 24/5 L
            f1Num: 1, f1Den: 4, // 1/4
            f2Num: 1, f2Den: 9, // 1/9
            f3Text: 'half', f3Num: 1, f3Den: 2, // 1/2
            personVal: '1 1/5', personN: 6, personD: 5,
            rem1Val: '3 3/5', rem1N: 18, rem1D: 5,
            drankVal: '2/5', drankN: 2, drankD: 5,
            rem2Val: '3 1/5', rem2N: 16, rem2D: 5,
            finalVal: '1 3/5', finalN: 8, finalD: 5,
            diffVal: '2/5', diffN: 2, diffD: 5
          },
          {
            initWhole: 3, initNum: 3, initDen: 4, // 15/4 L
            f1Num: 1, f1Den: 3, // 1/3 -> Person gets 5/4 L, Rem 1 = 10/4 = 5/2 L
            f2Num: 1, f2Den: 5, // 1/5 -> Drank 1/2 L, Rem 2 = 2 L = 4/2 L
            f3Text: 'half', f3Num: 1, f3Den: 2, // 1/2 -> Used 1 L, Final Left = 1 L = 4/4 L
            personVal: '1 1/4', personN: 5, personD: 4,
            rem1Val: '2 1/2', rem1N: 5, rem1D: 2,
            drankVal: '1/2', drankN: 1, drankD: 2,
            rem2Val: '2', rem2N: 2, rem2D: 1,
            finalVal: '1', finalN: 1, finalD: 1,
            diffVal: '1/4', diffN: 1, diffD: 4
          },
          {
            initWhole: 5, initNum: 1, initDen: 3, // 16/3 L
            f1Num: 1, f1Den: 4, // 1/4 -> Person gets 4/3 L, Rem 1 = 12/3 = 4 L
            f2Num: 1, f2Den: 4, // 1/4 -> Drank 1 L, Rem 2 = 3 L
            f3Text: 'half', f3Num: 1, f3Den: 2, // 1/2 -> Used 1 1/2 L = 3/2 L, Final Left = 3/2 L
            personVal: '1 1/3', personN: 4, personD: 3,
            rem1Val: '4', rem1N: 4, rem1D: 1,
            drankVal: '1', drankN: 1, drankD: 1,
            rem2Val: '3', rem2N: 3, rem2D: 1,
            finalVal: '1 1/2', finalN: 3, finalD: 2,
            diffVal: '1/6', diffN: 1, diffD: 6
          }
        ];

        const sc = pickRandom(scenarios);
        const initText = `${sc.initWhole} ${sc.initNum}/${sc.initDen}`;
        const f1Text = `${sc.f1Num}/${sc.f1Den}`;
        const f2Text = `${sc.f2Num}/${sc.f2Den}`;

        const question = `${name} had ${initText} L of ${liquid}. After giving ${f1Text} of it to her ${relative}, she drank ${f2Text} of what she still had. She then used ${sc.f3Text} of the remaining ${liquid} for a science club event. What is the difference between what ${name} had left and what she gave to her ${relative}?`;

        const steps = [
          `Step 1: Find how much ${name} gave to her ${relative}: (${f1Text}) × (${initText} L) = (${sc.f1Num}/${sc.f1Den}) × (${sc.initWhole * sc.initDen + sc.initNum}/${sc.initDen}) = ${sc.personVal} L.`,
          `Step 2: Find the remaining amount: ${initText} L − ${sc.personVal} L = ${sc.rem1Val} L.`,
          `Step 3: Calculate how much she drank: (${f2Text}) of (${sc.rem1Val} L) = ${sc.drankVal} L.`,
          `Step 4: Find the second remainder: ${sc.rem1Val} L − ${sc.drankVal} L = ${sc.rem2Val} L.`,
          `Step 5: She used half of ${sc.rem2Val} L for the event, leaving: ${sc.finalVal} L.`,
          `Step 6: Find the difference between what she had left (${sc.finalVal} L) and what she gave her ${relative} (${sc.personVal} L): |${sc.finalVal} − ${sc.personVal}| = ${sc.diffVal} L.`
        ];

        return {
          question,
          equation: `Difference = |${sc.finalVal} L − ${sc.personVal} L| = ${sc.diffVal} L`,
          answer: sc.diffVal,
          altAnswers: [sc.diffVal, `${sc.diffVal} L`, `${sc.diffVal} liters`, `${sc.diffVal} litres`],
          unit: 'L',
          steps,
          hint: `Work step by step: (1) Find ${f1Text} of ${initText} L. (2) Subtract to find remainder 1. (3) Find ${f2Text} of remainder 1. (4) Subtract to find remainder 2. (5) Take half of remainder 2. (6) Subtract what was given to the ${relative} from what was left.`
        };
      }
    },

    // 16. Working Backwards with Fractions (Remainder Chain)
    {
      category: 'fractions',
      topic: 'Working Backwards (Fraction Chain)',
      generate: () => {
        const name = pickRandom(names);
        const item = pickRandom(['blueberry muffins', 'maple cookies', 'granola bars', 'apple tarts']);
        
        // Let Total = 60, Rem 1 (after giving 1/3) = 40, Rem 2 (after giving 1/4 of rem) = 30, Final left (after giving 1/2 of rem) = 15
        const scenarios = [
          { f1Text: '1/3', f2Text: '1/4', f3Text: 'half', left: 15, total: 60 },
          { f1Text: '1/4', f2Text: '1/3', f3Text: 'half', left: 12, total: 48 },
          { f1Text: '1/5', f2Text: '1/2', f3Text: 'half', left: 8, total: 40 },
          { f1Text: '1/2', f2Text: '1/3', f3Text: 'half', left: 9, total: 54 }
        ];

        const sc = pickRandom(scenarios);
        const question = `${name} baked a tray of fresh ${item}. She gave ${sc.f1Text} of the total to her class. Of the remaining ${item}, she gave ${sc.f2Text} to her neighbours. Finally, she gave ${sc.f3Text} of what was left to her family. If ${name} has ${sc.left} ${item} left for herself, how many ${item} did she bake in total?`;

        const steps = [
          `Method 1: Fraction of the Whole method:`,
          `• Fraction remaining after class: 1 − ${sc.f1Text} = ${(sc.f1Text === '1/3' ? '2/3' : sc.f1Text === '1/4' ? '3/4' : sc.f1Text === '1/5' ? '4/5' : '1/2')}`,
          `• Fraction remaining after neighbours: (1 − ${sc.f2Text}) × (previous remainder)`,
          `• Fraction remaining after family: (1/2) × (previous remainder) = ${(sc.left / sc.total === 0.25 ? '1/4' : sc.left / sc.total === 0.2 ? '1/5' : '1/6')}`,
          `Method 2: Working Backwards step by step:`,
          `1. Before giving to family (${sc.f3Text}): ${sc.left} × 2 = ${sc.left * 2}.`,
          `2. Before giving to neighbours (${sc.f2Text}): (${sc.left * 2}) ÷ (1 − ${sc.f2Text}) = ${Math.round((sc.left * 2) / (1 - eval(sc.f2Text)))}.`,
          `3. Before giving to class (${sc.f1Text}): Total = (${Math.round((sc.left * 2) / (1 - eval(sc.f2Text)))}) ÷ (1 − ${sc.f1Text}) = ${sc.total}.`
        ];

        return {
          question,
          equation: `Final ${sc.left} ➔ Initial Total = ${sc.total}`,
          answer: sc.total.toString(),
          altAnswers: [sc.total.toString(), `${sc.total} ${item}`],
          unit: item,
          steps,
          hint: `Work backwards from ${sc.left}: double it first, then divide by the fraction remaining at each previous stage.`
        };
      }
    }
  ];

  function generateWordProblem(category = 'all') {
    let pool = templates;
    if (category !== 'all') {
      pool = templates.filter(t => t.category === category);
      if (pool.length === 0) pool = templates;
    }
    const template = pickRandom(pool);
    const item = template.generate();
    return {
      type: 'word_problem',
      category: 'Word Problems',
      topic: template.topic,
      prompt: item.question,
      htmlQuestion: `<div class="word-problem-text">${item.question}</div>`,
      equation: item.equation,
      answer: item.answer,
      altAnswers: item.altAnswers || [item.answer],
      steps: item.steps,
      hint: item.hint
    };
  }

  return {
    generateWordProblem,
    templates
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WordProblems;
}
