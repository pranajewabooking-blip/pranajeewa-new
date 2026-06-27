import { NewsBanner } from "../models/NewsBanner.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadedImageUrl } from "../utils/imageStorage.js";

export const listPublicBanners = asyncHandler(async (req, res) => {
  const banners = await NewsBanner.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.json({ banners });
});

export const listAllBanners = asyncHandler(async (req, res) => {
  const banners = await NewsBanner.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json({ banners });
});

export const createBanner = asyncHandler(async (req, res) => {
  const image = (await uploadedImageUrl(req.file, "news-banners")) || req.body.image;

  if (!image) {
    return res.status(422).json({
      message: "Validation failed",
      errors: [{ field: "image", message: "Banner image is required" }]
    });
  }

  const banner = await NewsBanner.create({
    title: req.body.title,
    image,
    altText: req.body.altText,
    linkUrl: req.body.linkUrl,
    isActive: req.body.isActive === undefined ? true : req.body.isActive === "true" || req.body.isActive === true,
    sortOrder: Number(req.body.sortOrder || 0)
  });

  res.status(201).json({ banner });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await NewsBanner.findById(req.params.id);

  if (!banner) {
    return res.status(404).json({ message: "News banner not found" });
  }

  banner.title = req.body.title ?? banner.title;
  banner.image = (await uploadedImageUrl(req.file, "news-banners")) || req.body.image || banner.image;
  banner.altText = req.body.altText ?? banner.altText;
  banner.linkUrl = req.body.linkUrl ?? banner.linkUrl;

  if (req.body.isActive !== undefined) {
    banner.isActive = req.body.isActive === "true" || req.body.isActive === true;
  }

  if (req.body.sortOrder !== undefined) {
    banner.sortOrder = Number(req.body.sortOrder);
  }

  await banner.save();

  res.json({ banner });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await NewsBanner.findByIdAndDelete(req.params.id);

  if (!banner) {
    return res.status(404).json({ message: "News banner not found" });
  }

  res.json({ message: "News banner deleted" });
});
