import App from "./App";
import ChatsPage from "./pages/chats/chats-page/ChatsPage";
import SigninPage from "./pages/home/signin/SigninPage";
import SignupPage from "./pages/home/signup/SignupPage";
import ProfileInfoPage from "./pages/profile/profile-info/ProfileInfoPage";
import RouteManager from "./services/RouteManager";

document.addEventListener("DOMContentLoaded", () => {
	const routeManager = new RouteManager();
	App.init();
	SigninPage.setRouteManager(routeManager);
	SignupPage.setRouteManager(routeManager);
	ChatsPage.setRouteManager(routeManager);
	ProfileInfoPage.setRouteManager(routeManager);
});
