import { compile } from "handlebars";
import notFoundTemplateSource from "./not-found.hbs?raw";
import "./not-found.css";

const notFoundTemplate = compile(notFoundTemplateSource);

export function renderNotFoundForm() {
  const html = notFoundTemplate();
  document.getElementById("app").innerHTML = html;

  const renderChatsBtn = document.querySelector(".notFound-backBtn");
  renderChatsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../chats/chats.js").then(({ renderChatsForm }) => {
      renderChatsForm();
    });
  });
}
