// client/src/hooks/useClosets.js
import { useCrudResource } from './useCrudResource';
import { getClosets, createCloset, updateCloset, deleteCloset } from '../services/closetService';

export function useClosets() {
  const { data: closets, loading, error, create, update, remove } = useCrudResource(getClosets, {
    createFn: createCloset,
    updateFn: updateCloset,
    deleteFn: deleteCloset,
  });

  return { closets, loading, error, addCloset: create, editCloset: update, removeCloset: remove };
}
