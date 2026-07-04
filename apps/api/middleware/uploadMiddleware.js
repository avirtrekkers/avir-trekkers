const multer = require("multer");

// Cloudinary free plan caps image files at 10MB; we cap lower since the
// incoming transformation resizes to <=1920px anyway.
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

// Magic-number signatures so a renamed .exe can't pass the MIME check.
const SIGNATURES = [
  { mime: "image/jpeg", check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/png", check: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { mime: "image/gif", check: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 },
  { mime: "image/webp", check: (b) => b.length > 11 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP" },
  { mime: "image/avif", check: (b) => b.length > 11 && b.toString("ascii", 4, 8) === "ftyp" },
];

function hasValidImageSignature(buffer) {
  if (!buffer || buffer.length < 12) return false;
  return SIGNATURES.some((s) => s.check(buffer));
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      const err = new Error("Only JPEG, PNG, WebP, GIF and AVIF images are allowed");
      err.statusCode = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

/** Wraps multer so its errors surface as clean 400s instead of 500s. */
const uploadImages = (req, res, next) => {
  upload.array("images", MAX_FILES)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        const messages = {
          LIMIT_FILE_SIZE: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          LIMIT_FILE_COUNT: `Too many files. Maximum is ${MAX_FILES}`,
          LIMIT_UNEXPECTED_FILE: 'Unexpected field. Send files under the "images" field',
        };
        return res.status(400).json({ success: false, message: messages[err.code] || err.message });
      }
      return res.status(err.statusCode || 400).json({ success: false, message: err.message });
    }
    next();
  });
};

module.exports = { uploadImages, hasValidImageSignature, MAX_FILE_SIZE, MAX_FILES };
