// server/scripts/testRealisticInserts.js
// Manual test data: a couple of realistic items split across two closets,
// plus a laundry load pulling a different pair together. Still a throwaway
// check against threadbase-test — not the real fixture-based seed script
// from project plan step 6.

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Closet = require('../models/Closet');
const Item = require('../models/Item');
const LaundryLoad = require('../models/LaundryLoad');

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'threadbase-test' });
  console.log('Connected to threadbase-test');

  const bedroomCloset = await Closet.create({
    name: 'Bedroom Closet',
    description: 'Main closet, everyday wear',
  });
  const hallCloset = await Closet.create({
    name: 'Hall Closet',
    description: 'Overflow storage',
  });
  console.log(
    'Created closets:',
    `${bedroomCloset.name} (${bedroomCloset._id})`,
    '|',
    `${hallCloset.name} (${hallCloset._id})`
  );

  // wearCount -> wearStatus follows the plan's manual mapping:
  // 0 clean, 1-2 light, 3-4 heavy, 5+ dirty
  const henley = await Item.create({
    nickname: 'Grey Henley',
    type: 'longsleeve-shirt',
    brand: 'Uniqlo',
    closetId: bedroomCloset._id,
    colourCategory: 'light',
    colour: 'heather grey',
    lastWorn: new Date('2026-07-14'),
    lastWashed: new Date('2026-07-01'),
    wearCount: 1,
    wearStatus: 'light',
    careInstructions: {
      washTemp: 'cold',
      dryMethod: 'machine-low',
      bleachOk: false,
      ironOk: true,
      delicate: false,
      source: 'manual',
    },
  });

  const jeans = await Item.create({
    // nickname intentionally left empty to exercise the derived-name fallback
    type: 'pants',
    brand: "Levi's",
    closetId: hallCloset._id,
    colourCategory: 'dark',
    colour: 'dark indigo',
    lastWorn: new Date('2026-07-15'),
    lastWashed: new Date('2026-06-20'),
    wearCount: 5,
    wearStatus: 'dirty',
    careInstructions: {
      washTemp: 'cold',
      dryMethod: 'air-dry',
      bleachOk: false,
      ironOk: false,
      delicate: false,
      source: 'manual',
    },
  });

  const oxford = await Item.create({
    nickname: 'White Oxford',
    type: 'shirt',
    brand: 'Brooks Brothers',
    closetId: bedroomCloset._id,
    colourCategory: 'white',
    colour: 'white',
    lastWorn: new Date('2026-07-13'),
    lastWashed: new Date('2026-06-25'),
    wearCount: 4,
    wearStatus: 'heavy',
    careInstructions: {
      washTemp: 'warm',
      dryMethod: 'machine-medium',
      bleachOk: true,
      ironOk: true,
      delicate: false,
      source: 'manual',
    },
  });

  console.log('Created items:');
  console.log(' ', henley.nickname, `(${henley._id})`, '-> closet', henley.closetId.toString());
  console.log(' ', "(no nickname, derives to \"Levi's dark pants\")", `(${jeans._id})`, '-> closet', jeans.closetId.toString());
  console.log(' ', oxford.nickname, `(${oxford._id})`, '-> closet', oxford.closetId.toString());

  bedroomCloset.items.push(henley._id, oxford._id);
  hallCloset.items.push(jeans._id);
  await Promise.all([bedroomCloset.save(), hallCloset.save()]);

  // Laundry load: the two items that actually need washing (heavy/dirty),
  // a different pairing than either closet's item set.
  const laundryLoad = await LaundryLoad.create({
    items: [jeans._id, oxford._id],
    criteria: 'pending wash: heavy/dirty items due for a load',
  });
  console.log(
    'Created laundry load:',
    `(${laundryLoad._id})`,
    '-> items',
    laundryLoad.items.map((id) => id.toString())
  );

  await mongoose.disconnect();
  console.log('Disconnected');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
