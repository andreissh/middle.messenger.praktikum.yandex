import http from "./api/HttpClient";
import { IRouteManager } from "./interfaces/IRouteManager";
import router from "./routes/Router";
import RouteManager from "./services/RouteManager";
import { UserData } from "./types/types";

export default class App {
	private static routeManager: IRouteManager = new RouteManager();

	private static async checkAuth() {
		try {
			const userData = await http.get<UserData>("/auth/user");
			localStorage.setItem("userId", String(userData.id));
			const { pathname } = window.location;
			if (pathname !== "/") {
				router.go(pathname);
			} else {
				router.go("/messenger");
			}
		} catch (err) {
			router.go("/");
			throw new Error("Ошибка при загрузке данных пользователя", {
				cause: err,
			});
		}
	}

	static init() {
		this.routeManager.setupRoutes();
		router.start();
		App.checkAuth();
	}

	static getRouteManager(): IRouteManager {
		return this.routeManager;
	}
}
