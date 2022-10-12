import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  server: {
    port: process.env.NUXT_PORT,
    host: process.env.NUXT_HOST
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Sherlock',
    title: 'Sherlock',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios',
    '~/plugins/services',
    '~/plugins/filters',
    '~/plugins/init'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    { path: '~/components', prefix: '', pathPrefix: false }
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/dotenv'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: process.env.ENVIROMENT === 'development',
    credentials: true,
    baseURL: process.env.API_ENDPOINT
  },

  proxy: {
    '/api': {
      target: process.env.API_ENDPOINT,
      pathRewrite: {
        '^/api': '/api'
      }
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      options: {
        customProperties: true
      },
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#0370B8',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.orange.darken2,
          error: colors.deepOrange.accent4,
          success: '#086E08',
          background: {
            lighten2: '#F9FAFD',
            base: '#E0E2F5'
          },
          neutral: {
            lighten2: '#989DB8',
            base: '#585E76',
            darken1: '#DFE2F5',
            darken2: '#242736'
          },
          vulnerability: {
            base: '#9D3F7A'
          },
          analizedEvents: {
            base: '#9D3F7A',
            lighten1: '#F4E6F4'
          },
          analizedLines: {
            base: '#B2453E',
            lighten1: '#FBE6E5'
          },
          userDetectedEvents: '#50A8FF',
          sherlockDetectedEvents: '#0470B8',
          avatar1: '#9D3F7A',
          avatar1Bg: '#F4E6F4',
          avatar6: '#77C07B',
          note1Bg: '#F6F1EA',
          note2: '#8E6733',
          lightGray: '#E0E0E0'
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
