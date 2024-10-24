import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

/**
 * Vite Config
 */
export default defineConfig(({ command, mode }) => {
  return {
    base: "./",
    publicDir: "static",
    build: {
      minify: true,
      sourcemap: true,
    },
    plugins: [
      legacy({
        targets: ["chrome >= 47"],
        modernPolyfills: ["es/global-this"],
      }),
    ],
  };
});
