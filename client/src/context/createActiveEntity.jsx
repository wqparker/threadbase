// client/src/context/createActiveEntity.jsx
// Shared Context+Provider+hook factory for a "currently active entity"
// slice - ActiveCloset and ActiveItem are identical in shape and only
// differ in which entity they track, so both are built from this.
import { createContext, useContext, useMemo, useState } from 'react';

export function createActiveEntity(errorMessage) {
  const Context = createContext(undefined);

  function Provider({ children }) {
    const [active, setActive] = useState(null);
    const value = useMemo(() => ({ active, setActive }), [active]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useActiveEntity() {
    const context = useContext(Context);
    if (!context) {
      throw new Error(errorMessage);
    }
    return context;
  }

  return { Provider, useActiveEntity };
}
