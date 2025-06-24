import Handlebars from "handlebars";
import signinTemplateSource from "./signin.hbs?raw";
import "./signin.css";
import { renderLink } from "../../../components/btn/index.js";

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
