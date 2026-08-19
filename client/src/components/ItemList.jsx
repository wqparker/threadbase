// client/src/components/ItemList.jsx
// Shared grid + add UI for a set of items. Pass closetId to scope to one
// closet, so new items default to it; omit it to show every item
// regardless of closet. Either way, the form's own closet dropdown lets
// the user assign/reassign/unassign independently of that scope.
// Cards are read-only nav triggers - editing/deleting an item happens on
// its detail screen, reached via onNavigateToItemDetail. Creating a new
// item is behind an "Add new" toggle rather than an always-open form, and
// uses the same ItemFieldsForm layout as that detail screen's Edit mode.
import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { useClosets } from '../hooks/useClosets';
import { useActiveItem } from '../hooks/useActiveItem';
import { ITEM_TYPES, COLOUR_CATEGORIES } from '../constants';
import ItemFieldsForm from './ItemFieldsForm';
import ItemCard from './ItemCard';
import AddExistingItems from './AddExistingItems';

function buildEmptyForm(closetId) {
  return {
    type: ITEM_TYPES[0],
    colourCategory: COLOUR_CATEGORIES[0],
    brand: '',
    nickname: '',
    closetId: closetId || '',
    colour: '',
    photoUrl: '',
    wearStatus: 'clean',
    wearCount: '0',
    lastWorn: '',
    lastWashed: '',
    washTemp: '',
    dryMethod: '',
    bleachOk: false,
    ironOk: true,
    delicate: false,
  };
}

function ItemList({ closetId, onNavigateToItemDetail }) {
  const { items, loading, error, addItem, editItem } = useItems(closetId);
  const { closets } = useClosets();
  const { setActiveItem } = useActiveItem();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formValues, setFormValues] = useState(() => buildEmptyForm(closetId));
  const [showExistingPicker, setShowExistingPicker] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    // '' becomes undefined for optional fields so the create payload
    // omits them entirely, letting the schema apply its own defaults.
    await addItem({
      type: formValues.type,
      colourCategory: formValues.colourCategory,
      brand: formValues.brand,
      nickname: formValues.nickname,
      closetId: formValues.closetId || undefined,
      colour: formValues.colour,
      photoUrl: formValues.photoUrl,
      wearStatus: formValues.wearStatus,
      wearCount: Number(formValues.wearCount),
      lastWorn: formValues.lastWorn || undefined,
      lastWashed: formValues.lastWashed || undefined,
      careInstructions: {
        washTemp: formValues.washTemp || undefined,
        dryMethod: formValues.dryMethod || undefined,
        bleachOk: formValues.bleachOk,
        ironOk: formValues.ironOk,
        delicate: formValues.delicate,
        source: 'manual',
      },
    });
    setFormValues(buildEmptyForm(closetId));
    setShowCreateForm(false);
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
      {showCreateForm ? (
        <ItemFieldsForm
          values={formValues}
          onChange={setFormValues}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormValues(buildEmptyForm(closetId));
            setShowCreateForm(false);
          }}
          submitLabel="Create item"
          closets={closets}
        />
      ) : (
        <button type="button" onClick={() => setShowCreateForm(true)}>
          Add new
        </button>
      )}

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
