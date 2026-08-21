// client/src/context/ActiveItemProvider.jsx
import { createActiveEntity } from './createActiveEntity';

const { Provider, useActiveEntity } = createActiveEntity(
  'useActiveItem must be used within an ActiveItemProvider'
);

export const ActiveItemProvider = Provider;
export const useActiveItemEntity = useActiveEntity;
