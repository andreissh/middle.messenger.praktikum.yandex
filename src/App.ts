import SigninPage from "./pages/home/signin/SigninPage";
import SignupPage from "./pages/home/signup/SignupPage";
import ChatsPage from "./pages/chats/ChatsPage";
import ProfileInfoPage from "./pages/profile/profile-info/ProfileInfoPage";
import ProfileEditPage from "./pages/profile/profile-edit/ProfileEditPage";
import ProfileEditPassPage from "./pages/profile/profile-edit-pass/ProfileEditPassPage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import ServerErrorPage from "./pages/server-error/ServerErrorPage";
import { PageConstructor, PageName } from "./types/types";

type AppState = {
	currentPage: PageName;
};

export default class App {
	private _state: AppState;

	private _rootElementId: string;

	private _pageConstructors: Record<PageName, PageConstructor>;

	constructor() {
		this._state = {
			currentPage: "SigninPage",
		};
		this._rootElementId = "app";

		this._pageConstructors = {
			SigninPage,
			SignupPage,
			ChatsPage,
			ProfileInfoPage,
			ProfileEditPage,
			ProfileEditPassPage,
			NotFoundPage,
			ServerErrorPage,
		};
	}

	private _render(): void {
		const rootElement = document.getElementById(this._rootElementId);
		if (!rootElement) {
			console.error(`Element with id '${this._rootElementId}' not found`);
			return;
		}

		const PageComponent = this._pageConstructors[this._state.currentPage];
		if (!PageComponent) {
			console.error(
				`No constructor found for page: ${this._state.currentPage}`,
			);
			return;
		}

		const pageInstance = new PageComponent({
			onChangePage: (pageName) => this.changePage(pageName),
		});
		const newContent = pageInstance.getContent();

		const newRootElement = document.createElement("div");
		newRootElement.id = this._rootElementId;
		newRootElement.appendChild(newContent);
		rootElement.replaceWith(newRootElement);
	}

	public render(): void {
		this._render();
	}

	public changePage(page: PageName): void {
		this._state.currentPage = page;
		this._render();
	}
}
