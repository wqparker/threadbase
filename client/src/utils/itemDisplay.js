// client/src/utils/itemDisplay.js
import shirtIcon from '../assets/itemIcons/s-shirt.png';
import longsleeveShirtIcon from '../assets/itemIcons/L-Shirt.png';
import pantsIcon from '../assets/itemIcons/Pants.png';
import shortsIcon from '../assets/itemIcons/Shorts.png';
import jacketIcon from '../assets/itemIcons/Jacket.png';
import socksIcon from '../assets/itemIcons/Socks.png';
import underwearIcon from '../assets/itemIcons/Underwear.png';
import otherIcon from '../assets/itemIcons/Other.png';

const ICONS_BY_TYPE = {
  shirt: shirtIcon,
  'longsleeve-shirt': longsleeveShirtIcon,
  pants: pantsIcon,
  shorts: shortsIcon,
  jacket: jacketIcon,
  socks: socksIcon,
  underwear: underwearIcon,
  other: otherIcon,
};

export function getItemDisplayName(item) {
  if (item.nickname?.trim()) return item.nickname;

  const parts = [item.brand, item.colourCategory, item.type].filter(Boolean);
  return parts.join(' ');
}

export function getItemIcon(type) {
  return ICONS_BY_TYPE[type] || otherIcon;
}
