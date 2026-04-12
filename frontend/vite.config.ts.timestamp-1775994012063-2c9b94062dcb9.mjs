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
      "/api/ingredients": { target: API_GATEWAY, changeOrigin: true, rewrite: (p) => p.replace(/^\/api\/ingredients/, "/ingredients") },
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvemVuLXF1aXJreS1ob3BwZXIvbW50L3Jlc3RhdXJhbnQtbWljcm9zZXJ2aWNlcy9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3Nlc3Npb25zL3plbi1xdWlya3ktaG9wcGVyL21udC9yZXN0YXVyYW50LW1pY3Jvc2VydmljZXMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3Nlc3Npb25zL3plbi1xdWlya3ktaG9wcGVyL21udC9yZXN0YXVyYW50LW1pY3Jvc2VydmljZXMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbi8vIEFQSSBHYXRld2F5IFVSTCAoQ29uZmlnIFNlcnZlciBvdmVycmlkZXMgcG9ydCB0byA4MDc3KVxyXG5jb25zdCBBUElfR0FURVdBWSA9IFwiaHR0cDovL2xvY2FsaG9zdDo4MDc3XCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIGhtcjoge1xyXG4gICAgICBvdmVybGF5OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICBwcm94eToge1xyXG4gICAgICAvLyBSb3V0ZXMgdGhhdCBhbHJlYWR5IG1hdGNoIHRoZSBnYXRld2F5IHBhdGhzXHJcbiAgICAgIFwiL2FwaS91c2Vyc1wiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICBcIi9hcGkvYXV0aFwiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICBcIi9hcGkvcmV2aWV3c1wiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICBcIi9hcGkvY29tcGxhaW50c1wiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICBcIi9hcGkvZGVsaXZlcmllc1wiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSB9LFxyXG4gICAgICAvLyBSb3V0ZXMgdGhhdCBuZWVkIHBhdGggcmV3cml0aW5nIChmcm9udGVuZCAvYXBpL3ggLT4gZ2F0ZXdheSAveClcclxuICAgICAgXCIvYXBpL3BsYXRzXCI6IHsgdGFyZ2V0OiBBUElfR0FURVdBWSwgY2hhbmdlT3JpZ2luOiB0cnVlLCByZXdyaXRlOiAocCkgPT4gcC5yZXBsYWNlKC9eXFwvYXBpXFwvcGxhdHMvLCBcIi9wbGF0c1wiKSB9LFxyXG4gICAgICBcIi9hcGkvaW5ncmVkaWVudHNcIjogeyB0YXJnZXQ6IEFQSV9HQVRFV0FZLCBjaGFuZ2VPcmlnaW46IHRydWUsIHJld3JpdGU6IChwKSA9PiBwLnJlcGxhY2UoL15cXC9hcGlcXC9pbmdyZWRpZW50cy8sIFwiL2luZ3JlZGllbnRzXCIpIH0sXHJcbiAgICAgIFwiL2FwaS9jb21tYW5kZXNcIjogeyB0YXJnZXQ6IEFQSV9HQVRFV0FZLCBjaGFuZ2VPcmlnaW46IHRydWUsIHJld3JpdGU6IChwKSA9PiBwLnJlcGxhY2UoL15cXC9hcGlcXC9jb21tYW5kZXMvLCBcIi9jb21tYW5kZXNcIikgfSxcclxuICAgICAgXCIvYXBpL2V2ZW50c1wiOiB7IHRhcmdldDogQVBJX0dBVEVXQVksIGNoYW5nZU9yaWdpbjogdHJ1ZSwgcmV3cml0ZTogKHApID0+IHAucmVwbGFjZSgvXlxcL2FwaVxcL2V2ZW50cy8sIFwiL2V2ZW5lbWVudHNcIikgfSxcclxuICAgICAgXCIvYXBpL2Jsb2dzXCI6IHsgdGFyZ2V0OiBBUElfR0FURVdBWSwgY2hhbmdlT3JpZ2luOiB0cnVlLCByZXdyaXRlOiAocCkgPT4gcC5yZXBsYWNlKC9eXFwvYXBpXFwvYmxvZ3MvLCBcIi9ibG9nc1wiKSB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCldLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgICBkZWR1cGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCIsIFwicmVhY3QvanN4LXJ1bnRpbWVcIiwgXCJyZWFjdC9qc3gtZGV2LXJ1bnRpbWVcIiwgXCJAdGFuc3RhY2svcmVhY3QtcXVlcnlcIiwgXCJAdGFuc3RhY2svcXVlcnktY29yZVwiXSxcclxuICB9LFxyXG59KSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVgsU0FBUyxvQkFBb0I7QUFDbFosT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQU16QyxJQUFNLGNBQWM7QUFHcEIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0EsT0FBTztBQUFBO0FBQUEsTUFFTCxjQUFjLEVBQUUsUUFBUSxhQUFhLGNBQWMsS0FBSztBQUFBLE1BQ3hELGFBQWEsRUFBRSxRQUFRLGFBQWEsY0FBYyxLQUFLO0FBQUEsTUFDdkQsZ0JBQWdCLEVBQUUsUUFBUSxhQUFhLGNBQWMsS0FBSztBQUFBLE1BQzFELG1CQUFtQixFQUFFLFFBQVEsYUFBYSxjQUFjLEtBQUs7QUFBQSxNQUM3RCxtQkFBbUIsRUFBRSxRQUFRLGFBQWEsY0FBYyxLQUFLO0FBQUE7QUFBQSxNQUU3RCxjQUFjLEVBQUUsUUFBUSxhQUFhLGNBQWMsTUFBTSxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsaUJBQWlCLFFBQVEsRUFBRTtBQUFBLE1BQzlHLG9CQUFvQixFQUFFLFFBQVEsYUFBYSxjQUFjLE1BQU0sU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLHVCQUF1QixjQUFjLEVBQUU7QUFBQSxNQUNoSSxrQkFBa0IsRUFBRSxRQUFRLGFBQWEsY0FBYyxNQUFNLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxxQkFBcUIsWUFBWSxFQUFFO0FBQUEsTUFDMUgsZUFBZSxFQUFFLFFBQVEsYUFBYSxjQUFjLE1BQU0sU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLGtCQUFrQixhQUFhLEVBQUU7QUFBQSxNQUNySCxjQUFjLEVBQUUsUUFBUSxhQUFhLGNBQWMsTUFBTSxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsaUJBQWlCLFFBQVEsRUFBRTtBQUFBLElBQ2hIO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLGlCQUFpQixnQkFBZ0IsQ0FBQyxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQzlFLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLElBQ0EsUUFBUSxDQUFDLFNBQVMsYUFBYSxxQkFBcUIseUJBQXlCLHlCQUF5QixzQkFBc0I7QUFBQSxFQUM5SDtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
