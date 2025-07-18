import Block from "@/framework/Block";
import Route from "./Route";

class Router {
	private static __instance: Router;

	private routes: Route[] = [];

	private history: History = window.history;

	private _currentRoute: Route | null = null;

	private _rootQuery!: string;

	private constructor(rootQuery: string) {
		this._rootQuery = rootQuery;
	}

	static getInstance(rootQuery: string): Router {
		if (!Router.__instance) {
			Router.__instance = new Router(rootQuery);
		}
		return Router.__instance;
	}

	use(pathname: string, block: new () => Block) {
		const route = new Route(pathname, block, { rootQuery: this._rootQuery });
		this.routes.push(route);
		return this;
	}

	start() {
		window.onpopstate = (event: PopStateEvent) => {
			this._onRoute((event.currentTarget as Window).location.pathname);
		};

		this._onRoute(window.location.pathname);
	}

	_onRoute(pathname: string) {
		let route;
		if (pathname.includes("messenger")) {
			route = this.getRoute("/messenger");
		} else {
			route = this.getRoute(pathname) || this.getRoute("/404");
		}
		if (!route) return;

		if (this._currentRoute && this._currentRoute !== route) {
			this._currentRoute.leave();
		}

		this._currentRoute = route;
		route.render();
	}

	go(pathname: string) {
		this.history.pushState({}, "", pathname);
		this._onRoute(pathname);
	}

	back() {
		this.history.back();
	}

	forward() {
		this.history.forward();
	}

	getRoute(pathname: string) {
		return this.routes.find((route) => route.match(pathname));
	}
}

const router = Router.getInstance("#app");
export default router;
