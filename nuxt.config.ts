// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  modules: ["shadcn-nuxt"],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["nkwzotero.uk"],
    },
  },

  css: ["~/assets/css/tailwind.css"],

  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
      ],
    },
  },
});
