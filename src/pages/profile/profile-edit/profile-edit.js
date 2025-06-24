import Handlebars from "handlebars";
import profileEditTemplateSource from "./profile-edit.hbs?raw";
import avatarImg from "../../../assets/icons/avatar-img.svg";
import backBtn from "../../../assets/icons/back-btn.svg";
import "./profile-edit.css";
import { renderLink } from "../../../components/btn/index.js";

const profileEditTemplate = Handlebars.compile(profileEditTemplateSource);

const profileFields = [
  {
    label: "Почта",
    type: "text",
    name: "email",
    autocomplete: "email",
    value: "pochta@yandex.ru",
  },
  {
    label: "Логин",
    type: "text",
    name: "login",
    autocomplete: "login",
    value: "ivanivanov",
  },
  {
    label: "Имя",
    type: "text",
    name: "first_name",
    autocomplete: "first_name",
    value: "Иван",
  },
  {
    label: "Фамилия",
    type: "text",
    name: "second_name",
    autocomplete: "second_name",
    value: "Иванов",
  },
  {
    label: "Имя в чате",
    type: "text",
    name: "display_name",
    autocomplete: "display_name",
    value: "Иван",
  },
  {
    label: "Телефон",
    type: "text",
    name: "phone",
    autocomplete: "phone",
    value: "+7 (909) 967 30 30",
  },
];

export function renderProfileEditForm() {
  document.getElementById("app").innerHTML = profileEditTemplate({
    profileFields,
    avatarImg,
    backBtn,
  });

  const linksContainer = document.querySelector(
    ".profile-edit-links-container"
  );
  if (linksContainer) {
    const link = renderLink({
      href: "#",
      id: "save",
      className: "btn",
      child: "Сохранить",
    });
    linksContainer.innerHTML = "";
    linksContainer.appendChild(link);
  }

  const renderBackBtn = document.querySelector(".profile-edit-goback-block");
  renderBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../profile-info/profile-info.js").then(
      ({ renderProfileInfoForm }) => {
        renderProfileInfoForm();
      }
    );
  });
}
