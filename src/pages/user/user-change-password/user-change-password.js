import { compile } from "handlebars";
import userPassTemplateSource from "./user-change-password.hbs?raw";
import "./user-change-password.css";

const userPassTemplate = compile(userPassTemplateSource);

export function renderUserPassForm() {
  const html = userPassTemplate();
  document.getElementById("app").innerHTML = html;

  const renderBackBtn = document.querySelector(".user-pass-goback-btn");
  renderBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../../chats/chats.js").then(({ renderChatsForm }) => {
      renderChatsForm();
    });
  });
}
