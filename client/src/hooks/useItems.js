// client/src/hooks/useItems.js
import { useEffect, useState } from 'react';
import { getItems, createItem, deleteItem } from '../services/itemService';

export function useItems(closetId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
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

  async function removeItem(id) {
    await deleteItem(id);
    setItems((prev) => prev.filter((item) => item._id !== id));
  }

  return { items, loading, error, addItem, removeItem };
}
