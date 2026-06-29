import { X } from "lucide-react";
import { useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";

export default function CustomerLoginModal() {
  const { loginOpen, closeLogin } = useCustomerAuth();
  const [error, setError] = useState("");

  if (!loginOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
        aria-label="Close login"
        onClick={closeLogin}
      />
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/10">
        <button
          type="button"
          onClick={closeLogin}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-brand-charcoal transition hover:bg-slate-200"
          aria-label="Close login"
        >
          <X size={18} />
        </button>

        <p className="text-sm font-bold uppercase text-brand-red">Customer Login</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-brand-charcoal">Sign in with Google</h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Select the Google account on your phone or browser to create your Sethsuwa customer profile.
        </p>

        <div className="mt-6">
          <GoogleLoginButton onError={setError} />
        </div>

        {error ? <p className="mt-5 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
      </div>
    </div>
  );
}
