// client/src/components/ItemForm.jsx
// Shared by ItemList for both the add form and each item's inline edit
// form - same fields either way, only the values/handlers/label differ.
import { ITEM_TYPES, COLOUR_CATEGORIES } from '../constants';

function ItemForm({ values, onChange, onSubmit, onCancel, submitLabel, className }) {
  function handleChange(field, value) {
    onChange({ ...values, [field]: value });
  }

  return (
    <form className={className} onSubmit={onSubmit}>
      <select value={values.type} onChange={(e) => handleChange('type', e.target.value)}>
        {ITEM_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <select value={values.colourCategory} onChange={(e) => handleChange('colourCategory', e.target.value)}>
        {COLOUR_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Brand (optional)"
        value={values.brand}
        onChange={(e) => handleChange('brand', e.target.value)}
      />
      <input
        type="text"
        placeholder="Nickname (optional)"
        value={values.nickname}
        onChange={(e) => handleChange('nickname', e.target.value)}
      />
      <button type="submit">{submitLabel}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default ItemForm;
