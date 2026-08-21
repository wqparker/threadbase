// client/src/context/ActiveClosetProvider.jsx
import { createActiveEntity } from './createActiveEntity';

const { Provider, useActiveEntity } = createActiveEntity(
  'useActiveCloset must be used within an ActiveClosetProvider'
);

export const ActiveClosetProvider = Provider;
export const useActiveClosetEntity = useActiveEntity;
