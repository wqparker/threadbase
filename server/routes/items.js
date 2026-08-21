// server/routes/items.js
const express = require('express');
const multer = require('multer');
const Item = require('../models/Item');
const { uploadPhoto, deletePhotoIfOwned } = require('../services/r2Service');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
});

// Multipart requests (a photo file is involved) wrap the real payload as
// a JSON string in `data` - multipart fields are flat strings, so nested
// objects like careInstructions can't travel as-is. Plain JSON requests
// (every existing caller/test, and any update that doesn't touch the
// photo) are used directly, unchanged.
function parseBody(req) {
  return req.body.data ? JSON.parse(req.body.data) : req.body;
}

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

router.post('/', upload.single('photo'), async (req, res) => {
  const data = parseBody(req);
  if (req.file) {
    data.photoUrl = await uploadPhoto(req.file.buffer, req.file.mimetype);
  }
  const item = await Item.create(data);
  res.status(201).json(item);
});

router.put('/:id', upload.single('photo'), async (req, res) => {
  const data = parseBody(req);
  const existing = await Item.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Item not found' });

  if (req.file) {
    data.photoUrl = await uploadPhoto(req.file.buffer, req.file.mimetype);
  }

  if ('photoUrl' in data && existing.photoUrl && existing.photoUrl !== data.photoUrl) {
    await deletePhotoIfOwned(existing.photoUrl);
  }

  const item = await Item.findByIdAndUpdate(req.params.id, data, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  await deletePhotoIfOwned(item.photoUrl);
  res.status(204).send();
});

module.exports = router;
