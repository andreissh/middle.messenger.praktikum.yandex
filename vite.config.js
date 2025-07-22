import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";

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
		[viteSingleFile()],
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
