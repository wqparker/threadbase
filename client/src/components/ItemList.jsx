// client/src/components/ItemList.jsx
// Shared grid + add/edit/delete UI for a set of items. Pass closetId to
// scope to one closet, so new items get attached to it; omit it to show
// every item regardless of closet - new items are just created unassigned.
import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';
import { ITEM_TYPES, COLOUR_CATEGORIES } from '../constants';
import ItemForm from './ItemForm';

const EMPTY_FORM = { type: ITEM_TYPES[0], colourCategory: COLOUR_CATEGORIES[0], brand: '', nickname: '' };

function ItemList({ closetId }) {
  const { items, loading, error, addItem, editItem, removeItem } = useItems(closetId);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState(EMPTY_FORM);

  async function handleSubmit(e) {
    e.preventDefault();
    await addItem({ ...formValues, closetId });
    setFormValues((prev) => ({ ...prev, brand: '', nickname: '' }));
  }

  function startEditing(item) {
    setEditingId(item._id);
    setEditValues({
      type: item.type,
      colourCategory: item.colourCategory,
      brand: item.brand || '',
      nickname: item.nickname || '',
    });
  }

  async function handleEditSubmit(e, id) {
    e.preventDefault();
    await editItem(id, editValues);
    setEditingId(null);
  }

  return (
    <>
      <ItemForm values={formValues} onChange={setFormValues} onSubmit={handleSubmit} submitLabel="Add item" />

      {loading && <p>Loading items...</p>}
      {error && <p>Error: {error}</p>}

      <div className="item-grid">
        {items.map((item) => {
          if (editingId === item._id) {
            return (
              <ItemForm
                key={item._id}
                className="item-card"
                values={editValues}
                onChange={setEditValues}
                onSubmit={(e) => handleEditSubmit(e, item._id)}
                onCancel={() => setEditingId(null)}
                submitLabel="Save"
              />
            );
          }

          const displayName = getItemDisplayName(item);
          return (
            <div key={item._id} className="item-card">
              <img src={item.photoUrl || getItemIcon()} alt={displayName} />
              <p>{displayName}</p>
              <button type="button" onClick={() => startEditing(item)}>
                Edit
              </button>
              <button type="button" onClick={() => removeItem(item._id)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ItemList;
