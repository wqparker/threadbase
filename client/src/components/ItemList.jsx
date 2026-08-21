// client/src/components/ItemList.jsx
// Shared grid for a set of items, plus existing-item assignment
// (closetId-scoped only). Pass closetId to scope to one closet; omit it
// to show every item regardless of closet. Cards are read-only nav
// triggers - editing/deleting an item happens on its detail screen, and
// creating a new one happens on ItemCreateScreen - both reached via the
// onNavigateTo* callbacks, not rendered inline here.
import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { useActiveItem } from '../hooks/useActiveItem';
import ItemCard from './ItemCard';
import AddExistingItems from './AddExistingItems';
import AddableGrid from './AddableGrid';

function ItemList({ closetId, onNavigateToItemDetail, onNavigateToItemCreate }) {
  const { items, loading, error, editItem } = useItems(closetId);
  const { setActiveItem } = useActiveItem();
  const [showExistingPicker, setShowExistingPicker] = useState(false);

  async function handleAddExisting(ids) {
    await Promise.all(ids.map((id) => editItem(id, { closetId })));
  }

  function handleItemClick(item) {
    setActiveItem(item);
    onNavigateToItemDetail();
  }

  return (
    <>
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

      <AddableGrid
        items={items}
        renderItem={(item) => (
          <ItemCard key={item._id} item={item} onClick={() => handleItemClick(item)} />
        )}
        addLabel="Add Item"
        onAddClick={onNavigateToItemCreate}
      />
    </>
  );
}

export default ItemList;
