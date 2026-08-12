// client/src/utils/itemDisplay.js
// Only s-shirt.png exists in itemIcons/ so far - used as the fallback for
// every item type until per-type icons are added.
import shirtIcon from '../assets/itemIcons/s-shirt.png';

export function getItemDisplayName(item) {
  if (item.nickname?.trim()) return item.nickname;

  const parts = [item.brand, item.colourCategory, item.type].filter(Boolean);
  return parts.join(' ');
}

export function getItemIcon() {
  return shirtIcon;
}
