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
  let closet;
  let item;
  let laundryLoad;

  afterEach(async () => {
    // Runs even if an assertion above threw, so a failing test can't
    // leave orphaned documents behind.
    await Promise.all([
      closet && Closet.findByIdAndDelete(closet._id),
      item && Item.findByIdAndDelete(item._id),
      laundryLoad && LaundryLoad.findByIdAndDelete(laundryLoad._id),
    ]);
    closet = item = laundryLoad = undefined;
  });

  test('deleting an item removes it from its closet and any laundry load', async () => {
    closet = await Closet.create({ name: 'Jest Test Closet' });
    item = await Item.create({
      type: 'other',
      closetId: closet._id,
      colourCategory: 'mixed',
    });
    closet.items.push(item._id);
    await closet.save();
    laundryLoad = await LaundryLoad.create({ items: [item._id] });

    await Item.findByIdAndDelete(item._id);

    const updatedCloset = await Closet.findById(closet._id);
    const updatedLoad = await LaundryLoad.findById(laundryLoad._id);
    expect(updatedCloset.items).not.toContainEqual(item._id);
    expect(updatedLoad.items).not.toContainEqual(item._id);

    item = undefined; // already deleted above, don't double-delete in afterEach
  });

  test('deleting a closet clears closetId on items that referenced it', async () => {
    closet = await Closet.create({ name: 'Jest Test Closet' });
    item = await Item.create({
      type: 'other',
      closetId: closet._id,
      colourCategory: 'mixed',
    });
    closet.items.push(item._id);
    await closet.save();

    await Closet.findByIdAndDelete(closet._id);

    const updatedItem = await Item.findById(item._id);
    expect(updatedItem.closetId).toBeUndefined();

    closet = undefined; // already deleted above, don't double-delete in afterEach
  });
});

describe('altering objects', () => {
  let closetA;
  let closetB;
  let item;

  afterEach(async () => {
    await Promise.all([
      closetA && Closet.findByIdAndDelete(closetA._id),
      closetB && Closet.findByIdAndDelete(closetB._id),
      item && Item.findByIdAndDelete(item._id),
    ]);
    closetA = closetB = item = undefined;
  });

  test('moving an item to a different closet updates both closets’ items arrays', async () => {
    closetA = await Closet.create({ name: 'Jest Closet A' });
    closetB = await Closet.create({ name: 'Jest Closet B' });
    item = await Item.create({ type: 'other', closetId: closetA._id, colourCategory: 'mixed' });
    closetA.items.push(item._id);
    await closetA.save();

    await Item.findByIdAndUpdate(item._id, { closetId: closetB._id });

    const updatedA = await Closet.findById(closetA._id);
    const updatedB = await Closet.findById(closetB._id);
    expect(updatedA.items).not.toContainEqual(item._id);
    expect(updatedB.items).toContainEqual(item._id);
  });

  test('changing an item’s wearStatus to dirty updates the field', async () => {
    closetA = await Closet.create({ name: 'Jest Closet A' });
    item = await Item.create({
      type: 'other',
      closetId: closetA._id,
      colourCategory: 'mixed',
      wearStatus: 'light',
    });

    await Item.findByIdAndUpdate(item._id, { wearStatus: 'dirty' });

    const updatedItem = await Item.findById(item._id);
    expect(updatedItem.wearStatus).toBe('dirty');
  });
});
