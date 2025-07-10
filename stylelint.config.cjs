module.exports = {
	extends: ["stylelint-config-standard"],
	rules: {
		// Добавил правило, чтобы использовать бэм подход с именованием модификатора через двойной дефис
		"selector-class-pattern":
			"^[a-z0-9]+(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$",
		"no-empty-source": null,
	},
	ignoreFiles: ["**/*.ts"],
};
