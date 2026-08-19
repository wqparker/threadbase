// client/src/services/laundryService.js
import { request } from './apiClient';

export function generateLaundryLoads() {
  return request('/api/laundry/generate', { method: 'POST' });
}
