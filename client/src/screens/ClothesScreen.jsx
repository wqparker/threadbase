// client/src/screens/ClothesScreen.jsx
import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';
import { ITEM_TYPES, COLOUR_CATEGORIES } from '../constants';

function ClothesScreen({ closet, onBack }) {
  const { items, loading, error, addItem, removeItem } = useItems(closet._id);
  const [type, setType] = useState(ITEM_TYPES[0]);
  const [colourCategory, setColourCategory] = useState(COLOUR_CATEGORIES[0]);
  const [brand, setBrand] = useState('');
  const [nickname, setNickname] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    await addItem({ type, colourCategory, brand, nickname, closetId: closet._id });
    setBrand('');
    setNickname('');
  }

  return (
    <section id="clothes">
      <button type="button" onClick={onBack}>
        &larr; Back to closets
      </button>
      <h1>{closet.name}</h1>

      <form onSubmit={handleSubmit}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {ITEM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={colourCategory} onChange={(e) => setColourCategory(e.target.value)}>
          {COLOUR_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Brand (optional)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nickname (optional)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button type="submit">Add item</button>
      </form>

      {loading && <p>Loading items...</p>}
      {error && <p>Error: {error}</p>}

      <div className="item-grid">
        {items.map((item) => (
          <div key={item._id} className="item-card">
            <img src={item.photoUrl || getItemIcon()} alt={getItemDisplayName(item)} />
            <p>{getItemDisplayName(item)}</p>
            <button type="button" onClick={() => removeItem(item._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ClothesScreen;
