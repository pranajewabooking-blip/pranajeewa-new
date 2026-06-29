import { useEffect, useRef, useState } from "react";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existing = document.querySelector("script[data-google-identity]");
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

export default function GoogleLoginButton({ onError }) {
  const buttonRef = useRef(null);
  const renderedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const { loginWithGoogleCredential } = useCustomerAuth();

  useEffect(() => {
    if (!googleClientId) return;

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || renderedRef.current || !buttonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            try {
              await loginWithGoogleCredential(response.credential);
            } catch (requestError) {
              onError?.(requestError.response?.data?.message || "Unable to complete Google login.");
            }
          }
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          width: Math.min(buttonRef.current.offsetWidth || 320, 360),
          text: "signin_with"
        });

        renderedRef.current = true;
        setReady(true);
      })
      .catch(() => onError?.("Unable to load Google login right now."));

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogleCredential, onError]);

  if (!googleClientId) {
    return (
      <p className="rounded-md bg-amber-100 px-4 py-3 text-sm font-bold text-amber-900">
        Google login is not configured yet.
      </p>
    );
  }

  return (
    <div>
      <div ref={buttonRef} className="min-h-11 w-full" />
      {!ready ? <p className="mt-3 text-sm font-semibold text-slate-500">Loading Google login...</p> : null}
    </div>
  );
}
