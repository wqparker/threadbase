// client/src/screens/ClosetsScreen.jsx
import { useState } from 'react';
import { useClosets } from '../hooks/useClosets';
import { useActiveCloset } from '../hooks/useActiveCloset';
import ClosetForm from '../components/ClosetForm';

const EMPTY_FORM = { name: '', description: '' };

function ClosetsScreen({ onNavigateToClosetDetail }) {
  const { closets, loading, error, addCloset, editCloset, removeCloset } = useClosets();
  const { setActiveCloset } = useActiveCloset();
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState(EMPTY_FORM);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formValues.name.trim()) return;
    await addCloset(formValues);
    setFormValues(EMPTY_FORM);
  }

  function startEditing(closet) {
    setEditingId(closet._id);
    setEditValues({ name: closet.name, description: closet.description || '' });
  }

  async function handleEditSubmit(e, id) {
    e.preventDefault();
    if (!editValues.name.trim()) return;
    await editCloset(id, editValues);
    setEditingId(null);
  }

  function handleSelect(closet) {
    setActiveCloset(closet);
    onNavigateToClosetDetail();
  }

  return (
    <section id="closets">
      <h1>Closets</h1>

      <ClosetForm values={formValues} onChange={setFormValues} onSubmit={handleSubmit} submitLabel="Add closet" />

      {loading && <p>Loading closets...</p>}
      {error && <p>Error: {error}</p>}

      <ul>
        {closets.map((closet) =>
          editingId === closet._id ? (
            <li key={closet._id}>
              <ClosetForm
                values={editValues}
                onChange={setEditValues}
                onSubmit={(e) => handleEditSubmit(e, closet._id)}
                onCancel={() => setEditingId(null)}
                submitLabel="Save"
              />
            </li>
          ) : (
            <li key={closet._id}>
              <button type="button" onClick={() => handleSelect(closet)}>
                <strong>{closet.name}</strong>
                {closet.description && <span> — {closet.description}</span>}
              </button>
              <button type="button" onClick={() => startEditing(closet)}>
                Edit
              </button>
              <button type="button" onClick={() => removeCloset(closet._id)}>
                Delete
              </button>
            </li>
          )
        )}
      </ul>
    </section>
  );
}

export default ClosetsScreen;
