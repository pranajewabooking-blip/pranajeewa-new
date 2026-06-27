import { asyncHandler } from "../utils/asyncHandler.js";
import { isCloudinaryConfigured, uploadedImageUrl } from "../utils/imageStorage.js";

export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(422).json({ message: "Image file is required" });
  }

  const url = await uploadedImageUrl(req.file, "uploads");

  res.status(201).json({
    url,
    filename: req.file.filename,
    provider: isCloudinaryConfigured ? "cloudinary" : "local"
  });
});
