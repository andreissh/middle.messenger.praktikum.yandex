import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "jsdom",
	extensionsToTreatAsEsm: [".ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"\\.(css)$": "identity-obj-proxy",
	},
	transform: {
		"^.+\\.ts$": "ts-jest",
		"^.+\\.svg$": "jest-transform-stub",
	},
	globals: {
		"ts-jest": {
			useESM: true,
			tsconfig: "./tsconfig.json",
		},
	},
};

export default config;
