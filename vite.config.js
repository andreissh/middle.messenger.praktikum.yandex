import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
  },
  plugins: [handlebars()],
});
