// client/src/components/ItemList.jsx
// Shared grid + add/edit/delete UI for a set of items. Pass closetId to
// scope to one closet, so new items default to it; omit it to show every
// item regardless of closet. Either way, the form's own closet dropdown
// lets the user assign/reassign/unassign independently of that scope.
import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { useClosets } from '../hooks/useClosets';
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';
import { ITEM_TYPES, COLOUR_CATEGORIES } from '../constants';
import ItemForm from './ItemForm';

function buildEmptyForm(closetId) {
  return {
    type: ITEM_TYPES[0],
    colourCategory: COLOUR_CATEGORIES[0],
    brand: '',
    nickname: '',
    closetId: closetId || '',
  };
}

function ItemList({ closetId }) {
  const { items, loading, error, addItem, editItem, removeItem } = useItems(closetId);
  const { closets } = useClosets();
  const [formValues, setFormValues] = useState(() => buildEmptyForm(closetId));
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState(() => buildEmptyForm(closetId));

  async function handleSubmit(e) {
    e.preventDefault();
    // '' (Unassigned) becomes undefined so the create payload omits
    // closetId entirely, same as before the dropdown existed.
    await addItem({ ...formValues, closetId: formValues.closetId || undefined });
    setFormValues((prev) => ({ ...prev, brand: '', nickname: '' }));
  }

  function startEditing(item) {
    setEditingId(item._id);
    setEditValues({
      type: item.type,
      colourCategory: item.colourCategory,
      brand: item.brand || '',
      nickname: item.nickname || '',
      closetId: item.closetId || '',
    });
  }

  async function handleEditSubmit(e, id) {
    e.preventDefault();
    // '' (Unassigned) becomes null so the update explicitly clears
    // closetId rather than omitting the key, which would leave it
    // untouched instead of unassigning it.
    await editItem(id, { ...editValues, closetId: editValues.closetId || null });
    setEditingId(null);
  }

  return (
    <>
      <ItemForm
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        submitLabel="Add item"
        closets={closets}
      />

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
                closets={closets}
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
