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

jest.mock("../routes/Router", () => {
	const mockRouter = {
		use: jest.fn().mockReturnThis(),
		reset: jest.fn(),
		start: jest.fn(),
	};
	return mockRouter;
});

describe("RouteManager", () => {
	let routeManager: IRouteManager;

	beforeEach(() => {
		routeManager = new RouteManager();
		jest.clearAllMocks();
	});

	describe("setupRoutes", () => {
		it("should register all routes with correct components", () => {
			routeManager.setupRoutes();

			expect(router.use).toHaveBeenCalledTimes(6);

			expect(router.use).toHaveBeenCalledWith("/", SigninPage);
			expect(router.use).toHaveBeenCalledWith("/sign-up", SignupPage);
			expect(router.use).toHaveBeenCalledWith("/messenger", ChatsPage);
			expect(router.use).toHaveBeenCalledWith("/settings", ProfileInfoPage);
			expect(router.use).toHaveBeenCalledWith("/404", NotFoundPage);
			expect(router.use).toHaveBeenCalledWith("/500", ServerErrorPage);
		});

		it("should chain the route registrations", () => {
			routeManager.setupRoutes();

			expect(router.use).toHaveReturnedWith(router);
		});
	});

	describe("updateRoutes", () => {
		it("should reset, setup, and start the router", () => {
			routeManager.updateRoutes();

			expect(router.reset).toHaveBeenCalledTimes(1);
			expect(router.use).toHaveBeenCalledTimes(6);
			expect(router.start).toHaveBeenCalledTimes(1);
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
