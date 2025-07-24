module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ["./tsconfig.json"],
		tsconfigRootDir: __dirname,
	},
	plugins: ["@typescript-eslint"],
	extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
	rules: {
		"no-underscore-dangle": "off",
		"class-methods-use-this": "off",
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
