// client/src/context/ActiveItemProvider.jsx
// Keeps the currently-viewed item in sync between the item grid and the
// item detail screen, so selecting an item is reflected there.
import { useMemo, useState } from 'react';
import { ActiveItemContext } from './ActiveItemContext';

export function ActiveItemProvider({ children }) {
  const [activeItem, setActiveItem] = useState(null);
  const value = useMemo(() => ({ activeItem, setActiveItem }), [activeItem]);
  return <ActiveItemContext.Provider value={value}>{children}</ActiveItemContext.Provider>;
}
