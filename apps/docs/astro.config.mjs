import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: "https://almach.dev",
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // More specific aliases must come BEFORE the general package alias
        "@almach/ui/styles": path.resolve(__dirname, "../../packages/ui/src/styles/globals.css"),
        "@almach/utils": path.resolve(__dirname, "../../packages/utils/src/index.ts"),
        "@almach/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
        "@almach/forms": path.resolve(__dirname, "../../packages/forms/src/index.ts"),
        "@almach/query": path.resolve(__dirname, "../../packages/query/src/index.ts"),
      },
    },
  },
});
