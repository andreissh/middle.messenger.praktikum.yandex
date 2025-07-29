import ChatsPage from "@/pages/chats/chats-page/ChatsPage";
import SigninPage from "@/pages/home/signin/SigninPage";
import SignupPage from "@/pages/home/signup/SignupPage";
import ProfileInfoPage from "@/pages/profile/profile-info/ProfileInfoPage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import ServerErrorPage from "@/pages/server-error/ServerErrorPage";
import { IRouteManager } from "../interfaces/IRouteManager";
import router from "../routes/Router";

class RouteManager implements IRouteManager {
	public setupRoutes() {
		router
			.use("/", SigninPage)
			.use("/sign-up", SignupPage)
			.use("/messenger", ChatsPage)
			.use("/settings", ProfileInfoPage)
			.use("/404", NotFoundPage)
			.use("/500", ServerErrorPage);
	}

	public updateRoutes() {
		router.reset();
		this.setupRoutes();
		router.start();
	}
}

export default RouteManager;
