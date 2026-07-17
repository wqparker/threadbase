// server/models/Closet.js
const mongoose = require('mongoose');

const closetSchema = new mongoose.Schema({
  name: {
    type: String, // should we also have an id?
    required: true,
  },
  description: {
    type: String,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
  ],
});

module.exports = mongoose.model('Closet', closetSchema);