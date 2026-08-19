// client/src/screens/ItemDetailScreen.jsx
// Reached by clicking an item card in ItemList - shows every field for one
// item, with Edit/Delete living only here (not on the grid cards). Calls
// itemService directly rather than going through useItems/useCrudResource:
// this screen isn't scoped to any one closet's list, and the screens that
// list items fully unmount when navigating away, so their own lists
// refetch fresh on return - there's no cache here to keep in sync.
import { useState } from 'react';
import { useActiveItem } from '../hooks/useActiveItem';
import { useClosets } from '../hooks/useClosets';
import { updateItem, deleteItem } from '../services/itemService';
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';
import ItemForm from '../components/ItemForm';

function ItemDetailScreen({ onBack }) {
  const { activeItem, setActiveItem } = useActiveItem();
  const { closets } = useClosets();
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState(null);

  if (!activeItem) {
    return (
      <section id="item-detail">
        <p>No item selected - go to Clothes or a closet and pick one.</p>
      </section>
    );
  }

  function startEditing() {
    setEditValues({
      type: activeItem.type,
      colourCategory: activeItem.colourCategory,
      brand: activeItem.brand || '',
      nickname: activeItem.nickname || '',
      closetId: activeItem.closetId || '',
    });
    setIsEditing(true);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    // '' (Unassigned) becomes null so the update explicitly clears
    // closetId rather than omitting the key, which would leave it
    // untouched instead of unassigning it.
    const updated = await updateItem(activeItem._id, {
      ...editValues,
      closetId: editValues.closetId || null,
    });
    setActiveItem(updated);
    setIsEditing(false);
  }

  async function handleDelete() {
    await deleteItem(activeItem._id);
    setActiveItem(null);
    onBack();
  }

  const displayName = getItemDisplayName(activeItem);
  const care = activeItem.careInstructions || {};
  const closet = closets.find((c) => c._id === activeItem.closetId);

  return (
    <section id="item-detail">
      <button type="button" onClick={onBack}>
        Back
      </button>

      {isEditing ? (
        <ItemForm
          values={editValues}
          onChange={setEditValues}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
          submitLabel="Save"
          closets={closets}
        />
      ) : (
        <>
          <img
            className="item-detail-image"
            src={activeItem.photoUrl || getItemIcon()}
            alt={displayName}
          />
          <h1>{displayName}</h1>
          <dl>
            <dt>Type</dt>
            <dd>{activeItem.type}</dd>
            <dt>Brand</dt>
            <dd>{activeItem.brand || '—'}</dd>
            <dt>Closet</dt>
            <dd>{closet ? closet.name : 'Unassigned'}</dd>
            <dt>Colour category</dt>
            <dd>{activeItem.colourCategory}</dd>
            <dt>Colour</dt>
            <dd>{activeItem.colour || '—'}</dd>
            <dt>Wear status</dt>
            <dd>{activeItem.wearStatus}</dd>
            <dt>Wear count</dt>
            <dd>{activeItem.wearCount}</dd>
            <dt>Last worn</dt>
            <dd>{activeItem.lastWorn ? new Date(activeItem.lastWorn).toLocaleDateString() : '—'}</dd>
            <dt>Last washed</dt>
            <dd>{activeItem.lastWashed ? new Date(activeItem.lastWashed).toLocaleDateString() : '—'}</dd>
            <dt>Wash temp</dt>
            <dd>{care.washTemp || '—'}</dd>
            <dt>Dry method</dt>
            <dd>{care.dryMethod || '—'}</dd>
            <dt>Bleach OK</dt>
            <dd>{care.bleachOk ? 'Yes' : 'No'}</dd>
            <dt>Iron OK</dt>
            <dd>{care.ironOk ? 'Yes' : 'No'}</dd>
            <dt>Delicate</dt>
            <dd>{care.delicate ? 'Yes' : 'No'}</dd>
          </dl>
          <button type="button" onClick={startEditing}>
            Edit
          </button>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </>
      )}
    </section>
  );
}

export default ItemDetailScreen;
