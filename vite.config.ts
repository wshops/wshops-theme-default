// @ts-ignore
import path from 'path'
import { defineConfig } from 'vite'
// @ts-ignore
import packageJson from './package.json'
import banner from 'vite-plugin-banner'
import removeConsole from 'vite-plugin-remove-console'
import { createMpaPlugin } from 'vite-plugin-virtual-mpa'

const base = '/'

module.exports = defineConfig({
  base: base,
  plugins: [
    banner(
      `/**\n * name: ${packageJson.name}\n * version: v${packageJson.version}\n * description: ${packageJson.description}\n * author: ${packageJson.author}\n * homepage: ${packageJson.homepage}\n */`
    ),
    removeConsole(),
    createMpaPlugin({
      pages: [
        {
          name: 'login',
          filename: 'login.html',
          entry: '/src/pages/login/main.ts',
          template: 'src/pages/login/index.html',
        },
        {
          name: 'register',
          filename: 'register.html',
          entry: '/src/pages/register/main.ts',
          template: 'src/pages/register/index.html',
        },
        {
          name: 'auth_result',
          filename: 'auth_result.html',
          entry: '/src/pages/auth_result/main.ts',
          template: 'src/pages/auth_result/index.html',
        },
        {
          name: 'index',
          filename: 'index.html',
          entry: '/src/pages/index/main.ts',
          template: 'src/pages/index/index.html',
        },
        {
          name: 'search',
          filename: 'search.html',
          entry: '/src/pages/search/main.ts',
          template: 'src/pages/search/index.html',
        },
        {
          name: 'product_category',
          filename: 'product_category.html',
          entry: '/src/pages/product_category/main.ts',
          template: 'src/pages/product_category/index.html',
        },
        {
          name: 'product_detail',
          filename: 'product_detail.html',
          entry: '/src/pages/product_detail/main.ts',
          template: 'src/pages/product_detail/index.html',
        },
        {
          name: 'cart',
          filename: 'cart.html',
          entry: '/src/pages/cart/main.ts',
          template: 'src/pages/cart/index.html',
        },
        {
          name: 'checkout',
          filename: 'checkout.html',
          entry: '/src/pages/checkout/main.ts',
          template: 'src/pages/checkout/index.html',
        },
        {
          name: 'clientarea',
          filename: 'clientarea.html',
          entry: '/src/pages/clientarea/main.ts',
          template: 'src/pages/clientarea/index.html',
        },
      ],
    }),
  ],
  server: {
    host: 'app.dev.local.wshop.info',
    hmr: true,
    proxy: {
      // with options
      '/api': {
        target: 'https://app.dev.cloud.wshop.info/api',
        xfwd: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    minify: true,
    target: 'modules',
    sourcemap: true,
  },
  define: {
    '__VUE_OPTIONS_API__': true,
    '__VUE_PROD_DEVTOOLS__': false
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
})
