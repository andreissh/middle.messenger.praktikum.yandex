import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import path from "path";

export default defineConfig({
	base: "./",
	appType: "spa",
	server: {
		port: 3000,
		historyApiFallback: true,
		strict: false,
	},
	plugins: [
		handlebars({
			partialsDirectory: path.resolve(__dirname, "src/components"),
		}),
	],
	build: {
		rollupOptions: {
			input: "index.html",
		},
	},
	assetsInclude: ["**/*.hbs"],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
});
