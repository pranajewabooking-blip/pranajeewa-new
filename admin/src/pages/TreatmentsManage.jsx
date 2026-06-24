import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { http, mediaUrl } from "../api/http";

const categories = ["Clinic", "Wellness Treatment", "Sport Massage Therapy", "Beauty Treatment"];

const emptyForm = {
  name: "",
  category: "Clinic",
  duration: "",
  price: "",
  image: "",
  imageFile: null,
  galleryImages: "",
  shortDescription: "",
  description: "",
  keyFeatures: "",
  keyBenefits: "",
  includedTreatments: "",
  suitability: "",
  process: "",
  videos: "",
  videoUrl: "",
  buttonLabel: "",
  isFeatured: true
};

export default function TreatmentsManage() {
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTreatments = async () => {
    setLoading(true);
    try {
      const response = await http.get("/treatments");
      setTreatments(response.data.treatments || []);
    } catch {
      setError("Unable to load treatments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreatments();
  }, []);

  const updateField = (event) => {
    const { name, value, files, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : files ? files[0] : value
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
  };

  const startEdit = (treatment) => {
    setEditingId(treatment._id);
    setForm({
      name: treatment.name || "",
      category: treatment.category || "Clinic",
      duration: treatment.duration || "",
      price: treatment.price || "",
      image: treatment.image || "",
      imageFile: null,
      galleryImages: (treatment.galleryImages || []).join("\n"),
      shortDescription: treatment.shortDescription || "",
      description: treatment.description || "",
      keyFeatures: (treatment.keyFeatures || []).join("\n"),
      keyBenefits: (treatment.keyBenefits || []).join("\n"),
      includedTreatments: (treatment.includedTreatments || [])
        .map((item) => `${item.name}: ${item.description || ""}`)
        .join("\n"),
      suitability: treatment.suitability || "",
      process: treatment.process || "",
      videos: (treatment.videos || []).join("\n"),
      videoUrl: treatment.videoUrl || "",
      buttonLabel: treatment.buttonLabel || "",
      isFeatured: Boolean(treatment.isFeatured)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildFormData = () => {
    const data = new FormData();
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("duration", form.duration);
    data.append("price", form.price);
    data.append("shortDescription", form.shortDescription);
    data.append("description", form.description);
    data.append("keyFeatures", form.keyFeatures);
    data.append("keyBenefits", form.keyBenefits);
    data.append("includedTreatments", form.includedTreatments);
    data.append("suitability", form.suitability);
    data.append("process", form.process);
    data.append("galleryImages", form.galleryImages);
    data.append("videos", form.videos);
    data.append("videoUrl", form.videoUrl);
    data.append("buttonLabel", form.buttonLabel);
    data.append("isFeatured", String(form.isFeatured));

    if (form.imageFile) {
      data.append("imageFile", form.imageFile);
    } else if (form.image) {
      data.append("image", form.image);
    }

    return data;
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await http.put(`/treatments/${editingId}`, buildFormData());
        setMessage("Treatment updated.");
      } else {
        await http.post("/treatments", buildFormData());
        setMessage("Treatment added.");
      }

      resetForm();
      await loadTreatments();
    } catch (requestError) {
      const validationMessage = requestError.response?.data?.errors?.[0]?.message;
      setError(validationMessage || requestError.response?.data?.message || "Unable to save treatment.");
    } finally {
      setSaving(false);
    }
  };

  const removeTreatment = async (id) => {
    const confirmed = window.confirm("Delete this treatment?");
    if (!confirmed) return;

    try {
      await http.delete(`/treatments/${id}`);
      setTreatments((current) => current.filter((treatment) => treatment._id !== id));
    } catch {
      setError("Unable to delete treatment.");
    }
  };

  return (
    <div>
      <div>
        <p className="text-sm font-bold uppercase text-brand-red">Treatment Management</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-brand-charcoal">
          {editingId ? "Edit Treatment" : "Add Treatment"}
        </h1>
      </div>

      <form onSubmit={submit} className="luxury-border mt-8 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Treatment Name</span>
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              required
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Category</span>
            <select
              name="category"
              value={form.category}
              onChange={updateField}
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Duration</span>
            <input
              name="duration"
              value={form.duration}
              onChange={updateField}
              placeholder="75 Mins"
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Price</span>
            <input
              name="price"
              value={form.price}
              onChange={updateField}
              placeholder="Rs. 6,500"
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Image URL</span>
            <input
              name="image"
              value={form.image}
              onChange={updateField}
              placeholder="https://..."
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Upload Image</span>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={updateField}
              className="w-full rounded-md border border-brand-gold/35 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-md file:border-0 file:bg-brand-cream file:px-4 file:py-2 file:font-bold file:text-brand-maroon"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Gallery Image URLs</span>
            <textarea
              name="galleryImages"
              value={form.galleryImages}
              onChange={updateField}
              rows="3"
              placeholder="One image URL per line"
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Short Description</span>
            <textarea
              name="shortDescription"
              value={form.shortDescription}
              onChange={updateField}
              rows="3"
              required
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Full Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows="5"
              required
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Key Features</span>
            <textarea
              name="keyFeatures"
              value={form.keyFeatures}
              onChange={updateField}
              rows="4"
              placeholder="One feature per line"
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Key Benefits</span>
            <textarea
              name="keyBenefits"
              value={form.keyBenefits}
              onChange={updateField}
              rows="4"
              placeholder="One benefit per line"
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Included Treatments</span>
            <textarea
              name="includedTreatments"
              value={form.includedTreatments}
              onChange={updateField}
              rows="4"
              placeholder="Treatment name: Description"
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Suitable For</span>
            <textarea
              name="suitability"
              value={form.suitability}
              onChange={updateField}
              rows="3"
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Process</span>
            <textarea
              name="process"
              value={form.process}
              onChange={updateField}
              rows="3"
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Video URLs</span>
            <textarea
              name="videos"
              value={form.videos}
              onChange={updateField}
              rows="2"
              placeholder="One video embed URL per line"
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Primary Video URL</span>
            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={updateField}
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Booking Button Label</span>
            <input
              name="buttonLabel"
              value={form.buttonLabel}
              onChange={updateField}
              placeholder="Submit Booking"
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={updateField}
              className="h-5 w-5 rounded border-brand-gold text-brand-red"
            />
            <span className="text-sm font-bold text-brand-charcoal">Show on home page</span>
          </label>
        </div>

        {message ? <p className="mt-5 rounded-md bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">{message}</p> : null}
        {error ? <p className="mt-5 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-brand-red px-5 py-3 font-bold text-white transition hover:bg-brand-maroon disabled:opacity-70"
          >
            {editingId ? <Save size={18} /> : <Plus size={18} />}
            {saving ? "Saving..." : editingId ? "Update Treatment" : "Add Treatment"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-5 py-3 font-bold text-brand-charcoal transition hover:bg-slate-200"
            >
              <X size={18} /> Cancel Edit
            </button>
          ) : null}
        </div>
      </form>

      <section className="mt-8 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
        <h2 className="font-display text-2xl font-bold text-brand-charcoal">Current Treatments</h2>
        {loading ? <p className="mt-5 text-slate-600">Loading treatments...</p> : null}
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {treatments.map((treatment) => (
            <article key={treatment._id} className="grid gap-4 rounded-lg border border-brand-gold/25 p-4 sm:grid-cols-[140px_1fr]">
              <img
                src={mediaUrl(treatment.image)}
                alt={treatment.name}
                className="h-32 w-full rounded-md object-cover sm:w-36"
              />
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-brand-gold">{treatment.category}</p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-brand-maroon">{treatment.name}</h3>
                    <p className="mt-2 text-xs font-bold text-brand-charcoal">
                      {[treatment.duration, treatment.price].filter(Boolean).join(" | ")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(treatment)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-cream text-brand-maroon transition hover:bg-brand-gold"
                      aria-label={`Edit ${treatment.name}`}
                    >
                      <Edit3 size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTreatment(treatment._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-100 text-rose-700 transition hover:bg-rose-200"
                      aria-label={`Delete ${treatment.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{treatment.shortDescription}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
