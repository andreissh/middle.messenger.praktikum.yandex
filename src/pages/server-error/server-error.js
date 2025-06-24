import Handlebars from "handlebars";
import serverErrorTemplateSource from "./server-error.hbs?raw";
import "./server-error.css";
import { renderLink } from "../../components/btn/index.js";

const serverErrorTemplate = Handlebars.compile(serverErrorTemplateSource);

export function renderServerErrorForm() {
  document.getElementById("app").innerHTML = serverErrorTemplate();

  const serverErrorContainer = document.querySelector(
    ".server-error-goback-container"
  );
  if (serverErrorContainer) {
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
    serverErrorContainer.innerHTML = "";
    serverErrorContainer.appendChild(link);
  }
}
