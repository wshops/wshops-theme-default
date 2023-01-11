// @ts-ignore
import path from "path";
import { defineConfig } from "vite";
// @ts-ignore
import packageJson from "./package.json";
import banner from "vite-plugin-banner";
import removeConsole from "vite-plugin-remove-console";
import { createMpaPlugin } from "vite-plugin-virtual-mpa";

const base = "/";

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
          name: "index",
          filename: "index.html",
          entry: "/src/pages/index/main.ts",
          template: "src/pages/index/index.html",
        },
        {
          name: "login",
          filename: "login.html",
          entry: "/src/pages/login/main.ts",
          template: "src/pages/login/index.html",
        },
        {
          name: "register",
          filename: "register.html",
          entry: "/src/pages/register/main.ts",
          template: "src/pages/register/index.html",
        },
      ],
    }),
  ],
  server: {
    hmr: true,
    proxy: {
      // with options
      "/api": {
        target: "https://app.dev.cloud.wshop.info/api",
        xfwd: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    minify: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
});
