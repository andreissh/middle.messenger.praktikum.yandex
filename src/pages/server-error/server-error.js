import { compile } from "handlebars";
import serverErrorTemplateSource from "./server-error.hbs?raw";
import "../../partials/btn/btn.js";
import "./server-error.css";

const serverErrorTemplate = compile(serverErrorTemplateSource);

export function renderServerErrorForm() {
  const html = serverErrorTemplate();
  document.getElementById("app").innerHTML = html;

  const renderChatsBtn = document.querySelector("#renderChatsBtn");
  renderChatsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../chats/chats.js").then(({ renderChatsForm }) => {
      renderChatsForm();
    });
  });
}
