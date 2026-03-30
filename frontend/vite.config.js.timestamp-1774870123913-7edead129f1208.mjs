// vite.config.js
import path from "node:path";
import vue from "file:///D:/Formpro/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import frappeui from "file:///D:/Formpro/frontend/node_modules/frappe-ui/vite/index.js";
import { defineConfig } from "file:///D:/Formpro/frontend/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "D:\\Formpro\\frontend";
var vite_config_default = defineConfig({
  plugins: [
    frappeui({
      frappeProxy: true,
      jinjaBootData: true,
      lucideIcons: true,
      buildConfig: {
        indexHtmlPath: "../forms_pro/www/frontend.html",
        emptyOutDir: true,
        sourcemap: true
      }
    }),
    vue()
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: "../forms_pro/public/frontend",
    emptyOutDir: true,
    target: "es2015",
    sourcemap: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src"),
      "tailwind.config.js": path.resolve(__vite_injected_original_dirname, "tailwind.config.js")
    }
  },
  optimizeDeps: {
    include: ["frappe-ui > feather-icons", "showdown", "highlight.js/lib/core", "interactjs"]
  },
  server: {
    allowedHosts: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxGb3JtcHJvXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxGb3JtcHJvXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Gb3JtcHJvL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuaW1wb3J0IGZyYXBwZXVpIGZyb20gXCJmcmFwcGUtdWkvdml0ZVwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBmcmFwcGV1aSh7XHJcbiAgICAgICAgICAgIGZyYXBwZVByb3h5OiB0cnVlLFxyXG4gICAgICAgICAgICBqaW5qYUJvb3REYXRhOiB0cnVlLFxyXG4gICAgICAgICAgICBsdWNpZGVJY29uczogdHJ1ZSxcclxuICAgICAgICAgICAgYnVpbGRDb25maWc6IHtcclxuICAgICAgICAgICAgICAgIGluZGV4SHRtbFBhdGg6IFwiLi4vZm9ybXNfcHJvL3d3dy9mcm9udGVuZC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBlbXB0eU91dERpcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KSxcclxuICAgICAgICB2dWUoKSxcclxuICAgIF0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTUwMCxcclxuICAgICAgICBvdXREaXI6IFwiLi4vZm9ybXNfcHJvL3B1YmxpYy9mcm9udGVuZFwiLFxyXG4gICAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgICAgIHRhcmdldDogXCJlczIwMTVcIixcclxuICAgICAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSxcclxuICAgICAgICAgICAgXCJ0YWlsd2luZC5jb25maWcuanNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJ0YWlsd2luZC5jb25maWcuanNcIiksXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgICBpbmNsdWRlOiBbXCJmcmFwcGUtdWkgPiBmZWF0aGVyLWljb25zXCIsIFwic2hvd2Rvd25cIiwgXCJoaWdobGlnaHQuanMvbGliL2NvcmVcIiwgXCJpbnRlcmFjdGpzXCJdLFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAgIGFsbG93ZWRIb3N0czogdHJ1ZSxcclxuICAgIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlQLE9BQU8sVUFBVTtBQUNsUSxPQUFPLFNBQVM7QUFDaEIsT0FBTyxjQUFjO0FBQ3JCLFNBQVMsb0JBQW9CO0FBSDdCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNMLGFBQWE7QUFBQSxNQUNiLGVBQWU7QUFBQSxNQUNmLGFBQWE7QUFBQSxNQUNiLGFBQWE7QUFBQSxRQUNULGVBQWU7QUFBQSxRQUNmLGFBQWE7QUFBQSxRQUNiLFdBQVc7QUFBQSxNQUNmO0FBQUEsSUFDSixDQUFDO0FBQUEsSUFDRCxJQUFJO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsdUJBQXVCO0FBQUEsSUFDdkIsUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLEVBQ2Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxNQUNsQyxzQkFBc0IsS0FBSyxRQUFRLGtDQUFXLG9CQUFvQjtBQUFBLElBQ3RFO0FBQUEsRUFDSjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1YsU0FBUyxDQUFDLDZCQUE2QixZQUFZLHlCQUF5QixZQUFZO0FBQUEsRUFDNUY7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLGNBQWM7QUFBQSxFQUNsQjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
