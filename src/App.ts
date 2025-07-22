import { IRouteManager } from "./interfaces/IRouteManager";
import RouteManager from "./services/RouteManager";

export default class App {
	private static routeManager: IRouteManager = new RouteManager();

	static init() {
		this.routeManager.updateRoutes();
	}

	static getRouteManager(): IRouteManager {
		return this.routeManager;
	}
}
