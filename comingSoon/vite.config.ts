import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Imports from 'unplugin-auto-import/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import I18n from '@intlify/unplugin-vue-i18n/vite'
import PurgeCss from 'rollup-plugin-purgecss'
import Unhead from '@unhead/addons/vite'
import { unheadVueComposablesImports } from '@unhead/vue'

/**
 * This is the main configuration file for vitejs
 *
 * @see https://vitejs.dev/config
 */
export default defineConfig({
  // Project root directory (where index.html is located).
  root: process.cwd(),
  // Base public path when served in development or production.
  // You also need to add this base like `history: createWebHistory('my-subdirectory')`
  // in ./src/router.ts
  // base: '/my-subdirectory/',
  base: '/',
  // Directory to serve as plain static assets.
  publicDir: 'public',
  // Adjust console output verbosity.
  logLevel: 'info',
  // development server configuration
  server: {
    // Vite 4 now defaults to 5173, but you can override it with the port option.
    port: 4000,
  },
  /**
   * By default, Vite will crawl your index.html to detect dependencies that
   * need to be pre-bundled. If build.rollupOptions.input is specified,
   * Vite will crawl those entry points instead.
   *
   * @see https://vitejs.dev/config/#optimizedeps-entries
   */
  optimizeDeps: {
    include: [
      '@vee-validate/zod',
      '@vueuse/core',
      '@vueuse/integrations',
      'axios',
      'defu',
      'nprogress',
      'notyf',
      'vee-validate',
      'vue',
      'vue-scrollto',
      'vue-i18n',
      'vue-router',
      'unplugin-vue-router/runtime',
      'vue-accessible-color-picker',
      'zod',
    ],
  },
  // Will be passed to @rollup/plugin-alias as its entries option.
  resolve: {
    alias: [
      {
        find: '/@src/',
        replacement: `/src/`,
      },
      {
        find: '/@userStores/',
        replacement: `/src/stores/user/`,
      },
      {
        find: '/@appStores/',
        replacement: `/src/stores/app/`,
      },
    ],
  },

  build: {
    target: 'esnext',
    minify: 'terser',
  },
  plugins: [
    /**
     * plugin-vue plugin inject vue library and allow sfc files to work (*.vue)
     *
     * @see https://github.com/vitejs/vite/tree/main/packages/plugin-vue
     */
    Vue({
      include: [/\.vue$/],
      template: {
        compilerOptions: {
          isCustomElement: tag => ['iconify-icon'].includes(tag),
        },
      },
    }),

    /**
     * vite-plugin-vue-i18n plugin does i18n resources pre-compilation / optimizations
     *
     * @see https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
     */
    I18n({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
      fullInstall: false,
      compositionOnly: true,
    }),

    /**
     * Unhead provides a Vite plugin to optimise your builds, by removing composables that aren't needed and simplifying your code.
     *
     * @see https://unhead.harlanzw.com/guide/getting-started/vite-plugin
     */
    Unhead(),

    /**
     * unplugin-auto-import allow to automaticaly import modules/components
     *
     * @see https://github.com/antfu/unplugin-auto-import
     */
    Imports({
      dts: './types/imports.d.ts',
      imports: [
        'vue',
        '@vueuse/core',
        'vue-i18n',
        unheadVueComposablesImports,
        { 'vue-router': ['RouterView', 'RouterLink', 'useRouter', 'useRoute'] },
      ],
      dirs: ['src/composables', 'src/utils']
    }),

    /**
     * unplugin-vue-components plugin is responsible of autoloading components
     * documentation and md file are loaded for elements and components sections
     *
     * @see https://github.com/antfu/unplugin-vue-components
     */
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: './types/components.d.ts',
      include: [/\.vue$/, /\.vue\?vue/],
    }),

    /**
     * polyfill Node's Core Modules for browser environments.
    */
    nodePolyfills(),

    /**
     * rollup-plugin-purgecss plugin is responsible of purging css rules
     * that are not used in the bundle
     *
     * @see https://github.com/FullHuman/purgecss/tree/main/packages/rollup-plugin-purgecss
     */
    PurgeCss({
      output: false,
      content: [`./src/**/*.vue`],
      variables: false,
      safelist: {
        standard: [
          /^notyf.*/, 
          'is-dark',
          /(autv|lnil|lnir|fas?)/,
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/,
        ],
      },
      defaultExtractor(content) {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
      },
    }),
  ],
})
