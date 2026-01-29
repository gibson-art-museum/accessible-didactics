// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content'
  ],

  // Build configuration
  build: {
    transpile: []
  },

  // TypeScript configuration - disable strict mode for build
  typescript: {
    typeCheck: false,
    strict: false
  },

  // App configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Accessible NFC Tags',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Accessible content for NFC-tagged exhibits and materials' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // CSS configuration
  css: [
    '~/assets/css/main.css'
  ],

  // Content module configuration
  content: {
    documentDriven: false,
    markdown: {
      anchorLinks: false
    }
  },

  // Nitro configuration for static generation
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/tag/001', '/tag/002']
    }
  },

  // Static site generation
  ssr: true,
  target: 'static',

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: 'https://yourusername.github.io/accessible-didactics'
    }
  },

  // Vite configuration 
  vite: {
    // No preprocessor configuration needed with Tailwind CSS
  }
})
