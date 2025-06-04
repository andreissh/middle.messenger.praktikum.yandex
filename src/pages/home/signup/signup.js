import { compile } from "handlebars";
import signupTemplateSource from "./signup.handlebars?raw";
import "./signup.css";

const signupTemplate = compile(signupTemplateSource);

export function renderSignupForm() {
  const html = signupTemplate();
  document.getElementById("app").innerHTML = html;

  const renderSigninBtn = document.querySelectorAll(".signup-form-btn");
  renderSigninBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      import("../signin/signin.js").then(({ renderSigninForm }) => {
        renderSigninForm();
      });
    });
  });
}
