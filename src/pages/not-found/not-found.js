import Handlebars from "handlebars";
import notFoundTemplateSource from "./not-found.hbs?raw";
import "./not-found.css";
import { renderLink } from "../../components/btn/index.js";

const notFoundTemplate = Handlebars.compile(notFoundTemplateSource);

export function renderNotFoundForm() {
  document.getElementById("app").innerHTML = notFoundTemplate();

  const notFoundContainer = document.querySelector(
    ".not-found-goback-container"
  );
  if (notFoundContainer) {
    const link = renderLink({
      href: "#",
      id: "renderChatsBtn",
      className: "btn-secondary",
      child: "Назад к чатам",
      events: {
        click: (e) => {
          e.preventDefault();
          import("../chats/chats.js").then(({ renderChatsForm }) => {
            renderChatsForm();
          });
        },
      },
    });
    notFoundContainer.innerHTML = "";
    notFoundContainer.appendChild(link);
  }
}
