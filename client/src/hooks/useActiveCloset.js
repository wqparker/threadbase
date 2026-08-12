// client/src/hooks/useActiveCloset.js
import { useContext } from 'react';
import { ActiveClosetContext } from '../context/ActiveClosetContext';

export function useActiveCloset() {
  const context = useContext(ActiveClosetContext);
  if (!context) {
    throw new Error('useActiveCloset must be used within an ActiveClosetProvider');
  }
  return context;
}
