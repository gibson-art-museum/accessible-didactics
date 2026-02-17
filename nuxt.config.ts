// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', '@vite-pwa/nuxt'],

  // Build configuration
  build: {
    transpile: [],
  },

  // TypeScript configuration - disable strict mode for build
  typescript: {
    typeCheck: false,
    strict: false,
  },

  // App configuration
  app: {
    baseURL: '/accessible-didactics/',
    cdnURL: '/accessible-didactics/',
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Gibson Accessible NFC Tags',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Accessible content for NFC-tagged exhibits and materials',
        },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/accessible-didactics/favicon.ico',
        },
      ],
    },
  },

  // CSS configuration
  css: ['~/assets/css/main.css'],

  // Content module configuration
  content: {
    documentDriven: false,
    markdown: {
      anchorLinks: false,
    },
  },

  // Nitro configuration for static generation
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  // Static site generation for GitHub Pages
  ssr: true,

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: 'https://gibson-art-museum.github.io/accessible-didactics',
    },
  },

  // PWA configuration for offline access
  // @ts-ignore - PWA module types
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Gibson Accessible NFC Tags',
      short_name: 'NFC Tags',
      description: 'Accessible content for NFC-tagged exhibits and materials',
      theme_color: '#00606B',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/accessible-didactics/',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600, // Check for updates every hour
    },
    devOptions: {
      enabled: false,
      type: 'module',
    },
  },
})
