// client/src/components/ItemList.jsx
// Shared grid + add UI for a set of items. Pass closetId to scope to one
// closet, so new items default to it; omit it to show every item
// regardless of closet. Either way, the form's own closet dropdown lets
// the user assign/reassign/unassign independently of that scope.
// Cards are read-only nav triggers - editing/deleting an item happens on
// its detail screen, reached via onNavigateToItemDetail.
import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { useClosets } from '../hooks/useClosets';
import { useActiveItem } from '../hooks/useActiveItem';
import { ITEM_TYPES, COLOUR_CATEGORIES } from '../constants';
import ItemForm from './ItemForm';
import ItemCard from './ItemCard';
import AddExistingItems from './AddExistingItems';

function buildEmptyForm(closetId) {
  return {
    type: ITEM_TYPES[0],
    colourCategory: COLOUR_CATEGORIES[0],
    brand: '',
    nickname: '',
    closetId: closetId || '',
  };
}

function ItemList({ closetId, onNavigateToItemDetail }) {
  const { items, loading, error, addItem, editItem } = useItems(closetId);
  const { closets } = useClosets();
  const { setActiveItem } = useActiveItem();
  const [formValues, setFormValues] = useState(() => buildEmptyForm(closetId));
  const [showExistingPicker, setShowExistingPicker] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    // '' (Unassigned) becomes undefined so the create payload omits
    // closetId entirely, same as before the dropdown existed.
    await addItem({ ...formValues, closetId: formValues.closetId || undefined });
    setFormValues((prev) => ({ ...prev, brand: '', nickname: '' }));
  }

  async function handleAddExisting(ids) {
    await Promise.all(ids.map((id) => editItem(id, { closetId })));
  }

  function handleItemClick(item) {
    setActiveItem(item);
    onNavigateToItemDetail();
  }

  return (
    <>
      <ItemForm
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        submitLabel="Create item"
        closets={closets}
      />

      {closetId &&
        (showExistingPicker ? (
          <AddExistingItems
            closetId={closetId}
            onAdd={handleAddExisting}
            onClose={() => setShowExistingPicker(false)}
          />
        ) : (
          <button type="button" onClick={() => setShowExistingPicker(true)}>
            Add existing item
          </button>
        ))}

      {loading && <p>Loading items...</p>}
      {error && <p>Error: {error}</p>}

      <div className="item-grid">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} onClick={() => handleItemClick(item)} />
        ))}
      </div>
    </>
  );
}

export default ItemList;
