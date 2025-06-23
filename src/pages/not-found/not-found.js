import Handlebars from "handlebars";
import notFoundTemplateSource from "./not-found.hbs?raw";
import "./not-found.css";

const notFoundTemplate = Handlebars.compile(notFoundTemplateSource);

export function renderNotFoundForm() {
  const html = notFoundTemplate();
  document.getElementById("app").innerHTML = html;

  const renderChatsBtn = document.querySelector("#renderChatsBtn");
  renderChatsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../chats/chats.js").then(({ renderChatsForm }) => {
      renderChatsForm();
    });
  });
}
