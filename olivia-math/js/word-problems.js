/**
 * Olivia's Math Worksheet - Grade 3 Word Problems Generator
 * Curated scenarios for 8-9 year olds with varied topics and dynamic numbers.
 */

const WordProblems = (function () {
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const names = ['Olivia', 'Emma', 'Lucas', 'Mia', 'Noah', 'Sophia', 'Liam', 'Ava', 'Ethan', 'Chloe'];
  const items = ['stickers', 'crayons', 'seashells', 'marbles', 'trading cards', 'stamps', 'colored pencils'];
  const treats = ['cupcakes', 'cookies', 'muffins', 'doughnuts', 'brownies'];
  const fruits = ['apples', 'oranges', 'strawberries', 'bananas', 'peaches'];

  const templates = [
    // 1. Multiplication: Equal Groups
    {
      category: 'multiplication',
      generate: () => {
        const name = pickRandom(names);
        const treat = pickRandom(treats);
        const boxes = randomInt(3, 8);
        const perBox = randomInt(4, 9);
        const total = boxes * perBox;
        return {
          question: `${name} baked ${boxes} boxes of ${treat}. Each box contains ${perBox} ${treat}. How many ${treat} did ${name} bake in all?`,
          equation: `${boxes} × ${perBox} = ${total}`,
          answer: total,
          unit: treat
        };
      }
    },
    // 2. Multiplication: Rows / Arrays
    {
      category: 'multiplication',
      generate: () => {
        const rows = randomInt(4, 9);
        const perRow = randomInt(5, 8);
        const total = rows * perRow;
        return {
          question: `The school auditorium has ${rows} rows of chairs. There are ${perRow} chairs in each row. How many chairs are there in total?`,
          equation: `${rows} × ${perRow} = ${total}`,
          answer: total,
          unit: 'chairs'
        };
      }
    },
    // 3. Division: Equal Sharing
    {
      category: 'division',
      generate: () => {
        const name = pickRandom(names);
        const item = pickRandom(items);
        const friends = randomInt(3, 6);
        const perPerson = randomInt(4, 9);
        const total = friends * perPerson;
        return {
          question: `${name} has ${total} ${item} and wants to share them equally among ${friends} friends. How many ${item} will each friend get?`,
          equation: `${total} ÷ ${friends} = ${perPerson}`,
          answer: perPerson,
          unit: item
        };
      }
    },
    // 4. Division: Packing into groups
    {
      category: 'division',
      generate: () => {
        const fruit = pickRandom(fruits);
        const perBag = randomInt(4, 8);
        const bags = randomInt(4, 9);
        const total = bags * perBag;
        return {
          question: `A farmer picked ${total} ${fruit}. She puts ${perBag} ${fruit} into each bag. How many bags can she fill?`,
          equation: `${total} ÷ ${perBag} = ${bags}`,
          answer: bags,
          unit: 'bags'
        };
      }
    },
    // 5. 2-Digit Addition (Regrouping)
    {
      category: 'addition',
      generate: () => {
        const name1 = pickRandom(names);
        const name2 = pickRandom(names.filter(n => n !== name1));
        const item = pickRandom(items);
        const num1 = randomInt(35, 85);
        const num2 = randomInt(28, 75);
        const total = num1 + num2;
        return {
          question: `${name1} collected ${num1} ${item}. ${name2} collected ${num2} ${item}. How many ${item} did they collect altogether?`,
          equation: `${num1} + ${num2} = ${total}`,
          answer: total,
          unit: item
        };
      }
    },
    // 6. 2-Digit Subtraction (Borrowing / Comparison)
    {
      category: 'subtraction',
      generate: () => {
        const name = pickRandom(names);
        const totalPages = randomInt(120, 250);
        const pagesRead = randomInt(45, 95);
        const remaining = totalPages - pagesRead;
        return {
          question: `${name} is reading a book with ${totalPages} pages. So far, ${name} has read ${pagesRead} pages. How many pages are left to read?`,
          equation: `${totalPages} − ${pagesRead} = ${remaining}`,
          answer: remaining,
          unit: 'pages'
        };
      }
    },
    // 7. Money & Change
    {
      category: 'subtraction',
      generate: () => {
        const name = pickRandom(names);
        const bill = pickRandom([20, 50]);
        const cost = randomInt(11, bill - 3);
        const change = bill - cost;
        return {
          question: `${name} went to the toy store and bought a board game for $${cost}. ${name} paid with a $${bill} bill. How much change did ${name} receive?`,
          equation: `$${bill} − $${cost} = $${change}`,
          answer: `$${change}`,
          unit: 'dollars'
        };
      }
    },
    // 8. Multi-Step (Grade 3 Challenge)
    {
      category: 'multi_step',
      generate: () => {
        const name = pickRandom(names);
        const item = pickRandom(items);
        const packs = randomInt(3, 6);
        const perPack = randomInt(5, 8);
        const totalPacks = packs * perPack;
        const givenAway = randomInt(4, totalPacks - 6);
        const remaining = totalPacks - givenAway;
        return {
          question: `${name} bought ${packs} packs of ${item}. There are ${perPack} ${item} in each pack. Later, ${name} gave ${givenAway} ${item} to a friend. How many ${item} does ${name} have left?`,
          equation: `(${packs} × ${perPack}) − ${givenAway} = ${remaining}`,
          answer: remaining,
          unit: item
        };
      }
    },
    // 9. Time / Elapsed Duration
    {
      category: 'addition',
      generate: () => {
        const name = pickRandom(names);
        const t1 = randomInt(25, 45);
        const t2 = randomInt(20, 40);
        const total = t1 + t2;
        return {
          question: `${name} practiced piano for ${t1} minutes in the morning and ${t2} minutes in the afternoon. How many total minutes did ${name} practice?`,
          equation: `${t1} + ${t2} = ${total}`,
          answer: total,
          unit: 'minutes'
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
    const data = template.generate();
    return {
      type: 'word_problem',
      ...data,
      expectedAnswer: data.answer.toString()
    };
  }

  function generateWordProblemsList(count = 5, category = 'all') {
    const list = [];
    for (let i = 0; i < count; i++) {
      const p = generateWordProblem(category);
      p.index = i + 1;
      list.push(p);
    }
    return list;
  }

  return {
    generateWordProblem,
    generateWordProblemsList
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WordProblems;
}
