// client/src/services/itemService.js
import { request } from './apiClient';

export function getItems(closetId) {
  const query = closetId ? `?closetId=${closetId}` : '';
  return request(`/api/items${query}`);
}

export function getItem(id) {
  return request(`/api/items/${id}`);
}

export function createItem(data) {
  return request('/api/items', { method: 'POST', body: JSON.stringify(data) });
}

export function updateItem(id, data) {
  return request(`/api/items/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteItem(id) {
  return request(`/api/items/${id}`, { method: 'DELETE' });
}
