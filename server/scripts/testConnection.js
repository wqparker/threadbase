// server/scripts/testConnection.js
// One-off manual check: connect to the threadbase-test database and confirm
// we can write a minimal document to each top-level collection. Not the
// real seed script (see project plan step 6) — just a connectivity smoke test.

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Closet = require('../models/Closet');
const Item = require('../models/Item');
const LaundryLoad = require('../models/LaundryLoad');

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'threadbase-test' });
  console.log('Connected to threadbase-test');

  const closet = await Closet.create({ name: 'Test Closet' });
  console.log('Created closet:', closet._id.toString());

  const item = await Item.create({
    type: 'other',
    closetId: closet._id,
    colourCategory: 'mixed',
  });
  console.log('Created item:', item._id.toString());
  console.log('  careInstructions default:', item.careInstructions.toObject());

  closet.items.push(item._id);
  await closet.save();

  const laundryLoad = await LaundryLoad.create({});
  console.log('Created laundry load:', laundryLoad._id.toString());

  await mongoose.disconnect();
  console.log('Disconnected');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
