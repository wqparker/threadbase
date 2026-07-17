// client/src/screens/ClothesScreen.jsx
import { useItems } from '../hooks/useItems';
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';

function ClothesScreen({ closet, onBack }) {
  const { items, loading, error } = useItems(closet._id);

  return (
    <section id="clothes">
      <button type="button" onClick={onBack}>
        &larr; Back to closets
      </button>
      <h1>{closet.name}</h1>

      {loading && <p>Loading items...</p>}
      {error && <p>Error: {error}</p>}

      <div className="item-grid">
        {items.map((item) => {
          const icon = getItemIcon(item);
          return (
            <div key={item._id} className="item-card">
              {item.photoUrl ? (
                <img src={item.photoUrl} alt={getItemDisplayName(item)} />
              ) : icon ? (
                <img src={icon} alt={item.type} />
              ) : (
                <div className="item-icon-placeholder">{item.type}</div>
              )}
              <p>{getItemDisplayName(item)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ClothesScreen;
