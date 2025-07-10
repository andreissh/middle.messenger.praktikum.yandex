import { router } from "./routes/Router";
import SigninPage from "./pages/home/signin/SigninPage";
import SignupPage from "./pages/home/signup/SignupPage";
import ChatsPage from "./pages/chats/ChatsPage";
import ProfileInfoPage from "./pages/profile/profile-info/ProfileInfoPage";
import ProfileEditPage from "./pages/profile/profile-edit/ProfileEditPage";
import ProfileEditPassPage from "./pages/profile/profile-edit-pass/ProfileEditPassPage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import ServerErrorPage from "./pages/server-error/ServerErrorPage";

export default class App {
	constructor() {
		this._initRouter();
	}

	private _initRouter() {
		router
			.use("/", SigninPage)
			.use("/signin", SigninPage)
			.use("/signup", SignupPage)
			.use("/chats", ChatsPage)
			.use("/profile", ProfileInfoPage)
			.use("/profile-edit", ProfileEditPage)
			.use("/profile-pass-edit", ProfileEditPassPage)
			.use("/404", NotFoundPage)
			.use("/500", ServerErrorPage)
			.start();

		if (window.location.pathname === "/") {
			router.go("/signin");
		}
	}
}
