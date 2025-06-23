import Handlebars from "handlebars";
import profileEditPassTemplateSource from "./profile-edit-pass.hbs?raw";
import avatarImg from "../../../assets/icons/avatar-img.svg";
import backBtn from "../../../assets/icons/back-btn.svg";
import "./profile-edit-pass.css";

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
  const html = profileEditPassTemplate({ passwordFields, avatarImg, backBtn });
  document.getElementById("app").innerHTML = html;

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
