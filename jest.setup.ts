import { jest } from "@jest/globals";

(global as any).Handlebars = {
	compile: jest.fn().mockImplementation((template) => () => template),
};
global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
