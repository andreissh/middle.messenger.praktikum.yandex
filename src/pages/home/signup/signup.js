import Handlebars from "handlebars";
import signupTemplateSource from "./signup.hbs?raw";
import "./signup.css";
import { renderLink } from "../../../components/btn/index.js";

const signupTemplate = Handlebars.compile(signupTemplateSource);

const loginFields = [
  { id: "email", label: "Почта", type: "text", name: "email" },
  { id: "login", label: "Логин", type: "text", name: "login" },
  {
    id: "first_name",
    label: "Имя",
    type: "text",
    name: "first_name",
  },
  {
    id: "second_name",
    label: "Фамилия",
    type: "text",
    name: "second_name",
  },
  { id: "phone", label: "Телефон", type: "text", name: "phone" },
  {
    id: "password",
    label: "Пароль",
    type: "password",
    name: "password",
  },
  {
    id: "password_repeat",
    label: "Пароль (еще раз)",
    type: "password",
    name: "password_repeat",
  },
];

export function renderSignupForm() {
  document.getElementById("app").innerHTML = signupTemplate({ loginFields });

  const signupContainer = document.querySelector(
    ".signup-form-signup-btn-container"
  );
  if (signupContainer) {
    const link = renderLink({
      href: "#",
      id: "signup",
      className: "btn renderSigninBtn",
      child: "Зарегистрироваться",
      events: {
        click: (e) => {
          e.preventDefault();
          import("../signin/signin.js").then(({ renderSigninForm }) => {
            renderSigninForm();
          });
        },
      },
    });
    signupContainer.innerHTML = "";
    signupContainer.appendChild(link);
  }

  const signinContainer = document.querySelector(
    ".signup-form-signin-btn-container"
  );
  if (signinContainer) {
    const link = renderLink({
      href: "#",
      id: "signin",
      className: "btn-secondary renderSigninBtn",
      child: "Войти",
      events: {
        click: (e) => {
          e.preventDefault();
          import("../signin/signin.js").then(({ renderSigninForm }) => {
            renderSigninForm();
          });
        },
      },
    });
    signinContainer.innerHTML = "";
    signinContainer.appendChild(link);
  }
}
