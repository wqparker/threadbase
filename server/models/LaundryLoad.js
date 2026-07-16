// server/models/LaundryLoad.js
const mongoose = require('mongoose');

const laundryLoadSchema = new mongoose.Schema({
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
  ],
  // Human-readable description of the grouping used,
  // e.g. "darks, machine-warm, non-delicate"
  criteria: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LaundryLoad', laundryLoadSchema);