// server/tests/laundry.routes.test.js
// Route-level tests via supertest against the exported app (no real port
// bound). Runs against threadbase-test, same as the other route tests -
// which, per CLAUDE.md, doubles as the live dev server's database, so
// these tests must never assume the collection is otherwise empty (or
// wipe it) - only assert on the specific items/loads each test creates.

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Item = require('../models/Item');
const LaundryLoad = require('../models/LaundryLoad');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'threadbase-test' });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('laundry routes', () => {
  let itemIds;
  let loadIds;

  beforeEach(() => {
    itemIds = [];
    loadIds = [];
  });

  afterEach(async () => {
    await Promise.all([
      ...itemIds.map((id) => Item.findByIdAndDelete(id)),
      ...loadIds.map((id) => LaundryLoad.findByIdAndDelete(id)),
    ]);
  });

  test('POST /api/laundry/generate groups dirty items and persists matching loads', async () => {
    const itemA = await Item.create({
      type: 'other',
      colourCategory: 'dark',
      wearStatus: 'dirty',
      careInstructions: { washTemp: 'cold', delicate: false },
    });
    const itemB = await Item.create({
      type: 'other',
      colourCategory: 'dark',
      wearStatus: 'dirty',
      careInstructions: { washTemp: 'cold', delicate: false },
    });
    itemIds.push(itemA._id.toString(), itemB._id.toString());

    const res = await request(app).post('/api/laundry/generate');
    loadIds.push(...res.body.map((load) => load._id));

    expect(res.status).toBe(201);
    // /api/laundry/generate groups every dirty item in the whole DB, not
    // just this test's - find the load our items actually landed in
    // rather than assuming the response contains only our data.
    const ourLoad = res.body.find((load) => load.items.some((item) => item._id === itemA._id.toString()));
    expect(ourLoad).toBeDefined();
    expect(ourLoad.criteria).toBe('cold wash, dark, non-delicate');
    expect(ourLoad.items.map((item) => item._id)).toEqual(
      expect.arrayContaining([itemA._id.toString(), itemB._id.toString()])
    );

    const persisted = await LaundryLoad.findById(ourLoad._id);
    expect(persisted.items.map((id) => id.toString())).toEqual(
      expect.arrayContaining([itemA._id.toString(), itemB._id.toString()])
    );
  });

  test('POST /api/laundry/generate excludes items that are not dirty', async () => {
    const cleanItem = await Item.create({
      type: 'other',
      colourCategory: 'dark',
      wearStatus: 'clean',
      careInstructions: { washTemp: 'cold', delicate: false },
    });
    itemIds.push(cleanItem._id.toString());

    const res = await request(app).post('/api/laundry/generate');
    loadIds.push(...res.body.map((load) => load._id));

    expect(res.status).toBe(201);
    const returnedItemIds = res.body.flatMap((load) => load.items.map((item) => item._id));
    expect(returnedItemIds).not.toContain(cleanItem._id.toString());
  });

  test('POST /api/laundry/generate runs cleanly when this test contributes no dirty items', async () => {
    const res = await request(app).post('/api/laundry/generate');
    loadIds.push(...res.body.map((load) => load._id));

    expect(res.status).toBe(201);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
