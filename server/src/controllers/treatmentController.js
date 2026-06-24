import mongoose from "mongoose";
import { Treatment } from "../models/Treatment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/slug.js";

const normalizeTextArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(String).map((item) => item.trim()).filter(Boolean);
      }
    } catch {
      // Fall through to comma/newline parsing.
    }

    return trimmed
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeIncludedTreatments = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => ({
        name: String(item.name || "").trim(),
        description: String(item.description || "").trim()
      }))
      .filter((item) => item.name);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      return normalizeIncludedTreatments(parsed);
    } catch {
      return trimmed
        .split(/\n+/)
        .map((line) => {
          const [name, ...description] = line.split(":");
          return {
            name: String(name || "").trim(),
            description: description.join(":").trim()
          };
        })
        .filter((item) => item.name);
    }
  }

  return [];
};

const fileImagePath = (req) => (req.file ? `/uploads/${req.file.filename}` : undefined);

const buildUniqueSlug = async (name, currentId) => {
  const base = slugify(name);
  let candidate = base;
  let index = 2;

  while (
    await Treatment.exists({
      slug: candidate,
      ...(currentId ? { _id: { $ne: currentId } } : {})
    })
  ) {
    candidate = `${base}-${index}`;
    index += 1;
  }

  return candidate;
};

export const listTreatments = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.category) filter.category = req.query.category;
  if (req.query.featured === "true") filter.isFeatured = true;

  const treatments = await Treatment.find(filter).sort({ createdAt: -1 });

  res.json({ treatments });
});

export const getTreatment = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const treatment = await Treatment.findOne(query);

  if (!treatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }

  res.json({ treatment });
});

export const createTreatment = asyncHandler(async (req, res) => {
  const image = fileImagePath(req) || req.body.image;

  if (!image) {
    return res.status(422).json({
      message: "Validation failed",
      errors: [{ field: "image", message: "Treatment image is required" }]
    });
  }

  const treatment = await Treatment.create({
    name: req.body.name,
    slug: await buildUniqueSlug(req.body.name),
    category: req.body.category,
    duration: req.body.duration,
    price: req.body.price,
    image,
    galleryImages: normalizeTextArray(req.body.galleryImages),
    shortDescription: req.body.shortDescription,
    description: req.body.description,
    keyFeatures: normalizeTextArray(req.body.keyFeatures),
    keyBenefits: normalizeTextArray(req.body.keyBenefits),
    includedTreatments: normalizeIncludedTreatments(req.body.includedTreatments),
    suitability: req.body.suitability,
    process: req.body.process,
    videos: normalizeTextArray(req.body.videos),
    videoUrl: req.body.videoUrl,
    buttonLabel: req.body.buttonLabel,
    isFeatured: req.body.isFeatured === undefined ? true : req.body.isFeatured === "true" || req.body.isFeatured === true
  });

  res.status(201).json({ treatment });
});

export const updateTreatment = asyncHandler(async (req, res) => {
  const treatment = await Treatment.findById(req.params.id);

  if (!treatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }

  const nextName = req.body.name || treatment.name;

  treatment.name = nextName;
  treatment.slug = await buildUniqueSlug(nextName, treatment._id);
  treatment.category = req.body.category || treatment.category;
  treatment.duration = req.body.duration ?? treatment.duration;
  treatment.price = req.body.price ?? treatment.price;
  treatment.image = fileImagePath(req) || req.body.image || treatment.image;
  if (req.body.galleryImages !== undefined) {
    treatment.galleryImages = normalizeTextArray(req.body.galleryImages);
  }
  treatment.shortDescription = req.body.shortDescription || treatment.shortDescription;
  treatment.description = req.body.description || treatment.description;
  if (req.body.keyFeatures !== undefined) {
    treatment.keyFeatures = normalizeTextArray(req.body.keyFeatures);
  }
  if (req.body.keyBenefits !== undefined) {
    treatment.keyBenefits = normalizeTextArray(req.body.keyBenefits);
  }
  if (req.body.includedTreatments !== undefined) {
    treatment.includedTreatments = normalizeIncludedTreatments(req.body.includedTreatments);
  }
  treatment.suitability = req.body.suitability ?? treatment.suitability;
  treatment.process = req.body.process ?? treatment.process;
  if (req.body.videos !== undefined) {
    treatment.videos = normalizeTextArray(req.body.videos);
  }
  treatment.videoUrl = req.body.videoUrl ?? treatment.videoUrl;
  treatment.buttonLabel = req.body.buttonLabel ?? treatment.buttonLabel;

  if (req.body.isFeatured !== undefined) {
    treatment.isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;
  }

  await treatment.save();

  res.json({ treatment });
});

export const deleteTreatment = asyncHandler(async (req, res) => {
  const treatment = await Treatment.findByIdAndDelete(req.params.id);

  if (!treatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }

  res.json({ message: "Treatment deleted" });
});
