import ChatsPage from "@/pages/chats/chats-page/ChatsPage";
import SigninPage from "@/pages/home/signin/SigninPage";
import SignupPage from "@/pages/home/signup/SignupPage";
import ProfileInfoPage from "@/pages/profile/profile-info/ProfileInfoPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import ServerErrorPage from "@/pages/server-error/ServerErrorPage";
import { jest } from "@jest/globals";
import RouteManager from "./RouteManager";
import router from "../routes/Router";
import { IRouteManager } from "../interfaces/IRouteManager";

jest.mock("@/routes/Router", () => {
	const mockRouter = {
		use: jest.fn().mockReturnThis(),
		reset: jest.fn(),
		start: jest.fn(),
	};
	return mockRouter;
});

const spyOnUse = jest.spyOn(router, "use");
const spyOnReset = jest.spyOn(router, "reset");
const spyOnStart = jest.spyOn(router, "start");

describe("RouteManager", () => {
	let routeManager: IRouteManager;

	beforeEach(() => {
		document.body.innerHTML = '<div id="app"></div>';
		routeManager = new RouteManager();
		jest.clearAllMocks();
	});

	describe("setupRoutes", () => {
		it("should register all routes with correct components", () => {
			routeManager.setupRoutes();

			expect(spyOnUse).toHaveBeenCalledTimes(6);

			expect(spyOnUse).toHaveBeenCalledWith("/", SigninPage);
			expect(spyOnUse).toHaveBeenCalledWith("/sign-up", SignupPage);
			expect(spyOnUse).toHaveBeenCalledWith("/messenger", ChatsPage);
			expect(spyOnUse).toHaveBeenCalledWith("/settings", ProfileInfoPage);
			expect(spyOnUse).toHaveBeenCalledWith("/404", NotFoundPage);
			expect(spyOnUse).toHaveBeenCalledWith("/500", ServerErrorPage);
		});

		it("should chain the route registrations", () => {
			routeManager.setupRoutes();

			expect(spyOnUse).toHaveReturnedWith(router);
		});
	});

	describe("updateRoutes", () => {
		it("should reset, setup, and start the router", () => {
			routeManager.updateRoutes();

			expect(spyOnReset).toHaveBeenCalledTimes(1);
			expect(spyOnUse).toHaveBeenCalledTimes(6);
			expect(spyOnStart).toHaveBeenCalledTimes(1);
		});

		it("should call setupRoutes during update", () => {
			const spy = jest.spyOn(routeManager, "setupRoutes");
			routeManager.updateRoutes();

			expect(spy).toHaveBeenCalledTimes(1);
			spy.mockRestore();
		});
	});

	describe("IRouteManager implementation", () => {
		it("should correctly implement the interface", () => {
			expect(routeManager.setupRoutes).toBeInstanceOf(Function);
			expect(routeManager.updateRoutes).toBeInstanceOf(Function);
		});
	});
});
