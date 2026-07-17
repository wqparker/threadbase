// client/src/screens/ClosetsScreen.jsx
import { useState } from 'react';
import { useClosets } from '../hooks/useClosets';

function ClosetsScreen() {
  const { closets, loading, error, addCloset } = useClosets();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await addCloset({ name, description });
    setName('');
    setDescription('');
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
        {closets.map((closet) => (
          <li key={closet._id}>
            <strong>{closet.name}</strong>
            {closet.description && <span> — {closet.description}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ClosetsScreen;
