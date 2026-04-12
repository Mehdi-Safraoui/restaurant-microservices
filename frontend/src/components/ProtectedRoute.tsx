import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirectMap: Record<UserRole, string> = { ADMIN: "/admin", CLIENT: "/client", LIVREUR: "/livreur" };
    return <Navigate to={redirectMap[user.role] || "/login"} replace />;
  }
  return <>{children}</>;
}
