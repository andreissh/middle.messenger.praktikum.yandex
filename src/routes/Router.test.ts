import Block from "@/framework/Block";
import { jest } from "@jest/globals";
import { Router } from "./Router";

jest.mock("./Route");

class TestComponent extends Block {
	constructor() {
		super("div");
	}

	render() {
		return this.compile("<div>Test</div>");
	}
}

describe("Router", () => {
	let router: any;

	beforeEach(() => {
		router = Router.getInstance("#app");
		router.reset();
	});

	it("should start and call _onRoute with current location", () => {
		const spy = jest.spyOn(router as any, "_onRoute");

		router.start();

		expect(window.location.pathname).toBe("/");
		expect(spy).toHaveBeenCalledWith(window.location.pathname);
	});

	it("should register routes", () => {
		router.use("/route", TestComponent);

		expect(router.getRoute("/route")).toBeDefined();
	});

	it("should navigate to a route with 'go'", () => {
		const fakeRender = jest.fn();
		const routeMock = {
			match: () => true,
			render: fakeRender,
		};
		(router as any).routes = [routeMock];

		router.go("/route");

		expect(fakeRender).toHaveBeenCalled();
	});

	it("should return route by pathname", () => {
		router.use("/route", TestComponent);

		const route = router.getRoute("/route");

		expect(route).toBeDefined();
	});

	it("should call 'leave' on previous route", () => {
		const leave = jest.fn();
		const oldRoute = { match: () => false, leave };
		const newRoute = { match: () => true, render: jest.fn() };

		router.use("/old", TestComponent);
		(router as any)._currentRoute = oldRoute;
		(router as any).routes = [newRoute];

		router.go("/test");

		expect(leave).toHaveBeenCalled();
	});

	it("should reset routes and currentRoute", () => {
		router.use("/route", TestComponent);
		(router as any)._currentRoute = {} as any;

		router.reset();

		expect((router as any).routes.length).toBe(0);
		expect((router as any)._currentRoute).toBeNull();
	});

	it("should render 404 page if no matching route found", () => {
		const renderNotFound = jest.fn();

		const notFoundRoute = {
			match: (path: string) => path === "/404",
			render: renderNotFound,
		};
		(router as any).routes = [notFoundRoute];

		router.go("/unknown-route");

		expect(renderNotFound).toHaveBeenCalled();
	});
});
