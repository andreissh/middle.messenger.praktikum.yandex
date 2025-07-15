import { router } from "./routes/Router";
import SigninPage from "./pages/home/signin/SigninPage";
import SignupPage from "./pages/home/signup/SignupPage";
import ChatsPage from "./pages/chats/ChatsPage";
import ProfileInfoPage from "./pages/profile/profile-info/ProfileInfoPage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import ServerErrorPage from "./pages/server-error/ServerErrorPage";

export default class App {
	constructor() {
		App._initRouter();
	}

	private static _initRouter() {
		router
			.use("/", SigninPage)
			.use("/sign-up", SignupPage)
			.use("/messenger", ChatsPage)
			.use("/settings", ProfileInfoPage)
			.use("/404", NotFoundPage)
			.use("/500", ServerErrorPage)
			.start();

		if (window.location.pathname === "/") {
			if (localStorage.getItem("isSignedIn") === "true") {
				router.go("/messenger");
			} else {
				router.go("/");
			}
		}
	}
}
