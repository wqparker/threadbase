// client/src/components/ItemFieldsForm.jsx
// Every editable Item/CareInstructions field, laid out as the same
// nickname-title + dl grid used for read-only display on ItemDetailScreen -
// shared between that screen's in-place Edit and ItemList's "Add new" item
// creation, so both look and behave the same way. Fully controlled: the
// caller owns `values` (see ItemDetailScreen/ItemList for the shape) and
// builds its own submit payload from them (create vs. edit convert empty
// optional fields to undefined vs. null respectively).
import { ITEM_TYPES, COLOUR_CATEGORIES, WEAR_STATUSES, WASH_TEMPS, DRY_METHODS } from '../constants';

function ItemFieldsForm({ values, onChange, onSubmit, onCancel, submitLabel, closets }) {
  function handleChange(field, value) {
    onChange({ ...values, [field]: value });
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        className="item-detail-title-input"
        type="text"
        placeholder="Nickname (optional)"
        value={values.nickname}
        onChange={(e) => handleChange('nickname', e.target.value)}
      />
      <dl>
        <dt>Type</dt>
        <dd>
          <select value={values.type} onChange={(e) => handleChange('type', e.target.value)}>
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
            value={values.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
          />
        </dd>
        <dt>Closet</dt>
        <dd>
          <select value={values.closetId} onChange={(e) => handleChange('closetId', e.target.value)}>
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
            value={values.colourCategory}
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
            value={values.colour}
            onChange={(e) => handleChange('colour', e.target.value)}
          />
        </dd>
        <dt>Wear status</dt>
        <dd>
          <select value={values.wearStatus} onChange={(e) => handleChange('wearStatus', e.target.value)}>
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
            value={values.wearCount}
            onChange={(e) => handleChange('wearCount', e.target.value)}
          />
        </dd>
        <dt>Last worn</dt>
        <dd>
          <input
            type="date"
            value={values.lastWorn}
            onChange={(e) => handleChange('lastWorn', e.target.value)}
          />
        </dd>
        <dt>Last washed</dt>
        <dd>
          <input
            type="date"
            value={values.lastWashed}
            onChange={(e) => handleChange('lastWashed', e.target.value)}
          />
        </dd>
        <dt>Wash temp</dt>
        <dd>
          <select value={values.washTemp} onChange={(e) => handleChange('washTemp', e.target.value)}>
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
          <select value={values.dryMethod} onChange={(e) => handleChange('dryMethod', e.target.value)}>
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
            checked={values.bleachOk}
            onChange={(e) => handleChange('bleachOk', e.target.checked)}
          />
        </dd>
        <dt>Iron OK</dt>
        <dd>
          <input
            type="checkbox"
            checked={values.ironOk}
            onChange={(e) => handleChange('ironOk', e.target.checked)}
          />
        </dd>
        <dt>Delicate</dt>
        <dd>
          <input
            type="checkbox"
            checked={values.delicate}
            onChange={(e) => handleChange('delicate', e.target.checked)}
          />
        </dd>
        <dt>Photo URL</dt>
        <dd>
          <input
            type="text"
            placeholder="Photo URL (optional)"
            value={values.photoUrl}
            onChange={(e) => handleChange('photoUrl', e.target.value)}
          />
        </dd>
      </dl>
      <button type="submit">{submitLabel}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default ItemFieldsForm;
