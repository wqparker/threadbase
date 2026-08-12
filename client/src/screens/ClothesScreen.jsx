// client/src/screens/ClothesScreen.jsx
import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { useActiveCloset } from '../hooks/useActiveCloset';
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';
import { ITEM_TYPES, COLOUR_CATEGORIES } from '../constants';

function ClothesScreen() {
  const { activeCloset } = useActiveCloset();
  const { items, loading, error, addItem, editItem, removeItem } = useItems(activeCloset?._id);
  const [type, setType] = useState(ITEM_TYPES[0]);
  const [colourCategory, setColourCategory] = useState(COLOUR_CATEGORIES[0]);
  const [brand, setBrand] = useState('');
  const [nickname, setNickname] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editType, setEditType] = useState(ITEM_TYPES[0]);
  const [editColourCategory, setEditColourCategory] = useState(COLOUR_CATEGORIES[0]);
  const [editBrand, setEditBrand] = useState('');
  const [editNickname, setEditNickname] = useState('');

  if (!activeCloset) {
    return (
      <section id="clothes">
        <h1>Clothes</h1>
        <p>Select a closet from the Closets tab to see its items.</p>
      </section>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await addItem({ type, colourCategory, brand, nickname, closetId: activeCloset._id });
    setBrand('');
    setNickname('');
  }

  function startEditing(item) {
    setEditingId(item._id);
    setEditType(item.type);
    setEditColourCategory(item.colourCategory);
    setEditBrand(item.brand || '');
    setEditNickname(item.nickname || '');
  }

  async function handleEditSubmit(e, id) {
    e.preventDefault();
    await editItem(id, {
      type: editType,
      colourCategory: editColourCategory,
      brand: editBrand,
      nickname: editNickname,
    });
    setEditingId(null);
  }

  return (
    <section id="clothes">
      <h1>{activeCloset.name}</h1>

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
        {items.map((item) =>
          editingId === item._id ? (
            <form key={item._id} className="item-card" onSubmit={(e) => handleEditSubmit(e, item._id)}>
              <select value={editType} onChange={(e) => setEditType(e.target.value)}>
                {ITEM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select value={editColourCategory} onChange={(e) => setEditColourCategory(e.target.value)}>
                {COLOUR_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Brand (optional)"
                value={editBrand}
                onChange={(e) => setEditBrand(e.target.value)}
              />
              <input
                type="text"
                placeholder="Nickname (optional)"
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingId(null)}>
                Cancel
              </button>
            </form>
          ) : (
            <div key={item._id} className="item-card">
              <img src={item.photoUrl || getItemIcon()} alt={getItemDisplayName(item)} />
              <p>{getItemDisplayName(item)}</p>
              <button type="button" onClick={() => startEditing(item)}>
                Edit
              </button>
              <button type="button" onClick={() => removeItem(item._id)}>
                Delete
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default ClothesScreen;
