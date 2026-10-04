// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["shadcn-nuxt"],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["test.nkwzotero.uk"],
    },
  },
  css: ["~/assets/css/tailwind.css"],
});
