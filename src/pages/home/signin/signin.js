import Handlebars from "handlebars";
import signinTemplateSource from "./signin.hbs?raw";
import "./signin.css";

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

  // const renderChatsBtn = document.querySelector("#renderChatsBtn");
  // renderChatsBtn.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   import("../../chats/chats.js").then(({ renderChatsForm }) => {
  //     renderChatsForm();
  //   });
  // });
}
