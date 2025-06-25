import SigninPage from "./pages/home/signin/SigninPage";
import SignupPage from "./pages/home/signup/signup";

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
