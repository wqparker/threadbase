// server/routes/laundry.js
const express = require('express');
const Item = require('../models/Item');
const LaundryLoad = require('../models/LaundryLoad');
const groupLaundry = require('../lib/groupLaundry');

const router = express.Router();

router.post('/generate', async (req, res) => {
  const dirtyItems = await Item.find({ wearStatus: 'dirty' });
  const groups = groupLaundry(dirtyItems);

  const loads = await Promise.all(
    groups.map(async (group) => {
      const load = await LaundryLoad.create({
        items: group.items.map((item) => item._id),
        criteria: group.criteria,
      });
      return { _id: load._id, criteria: load.criteria, date: load.date, items: group.items };
    })
  );

  res.status(201).json(loads);
});

module.exports = router;
