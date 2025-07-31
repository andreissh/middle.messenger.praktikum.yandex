import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "node",
	extensionsToTreatAsEsm: [".ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	globals: {
		"ts-jest": {
			useESM: true,
			tsconfig: "./tsconfig.json",
		},
	},
};

export default config;
