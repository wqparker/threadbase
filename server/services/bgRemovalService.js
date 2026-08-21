// server/services/bgRemovalService.js
// Thin HTTP wrapper around the local bg-removal-service (see its README
// for setup/run instructions - a separate Python process, not started by
// this server).
const BG_REMOVAL_URL = process.env.BG_REMOVAL_SERVICE_URL || 'http://localhost:8001';

async function removeBackground(buffer, mimetype) {
  const res = await fetch(`${BG_REMOVAL_URL}/remove-background`, {
    method: 'POST',
    headers: { 'Content-Type': mimetype },
    body: buffer,
  });
  if (!res.ok) throw new Error('Background removal failed');
  return Buffer.from(await res.arrayBuffer());
}

module.exports = { removeBackground };
