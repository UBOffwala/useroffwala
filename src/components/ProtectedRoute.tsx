import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { isLoggedIn } = useUser();
  const location = useLocation();

  // If authentication is required but user is not logged in
  if (requireAuth && !isLoggedIn) {
    // Save the attempted location for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is logged in but trying to access auth pages, redirect to home
  if (!requireAuth && isLoggedIn && location.pathname.startsWith("/auth/")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
