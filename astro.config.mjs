// @ts-check
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      experimentalReactChildren: true,
    }),
  ],
  env: {
    schema: {
      CONVEX_URL: envField.string({
        access: "public",
        context: "client",
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      global: "globalThis",
    },
    ssr: {
      external: ["node:async_hooks"],
      noExternal: ["react", "react-dom"],
    },
  },
  adapter: cloudflare(),
  output: "server",
});
