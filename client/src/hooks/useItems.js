// client/src/hooks/useItems.js
import { useEffect, useState } from 'react';
import { getItems, createItem, updateItem, deleteItem } from '../services/itemService';

export function useItems(closetId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Deliberate: flips the loading flag before the fetch starts. The
    // "cascading render" this rule warns about is real but negligible here -
    // a single extra render to flip loading true.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getItems(closetId)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [closetId]);

  async function addItem(data) {
    const newItem = await createItem(data);
    setItems((prev) => [...prev, newItem]);
    return newItem;
  }

  async function editItem(id, data) {
    const updated = await updateItem(id, data);
    setItems((prev) => prev.map((item) => (item._id === id ? updated : item)));
    return updated;
  }

  async function removeItem(id) {
    await deleteItem(id);
    setItems((prev) => prev.filter((item) => item._id !== id));
  }

  return { items, loading, error, addItem, editItem, removeItem };
}
