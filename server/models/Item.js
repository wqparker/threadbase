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
  // Not required: an item becomes unassigned (closetId cleared) if its
  // closet is deleted, rather than being deleted along with it.
  closetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Closet',
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

// Add newly-created items to their closet's items array. isNew flips to
// false by the time post('save') fires, so it has to be captured here in
// pre('save') and stashed on $locals to read back afterward.
itemSchema.pre('save', function () {
  this.$locals.wasNew = this.isNew;
});

itemSchema.post('save', async function (doc) {
  if (doc.$locals.wasNew && doc.closetId) {
    await mongoose.model('Closet').updateOne({ _id: doc.closetId }, { $addToSet: { items: doc._id } });
  }
});

// Cascade cleanup on deletion via findByIdAndDelete/findOneAndDelete: an
// item's own reference lives on Closet/LaundryLoad as array entries, so
// deleting the item has to pull it out of both. Requires Closet and
// LaundryLoad to already be registered with mongoose elsewhere in the
// process (not covered: deleteOne()/deleteMany()).
itemSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;
  await mongoose.model('Closet').updateMany({ items: doc._id }, { $pull: { items: doc._id } });
  await mongoose.model('LaundryLoad').updateMany({ items: doc._id }, { $pull: { items: doc._id } });
});

// Keep Closet.items in sync when an item moves closets via
// findByIdAndUpdate/findOneAndUpdate (not covered: doc.save()). The doc
// findOneAndUpdate's post-hook receives is the pre-update document unless
// the caller passes { new: true }, so the new closetId has to come from
// the update payload itself rather than from that doc.
itemSchema.pre('findOneAndUpdate', async function () {
  this._previousDoc = await this.model.findOne(this.getFilter());
});

itemSchema.post('findOneAndUpdate', async function () {
  const previous = this._previousDoc;
  if (!previous) return;

  const update = this.getUpdate() || {};
  const setOps = update.$set || update;
  if (!Object.prototype.hasOwnProperty.call(setOps, 'closetId')) return;

  const oldClosetId = previous.closetId?.toString();
  const newClosetId = setOps.closetId?.toString();
  if (oldClosetId === newClosetId) return;

  const Closet = mongoose.model('Closet');
  if (oldClosetId) {
    await Closet.updateOne({ _id: oldClosetId }, { $pull: { items: previous._id } });
  }
  if (newClosetId) {
    await Closet.updateOne({ _id: newClosetId }, { $addToSet: { items: previous._id } });
  }
});

module.exports = mongoose.model('Item', itemSchema);