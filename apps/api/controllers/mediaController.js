const ApiResponse = require("../utils/apiResponse");
const { uploadImage, deleteImage, ALLOWED_FOLDERS } = require("../utils/cloudinaryService");
const { hasValidImageSignature } = require("../middleware/uploadMiddleware");

// POST /api/media/images  (multipart, field: "images", body: { folder })
const uploadMediaImages = async (req, res, next) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return ApiResponse.badRequest(res, 'No files received. Send images under the "images" field');
    }

    const folder = req.body.folder || "misc";
    if (!ALLOWED_FOLDERS.includes(folder)) {
      return ApiResponse.badRequest(res, `Invalid folder. Allowed: ${ALLOWED_FOLDERS.join(", ")}`);
    }

    const invalid = files.filter((f) => !hasValidImageSignature(f.buffer));
    if (invalid.length > 0) {
      return ApiResponse.badRequest(
        res,
        `Not a valid image file: ${invalid.map((f) => f.originalname).join(", ")}`
      );
    }

    const results = await Promise.allSettled(files.map((f) => uploadImage(f.buffer, folder)));

    const uploaded = [];
    const failed = [];
    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        uploaded.push({ ...r.value, originalName: files[i].originalname });
      } else {
        failed.push({ originalName: files[i].originalname, error: r.reason?.message || "Upload failed" });
      }
    });

    if (uploaded.length === 0) {
      return ApiResponse.error(res, "All uploads failed", 502, failed);
    }

    return ApiResponse.success(
      res,
      { uploaded, failed },
      failed.length > 0 ? `${uploaded.length} uploaded, ${failed.length} failed` : "Images uploaded successfully",
      failed.length > 0 ? 207 : 201
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/media/images  (body: { publicId })
const deleteMediaImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return ApiResponse.badRequest(res, "publicId is required");
    }
    await deleteImage(publicId);
    return ApiResponse.success(res, null, "Image deleted");
  } catch (error) {
    if (error.statusCode === 400) {
      return ApiResponse.badRequest(res, error.message);
    }
    next(error);
  }
};

module.exports = { uploadMediaImages, deleteMediaImage };
