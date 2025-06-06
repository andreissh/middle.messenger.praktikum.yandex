import Handlebars from "handlebars";
import signupTemplateSource from "./signup.hbs?raw";
import "../components/login-field/login-field.js";
import "../../../components/btn/btn.js";
import "./signup.css";

const signupTemplate = Handlebars.compile(signupTemplateSource);

const loginFields = [
  { label: "Почта", type: "text", name: "email", autocomplete: "email" },
  { label: "Логин", type: "text", name: "login", autocomplete: "login" },
  {
    label: "Имя",
    type: "text",
    name: "first_name",
    autocomplete: "first_name",
  },
  {
    label: "Фамилия",
    type: "text",
    name: "second_name",
    autocomplete: "second_name",
  },
  { label: "Телефон", type: "text", name: "phone", autocomplete: "phone" },
  {
    label: "Пароль",
    type: "password",
    name: "password",
    autocomplete: "password",
  },
  {
    label: "Пароль (еще раз)",
    type: "password",
    name: "password_repeat",
    autocomplete: "password",
  },
];

export function renderSignupForm() {
  const html = signupTemplate({ loginFields });
  document.getElementById("app").innerHTML = html;

  const renderSigninBtn = document.querySelectorAll(".renderSigninBtn");
  renderSigninBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      import("../signin/signin.js").then(({ renderSigninForm }) => {
        renderSigninForm();
      });
    });
  });
}
