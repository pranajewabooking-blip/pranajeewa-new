import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { booting, isAuthenticated } = useAuth();

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-gold border-t-brand-red" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
