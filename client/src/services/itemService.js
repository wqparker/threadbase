// client/src/services/itemService.js
import { request } from './apiClient';

export function getItems(closetId) {
  const query = closetId ? `?closetId=${closetId}` : '';
  return request(`/api/items${query}`);
}

export function getItem(id) {
  return request(`/api/items/${id}`);
}

function toRequestBody(data, photoFile) {
  if (!photoFile) return JSON.stringify(data);
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  formData.append('photo', photoFile);
  return formData;
}

export function createItem(data, photoFile) {
  return request('/api/items', { method: 'POST', body: toRequestBody(data, photoFile) });
}

export function updateItem(id, data, photoFile) {
  return request(`/api/items/${id}`, { method: 'PUT', body: toRequestBody(data, photoFile) });
}

export function deleteItem(id) {
  return request(`/api/items/${id}`, { method: 'DELETE' });
}
