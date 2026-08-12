// client/src/components/ClosetForm.jsx
// Shared by ClosetsScreen for both the add form and each closet's inline
// edit form - same fields either way, only the values/handlers/label differ.
function ClosetForm({ values, onChange, onSubmit, onCancel, submitLabel }) {
  function handleChange(field, value) {
    onChange({ ...values, [field]: value });
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Closet name"
        value={values.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={values.description}
        onChange={(e) => handleChange('description', e.target.value)}
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

export default ClosetForm;
