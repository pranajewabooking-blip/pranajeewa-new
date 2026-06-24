import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { http, mediaUrl } from "../api/http";

const emptyForm = {
  title: "",
  image: "",
  imageFile: null,
  altText: "",
  linkUrl: "",
  isActive: true,
  sortOrder: 0
};

export default function NewsBannersManage() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadBanners = async () => {
    setLoading(true);
    try {
      const response = await http.get("/news-banners/admin/all");
      setBanners(response.data.banners || []);
    } catch {
      setError("Unable to load news banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
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
    setMessage("");
    setError("");
  };

  const startEdit = (banner) => {
    setEditingId(banner._id);
    setForm({
      title: banner.title || "",
      image: banner.image || "",
      imageFile: null,
      altText: banner.altText || "",
      linkUrl: banner.linkUrl || "",
      isActive: Boolean(banner.isActive),
      sortOrder: banner.sortOrder || 0
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildFormData = () => {
    const data = new FormData();
    data.append("title", form.title);
    data.append("altText", form.altText);
    data.append("linkUrl", form.linkUrl);
    data.append("isActive", String(form.isActive));
    data.append("sortOrder", String(form.sortOrder));

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
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await http.put(`/news-banners/${editingId}`, buildFormData());
        setMessage("News banner updated.");
      } else {
        await http.post("/news-banners", buildFormData());
        setMessage("News banner added.");
      }

      resetForm();
      await loadBanners();
    } catch (requestError) {
      const validationMessage = requestError.response?.data?.errors?.[0]?.message;
      setError(validationMessage || requestError.response?.data?.message || "Unable to save news banner.");
    } finally {
      setSaving(false);
    }
  };

  const removeBanner = async (id) => {
    const confirmed = window.confirm("Delete this news banner?");
    if (!confirmed) return;

    try {
      await http.delete(`/news-banners/${id}`);
      setBanners((current) => current.filter((banner) => banner._id !== id));
    } catch {
      setError("Unable to delete news banner.");
    }
  };

  return (
    <div>
      <div>
        <p className="text-sm font-bold uppercase text-brand-red">News Banner Management</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-brand-charcoal">
          {editingId ? "Edit News Banner" : "Add News Banner"}
        </h1>
      </div>

      <form onSubmit={submit} className="luxury-border mt-8 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Banner Title</span>
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Sort Order</span>
            <input
              type="number"
              min="0"
              name="sortOrder"
              value={form.sortOrder}
              onChange={updateField}
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
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Alt Text</span>
            <input
              name="altText"
              value={form.altText}
              onChange={updateField}
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Link URL</span>
            <input
              name="linkUrl"
              value={form.linkUrl}
              onChange={updateField}
              className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={updateField}
              className="h-5 w-5 rounded border-brand-gold text-brand-red"
            />
            <span className="text-sm font-bold text-brand-charcoal">Active on home page</span>
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
            {saving ? "Saving..." : editingId ? "Update Banner" : "Add Banner"}
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
        <h2 className="font-display text-2xl font-bold text-brand-charcoal">Current News Banners</h2>
        {loading ? <p className="mt-5 text-slate-600">Loading banners...</p> : null}
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {banners.map((banner) => (
            <article key={banner._id} className="overflow-hidden rounded-lg border border-brand-gold/25">
              <img src={mediaUrl(banner.image)} alt={banner.altText || banner.title || "News banner"} className="aspect-[16/7] w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-brand-gold">
                      {banner.isActive ? "Active" : "Hidden"} | Order {banner.sortOrder}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-brand-maroon">{banner.title || "Untitled Banner"}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(banner)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-cream text-brand-maroon transition hover:bg-brand-gold"
                      aria-label={`Edit ${banner.title || "banner"}`}
                    >
                      <Edit3 size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBanner(banner._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-rose-100 text-rose-700 transition hover:bg-rose-200"
                      aria-label={`Delete ${banner.title || "banner"}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
