(global as any).Handlebars = {
	compile: jest.fn().mockImplementation((template) => () => template),
};
