// client/src/hooks/useActiveItem.js
import { useActiveItemEntity } from '../context/ActiveItemProvider';

export function useActiveItem() {
  const { active, setActive } = useActiveItemEntity();
  return { activeItem: active, setActiveItem: setActive };
}
