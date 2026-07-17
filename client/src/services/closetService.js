// client/src/services/closetService.js
import { request } from './apiClient';

export function getClosets() {
  return request('/api/closets');
}

export function getCloset(id) {
  return request(`/api/closets/${id}`);
}

export function createCloset(data) {
  return request('/api/closets', { method: 'POST', body: JSON.stringify(data) });
}

export function updateCloset(id, data) {
  return request(`/api/closets/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteCloset(id) {
  return request(`/api/closets/${id}`, { method: 'DELETE' });
}
