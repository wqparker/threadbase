// server/constants.js
// Central source of truth for all enum values used across models.
// Schemas import from here rather than hardcoding values inline.

const ITEM_TYPES = [
  'shirt',
  'longsleeve-shirt',
  'pants',
  'shorts',
  'jacket',
  'socks',
  'underwear',
  'other',
];

const COLOUR_CATEGORIES = ['white', 'light', 'dark', 'black', 'bright', 'mixed'];

const WEAR_STATUSES = ['clean', 'light', 'heavy', 'dirty'];

const WASH_TEMPS = ['cold', 'warm', 'hot'];

const DRY_METHODS = [
  'machine-low',
  'machine-medium',
  'machine-high',
  'air-dry',
  'flat-dry',
  'do-not-dry',
];

const CARE_SOURCES = ['manual', 'scanned'];

module.exports = {
  ITEM_TYPES,
  COLOUR_CATEGORIES,
  WEAR_STATUSES,
  WASH_TEMPS,
  DRY_METHODS,
  CARE_SOURCES,
};