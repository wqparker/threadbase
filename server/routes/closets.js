// server/routes/closets.js
const express = require('express');
const Closet = require('../models/Closet');

const router = express.Router();

router.get('/', async (req, res) => {
  const closets = await Closet.find();
  res.json(closets);
});

router.get('/:id', async (req, res) => {
  const closet = await Closet.findById(req.params.id);
  if (!closet) return res.status(404).json({ error: 'Closet not found' });
  res.json(closet);
});

router.post('/', async (req, res) => {
  const closet = await Closet.create(req.body);
  res.status(201).json(closet);
});

router.put('/:id', async (req, res) => {
  const closet = await Closet.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!closet) return res.status(404).json({ error: 'Closet not found' });
  res.json(closet);
});

router.delete('/:id', async (req, res) => {
  const closet = await Closet.findByIdAndDelete(req.params.id);
  if (!closet) return res.status(404).json({ error: 'Closet not found' });
  res.status(204).send();
});

module.exports = router;
