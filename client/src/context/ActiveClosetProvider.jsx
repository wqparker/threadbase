// client/src/context/ActiveClosetProvider.jsx
// Keeps the currently-viewed closet in sync between the sidebar and the
// item grid, so selecting a closet in one place is reflected in the other.
import { useMemo, useState } from 'react';
import { ActiveClosetContext } from './ActiveClosetContext';

export function ActiveClosetProvider({ children }) {
  const [activeCloset, setActiveCloset] = useState(null);
  const value = useMemo(() => ({ activeCloset, setActiveCloset }), [activeCloset]);
  return <ActiveClosetContext.Provider value={value}>{children}</ActiveClosetContext.Provider>;
}
