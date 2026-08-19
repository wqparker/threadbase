// client/src/screens/ItemDetailScreen.jsx
// Reached by clicking an item card in ItemList - shows every field for one
// item, with Edit/Delete living only here (not on the grid cards). Edit
// swaps every field's value in place (same dl layout, inputs/selects where
// the text was) rather than switching to ItemForm - ItemForm only covers 5
// fields and its stacked layout doesn't fit here, so this duplicates
// those 5 inline and adds controls for the rest instead of reusing it.
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
import { ITEM_TYPES, COLOUR_CATEGORIES, WEAR_STATUSES, WASH_TEMPS, DRY_METHODS } from '../constants';

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

  function handleChange(field, value) {
    setEditValues((prev) => ({ ...prev, [field]: value }));
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
    const updated = await updateItem(activeItem._id, {
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

      <img
        className="item-detail-image"
        src={activeItem.photoUrl || getItemIcon()}
        alt={displayName}
      />

      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            className="item-detail-title-input"
            type="text"
            placeholder="Nickname (optional)"
            value={editValues.nickname}
            onChange={(e) => handleChange('nickname', e.target.value)}
          />
          <dl>
            <dt>Type</dt>
            <dd>
              <select value={editValues.type} onChange={(e) => handleChange('type', e.target.value)}>
                {ITEM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </dd>
            <dt>Brand</dt>
            <dd>
              <input
                type="text"
                placeholder="Brand (optional)"
                value={editValues.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
              />
            </dd>
            <dt>Closet</dt>
            <dd>
              <select
                value={editValues.closetId}
                onChange={(e) => handleChange('closetId', e.target.value)}
              >
                <option value="">Unassigned</option>
                {closets.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </dd>
            <dt>Colour category</dt>
            <dd>
              <select
                value={editValues.colourCategory}
                onChange={(e) => handleChange('colourCategory', e.target.value)}
              >
                {COLOUR_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </dd>
            <dt>Colour</dt>
            <dd>
              <input
                type="text"
                placeholder="Colour (optional)"
                value={editValues.colour}
                onChange={(e) => handleChange('colour', e.target.value)}
              />
            </dd>
            <dt>Wear status</dt>
            <dd>
              <select
                value={editValues.wearStatus}
                onChange={(e) => handleChange('wearStatus', e.target.value)}
              >
                {WEAR_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </dd>
            <dt>Wear count</dt>
            <dd>
              <input
                type="number"
                min="0"
                value={editValues.wearCount}
                onChange={(e) => handleChange('wearCount', e.target.value)}
              />
            </dd>
            <dt>Last worn</dt>
            <dd>
              <input
                type="date"
                value={editValues.lastWorn}
                onChange={(e) => handleChange('lastWorn', e.target.value)}
              />
            </dd>
            <dt>Last washed</dt>
            <dd>
              <input
                type="date"
                value={editValues.lastWashed}
                onChange={(e) => handleChange('lastWashed', e.target.value)}
              />
            </dd>
            <dt>Wash temp</dt>
            <dd>
              <select
                value={editValues.washTemp}
                onChange={(e) => handleChange('washTemp', e.target.value)}
              >
                <option value="">(not set)</option>
                {WASH_TEMPS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </dd>
            <dt>Dry method</dt>
            <dd>
              <select
                value={editValues.dryMethod}
                onChange={(e) => handleChange('dryMethod', e.target.value)}
              >
                <option value="">(not set)</option>
                {DRY_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </dd>
            <dt>Bleach OK</dt>
            <dd>
              <input
                type="checkbox"
                checked={editValues.bleachOk}
                onChange={(e) => handleChange('bleachOk', e.target.checked)}
              />
            </dd>
            <dt>Iron OK</dt>
            <dd>
              <input
                type="checkbox"
                checked={editValues.ironOk}
                onChange={(e) => handleChange('ironOk', e.target.checked)}
              />
            </dd>
            <dt>Delicate</dt>
            <dd>
              <input
                type="checkbox"
                checked={editValues.delicate}
                onChange={(e) => handleChange('delicate', e.target.checked)}
              />
            </dd>
            <dt>Photo URL</dt>
            <dd>
              <input
                type="text"
                placeholder="Photo URL (optional)"
                value={editValues.photoUrl}
                onChange={(e) => handleChange('photoUrl', e.target.value)}
              />
            </dd>
          </dl>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
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
            <dt>Photo URL</dt>
            <dd>{activeItem.photoUrl || '—'}</dd>
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
