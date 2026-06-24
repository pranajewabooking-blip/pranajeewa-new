import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { env } from "../config/env.js";

fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, env.uploadDir);
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    callback(null, `${Date.now()}-${safeBase || "image"}${ext}`);
  }
});

const fileFilter = (req, file, callback) => {
  if (!file.mimetype.startsWith("image/")) {
    return callback(new Error("Only image uploads are allowed"));
  }

  callback(null, true);
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
