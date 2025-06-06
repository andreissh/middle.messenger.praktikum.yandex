import { compile } from "handlebars";
import serverErrorTemplateSource from "./server-error.hbs?raw";
import "./server-error.css";

const serverErrorTemplate = compile(serverErrorTemplateSource);

export function renderServerErrorForm() {
  const html = serverErrorTemplate();
  document.getElementById("app").innerHTML = html;

  const renderChatsBtn = document.querySelector(".serverError-backBtn");
  renderChatsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../chats/chats.js").then(({ renderChatsForm }) => {
      renderChatsForm();
    });
  });
}
