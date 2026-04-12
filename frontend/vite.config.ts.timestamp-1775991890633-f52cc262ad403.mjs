// vite.config.ts
import { defineConfig } from "file:///sessions/zen-quirky-hopper/mnt/restaurant-microservices/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/zen-quirky-hopper/mnt/restaurant-microservices/frontend/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///sessions/zen-quirky-hopper/mnt/restaurant-microservices/frontend/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/sessions/zen-quirky-hopper/mnt/restaurant-microservices/frontend";
var API_GATEWAY = "http://localhost:8077";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false
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
      "/api/commandes": { target: API_GATEWAY, changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/commandes/, "/commandes") },
      "/api/events": { target: API_GATEWAY, changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/events/, "/evenements") },
      "/api/blogs": { target: API_GATEWAY, changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/blogs/, "/blogs") }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvemVuLXF1aXJreS1ob3BwZXIvbW50L3Jlc3RhdXJhbnQtbWljcm9zZXJ2aWNlcy9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3Nlc3Npb25zL3plbi1xdWlya3ktaG9wcGVyL21udC9yZXN0YXVyYW50LW1pY3Jvc2VydmljZXMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3Nlc3Npb25zL3plbi1xdWlya3ktaG9wcGVyL21udC9yZXN0YXVyYW50LW1pY3Jvc2VydmljZXMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbi8vIEFQSSBHYXRld2F5IFVSTCAoQ29uZmlnIFNlcnZlciBvdmVycmlkZXMgcG9ydCB0byA4MDc3KVxyXG5jb25zdCBBUElfR0FURVdBWSA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDc3XCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIGhtcjoge1xyXG4gICAgICBvdmVybGF5OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICBwcm94eToge1xyXG4gICAgICAvLyBSb3V0ZXMgdGhhdCBhbHJlYWR5IG1hdGNoIHRoZSBnYXRld2F5IHBhdGhzXHJcbiAgICAgIFwiL2FwaS91c2Vyc1wiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICBcIi9hcGkvYXV0aFwiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICBcIi9hcGkvcmV2aWV3c1wiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICBcIi9hcGkvY29tcGxhaW50c1wiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICBcIi9hcGkvZGVsaXZlcmllc1wiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICAvLyBSb3V0ZXMgdGhhdCBuZWVkIHBhdGggcmV3cml0aW5nIChmcm9udGVuZCAvYXBpL3ggLT4gZ2F0ZXdheSAveClcclxuICAgICAgXCIvYXBpL3BsYXRzXCI6IHsgdGFyZ2V0OiBBUElfR0FURVdBWSwgY2hhbmdlT3JpZ2luOiB0cnVlLCByZXdyaXRlOiAocCkgPT4gcC5yZXBsYWNlKC9eXFwvYXBpXFwvcGxhdHMvLCBcIi9wbGF0c1wiKSB9LFxyXG4gICAgICBcIi9hcGkvY29tbWFuZGVzXCI6IHsgdGFyZ2V0OiBBUElfR0FURVdBWSwgY2hhbmdlT3JpZ2luOiB0cnVlLCByZXdyaXRlOiAocCkgPT4gcC5yZXBsYWNlKC9eXFwvYXBpXFwvY29tbWFuZGVzLywgXCIvY29tbWFuZGVzXCIpIH0sXHJcbiAgICAgIFwiL2FwaS9ldmVudHNcIjogeyB0YXJnZXQ6IEFQSV9HQVRFV0FZLCBjaGFuZ2VPcmlnaW46IHRydWUsIHJld3JpdGU6IChwKSA9PiBwLnJlcGxhY2UoL15cXC9hcGlcXC9ldmVudHMvLCBcIi9ldmVuZW1lbnRzXCIpIH0sXHJcbiAgICAgIFwiL2FwaS9ibG9nc1wiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSwgcmV3cml0ZTogKHApID0+IHAucmVwbGFjZSgvXlxcL2FwaVxcL2Jsb2dzLywgXCIvYmxvZ3NcIikgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIGNvbXBvbmVudFRhZ2dlcigpXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCIsIFwicmVhY3QvanN4LWRldi1ydW50aW1lXCIsIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCIsIFwiQHRhbnN0YWNrL3F1ZXJ5LWNvcmVcIl0sXHJcbiAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFYLFNBQVMsb0JBQW9CO0FBQ2xaLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTSxjQUFjO0FBR3BCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxJQUNBLE9BQU87QUFBQTtBQUFBLE1BRUwsY0FBYyxFQUFFLFFBQVEsYUFBYSxjQUFjLEtBQUs7QUFBQSxNQUN4RCxhQUFhLEVBQUUsUUFBUSxhQUFhLGNBQWMsS0FBSztBQUFBLE1BQ3ZELGdCQUFnQixFQUFFLFFBQVEsYUFBYSxjQUFjLEtBQUs7QUFBQSxNQUMxRCxtQkFBbUIsRUFBRSxRQUFRLGFBQWEsY0FBYyxLQUFLO0FBQUEsTUFDN0QsbUJBQW1CLEVBQUUsUUFBUSxhQUFhLGNBQWMsS0FBSztBQUFBO0FBQUEsTUFFN0QsY0FBYyxFQUFFLFFBQVEsYUFBYSxjQUFjLE1BQU0sU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLGlCQUFpQixRQUFRLEVBQUU7QUFBQSxNQUM5RyxrQkFBa0IsRUFBRSxRQUFRLGFBQWEsY0FBYyxNQUFNLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxxQkFBcUIsWUFBWSxFQUFFO0FBQUEsTUFDMUgsZUFBZSxFQUFFLFFBQVEsYUFBYSxjQUFjLE1BQU0sU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLGtCQUFrQixhQUFhLEVBQUU7QUFBQSxNQUNySCxjQUFjLEVBQUUsUUFBUSxhQUFhLGNBQWMsTUFBTSxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsaUJBQWlCLFFBQVEsRUFBRTtBQUFBLElBQ2hIO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLGlCQUFpQixnQkFBZ0IsQ0FBQyxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQzlFLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLElBQ0EsUUFBUSxDQUFDLFNBQVMsYUFBYSxxQkFBcUIseUJBQXlCLHlCQUF5QixzQkFBc0I7QUFBQSxFQUM5SDtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
