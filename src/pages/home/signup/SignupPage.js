import "./signup.css";
import Block from "../../../framework/Block.js";
import LoginField from "../components/login-field/LoginField.js";
import Link from "../../../components/btn/Link.js";

const template = `
  <div class="signup-wrapper">
    <div class="signup-container">
      <h1 class="signup-header">Регистрация</h1>
      <form class="signup-form">
        <ul class="login-field-list">
          {{{ EmailField }}}
          {{{ LoginField }}}
          {{{ FirstNameField }}}
          {{{ SecondNameField }}}
          {{{ PhoneField }}}
          {{{ PasswordField }}}
          {{{ PasswordRepeatField }}}
        </ul>
        <div class="signup-form-signup-btn-container">
          {{{ SignupLink }}}
        </div>
      </form>

      <div class="signup-form-signin-btn-container">
        {{{ SigninLink }}}
      </div>
    </div>
  </div>
`;

export default class SignupPage extends Block {
  constructor(app) {
    super("div", {
      EmailField: new LoginField({
        id: "email",
        label: "Почта",
        type: "text",
        name: "email",
      }),
      LoginField: new LoginField({
        id: "login",
        label: "Логин",
        type: "text",
        name: "login",
      }),
      FirstNameField: new LoginField({
        id: "first_name",
        label: "Имя",
        type: "text",
        name: "first_name",
      }),
      SecondNameField: new LoginField({
        id: "second_name",
        label: "Фамилия",
        type: "text",
        name: "second_name",
      }),
      PhoneField: new LoginField({
        id: "phone",
        label: "Телефон",
        type: "text",
        name: "phone",
      }),
      PasswordField: new LoginField({
        id: "password",
        label: "Пароль",
        type: "password",
        name: "password",
      }),
      PasswordRepeatField: new LoginField({
        id: "password_repeat",
        label: "Пароль (еще раз)",
        type: "password",
        name: "password_repeat",
      }),
      SignupLink: new Link({
        href: "#",
        id: "signup",
        class: "btn renderSigninBtn",
        text: "Зарегистрироваться",
        events: {
          click: () => {
            app.changePage("SigninPage");
          },
        },
      }),
      SigninLink: new Link({
        href: "#",
        id: "signin",
        class: "btn-secondary renderSigninBtn",
        text: "Войти",
        events: {
          click: () => {
            app.changePage("SigninPage");
          },
        },
      }),
    });
  }
  render() {
    return this.compile(template);
  }
}
