// server/tests/groupLaundry.test.js
// Pure-function tests for the laundry-load-grouping algorithm — no DB
// connection needed since groupLaundry has no Mongoose/Express dependency.

const groupLaundry = require('../lib/groupLaundry');
const fixtures = require('./fixtures/laundryItems');

describe('groupLaundry', () => {
  test('merges dirty items that match on wash temp, colour, and delicate', () => {
    const result = groupLaundry([fixtures.darkColdA, fixtures.darkColdB]);

    expect(result).toHaveLength(1);
    expect(result[0].items).toEqual([fixtures.darkColdA, fixtures.darkColdB]);
  });

  test('splits into separate loads when wash temp differs', () => {
    const result = groupLaundry([fixtures.darkColdA, fixtures.darkWarm]);

    expect(result).toHaveLength(2);
  });

  test('splits into separate loads when colour category differs', () => {
    const result = groupLaundry([fixtures.darkColdA, fixtures.whiteCold]);

    expect(result).toHaveLength(2);
  });

  test('splits into separate loads when delicate handling differs', () => {
    const result = groupLaundry([fixtures.darkColdA, fixtures.darkColdDelicate]);

    expect(result).toHaveLength(2);
  });

  test('excludes items that are not wearStatus "dirty"', () => {
    const result = groupLaundry([
      fixtures.cleanItem,
      fixtures.lightWearItem,
      fixtures.heavyWearItem,
    ]);

    expect(result).toEqual([]);
  });

  test('defaults a missing washTemp to cold and groups it with explicit cold items', () => {
    const result = groupLaundry([fixtures.darkColdA, fixtures.darkMissingTemp]);

    expect(result).toHaveLength(1);
    expect(result[0].criteria).toBe('cold wash, dark, non-delicate');
    expect(result[0].items).toEqual([fixtures.darkColdA, fixtures.darkMissingTemp]);
  });

  test('returns an empty array for empty input', () => {
    expect(groupLaundry([])).toEqual([]);
  });

  test('each group\'s criteria string reflects its wash temp, colour, and delicate status', () => {
    const result = groupLaundry([fixtures.darkColdDelicate]);

    expect(result).toEqual([
      {
        criteria: 'cold wash, dark, delicate',
        items: [fixtures.darkColdDelicate],
      },
    ]);
  });
});
