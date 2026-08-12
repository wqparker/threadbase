// client/src/hooks/useItems.js
import { useCrudResource } from './useCrudResource';
import { getItems, createItem, updateItem, deleteItem } from '../services/itemService';

export function useItems(closetId) {
  const {
    data: items,
    loading,
    error,
    create,
    update,
    remove,
  } = useCrudResource(() => getItems(closetId), {
    createFn: createItem,
    updateFn: updateItem,
    deleteFn: deleteItem,
    deps: [closetId],
    belongs: closetId ? (item) => item.closetId === closetId : undefined,
  });

  return { items, loading, error, addItem: create, editItem: update, removeItem: remove };
}
