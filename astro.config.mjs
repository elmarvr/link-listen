import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "nl"],
    routing: "manual",
  },
  redirects: {
    "/resume": "/en/resume",
  },
});
