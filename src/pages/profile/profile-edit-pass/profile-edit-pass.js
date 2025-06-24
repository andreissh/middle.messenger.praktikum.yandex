import Handlebars from "handlebars";
import profileEditPassTemplateSource from "./profile-edit-pass.hbs?raw";
import avatarImg from "../../../assets/icons/avatar-img.svg";
import backBtn from "../../../assets/icons/back-btn.svg";
import "./profile-edit-pass.css";
import { renderLink } from "../../../components/btn/index.js";

const profileEditPassTemplate = Handlebars.compile(
  profileEditPassTemplateSource
);

const passwordFields = [
  {
    id: "oldPassword",
    label: "Старый пароль",
    type: "password",
    name: "oldPassword",
  },
  {
    id: "newPassword",
    label: "Новый пароль",
    type: "password",
    name: "newPassword",
  },
  {
    id: "repeatPassword",
    label: "Повторите пароль",
    type: "password",
    name: "newPassword",
  },
];

export function renderProfileEditPassForm() {
  document.getElementById("app").innerHTML = profileEditPassTemplate({
    passwordFields,
    avatarImg,
    backBtn,
  });

  const linksContainer = document.querySelector(
    ".profile-edit-pass-links-container"
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

  const renderBackBtn = document.querySelector(
    ".profile-edit-pass-goback-block"
  );
  renderBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../profile-info/profile-info.js").then(
      ({ renderProfileInfoForm }) => {
        renderProfileInfoForm();
      }
    );
  });
}
