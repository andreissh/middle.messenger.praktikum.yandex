import ChatsPage from "@/pages/chats/chats-page/ChatsPage";
import SigninPage from "@/pages/home/signin/SigninPage";
import SignupPage from "@/pages/home/signup/SignupPage";
import ProfileInfoPage from "@/pages/profile/profile-info/ProfileInfoPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import ServerErrorPage from "@/pages/server-error/ServerErrorPage";
import { IRouteManager } from "../interfaces/IRouteManager";
import router from "../routes/Router";

class RouteManager implements IRouteManager {
	// eslint-disable-next-line class-methods-use-this
	public updateRoutes() {
		router.reset();
		RouteManager.setupRoutes();
		router.start();
	}

	private static setupRoutes() {
		if (localStorage.getItem("isSignedIn") === "true") {
			router.use("/", ChatsPage);
		} else {
			router.use("/", SigninPage);
		}

		router
			.use("/sign-up", SignupPage)
			.use("/messenger", ChatsPage)
			.use("/settings", ProfileInfoPage)
			.use("/404", NotFoundPage)
			.use("/500", ServerErrorPage);
	}
}

export default RouteManager;
