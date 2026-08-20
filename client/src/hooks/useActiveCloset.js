// client/src/hooks/useActiveCloset.js
import { useActiveClosetEntity } from '../context/ActiveClosetProvider';

export function useActiveCloset() {
  const { active, setActive } = useActiveClosetEntity();
  return { activeCloset: active, setActiveCloset: setActive };
}
