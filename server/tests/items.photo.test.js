// server/tests/items.photo.test.js
// Covers the photo upload/background-removal/cleanup behavior added to
// the items routes. Mocks r2Service and bgRemovalService so these tests
// never hit real R2 or the Python service.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const itemsRouter = require('../routes/items');
const Item = require('../models/Item');

jest.mock('../services/r2Service');
jest.mock('../services/bgRemovalService');
const { uploadPhoto, deletePhotoIfOwned } = require('../services/r2Service');
const { removeBackground } = require('../services/bgRemovalService');

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
    removeBackground.mockReset();
    // Harmless default so routes' own fire-and-forget background call
    // (triggered for real on every photo upload, even in these tests)
    // doesn't error/log noise when a test isn't specifically checking it.
    removeBackground.mockResolvedValue(Buffer.from('processed-bytes'));
  });

  afterEach(async () => {
    await Promise.all(itemIds.map((id) => Item.findByIdAndDelete(id)));
  });

  test('POST /api/items with a photo saves the original immediately and marks it processing', async () => {
    uploadPhoto.mockResolvedValue('https://example.com/items/original.jpg');

    const res = await request(app)
      .post('/api/items')
      .field('data', JSON.stringify({ type: 'other', colourCategory: 'mixed' }))
      .attach('photo', Buffer.from('fake-image-data'), 'test.jpg');
    itemIds.push(res.body._id);

    expect(res.status).toBe(201);
    expect(uploadPhoto).toHaveBeenCalledWith(expect.any(Buffer), 'image/jpeg');
    expect(res.body.photoUrl).toBe('https://example.com/items/original.jpg');
    expect(res.body.photoProcessing).toBe(true);
  });

  test('PUT /api/items/:id with a new photo saves the original immediately, marks it processing, and deletes the previous photo', async () => {
    const item = await Item.create({
      type: 'other',
      colourCategory: 'mixed',
      photoUrl: 'https://example.com/items/old-photo.jpg',
    });
    itemIds.push(item._id.toString());
    uploadPhoto.mockResolvedValue('https://example.com/items/new-original.jpg');

    const res = await request(app)
      .put(`/api/items/${item._id}`)
      .field('data', JSON.stringify({ type: 'other', colourCategory: 'mixed' }))
      .attach('photo', Buffer.from('fake-image-data'), 'test.jpg');

    expect(res.status).toBe(200);
    expect(res.body.photoUrl).toBe('https://example.com/items/new-original.jpg');
    expect(res.body.photoProcessing).toBe(true);
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

  test('processPhotoInBackground swaps in the processed photo and cleans up the original', async () => {
    const item = await Item.create({
      type: 'other',
      colourCategory: 'mixed',
      photoUrl: 'https://example.com/items/original.jpg',
      photoProcessing: true,
    });
    itemIds.push(item._id.toString());

    removeBackground.mockResolvedValue(Buffer.from('processed-bytes'));
    uploadPhoto.mockResolvedValue('https://example.com/items/processed.jpg');

    await itemsRouter.processPhotoInBackground(
      item._id,
      Buffer.from('original-bytes'),
      'image/jpeg',
      item.photoUrl
    );

    const updated = await Item.findById(item._id);
    expect(updated.photoUrl).toBe('https://example.com/items/processed.jpg');
    expect(updated.photoProcessing).toBe(false);
    expect(deletePhotoIfOwned).toHaveBeenCalledWith('https://example.com/items/original.jpg');
  });

  test('processPhotoInBackground discards the processed cutout if the photo changed while it was running', async () => {
    const item = await Item.create({
      type: 'other',
      colourCategory: 'mixed',
      photoUrl: 'https://example.com/items/original.jpg',
      photoProcessing: true,
    });
    itemIds.push(item._id.toString());

    // Simulate a second upload landing (e.g. the user replaced the photo)
    // while the first job's background removal is still in flight.
    await Item.findByIdAndUpdate(item._id, {
      photoUrl: 'https://example.com/items/replaced.jpg',
      photoProcessing: true,
    });

    removeBackground.mockResolvedValue(Buffer.from('processed-bytes'));
    uploadPhoto.mockResolvedValue('https://example.com/items/processed.jpg');

    await itemsRouter.processPhotoInBackground(
      item._id,
      Buffer.from('original-bytes'),
      'image/jpeg',
      'https://example.com/items/original.jpg'
    );

    const updated = await Item.findById(item._id);
    expect(updated.photoUrl).toBe('https://example.com/items/replaced.jpg');
    expect(deletePhotoIfOwned).toHaveBeenCalledWith('https://example.com/items/processed.jpg');
    expect(deletePhotoIfOwned).not.toHaveBeenCalledWith('https://example.com/items/original.jpg');
  });

  test('POST /api/items cleans up the uploaded photo if item creation fails validation', async () => {
    uploadPhoto.mockResolvedValue('https://example.com/items/orphaned.jpg');

    const res = await request(app)
      .post('/api/items')
      .field('data', JSON.stringify({ colourCategory: 'mixed' })) // missing required `type`
      .attach('photo', Buffer.from('fake-image-data'), 'test.jpg');

    expect(res.status).toBe(400);
    expect(deletePhotoIfOwned).toHaveBeenCalledWith('https://example.com/items/orphaned.jpg');
  });

  test('processPhotoInBackground falls back to the original photo if removal fails', async () => {
    const item = await Item.create({
      type: 'other',
      colourCategory: 'mixed',
      photoUrl: 'https://example.com/items/original.jpg',
      photoProcessing: true,
    });
    itemIds.push(item._id.toString());

    removeBackground.mockRejectedValue(new Error('service unreachable'));

    await itemsRouter.processPhotoInBackground(
      item._id,
      Buffer.from('original-bytes'),
      'image/jpeg',
      item.photoUrl
    );

    const updated = await Item.findById(item._id);
    expect(updated.photoUrl).toBe('https://example.com/items/original.jpg');
    expect(updated.photoProcessing).toBe(false);
  });
});
