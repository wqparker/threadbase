// client/src/components/ItemCard.jsx
// Read-only item card: photo + display name. Pass onClick to make it
// interactive (a button, used by ItemList's grid); omit it for a static
// card.
import Card from './Card';
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';

function ItemCard({ item, onClick }) {
  const displayName = getItemDisplayName(item);
  const wearStatus = item.wearStatus || 'clean';
  return (
    <Card onClick={onClick}>
      <span
        className={`wear-status-badge wear-status-${wearStatus}`}
        role="img"
        aria-label={`Wear status: ${wearStatus}`}
        title={wearStatus}
      />
      <img
        className={item.photoUrl ? undefined : 'item-icon-fallback'}
        src={item.photoUrl || getItemIcon(item.type)}
        alt={displayName}
      />
      <p>{displayName}</p>
    </Card>
  );
}

export default ItemCard;
