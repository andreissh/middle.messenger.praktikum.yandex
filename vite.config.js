import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  server: {
    port: 3000,
  },
  plugins: [
    handlebars({
      partialsDirectory: resolve(__dirname, "src/components"),
    }),
  ],
  build: {
    rollupOptions: {
      input: "index.html",
    },
  },
  assetsInclude: ["**/*.hbs"],
});
