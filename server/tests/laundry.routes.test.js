// server/tests/laundry.routes.test.js
// Route-level tests via supertest against the exported app (no real port
// bound). Runs against threadbase-test, same as the other route tests.

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
    expect(res.body).toHaveLength(1);
    expect(res.body[0].criteria).toBe('cold wash, dark, non-delicate');
    expect(res.body[0].items.map((item) => item._id)).toEqual(
      expect.arrayContaining([itemA._id.toString(), itemB._id.toString()])
    );

    const persisted = await LaundryLoad.findById(res.body[0]._id);
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
    expect(res.body).toEqual([]);
  });

  test('POST /api/laundry/generate returns an empty array when nothing is dirty', async () => {
    const res = await request(app).post('/api/laundry/generate');
    loadIds.push(...res.body.map((load) => load._id));

    expect(res.status).toBe(201);
    expect(res.body).toEqual([]);
  });
});
