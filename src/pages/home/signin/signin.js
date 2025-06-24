import Handlebars from "handlebars";
import signinTemplateSource from "./signin.hbs?raw";
import "./signin.css";
import { renderLink } from "../../../components/btn/index.js";
import Block from "../../../framework/Block.js";
import Link from "../../../components/btn/Link.js";

const signinTemplate = Handlebars.compile(signinTemplateSource);

export function renderSigninForm() {
  document.getElementById("app").innerHTML = signinTemplate();

  const signinContainer = document.querySelector(
    ".signin-form-signin-btn-container"
  );
  if (signinContainer) {
    const link = renderLink({
      href: "#",
      id: "renderChatsBtn",
      className: "btn",
      child: "Войти",
      events: {
        click: (e) => {
          e.preventDefault();
          import("../../chats/chats.js").then(({ renderChatsForm }) => {
            renderChatsForm();
          });
        },
      },
    });
    signinContainer.innerHTML = "";
    signinContainer.appendChild(link);
  }

  const signupContainer = document.querySelector(
    ".signin-form-signup-btn-container"
  );
  if (signupContainer) {
    const link = renderLink({
      href: "#",
      id: "renderSignupBtn",
      className: "btn-secondary",
      child: "Нет аккаунта?",
      events: {
        click: (e) => {
          e.preventDefault();
          import("../signup/signup.js").then(({ renderSignupForm }) => {
            renderSignupForm();
          });
        },
      },
    });
    signupContainer.innerHTML = "";
    signupContainer.appendChild(link);
  }
}

const template = `
<div class="signin-wrapper">
  <div class="signin-container">
    <h1 class="signin-header">Вход</h1>
    <form class="signin-form">
      <ul class="login-field-list">
        {{#LoginField
          id="login" label="Логин" type="text" name="login"
        }}{{/LoginField}}
        {{#LoginField
          id="password" label="Пароль" type="password" name="password"
        }}{{/LoginField}}
      </ul>
      <div class="signin-form-signin-btn-container">
        {{{ SigninLink }}}
      </div>
    </form>

    <div class="signin-form-signup-btn-container">
      {{{ SignupLink }}}
    </div>
  </div>
</div>`;

export default class SigninPage extends Block {
  constructor() {
    super("div", {
      SigninLink: new Link({
        href: "#",
        id: "renderChatsBtn",
        className: "btn",
        child: "Войти",
        events: {
          click: (e) => {
            e.preventDefault();
            // import("../../chats/chats.js").then(({ renderChatsForm }) => {
            //   renderChatsForm();
            // });
            console.log("signin button click");
          },
        },
      }),
      SignupLink: new Link({
        href: "#",
        id: "renderSignupBtn",
        className: "btn-secondary",
        child: "Нет аккаунта?",
        events: {
          click: (e) => {
            e.preventDefault();
            // import("../signup/signup.js").then(({ renderSignupForm }) => {
            //   renderSignupForm();
            // });
            console.log("signup button click");
          },
        },
      }),
    });
  }
  render() {
    return this.compile(template);
  }
}
