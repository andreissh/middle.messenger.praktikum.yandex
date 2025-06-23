import Handlebars from "handlebars";
import chatsTemplateSource from "./chats.hbs?raw";
import arrowIcon from "../../assets/icons/arrow-right.svg";
import "./chats.css";

const chatsTemplate = Handlebars.compile(chatsTemplateSource);

const chatData = [
  { name: "Андрей", text: "Изображение", time: "12:49", count: "2" },
  { name: "Киноклуб", text: "Вы: стикер", time: "12:00", count: "" },
  {
    name: "Илья",
    text: "Друзья, у меня для вас особенный выпуск новостей!...",
    time: "15:12",
    count: "4",
  },
];

export function renderChatsForm() {
  const html = chatsTemplate({ chats: chatData, arrowIcon });
  document.getElementById("app").innerHTML = html;

  const renderProfileInfoBtn = document.querySelector("#renderProfileInfoBtn");
  renderProfileInfoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../profile/profile-info/profile-info.js").then(
      ({ renderProfileInfoForm }) => {
        renderProfileInfoForm();
      }
    );
  });
}
