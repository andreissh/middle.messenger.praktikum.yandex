import router from "./routes/Router";
import SigninPage from "./pages/home/signin/SigninPage";
import SignupPage from "./pages/home/signup/SignupPage";
import ChatsPage from "./pages/chats/chats-page/ChatsPage";
import ProfileInfoPage from "./pages/profile/profile-info/ProfileInfoPage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import ServerErrorPage from "./pages/server-error/ServerErrorPage";

export default class App {
	static init() {
		this._initRouter();
	}

	private static _setupRoutes() {
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

	static _initRouter() {
		this._setupRoutes();
		router.start();
	}

	static updateRoutes() {
		router.reset();
		this._setupRoutes();
	}
}
