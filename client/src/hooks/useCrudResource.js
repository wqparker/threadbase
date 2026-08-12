// client/src/hooks/useCrudResource.js
// Shared list+create+edit+delete state management for a fetched resource.
// useClosets/useItems are thin wrappers that call this with their own
// service functions and rename data/create/update/remove to their domain's
// naming (closets/addCloset/editCloset/removeCloset, etc).
import { useEffect, useState } from 'react';

export function useCrudResource(fetchFn, { createFn, updateFn, deleteFn, deps = [] }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Deliberate: flips the loading flag before the fetch starts. The
    // "cascading render" this rule warns about is real but negligible here -
    // a single extra render to flip loading true.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchFn()
      .then((result) => {
        if (!cancelled) setData(result);
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
    // deps is caller-controlled by design, same idea as useEffect's own
    // dependency array - each call site passes exactly what should trigger
    // a refetch (e.g. [closetId]), so exhaustive-deps can't verify this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  async function create(payload) {
    const created = await createFn(payload);
    setData((prev) => [...prev, created]);
    return created;
  }

  async function update(id, payload) {
    const updated = await updateFn(id, payload);
    setData((prev) => prev.map((item) => (item._id === id ? updated : item)));
    return updated;
  }

  async function remove(id) {
    await deleteFn(id);
    setData((prev) => prev.filter((item) => item._id !== id));
  }

  return { data, loading, error, create, update, remove };
}
