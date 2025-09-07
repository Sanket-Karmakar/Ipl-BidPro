import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/UserContext";

export default function ProtectedRoute() {
  const { user, ready } = useAuth();

  // Wait until we hydrate from localStorage, otherwise we might flicker/redirect incorrectly
  if (!ready) return null; // or a spinner

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

