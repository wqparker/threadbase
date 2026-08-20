// client/src/components/ItemCard.jsx
// Read-only item card: photo + display name. Pass onClick to make it
// interactive (a button, used by ItemList's grid); omit it for a static
// card.
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';

function ItemCard({ item, onClick }) {
  const displayName = getItemDisplayName(item);
  const wearStatus = item.wearStatus || 'clean';
  const content = (
    <>
      <span
        className={`wear-status-badge wear-status-${wearStatus}`}
        role="img"
        aria-label={`Wear status: ${wearStatus}`}
        title={wearStatus}
      />
      <img src={item.photoUrl || getItemIcon(item.type)} alt={displayName} />
      <p>{displayName}</p>
    </>
  );

  if (!onClick) {
    return <div className="item-card">{content}</div>;
  }

  return (
    <button type="button" className="item-card" onClick={onClick}>
      {content}
    </button>
  );
}

export default ItemCard;
