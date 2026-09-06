import path from "node:path";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: "https://almach.kita.blue",
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // `@almach/forms` and `@almach/query` are aliased to their TypeScript
      // source below, so Vite treats them as app code rather than as
      // pre-bundled dependencies. Their own dependencies are therefore only
      // discovered when something imports them — and since /forms and /query
      // are lazy routes, that happens mid-session, on first navigation.
      // Vite then re-optimizes, invalidates the `?v=` hashes the browser is
      // already holding, and the in-flight chunk requests fail with
      // "504 Outdated Optimize Dep", taking the dynamic page import with them.
      // Declaring them up front makes the dep graph deterministic at startup.
      include: [
        "@tanstack/react-form",
        "@tanstack/react-query",
        "@internationalized/date",
        "zod",
      ],
    },
    resolve: {
      alias: {
        // More specific aliases must come BEFORE the general package alias
        "@almach/ui/styles": path.resolve(
          __dirname,
          "../../packages/ui/src/styles/globals.css",
        ),
        "@almach/utils": path.resolve(
          __dirname,
          "../../packages/utils/src/index.ts",
        ),
        "@almach/ui": path.resolve(__dirname, "../../packages/ui/src/index.ts"),
        "@almach/forms": path.resolve(
          __dirname,
          "../../packages/forms/src/index.ts",
        ),
        "@almach/query": path.resolve(
          __dirname,
          "../../packages/query/src/index.ts",
        ),
      },
    },
  },
});
