// client/src/hooks/useActiveItem.js
import { useContext } from 'react';
import { ActiveItemContext } from '../context/ActiveItemContext';

export function useActiveItem() {
  const context = useContext(ActiveItemContext);
  if (!context) {
    throw new Error('useActiveItem must be used within an ActiveItemProvider');
  }
  return context;
}
