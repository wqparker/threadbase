// server/tests/routes.test.js
// Route-level tests via supertest against the exported app (no real port
// bound). Runs against threadbase-test, same as the model-level tests.

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Closet = require('../models/Closet');
const Item = require('../models/Item');
const LaundryLoad = require('../models/LaundryLoad');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'threadbase-test' });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('closets routes', () => {
  let closetIds;

  beforeEach(() => {
    closetIds = [];
  });

  afterEach(async () => {
    await Promise.all(closetIds.map((id) => Closet.findByIdAndDelete(id)));
  });

  test('POST /api/closets creates a closet', async () => {
    const res = await request(app).post('/api/closets').send({ name: 'Route Test Closet' });
    closetIds.push(res.body._id);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Route Test Closet');
  });

  test('GET /api/closets lists closets, GET /api/closets/:id gets one', async () => {
    const created = await Closet.create({ name: 'Route Test Closet' });
    closetIds.push(created._id.toString());

    const list = await request(app).get('/api/closets');
    expect(list.status).toBe(200);
    expect(list.body.map((c) => c._id)).toContainEqual(created._id.toString());

    const single = await request(app).get(`/api/closets/${created._id}`);
    expect(single.status).toBe(200);
    expect(single.body.name).toBe('Route Test Closet');
  });

  test('GET /api/closets/:id returns 404 for a nonexistent id', async () => {
    const res = await request(app).get(`/api/closets/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });

  test('PUT /api/closets/:id updates a closet', async () => {
    const created = await Closet.create({ name: 'Route Test Closet' });
    closetIds.push(created._id.toString());

    const res = await request(app)
      .put(`/api/closets/${created._id}`)
      .send({ name: 'Renamed Closet' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Renamed Closet');
  });

  test('DELETE /api/closets/:id deletes a closet', async () => {
    const created = await Closet.create({ name: 'Route Test Closet' });

    const res = await request(app).delete(`/api/closets/${created._id}`);
    expect(res.status).toBe(204);

    const found = await Closet.findById(created._id);
    expect(found).toBeNull();
  });
});

describe('items routes', () => {
  let closetIds;
  let itemIds;

  beforeEach(() => {
    closetIds = [];
    itemIds = [];
  });

  afterEach(async () => {
    await Promise.all([
      ...itemIds.map((id) => Item.findByIdAndDelete(id)),
      ...closetIds.map((id) => Closet.findByIdAndDelete(id)),
    ]);
  });

  test('POST /api/items creates an item and adds it to its closet', async () => {
    const closet = await Closet.create({ name: 'Route Test Closet' });
    closetIds.push(closet._id.toString());

    const res = await request(app).post('/api/items').send({
      type: 'other',
      closetId: closet._id.toString(),
      colourCategory: 'mixed',
    });
    itemIds.push(res.body._id);

    expect(res.status).toBe(201);
    expect(res.body.closetId).toBe(closet._id.toString());

    const updatedCloset = await Closet.findById(closet._id);
    expect(updatedCloset.items.map((id) => id.toString())).toContainEqual(res.body._id);
  });

  test('POST /api/items with a missing required field returns 400', async () => {
    const res = await request(app).post('/api/items').send({ colourCategory: 'mixed' });
    expect(res.status).toBe(400);
  });

  test('GET /api/items?closetId filters by closet', async () => {
    const closetA = await Closet.create({ name: 'Closet A' });
    const closetB = await Closet.create({ name: 'Closet B' });
    closetIds.push(closetA._id.toString(), closetB._id.toString());

    const itemA = await Item.create({ type: 'other', closetId: closetA._id, colourCategory: 'mixed' });
    const itemB = await Item.create({ type: 'other', closetId: closetB._id, colourCategory: 'mixed' });
    itemIds.push(itemA._id.toString(), itemB._id.toString());

    const res = await request(app).get(`/api/items?closetId=${closetA._id}`);
    const ids = res.body.map((i) => i._id);
    expect(ids).toContainEqual(itemA._id.toString());
    expect(ids).not.toContainEqual(itemB._id.toString());
  });

  test('PUT /api/items/:id moving closets updates both closets’ items arrays', async () => {
    const closetA = await Closet.create({ name: 'Closet A' });
    const closetB = await Closet.create({ name: 'Closet B' });
    closetIds.push(closetA._id.toString(), closetB._id.toString());

    const item = await Item.create({ type: 'other', closetId: closetA._id, colourCategory: 'mixed' });
    itemIds.push(item._id.toString());

    const res = await request(app)
      .put(`/api/items/${item._id}`)
      .send({ closetId: closetB._id.toString() });
    expect(res.status).toBe(200);

    const updatedA = await Closet.findById(closetA._id);
    const updatedB = await Closet.findById(closetB._id);
    expect(updatedA.items.map((id) => id.toString())).not.toContainEqual(item._id.toString());
    expect(updatedB.items.map((id) => id.toString())).toContainEqual(item._id.toString());
  });

  test('DELETE /api/items/:id removes it from its closet and any laundry load', async () => {
    const closet = await Closet.create({ name: 'Route Test Closet' });
    closetIds.push(closet._id.toString());

    const item = await Item.create({ type: 'other', closetId: closet._id, colourCategory: 'mixed' });
    const laundryLoad = await LaundryLoad.create({ items: [item._id] });

    const res = await request(app).delete(`/api/items/${item._id}`);
    expect(res.status).toBe(204);

    const updatedCloset = await Closet.findById(closet._id);
    const updatedLoad = await LaundryLoad.findById(laundryLoad._id);
    expect(updatedCloset.items.map((id) => id.toString())).not.toContainEqual(item._id.toString());
    expect(updatedLoad.items.map((id) => id.toString())).not.toContainEqual(item._id.toString());

    await LaundryLoad.findByIdAndDelete(laundryLoad._id);
  });
});
