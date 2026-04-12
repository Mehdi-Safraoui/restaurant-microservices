import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import { UserRole } from "./types";

// Pages
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminMenuPage from "./pages/admin/AdminMenuPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminEventsPage from "./pages/admin/AdminEventsPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";
// Client
import ClientHome from "./pages/client/ClientHome";
import ClientMenuPage from "./pages/client/ClientMenuPage";
import CartPage from "./pages/client/CartPage";
import ClientOrders from "./pages/client/ClientOrders";
import ClientEvents from "./pages/client/ClientEvents";
// Delivery
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryDetails from "./pages/delivery/DeliveryDetails";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";

const queryClient = new QueryClient();

function AuthInit({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    // If authenticated but no user in store (shouldn't happen with localStorage persistence),
    // log out to force re-login
    if (isAuthenticated && !user) {
      logout();
    }
  }, [isAuthenticated, user, logout]);

  return <>{children}</>;
}

function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const redirectMap: Record<UserRole, string> = { ADMIN: "/admin", CLIENT: "/client", LIVREUR: "/livreur" };
  return <Navigate to={redirectMap[user?.role || "CLIENT"]} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthInit>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RootRedirect />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/menu" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminMenuPage /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminOrdersPage /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminReviewsPage /></ProtectedRoute>} />
            <Route path="/admin/events" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminEventsPage /></ProtectedRoute>} />

            {/* Client Routes */}
            <Route path="/client" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientHome /></ProtectedRoute>} />
            <Route path="/client/menu" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientMenuPage /></ProtectedRoute>} />
            <Route path="/client/cart" element={<ProtectedRoute allowedRoles={["CLIENT"]}><CartPage /></ProtectedRoute>} />
            <Route path="/client/orders" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientOrders /></ProtectedRoute>} />
            <Route path="/client/events" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientEvents /></ProtectedRoute>} />

            {/* Delivery Routes */}
            <Route path="/livreur" element={<ProtectedRoute allowedRoles={["LIVREUR"]}><DeliveryDashboard /></ProtectedRoute>} />
            <Route path="/livreur/deliveries/:id" element={<ProtectedRoute allowedRoles={["LIVREUR"]}><DeliveryDetails /></ProtectedRoute>} />
            <Route path="/livreur/deliveries" element={<ProtectedRoute allowedRoles={["LIVREUR"]}><DeliveryDashboard /></ProtectedRoute>} />
            <Route path="/livreur/history" element={<ProtectedRoute allowedRoles={["LIVREUR"]}><DeliveryHistory /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthInit>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
