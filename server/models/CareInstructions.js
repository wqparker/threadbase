// server/models/CareInstructions.js
// Not its own collection — this is a subdocument schema embedded inside
// Item. No mongoose.model() call here; that's only for top-level
// collections (Closet, Item, LaundryLoad).

const mongoose = require('mongoose');
const { WASH_TEMPS, DRY_METHODS, CARE_SOURCES } = require('../constants');

const careInstructionsSchema = new mongoose.Schema(
  {
    washTemp: {
      type: String,
      enum: WASH_TEMPS,
    },
    dryMethod: {
      type: String,
      enum: DRY_METHODS,
    },
    bleachOk: {
      type: Boolean,
      default: false,
    },
    ironOk: {
      type: Boolean,
      default: true,
    },
    delicate: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: CARE_SOURCES,
      default: 'manual',
    },
    //confidence: {
    //  type: Number, // only meaningful when source === 'scanned'
    //}, taking out for now
  },
  { _id: false } // subdocument — doesn't need its own _id
);

module.exports = careInstructionsSchema;