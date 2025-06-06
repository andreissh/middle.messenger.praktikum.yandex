import Handlebars from "handlebars";
import signinTemplateSource from "./signin.hbs?raw";
import labelInputPartial from "../../../partials/label-input/label-input.hbs?raw";
import "./signin.css";

Handlebars.registerPartial("label-input", labelInputPartial);
const signinTemplate = Handlebars.compile(signinTemplateSource);

export function renderSigninForm() {
  const html = signinTemplate();
  document.getElementById("app").innerHTML = html;

  const renderSignupBtn = document.querySelector("#renderSignupBtn");
  renderSignupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../signup/signup.js").then(({ renderSignupForm }) => {
      renderSignupForm();
    });
  });

  const renderChatsBtn = document.querySelector("#renderChatsBtn");
  renderChatsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../../chats/chats.js").then(({ renderChatsForm }) => {
      renderChatsForm();
    });
  });
}
