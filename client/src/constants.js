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
