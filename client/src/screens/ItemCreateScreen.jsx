// client/src/screens/ItemCreateScreen.jsx
// Reached by clicking "Add Item" in ClothesScreen or a closet's detail
// screen - same visual shell as ItemDetailScreen (Back button, photo,
// ItemFieldsForm) but for creating a new item rather than viewing/
// editing one, so no view/edit toggle and no Delete button. Calls
// itemService directly rather than going through useItems/
// useCrudResource: this screen isn't a list, and the screens that list
// items fully unmount/refetch fresh on return, so there's no cache here
// to keep in sync (same rationale as ItemDetailScreen).
import { useState } from 'react';
import { useClosets } from '../hooks/useClosets';
import { createItem } from '../services/itemService';
import { ITEM_TYPES, COLOUR_CATEGORIES } from '../constants';
import ItemFieldsForm from '../components/ItemFieldsForm';
import BackIcon from '../components/icons/BackIcon';

function buildEmptyForm(closetId) {
  return {
    type: ITEM_TYPES[0],
    colourCategory: COLOUR_CATEGORIES[0],
    brand: '',
    nickname: '',
    closetId: closetId || '',
    colour: '',
    photoUrl: '',
    photoFile: null,
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

function ItemCreateScreen({ closetId, onBack }) {
  const { closets } = useClosets();
  const [formValues, setFormValues] = useState(() => buildEmptyForm(closetId));

  async function handleSubmit(e) {
    e.preventDefault();
    // '' becomes undefined for optional fields so the create payload
    // omits them entirely, letting the schema apply its own defaults.
    // photoFile isn't JSON-serializable and travels as its own request
    // part instead - see createItem/toRequestBody in itemService.
    await createItem(
      {
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
      },
      formValues.photoFile
    );
    onBack();
  }

  return (
    <section id="item-detail">
      <button type="button" className="icon-button" onClick={onBack}>
        <BackIcon />
        Back
      </button>

      <ItemFieldsForm
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        submitLabel="Create item"
        closets={closets}
      />
    </section>
  );
}

export default ItemCreateScreen;
