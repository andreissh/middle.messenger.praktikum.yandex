/* eslint-disable import/first */
import { jest } from "@jest/globals";

await jest.unstable_mockModule("@/utils/renderDOM", () => ({
	__esModule: true,
	default: jest.fn(),
}));

const renderDOM = (await import("@/utils/renderDOM")).default;
import Block from "@/framework/Block";

const { default: Route } = await import("./Route");

class TestComponent extends Block {
	constructor() {
		super("div");
	}

	render() {
		return this.compile("<div>Test</div>");
	}
}

describe("Route", () => {
	it("should match the correct path", () => {
		const route = new Route("/route", TestComponent, { rootQuery: "#app" });

		expect(route.match("/route")).toBe(true);
		expect(route.match("/other")).toBe(false);
	});

	it("should render the block", () => {
		const route = new Route("/test", TestComponent, { rootQuery: "#app" });
		(route as any)._block = null;

		route.render();

		expect(renderDOM).toHaveBeenCalled();
	});

	it("should hide block on leave", () => {
		const block = new TestComponent();
		const route = new Route("/route", TestComponent, { rootQuery: "#app" });
		(route as any)._block = block;
		const hide = jest.spyOn(block, "hide");

		route.leave();

		expect(hide).toHaveBeenCalled();
	});

	it("should navigate to matching path and call render", () => {
		const route = new Route("/route", TestComponent, { rootQuery: "#app" });
		(route as any).render = jest.fn();

		route.navigate("/route");

		expect((route as any).render).toHaveBeenCalled();
	});

	it("should not navigate to non-matching path", () => {
		const route = new Route("/route", TestComponent, { rootQuery: "#app" });
		(route as any).render = jest.fn();

		route.navigate("/other");

		expect((route as any).render).not.toHaveBeenCalled();
	});
});
