// client/src/hooks/useClosets.js
import { useEffect, useState, useCallback } from 'react';
import { getClosets, createCloset, deleteCloset } from '../services/closetService';

export function useClosets() {
  const [closets, setClosets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClosets();
      setClosets(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addCloset(data) {
    const newCloset = await createCloset(data);
    setClosets((prev) => [...prev, newCloset]);
    return newCloset;
  }

  async function removeCloset(id) {
    await deleteCloset(id);
    setClosets((prev) => prev.filter((closet) => closet._id !== id));
  }

  return { closets, loading, error, addCloset, removeCloset };
}
