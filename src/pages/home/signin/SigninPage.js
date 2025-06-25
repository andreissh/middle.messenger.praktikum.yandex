import "./signin.css";
import Block from "../../../framework/Block.js";
import Link from "../../../components/btn/Link.js";
import LoginField from "../components/login-field/LoginField.js";

const template = `
  <div class="signin-wrapper">
    <div class="signin-container">
      <h1 class="signin-header">Вход</h1>
      <form class="signin-form">
        <ul class="login-field-list">
          {{{ LoginField }}}
          {{{ PassField }}}
        </ul>
        <div class="signin-form-signin-btn-container">
          {{{ SigninLink }}}
        </div>
      </form>

      <div class="signin-form-signup-btn-container">
        {{{ SignupLink }}}
      </div>
    </div>
  </div>
`;

export default class SigninPage extends Block {
  constructor(app) {
    super("div", {
      LoginField: new LoginField({
        id: "login",
        label: "Логин",
        type: "text",
        name: "login",
      }),
      PassField: new LoginField({
        id: "password",
        label: "Пароль",
        type: "password",
        name: "password",
      }),
      SigninLink: new Link({
        href: "#",
        id: "renderChatsBtn",
        class: "btn",
        text: "Войти",
        events: {
          click: () => {
            app.changePage("ChatsPage");
          },
        },
      }),
      SignupLink: new Link({
        href: "#",
        id: "renderSignupBtn",
        class: "btn-secondary",
        text: "Нет аккаунта?",
        events: {
          click: () => {
            app.changePage("SignupPage");
          },
        },
      }),
    });
  }
  render() {
    return this.compile(template);
  }
}
