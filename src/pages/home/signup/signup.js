import Handlebars from "handlebars";
import signupTemplateSource from "./signup.hbs?raw";
import "../../../partials/label-input/label-input.js";
import "../../../partials/btn/btn.js";
import "./signup.css";

const signupTemplate = Handlebars.compile(signupTemplateSource);

export function renderSignupForm() {
  const html = signupTemplate();
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
