module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ["./tsconfig.json"],
		tsconfigRootDir: __dirname,
	},
	plugins: ["@typescript-eslint"],
	extends: ["airbnb-base", "airbnb-typescript/base"],
	rules: {
		indent: "off",
		"@typescript-eslint/indent": ["error", "tab"],
		"no-tabs": "off",
		quotes: ["error", "double"],
		"@typescript-eslint/quotes": ["error", "double"],
		"no-underscore-dangle": "off",
		"linebreak-style": [
			"error",
			process.platform === "win32" ? "windows" : "unix",
		],
	},
	ignorePatterns: ["dist/", "node_modules/", "*.config.*js"],
	settings: {
		"import/resolver": {
			typescript: {
				project: "./tsconfig.json",
				alwaysTryTypes: true,
			},
		},
	},
};
