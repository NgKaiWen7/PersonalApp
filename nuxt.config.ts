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
    optimizeDeps: {
      include: [
        "@lucide/vue",
        "@vueuse/core",
        "class-variance-authority",
        "clsx",
        "cn",
        "dompurify",
        "marked",
        "reka-ui",
        "tailwind-merge",
      ],
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
