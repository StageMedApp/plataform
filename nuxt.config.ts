// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {},
  },
  nitro: {
    compressPublicAssets: {
      brotli: true,
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === "production" ? "https://api.stagemed.com.br/" : "http://127.0.0.1:4000/",
    },
  },
  css: [
    "~/styles/_variables.scss",
    "~/styles/fonts.scss",
    "~/styles/global.scss",
    "notivue/notification.css", // Only needed if using built-in notifications
    "notivue/animations.css", // Only needed if using built-in animations
  ],
  ssr: false,
  modules: [
    ["@pinia/nuxt", { autoImports: ["defineStore"] }],
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-headlessui",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@vee-validate/nuxt",
    "nuxt-api-party",
    "nuxt-icon",
    "nuxt-lodash",
    "notivue/nuxt",
  ],
  notivue: {
    position: "top-right",
    limit: 6,
    enqueue: true,
    avoidDuplicates: true,
  },
  lodash: {
    prefix: "_",
  },
  i18n: {
    baseUrl: "https://stagemed.com.br",
    locales: [
      { name: "Português (BR)", code: "pt", iso: "pt-BR", file: "pt-BR.json" },
      { name: "Espanhol", code: "es", iso: "es-ES", file: "es-ES.json" },
    ],
    lazy: true,
    langDir: "lang",
    strategy: "prefix_except_default",
    defaultLocale: "pt",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  piniaPersistedstate: {
    debug: true,
  },
  headlessui: {
    prefix: "Headless",
  },
  colorMode: {
    preference: "light",
    dataValue: "theme",
    classSuffix: "",
  },
  apiParty: {
    endpoints: {
      public: {
        url: process.env.NODE_ENV === "production" ? "https://api.stagemed.com.br/" : "http://127.0.0.1:4000/",
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "pt-BR" },
      viewport: "width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0",
      charset: "utf-8",
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, interactive-widget=overlays-content",
        },
        {
          hid: "description",
          name: "description",
          content: "A plataforma ideal para estudar, treinar e se preparara para revalidar sua residencia!",
        },

        { name: "og:type", content: "website" },
        { name: "og:url", content: "https://stagemed.com.br/" },
        { name: "og:title", content: "Stagemed - Treine e Revalide sua residência" },
        {
          name: "og:description",
          content: "A plataforma ideal para estudar, treinar e se preparara para revalidar sua residencia!",
        },
        { name: "og:image", content: "https://stagemed.com.br/images/banner.png" },
        { name: "og:image:type", content: "image/png" },
        { name: "og:site_name”", content: "Stagemed" },
        { name: "og:locale", content: "pt_BR" },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:url", content: "https://stagemed.com.br/" },
        { name: "twitter:title", content: "Stagemed - Treine e Revalide sua residência" },
        {
          name: "twitter:description",
          content: "A plataforma ideal para estudar, treinar e se preparara para revalidar sua residencia!",
        },
        { name: "twitter:image", content: "https://stagemed.com.br/images/banner.png" },

        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-title", content: "Stagemed" },
        { name: "application-name", content: "Stagemed" },

        { name: "apple-mobile-web-app-status-bar-style", content: "0fd5b0" },
        { name: "msapplication-TileColor", content: "#0fd5b0" },
        { name: "theme-color", content: "#0fd5b0" },
      ],
      script: [],
      link: [],
      style: [],
    },
  },
});
