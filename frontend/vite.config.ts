import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// API Gateway URL (Config Server overrides port to 8077)
const API_GATEWAY = "http://localhost:8077";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false,
    },
    proxy: {
      // Routes that already match the gateway paths
      "/api/users": { target: API_GATEWAY, changeOrigin: true },
      "/api/auth": { target: API_GATEWAY, changeOrigin: true },
      "/api/reviews": { target: API_GATEWAY, changeOrigin: true },
      "/api/complaints": { target: API_GATEWAY, changeOrigin: true },
      "/api/deliveries": { target: API_GATEWAY, changeOrigin: true },
      // Routes that need path rewriting (frontend /api/x -> gateway /x)
      "/api/plats": { target: API_GATEWAY, changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/plats/, "/plats") },
      "/api/ingredients": { target: API_GATEWAY, changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/ingredients/, "/ingredients") },
      "/api/commandes": { target: API_GATEWAY, changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/commandes/, "/commandes") },
      "/api/events": { target: API_GATEWAY, changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/events/, "/evenements") },
      "/api/blogs": { target: API_GATEWAY, changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/blogs/, "/blogs") },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
