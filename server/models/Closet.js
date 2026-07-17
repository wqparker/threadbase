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

// Cascade cleanup on deletion via findByIdAndDelete/findOneAndDelete: items
// referencing this closet become unassigned rather than deleted. Requires
// Item to already be registered with mongoose elsewhere in the process
// (not covered: deleteOne()/deleteMany()).
closetSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;
  await mongoose.model('Item').updateMany({ closetId: doc._id }, { $unset: { closetId: '' } });
});

module.exports = mongoose.model('Closet', closetSchema);