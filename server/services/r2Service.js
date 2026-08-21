// server/services/r2Service.js
// Talks to Cloudflare R2 via its S3-compatible API. region: 'auto' and
// the account-scoped endpoint form are Cloudflare's documented
// S3-compatibility settings, not a real AWS region.
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

async function uploadPhoto(buffer, mimetype) {
  const ext = EXTENSIONS[mimetype] || 'jpg';
  const key = `items/${crypto.randomUUID()}.${ext}`;
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    })
  );
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

// Only deletes URLs we actually own - existing items may have arbitrary
// manually-typed photoUrl values from before this feature existed.
async function deletePhotoIfOwned(url) {
  if (!url || !url.startsWith(process.env.R2_PUBLIC_URL)) return;
  const key = url.slice(process.env.R2_PUBLIC_URL.length + 1);
  await client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }));
}

module.exports = { uploadPhoto, deletePhotoIfOwned };
