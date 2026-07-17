// server/models/Item.js
const mongoose = require('mongoose');
const careInstructionsSchema = require('./CareInstructions');
const { ITEM_TYPES, COLOUR_CATEGORIES, WEAR_STATUSES } = require('../constants');

const itemSchema = new mongoose.Schema({
  // Optional short label, e.g. "Grey Henley". Falls back to a derived
  // name (brand + colourCategory + type) at display time when empty —
  // no separate "full name" field is stored.
  nickname: {
    type: String,
  },
  type: {
    type: String,
    enum: ITEM_TYPES,
    required: true,
  },
  brand: {
    type: String,
  },
  closetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Closet',
    required: true,
  },
  // What the laundry-grouping algorithm actually keys off — not exact colour
  colourCategory: {
    type: String,
    enum: COLOUR_CATEGORIES,
    required: true,
  },
  // Optional free-text colour, for display only (e.g. "navy blue")
  colour: {
    type: String, // I want to make this main colour enum
  },
  // R2 key/URL only — never the binary image itself
  photoUrl: {
    type: String,
  },
  careInstructions: {
    type: careInstructionsSchema,
    default: () => ({}),
  },
  lastWorn: {
    type: Date,
  },
  lastWashed: {
    type: Date,
  },
  wearCount: {
    type: Number,
    default: 0,
  },
  // Auto-computed from wearCount since last wash, with manual override
  // supported — replaces a simple isDirty boolean
  wearStatus: {
    type: String,
    enum: WEAR_STATUSES,
    default: 'clean',
  },
});

module.exports = mongoose.model('Item', itemSchema);