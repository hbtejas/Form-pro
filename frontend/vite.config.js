import path from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    build: {
        chunkSizeWarningLimit: 1500,
        outDir: "dist",
        emptyOutDir: true,
        target: "es2015",
        sourcemap: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "tailwind.config.js": path.resolve(__dirname, "tailwind.config.js"),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
        allowedHosts: true,
    },
});

