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
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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
        const sim = MathEngine.simplifyFraction(totalN, cups.d);
        const ans = MathEngine.formatFraction(sim.n, sim.d, true);

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
        const sim = MathEngine.simplifyFraction(remN, d);
        const ans = MathEngine.formatFraction(sim.n, sim.d, true);

        return {
          question: `${name1} and ${name2} ordered ${totalPizzas} large pizzas. Together, they ate ${MathEngine.formatFraction(eatenN, d, true)} pizzas. How much pizza was left over?`,
          equation: `${totalPizzas} − ${MathEngine.formatFraction(eatenN, d, true)} = ${ans}`,
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
