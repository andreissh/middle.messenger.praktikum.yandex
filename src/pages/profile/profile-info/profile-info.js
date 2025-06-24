import Handlebars from "handlebars";
import profileInfoTemplateSource from "./profile-info.hbs?raw";
import avatarImg from "../../../assets/icons/avatar-img.svg";
import backBtn from "../../../assets/icons/back-btn.svg";
import "./profile-info.css";
import { renderLink } from "../../../components/btn/index.js";

const profileInfoTemplate = Handlebars.compile(profileInfoTemplateSource);

const profileFields = [
  {
    id: "email",
    label: "Почта",
    type: "text",
    name: "email",
    value: "pochta@yandex.ru",
    readonly: "true",
  },
  {
    id: "login",
    label: "Логин",
    type: "text",
    name: "login",
    value: "ivanivanov",
    readonly: "true",
  },
  {
    id: "first_name",
    label: "Имя",
    type: "text",
    name: "first_name",
    value: "Иван",
    readonly: "true",
  },
  {
    id: "second_name",
    label: "Фамилия",
    type: "text",
    name: "second_name",
    value: "Иванов",
    readonly: "true",
  },
  {
    id: "display_name",
    label: "Имя в чате",
    type: "text",
    name: "display_name",
    value: "Иван",
    readonly: "true",
  },
  {
    id: "phone",
    label: "Телефон",
    type: "text",
    name: "phone",
    value: "+7 (909) 967 30 30",
    readonly: "true",
  },
];

const profileLinks = [
  {
    id: "renderProfileEditBtn",
    text: "Изменить данные",
    className: "profile-info-links-item-link",
  },
  {
    id: "renderProfileEditPassBtn",
    text: "Изменить пароль",
    className: "profile-info-links-item-link",
  },
  {
    id: "renderSigninBtn",
    text: "Выйти",
    className:
      "profile-info-links-item-link profile-info-links-item-link--danger",
  },
];

export function renderProfileInfoForm() {
  document.getElementById("app").innerHTML = profileInfoTemplate({
    profileFields,
    avatarImg,
    backBtn,
  });

  const linksList = document.querySelector(".profile-info-links-list");
  profileLinks.forEach(({ id, text, className }) => {
    const linksItem = document.createElement("li");
    linksItem.className = "profile-info-links-item";
    const link = renderLink({
      href: "#",
      id,
      className,
      child: text,
    });
    linksItem.appendChild(link);
    linksList.appendChild(linksItem);
  });

  const renderBackBtn = document.querySelector(".profile-info-goback-block");
  renderBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../../chats/chats.js").then(({ renderChatsForm }) => {
      renderChatsForm();
    });
  });

  const renderProfileEditBtn = document.querySelector("#renderProfileEditBtn");
  renderProfileEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../profile-edit/profile-edit.js").then(
      ({ renderProfileEditForm }) => {
        renderProfileEditForm();
      }
    );
  });

  const renderProfileEditPassBtn = document.querySelector(
    "#renderProfileEditPassBtn"
  );
  renderProfileEditPassBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../profile-edit-pass/profile-edit-pass.js").then(
      ({ renderProfileEditPassForm }) => {
        renderProfileEditPassForm();
      }
    );
  });

  const renderSigninBtn = document.querySelector("#renderSigninBtn");
  renderSigninBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../../home/signin/signin.js").then(({ renderSigninForm }) => {
      renderSigninForm();
    });
  });
}
