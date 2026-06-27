import fs from "node:fs/promises";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

export const isCloudinaryConfigured = Boolean(
  env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret
  });
}

const cloudinaryFolder = (folder) =>
  [env.cloudinaryFolder, folder]
    .filter(Boolean)
    .map((part) => String(part).replace(/^\/+|\/+$/g, ""))
    .join("/");

export const uploadedImageUrl = async (file, folder = "images") => {
  if (!file) return undefined;

  if (!isCloudinaryConfigured) {
    return `/uploads/${file.filename}`;
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: cloudinaryFolder(folder),
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });

    return result.secure_url;
  } finally {
    await fs.unlink(file.path).catch(() => {});
  }
};
