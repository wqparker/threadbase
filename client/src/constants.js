// client/src/constants.js
// Mirrors server/constants.js. Client and server are separate deployable
// packages with no shared-code mechanism, so these are duplicated by hand -
// keep in sync if the backend enums change.

export const ITEM_TYPES = [
  'shirt',
  'longsleeve-shirt',
  'pants',
  'shorts',
  'jacket',
  'socks',
  'underwear',
  'other',
];

export const COLOUR_CATEGORIES = ['white', 'light', 'dark', 'black', 'bright', 'mixed'];

export const WEAR_STATUSES = ['clean', 'light', 'heavy', 'dirty'];

export const WASH_TEMPS = ['cold', 'warm', 'hot'];

export const DRY_METHODS = [
  'machine-low',
  'machine-medium',
  'machine-high',
  'air-dry',
  'flat-dry',
  'do-not-dry',
];
