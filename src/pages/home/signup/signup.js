import Handlebars from "handlebars";
import signupTemplateSource from "./signup.hbs?raw";
import "./signup.css";

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
