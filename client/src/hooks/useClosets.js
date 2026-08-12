// client/src/hooks/useClosets.js
import { useEffect, useState, useCallback } from 'react';
import { getClosets, createCloset, updateCloset, deleteCloset } from '../services/closetService';

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
    // Deliberate: refresh() sets loading/data/error to kick off the initial
    // fetch. The "cascading render" this rule warns about is real but
    // negligible here - a single extra render to flip loading true.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  async function addCloset(data) {
    const newCloset = await createCloset(data);
    setClosets((prev) => [...prev, newCloset]);
    return newCloset;
  }

  async function editCloset(id, data) {
    const updated = await updateCloset(id, data);
    setClosets((prev) => prev.map((closet) => (closet._id === id ? updated : closet)));
    return updated;
  }

  async function removeCloset(id) {
    await deleteCloset(id);
    setClosets((prev) => prev.filter((closet) => closet._id !== id));
  }

  return { closets, loading, error, addCloset, editCloset, removeCloset };
}
