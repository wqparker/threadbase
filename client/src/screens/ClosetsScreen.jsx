// client/src/screens/ClosetsScreen.jsx
import { useState } from 'react';
import { useClosets } from '../hooks/useClosets';

function ClosetsScreen({ onSelectCloset }) {
  const { closets, loading, error, addCloset, editCloset, removeCloset } = useClosets();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await addCloset({ name, description });
    setName('');
    setDescription('');
  }

  function startEditing(closet) {
    setEditingId(closet._id);
    setEditName(closet.name);
    setEditDescription(closet.description || '');
  }

  async function handleEditSubmit(e, id) {
    e.preventDefault();
    if (!editName.trim()) return;
    await editCloset(id, { name: editName, description: editDescription });
    setEditingId(null);
  }

  return (
    <section id="closets">
      <h1>Closets</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Closet name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add closet</button>
      </form>

      {loading && <p>Loading closets...</p>}
      {error && <p>Error: {error}</p>}

      <ul>
        {closets.map((closet) =>
          editingId === closet._id ? (
            <li key={closet._id}>
              <form onSubmit={(e) => handleEditSubmit(e, closet._id)}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </form>
            </li>
          ) : (
            <li key={closet._id}>
              <button type="button" onClick={() => onSelectCloset(closet)}>
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
