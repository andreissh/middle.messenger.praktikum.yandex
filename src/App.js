import SigninPage from "./pages/home/signin/SigninPage";
import SignupPage from "./pages/home/signup/SignupPage";
import ChatsPage from "./pages/chats/ChatsPage";
import ProfileInfoPage from "./pages/profile/profile-info/ProfileInfoPage";
import ProfileEditPage from "./pages/profile/profile-edit/ProfileEditPage";
import ProfileEditPassPage from "./pages/profile/profile-edit-pass/ProfileEditPassPage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import ServerErrorPage from "./pages/server-error/ServerErrorPage";

export default class App {
  _state;
  _appElement;

  constructor() {
    this._state = {
      currentPage: "SigninPage",
    };
    this._rootElementId = "app";
  }

  render() {
    const rootElement = document.getElementById(this._rootElementId);
    if (!rootElement) return;

    let newContent;

    switch (this._state.currentPage) {
      case "SigninPage":
        const signinPage = new SigninPage(this);
        newContent = signinPage.getContent();
        break;
      case "SignupPage":
        const signupPage = new SignupPage(this);
        newContent = signupPage.getContent();
        break;
      case "ChatsPage":
        const chatsPage = new ChatsPage(this);
        newContent = chatsPage.getContent();
        break;
      case "ProfileInfoPage":
        const profileInfoPage = new ProfileInfoPage(this);
        newContent = profileInfoPage.getContent();
        break;
      case "ProfileEditPage":
        const profileEditPage = new ProfileEditPage(this);
        newContent = profileEditPage.getContent();
        break;
      case "ProfileEditPassPage":
        const profileEditPassPage = new ProfileEditPassPage(this);
        newContent = profileEditPassPage.getContent();
        break;
      case "NotFoundPage":
        const notFoundPage = new NotFoundPage(this);
        newContent = notFoundPage.getContent();
        break;
      case "ServerErrorPage":
        const serverErrorPage = new ServerErrorPage(this);
        newContent = serverErrorPage.getContent();
        break;
      default:
        return;
    }

    const newRootElement = document.createElement("div");
    newRootElement.id = this._rootElementId;
    newRootElement.appendChild(newContent);
    rootElement.replaceWith(newRootElement);
  }

  changePage(page) {
    this._state.currentPage = page;
    this.render();
  }
}
