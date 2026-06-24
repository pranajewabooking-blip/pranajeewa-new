import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(422).json({ message: "Image file is required" });
  }

  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename
  });
});
