import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { toast } from "sonner";

const API_URLS = {
  users: import.meta.env.VITE_USERS_API_URL || "/api/users",
  auth: import.meta.env.VITE_USERS_API_URL?.replace("/users", "/auth") || "/api/auth",
  plats: import.meta.env.VITE_PLATS_API_URL || "/api/plats",
  ingredients: "/api/ingredients",
  commandes: import.meta.env.VITE_COMMANDES_API_URL || "/api/commandes",
  reviews: import.meta.env.VITE_REVIEWS_API_URL || "/api/reviews",
  complaints: import.meta.env.VITE_COMPLAINTS_API_URL || "/api/complaints",
  deliveries: import.meta.env.VITE_DELIVERIES_API_URL || "/api/deliveries",
  events: import.meta.env.VITE_EVENTS_API_URL || "/api/events",
  blogs: import.meta.env.VITE_BLOGS_API_URL || "/api/blogs",
};

function clearStoredAuth() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}

function createApiInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({ baseURL, timeout: 15000, headers: { "Content-Type": "application/json" } });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (config.url === "/") {
      config.url = "";
    } else if (config.url && config.url.length > 1 && config.url.endsWith("/")) {
      config.url = config.url.slice(0, -1);
    }

    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
      const isAuthRequest = error.config?.baseURL === API_URLS.auth;
      const isAuthPage = typeof window !== "undefined" && window.location.pathname === "/login";

      if (error.response?.status === 401) {
        clearStoredAuth();
        if (!isAuthRequest && !isAuthPage) {
          window.location.href = "/login";
        }
      } else if (error.response?.status === 403) {
        toast.error("Access denied");
      } else if (error.response?.status && error.response.status >= 500) {
        toast.error("Server error. Please try again.");
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const usersApi = createApiInstance(API_URLS.users);
export const authApi = createApiInstance(API_URLS.auth);
export const ingredientsApi = createApiInstance(API_URLS.ingredients);
export const platsApi = createApiInstance(API_URLS.plats);
export const commandesApi = createApiInstance(API_URLS.commandes);
export const reviewsApi = createApiInstance(API_URLS.reviews);
export const complaintsApi = createApiInstance(API_URLS.complaints);
export const deliveriesApi = createApiInstance(API_URLS.deliveries);
export const eventsApi = createApiInstance(API_URLS.events);
export const blogsApi = createApiInstance(API_URLS.blogs);

export async function findUserByEmail(email: string) {
  const { data } = await usersApi.get("/");
  const users = Array.isArray(data) ? data : [];
  const found = users.find((user: { email?: string }) => user.email?.toLowerCase() === email.toLowerCase());
  if (!found) {
    return null;
  }
  const { password: _password, ...safeUser } = found as { password?: string };
  return safeUser;
}
