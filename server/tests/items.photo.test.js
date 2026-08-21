// server/tests/items.photo.test.js
// Covers the photo upload/cleanup behavior added to the items routes.
// Mocks r2Service so these tests never hit real R2.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Item = require('../models/Item');

jest.mock('../services/r2Service');
const { uploadPhoto, deletePhotoIfOwned } = require('../services/r2Service');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'threadbase-test' });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('item photo upload/cleanup', () => {
  let itemIds;

  beforeEach(() => {
    itemIds = [];
    uploadPhoto.mockReset();
    deletePhotoIfOwned.mockReset();
  });

  afterEach(async () => {
    await Promise.all(itemIds.map((id) => Item.findByIdAndDelete(id)));
  });

  test('POST /api/items with a photo uploads it and stores the returned URL', async () => {
    uploadPhoto.mockResolvedValue('https://example.com/items/new-photo.jpg');

    const res = await request(app)
      .post('/api/items')
      .field('data', JSON.stringify({ type: 'other', colourCategory: 'mixed' }))
      .attach('photo', Buffer.from('fake-image-data'), 'test.jpg');
    itemIds.push(res.body._id);

    expect(res.status).toBe(201);
    expect(uploadPhoto).toHaveBeenCalledWith(expect.any(Buffer), 'image/jpeg');
    expect(res.body.photoUrl).toBe('https://example.com/items/new-photo.jpg');
  });

  test('PUT /api/items/:id with a new photo replaces it and deletes the old one', async () => {
    const item = await Item.create({
      type: 'other',
      colourCategory: 'mixed',
      photoUrl: 'https://example.com/items/old-photo.jpg',
    });
    itemIds.push(item._id.toString());
    uploadPhoto.mockResolvedValue('https://example.com/items/new-photo.jpg');

    const res = await request(app)
      .put(`/api/items/${item._id}`)
      .field('data', JSON.stringify({ type: 'other', colourCategory: 'mixed' }))
      .attach('photo', Buffer.from('fake-image-data'), 'test.jpg');

    expect(res.status).toBe(200);
    expect(res.body.photoUrl).toBe('https://example.com/items/new-photo.jpg');
    expect(deletePhotoIfOwned).toHaveBeenCalledWith('https://example.com/items/old-photo.jpg');
  });

  test('PUT /api/items/:id without touching photoUrl never calls cleanup', async () => {
    const item = await Item.create({
      type: 'other',
      colourCategory: 'mixed',
      photoUrl: 'https://example.com/items/existing.jpg',
    });
    itemIds.push(item._id.toString());

    const res = await request(app).put(`/api/items/${item._id}`).send({ wearStatus: 'dirty' });

    expect(res.status).toBe(200);
    expect(deletePhotoIfOwned).not.toHaveBeenCalled();
  });

  test('DELETE /api/items/:id cleans up its photo', async () => {
    const item = await Item.create({
      type: 'other',
      colourCategory: 'mixed',
      photoUrl: 'https://example.com/items/to-delete.jpg',
    });

    const res = await request(app).delete(`/api/items/${item._id}`);

    expect(res.status).toBe(204);
    expect(deletePhotoIfOwned).toHaveBeenCalledWith('https://example.com/items/to-delete.jpg');
  });
});
