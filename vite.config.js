import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
<<<<<<< HEAD
    port: 8080,
    proxy: {
      "/api": "http://127.0.0.1:5000", // 🔑 This is the key line for forwarding API calls
    },
=======
    port: 8080,
    proxy: {
      "/api": "http://127.0.0.1:5000", // 🔑 This is the key line for forwarding API calls
    },
>>>>>>> 133dc760c975bd992d26361a3f3abead18cba716
    hmr: { overlay: false },
    fs: {
      allow: ["./client", "./shared","./"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./client"),
      "@shared": path.resolve(process.cwd(), "./shared"),
    },
  },
}));
