import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const logoUrl = "https://pranajewabooking-blip.github.io/pranajeewa/slider-removebg-preview.png";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateField = (event) => {
    setCredentials((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(credentials);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-screen bg-brand-cream lg:grid-cols-[1fr_0.9fr]">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://www.pranajeewa.lk/assets/images/whatsapp-image-2023-12-27-at-16.20.31-fd8f2666.jpg"
          alt="Sethsuwa award ceremony"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-charcoal/70" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <p className="font-display text-5xl font-bold">Traditional care, carefully managed.</p>
          <p className="mt-5 max-w-xl leading-8 text-white/76">
            Secure access for Sethsuwa treatment, booking, and news banner administration.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <form onSubmit={submit} className="luxury-border w-full max-w-md rounded-lg bg-white p-8 shadow-soft">
          <div className="text-center">
            <img src={logoUrl} alt="Sethsuwa logo" className="mx-auto h-20 w-20 object-contain" />
            <p className="brand-title mt-3 font-display text-4xl font-bold">SETHSUWA</p>
            <h1 className="mt-2 text-xl font-bold text-brand-charcoal">Admin Login</h1>
          </div>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-charcoal">
                <Mail size={17} /> Email
              </span>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={updateField}
                required
                className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-charcoal">
                <Lock size={17} /> Password
              </span>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={updateField}
                required
                className="w-full rounded-md border border-brand-gold/35 px-4 py-3 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
              />
            </label>
          </div>

          {error ? <p className="mt-5 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-md bg-brand-red px-6 py-3 font-bold text-white transition hover:bg-brand-maroon disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}
