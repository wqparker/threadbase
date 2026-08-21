// client/src/services/apiClient.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function request(path, options = {}) {
  // FormData bodies (photo uploads) need the browser to set its own
  // multipart boundary header - forcing application/json here would
  // break the request.
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}
