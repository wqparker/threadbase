// server/routes/items.js
const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.closetId) filter.closetId = req.query.closetId;
  const items = await Item.find(filter);
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

router.post('/', async (req, res) => {
  const item = await Item.create(req.body);
  res.status(201).json(item);
});

router.put('/:id', async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.status(204).send();
});

module.exports = router;
