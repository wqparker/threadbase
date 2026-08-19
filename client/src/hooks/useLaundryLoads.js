// client/src/hooks/useLaundryLoads.js
// "Generate loads" is a one-shot POST returning a new derived result, not a
// CRUD mutation against an existing list identified by _id, so this doesn't
// build on useCrudResource - it mirrors that hook's loading/error shape
// by hand instead.
import { useState } from 'react';
import { generateLaundryLoads } from '../services/laundryService';

export function useLaundryLoads() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generateLoads() {
    setLoading(true);
    setError(null);
    try {
      const result = await generateLaundryLoads();
      setLoads(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { loads, loading, error, generateLoads };
}
