// client/src/components/AddExistingItems.jsx
// Lets the user pick from items not already in this closet (unassigned or
// assigned elsewhere) and add several to it at once. Fetches fresh each
// time it's mounted, so it's meant to be shown/hidden by the parent rather
// than kept permanently mounted - no need to track staleness otherwise.
import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { getItemDisplayName } from '../utils/itemDisplay';

function AddExistingItems({ closetId, onAdd, onClose }) {
  const { items, loading, error } = useItems();
  const [selectedIds, setSelectedIds] = useState([]);

  const candidates = items.filter((item) => item.closetId !== closetId);

  function toggle(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleAdd() {
    await onAdd(selectedIds);
    onClose();
  }

  return (
    <div>
      {loading && <p>Loading items...</p>}
      {error && <p>Error: {error}</p>}

      <ul>
        {candidates.map((item) => (
          <li key={item._id}>
            <label>
              <input type="checkbox" checked={selectedIds.includes(item._id)} onChange={() => toggle(item._id)} />
              {getItemDisplayName(item)}
            </label>
          </li>
        ))}
      </ul>

      <button type="button" onClick={handleAdd} disabled={selectedIds.length === 0}>
        Add item
      </button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
}

export default AddExistingItems;
