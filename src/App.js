import SigninPage from "./pages/home/signin/signin";

export default class App {
  _state;
  _appElement;

  constructor() {
    this._state = {
      currentPage: "SigninPage",
    };
    this._appElement = document.getElementById("app");
  }

  render() {
    if (this._state.currentPage === "SigninPage") {
      const signinPage = new SigninPage();
      if (this._appElement) {
        this._appElement.replaceWith(signinPage.getContent());
      }
    }
    return "";
  }

  changePage(page) {
    this._state.currentPage = page;
    this.render();
  }
}
