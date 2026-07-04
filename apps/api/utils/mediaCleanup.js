const { deleteImage, isOwnAssetUrl, publicIdFromUrl } = require("./cloudinaryService");
const Trek = require("../Models/TrekModel");
const GalleryTrek = require("../Models/GalleryTrekModel");
const SocialActivity = require("../Models/SocialActivityModel");
const HeroSlide = require("../Models/HeroSlideModel");
const TeamMember = require("../Models/TeamMemberModel");
const Review = require("../Models/ReviewModel");

// Every model/field that stores image URLs. Uploads are deduplicated by
// content hash, so one Cloudinary asset can back multiple records — an asset
// may only be destroyed once nothing references it.
const REFERENCE_QUERIES = (url) => [
  Trek.countDocuments({ images: url }),
  GalleryTrek.countDocuments({ "images.url": url }),
  SocialActivity.countDocuments({ "images.url": url }),
  HeroSlide.countDocuments({ image: url }),
  TeamMember.countDocuments({ photo: url }),
  Review.countDocuments({ customerAvatar: url }),
];

async function isReferenced(url) {
  const counts = await Promise.all(REFERENCE_QUERIES(url));
  return counts.some((c) => c > 0);
}

/**
 * Best-effort cleanup of Cloudinary assets that are no longer referenced by
 * any record. Call AFTER the DB removal has been saved. Never throws; a
 * failed cleanup must not fail the request that triggered it.
 */
async function cleanupUrls(urls) {
  try {
    const list = (Array.isArray(urls) ? urls : [urls])
      .map((u) => (typeof u === "string" ? u : u?.url))
      .filter((u) => isOwnAssetUrl(u));

    for (const url of list) {
      try {
        if (await isReferenced(url)) continue;
        const publicId = publicIdFromUrl(url);
        if (publicId) await deleteImage(publicId);
      } catch (err) {
        console.error(`[cloudinary] cleanup failed for ${url}:`, err.message);
      }
    }
  } catch (err) {
    console.error("[cloudinary] cleanup error:", err.message);
  }
}

module.exports = { cleanupUrls };
