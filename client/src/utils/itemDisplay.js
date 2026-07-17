// client/src/utils/itemDisplay.js
import shirtIcon from '../assets/itemIcons/s-shirt.png';

const TYPE_ICONS = {
  shirt: shirtIcon,
};

export function getItemDisplayName(item) {
  if (item.nickname?.trim()) return item.nickname;

  const parts = [item.brand, item.colourCategory, item.type].filter(Boolean);
  return parts.join(' ');
}

export function getItemIcon(item) {
  return TYPE_ICONS[item.type] || null;
}
