import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

const CustomerAuthContext = createContext(null);
const TOKEN_KEY = "sethsuwa_customer_token";

export const requiredProfileFields = ["name", "mobileNumber", "whatsappNumber", "address", "gender"];

export const isCustomerProfileComplete = (customer) =>
  Boolean(customer && requiredProfileFields.every((field) => String(customer[field] || "").trim()));

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  const token = window.localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    const loadCustomer = async () => {
      if (!window.localStorage.getItem(TOKEN_KEY)) {
        setLoading(false);
        return;
      }

      try {
        const response = await http.get("/customers/me");
        setCustomer(response.data.customer);
      } catch {
        window.localStorage.removeItem(TOKEN_KEY);
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, []);

  const loginWithGoogleCredential = useCallback(async (credential) => {
    const response = await http.post("/customer-auth/google", { credential });
    window.localStorage.setItem(TOKEN_KEY, response.data.token);
    setCustomer(response.data.customer);
    setLoginOpen(false);
    return response.data.customer;
  }, []);

  const updateProfile = useCallback(async (profile) => {
    const response = await http.put("/customers/me", profile);
    setCustomer(response.data.customer);
    return response.data.customer;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    setCustomer(null);
    setLoginOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      customer,
      loading,
      token,
      loginOpen,
      profileComplete: isCustomerProfileComplete(customer),
      openLogin: () => setLoginOpen(true),
      closeLogin: () => setLoginOpen(false),
      loginWithGoogleCredential,
      updateProfile,
      logout
    }),
    [customer, loading, loginOpen, token, loginWithGoogleCredential, updateProfile, logout]
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);

  if (!context) {
    throw new Error("useCustomerAuth must be used inside CustomerAuthProvider");
  }

  return context;
};
