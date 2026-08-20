// client/src/components/ClosetForm.jsx
// Shared by ClosetsScreen (create) and ClosetDetailScreen (edit) - same
// fields either way, only the values/handlers/label differ. Styled to
// match ItemFieldsForm's layout (big title input + a field-list dl).
function ClosetForm({ values, onChange, onSubmit, onCancel, submitLabel }) {
  function handleChange(field, value) {
    onChange({ ...values, [field]: value });
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        className="detail-title-input"
        type="text"
        placeholder="Closet name"
        value={values.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <dl className="field-list">
        <dt>Description</dt>
        <dd>
          <input
            type="text"
            placeholder="Description (optional)"
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
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

export default ClosetForm;
