const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

const ROOT_FOLDER = "avir-trekkers";

// Folders the API allows uploads into. Anything else is rejected so the
// account never accumulates assets outside the app's namespace.
const ALLOWED_FOLDERS = ["treks", "gallery", "social", "hero", "team", "misc"];

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const err = new Error("Cloudinary credentials are not configured");
    err.statusCode = 503;
    throw err;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

const RETRYABLE = (error) => {
  const status = error?.http_code || error?.statusCode;
  // network failures have no http_code; 5xx and 420 (rate limit) are transient
  return !status || status >= 500 || status === 420;
};

async function withRetry(fn, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!RETRYABLE(error) || i === attempts - 1) throw error;
      await new Promise((r) => setTimeout(r, 500 * 2 ** i));
    }
  }
  throw lastError;
}

/**
 * Upload an image buffer.
 *
 * Free-plan cost controls:
 * - public_id is the content hash, so re-uploading an identical file returns
 *   the existing asset (overwrite:false) instead of storing a duplicate.
 * - a single incoming transformation caps stored size at 1920px / q_auto:good;
 *   no eager derived versions are generated.
 */
async function uploadImage(buffer, folder) {
  ensureConfigured();
  if (!ALLOWED_FOLDERS.includes(folder)) {
    const err = new Error(`Invalid folder. Allowed: ${ALLOWED_FOLDERS.join(", ")}`);
    err.statusCode = 400;
    throw err;
  }

  const hash = crypto.createHash("md5").update(buffer).digest("hex");

  const result = await withRetry(
    () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `${ROOT_FOLDER}/${folder}`,
            public_id: hash,
            overwrite: false,
            unique_filename: false,
            resource_type: "image",
            transformation: [{ width: 1920, height: 1920, crop: "limit", quality: "auto:good" }],
          },
          (error, uploadResult) => (error ? reject(error) : resolve(uploadResult))
        );
        stream.end(buffer);
      })
  );

  return {
    publicId: result.public_id,
    // f_auto/q_auto delivery URL: format + quality decided per-request by the
    // CDN, derived lazily on first hit — nothing extra is stored up front.
    url: cloudinary.url(result.public_id, {
      fetch_format: "auto",
      quality: "auto",
      secure: true,
    }),
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    existing: result.existing === true,
  };
}

/** Delete an asset. Only assets inside the app's root folder can be removed. */
async function deleteImage(publicId) {
  ensureConfigured();
  if (typeof publicId !== "string" || !publicId.startsWith(`${ROOT_FOLDER}/`)) {
    const err = new Error("Invalid public ID");
    err.statusCode = 400;
    throw err;
  }
  const result = await withRetry(() =>
    cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true })
  );
  return result.result === "ok" || result.result === "not found";
}

/** True when a URL points at this Cloudinary account's app folder. */
function isOwnAssetUrl(url) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName || typeof url !== "string") return false;
  return url.includes(`res.cloudinary.com/${cloudName}/`) && url.includes(`/${ROOT_FOLDER}/`);
}

/** Extract the public ID (avir-trekkers/<folder>/<hash>) from a delivery URL. */
function publicIdFromUrl(url) {
  const match = typeof url === "string" && url.match(new RegExp(`(${ROOT_FOLDER}/[\\w-]+/[\\w-]+)(?:\\.[a-zA-Z0-9]+)?(?:$|\\?)`));
  return match ? match[1] : null;
}

module.exports = { uploadImage, deleteImage, isOwnAssetUrl, publicIdFromUrl, ALLOWED_FOLDERS };
