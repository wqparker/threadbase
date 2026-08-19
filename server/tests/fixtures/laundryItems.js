// server/tests/fixtures/laundryItems.js
// Hand-written plain-object item fixtures for groupLaundry.test.js —
// deliberately not full Mongoose documents, since groupLaundry is a pure
// function that only reads wearStatus, colourCategory, and careInstructions.

module.exports = {
  // Two dirty items matching on all 3 grouping axes — should merge into one load.
  darkColdA: {
    nickname: 'Dark Cold A',
    wearStatus: 'dirty',
    colourCategory: 'dark',
    careInstructions: { washTemp: 'cold', delicate: false },
  },
  darkColdB: {
    nickname: 'Dark Cold B',
    wearStatus: 'dirty',
    colourCategory: 'dark',
    careInstructions: { washTemp: 'cold', delicate: false },
  },

  // Differs from darkColdA/B by washTemp only — should land in its own load.
  darkWarm: {
    nickname: 'Dark Warm',
    wearStatus: 'dirty',
    colourCategory: 'dark',
    careInstructions: { washTemp: 'warm', delicate: false },
  },

  // Differs from darkColdA/B by colourCategory only — should land in its own load.
  whiteCold: {
    nickname: 'White Cold',
    wearStatus: 'dirty',
    colourCategory: 'white',
    careInstructions: { washTemp: 'cold', delicate: false },
  },

  // Differs from darkColdA/B by delicate only — should land in its own load.
  darkColdDelicate: {
    nickname: 'Dark Cold Delicate',
    wearStatus: 'dirty',
    colourCategory: 'dark',
    careInstructions: { washTemp: 'cold', delicate: true },
  },

  // No washTemp set — should default to 'cold' and merge with darkColdA/B.
  darkMissingTemp: {
    nickname: 'Dark Missing Temp',
    wearStatus: 'dirty',
    colourCategory: 'dark',
    careInstructions: { delicate: false },
  },

  // Not dirty — every non-'dirty' wearStatus should be excluded entirely.
  cleanItem: {
    nickname: 'Clean Item',
    wearStatus: 'clean',
    colourCategory: 'dark',
    careInstructions: { washTemp: 'cold', delicate: false },
  },
  lightWearItem: {
    nickname: 'Light Wear Item',
    wearStatus: 'light',
    colourCategory: 'dark',
    careInstructions: { washTemp: 'cold', delicate: false },
  },
  heavyWearItem: {
    nickname: 'Heavy Wear Item',
    wearStatus: 'heavy',
    colourCategory: 'dark',
    careInstructions: { washTemp: 'cold', delicate: false },
  },
};
