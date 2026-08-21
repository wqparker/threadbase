// client/src/screens/ItemDetailScreen.jsx
// Reached by clicking an item card in ItemList - shows every field for one
// item, with Edit/Delete living only here (not on the grid cards). Edit
// swaps to ItemFieldsForm, the same field layout ItemList's "Add new" uses
// for creation, so editing and creating look and behave identically.
// Calls itemService directly rather than going through useItems/
// useCrudResource: this screen isn't scoped to any one closet's list, and
// the screens that list items fully unmount when navigating away, so
// their own lists refetch fresh on return - there's no cache here to keep
// in sync.
import { useState } from 'react';
import { useActiveItem } from '../hooks/useActiveItem';
import { useClosets } from '../hooks/useClosets';
import { updateItem, deleteItem } from '../services/itemService';
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';
import ItemFieldsForm from '../components/ItemFieldsForm';
import BackIcon from '../components/icons/BackIcon';
import EditIcon from '../components/icons/EditIcon';
import DeleteIcon from '../components/icons/DeleteIcon';

function toDateInputValue(date) {
  return date ? new Date(date).toISOString().slice(0, 10) : '';
}

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
    const care = activeItem.careInstructions || {};
    setEditValues({
      type: activeItem.type,
      colourCategory: activeItem.colourCategory,
      brand: activeItem.brand || '',
      nickname: activeItem.nickname || '',
      closetId: activeItem.closetId || '',
      colour: activeItem.colour || '',
      photoUrl: activeItem.photoUrl || '',
      photoFile: null,
      wearStatus: activeItem.wearStatus || 'clean',
      wearCount: String(activeItem.wearCount ?? 0),
      lastWorn: toDateInputValue(activeItem.lastWorn),
      lastWashed: toDateInputValue(activeItem.lastWashed),
      washTemp: care.washTemp || '',
      dryMethod: care.dryMethod || '',
      bleachOk: care.bleachOk || false,
      ironOk: care.ironOk ?? true,
      delicate: care.delicate || false,
    });
    setIsEditing(true);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    // '' becomes null/undefined for optional fields so the update clears
    // them explicitly rather than leaving stale values in place.
    // photoFile isn't JSON-serializable and travels as its own request
    // part instead - see updateItem/toRequestBody in itemService.
    const updated = await updateItem(
      activeItem._id,
      {
        type: editValues.type,
        colourCategory: editValues.colourCategory,
        brand: editValues.brand,
        nickname: editValues.nickname,
        closetId: editValues.closetId || null,
        colour: editValues.colour,
        photoUrl: editValues.photoUrl,
        wearStatus: editValues.wearStatus,
        wearCount: Number(editValues.wearCount),
        lastWorn: editValues.lastWorn || null,
        lastWashed: editValues.lastWashed || null,
        careInstructions: {
          washTemp: editValues.washTemp || undefined,
          dryMethod: editValues.dryMethod || undefined,
          bleachOk: editValues.bleachOk,
          ironOk: editValues.ironOk,
          delicate: editValues.delicate,
          source: 'manual',
        },
      },
      editValues.photoFile
    );
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
      <button type="button" className="icon-button" onClick={onBack}>
        <BackIcon />
        Back
      </button>

      {isEditing ? (
        <ItemFieldsForm
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
            className={`item-detail-image${activeItem.photoUrl ? '' : ' item-icon-fallback'}`}
            src={activeItem.photoUrl || getItemIcon(activeItem.type)}
            alt={displayName}
          />
          <h1>{displayName}</h1>
          <dl className="field-list">
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
          <button type="button" className="icon-button" onClick={startEditing}>
            <EditIcon />
            Edit
          </button>
          <button type="button" className="icon-button" onClick={handleDelete}>
            <DeleteIcon />
            Delete
          </button>
        </>
      )}
    </section>
  );
}

export default ItemDetailScreen;
