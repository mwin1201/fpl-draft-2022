import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This project (originally Create React App) keeps JSX in `.js` files rather
// than `.jsx`. Vite/esbuild treats `.js` as plain JS by default, so we tell
// esbuild to load `src` `.js` files with the JSX loader (both for the dev
// dependency pre-bundle and the production build).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // Output to `build` (instead of Vite's default `dist`) so the Express
    // server's static path in backend/server.js keeps working unchanged.
    outDir: "build",
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
