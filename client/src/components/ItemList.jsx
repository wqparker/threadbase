// client/src/components/ItemList.jsx
// Shared grid + add/edit/delete UI for a set of items. Pass closetId to
// scope to one closet (and show the Add-Item form attaching new items to
// it); omit it to show every item regardless of closet, read-only for
// creation (adding an unassigned item isn't a supported flow yet).
import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';
import { ITEM_TYPES, COLOUR_CATEGORIES } from '../constants';

function ItemList({ closetId }) {
  const { items, loading, error, addItem, editItem, removeItem } = useItems(closetId);
  const [type, setType] = useState(ITEM_TYPES[0]);
  const [colourCategory, setColourCategory] = useState(COLOUR_CATEGORIES[0]);
  const [brand, setBrand] = useState('');
  const [nickname, setNickname] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editType, setEditType] = useState(ITEM_TYPES[0]);
  const [editColourCategory, setEditColourCategory] = useState(COLOUR_CATEGORIES[0]);
  const [editBrand, setEditBrand] = useState('');
  const [editNickname, setEditNickname] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    await addItem({ type, colourCategory, brand, nickname, closetId });
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
    <>
      {closetId && (
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
      )}

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
    </>
  );
}

export default ItemList;
