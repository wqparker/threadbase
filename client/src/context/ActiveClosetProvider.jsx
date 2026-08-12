// client/src/context/ActiveClosetProvider.jsx
// Keeps the currently-viewed closet in sync between the sidebar and the
// item grid, so selecting a closet in one place is reflected in the other.
import { useState } from 'react';
import { ActiveClosetContext } from './ActiveClosetContext';

export function ActiveClosetProvider({ children }) {
  const [activeCloset, setActiveCloset] = useState(null);
  return (
    <ActiveClosetContext.Provider value={{ activeCloset, setActiveCloset }}>
      {children}
    </ActiveClosetContext.Provider>
  );
}
