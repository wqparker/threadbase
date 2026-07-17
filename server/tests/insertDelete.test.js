// server/tests/insertDelete.test.js
// Runs against the threadbase-test database (per CLAUDE.md convention).
// Covers basic insert success, and the delete cascades: deleting an item
// removes it from any closet/laundry-load arrays it's referenced in;
// deleting a closet clears closetId on any items that pointed to it.

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Closet = require('../models/Closet');
const Item = require('../models/Item');
const LaundryLoad = require('../models/LaundryLoad');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'threadbase-test' });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('inserting objects', () => {
  let closet;
  let item;
  let laundryLoad;

  afterEach(async () => {
    await Promise.all([
      closet && Closet.findByIdAndDelete(closet._id),
      item && Item.findByIdAndDelete(item._id),
      laundryLoad && LaundryLoad.findByIdAndDelete(laundryLoad._id),
    ]);
    closet = item = laundryLoad = undefined;
  });

  test('creates a closet, an item, and a laundry load successfully', async () => {
    closet = await Closet.create({ name: 'Jest Test Closet' });
    item = await Item.create({
      type: 'other',
      closetId: closet._id,
      colourCategory: 'mixed',
    });
    laundryLoad = await LaundryLoad.create({ items: [item._id] });

    expect(closet._id).toBeDefined();
    expect(item._id).toBeDefined();
    expect(item.closetId).toEqual(closet._id);
    expect(item.careInstructions.source).toBe('manual');
    expect(laundryLoad.items).toContainEqual(item._id);
  });
});

describe('deleting objects', () => {
  test('deleting an item removes it from its closet and any laundry load', async () => {
    const closet = await Closet.create({ name: 'Jest Test Closet' });
    const item = await Item.create({
      type: 'other',
      closetId: closet._id,
      colourCategory: 'mixed',
    });
    closet.items.push(item._id);
    await closet.save();
    const laundryLoad = await LaundryLoad.create({ items: [item._id] });

    await Item.findByIdAndDelete(item._id);

    const updatedCloset = await Closet.findById(closet._id);
    const updatedLoad = await LaundryLoad.findById(laundryLoad._id);
    expect(updatedCloset.items).not.toContainEqual(item._id);
    expect(updatedLoad.items).not.toContainEqual(item._id);

    await Promise.all([
      Closet.findByIdAndDelete(closet._id),
      LaundryLoad.findByIdAndDelete(laundryLoad._id),
    ]);
  });

  test('deleting a closet clears closetId on items that referenced it', async () => {
    const closet = await Closet.create({ name: 'Jest Test Closet' });
    const item = await Item.create({
      type: 'other',
      closetId: closet._id,
      colourCategory: 'mixed',
    });
    closet.items.push(item._id);
    await closet.save();

    await Closet.findByIdAndDelete(closet._id);

    const updatedItem = await Item.findById(item._id);
    expect(updatedItem.closetId).toBeUndefined();

    await Item.findByIdAndDelete(item._id);
  });
});
