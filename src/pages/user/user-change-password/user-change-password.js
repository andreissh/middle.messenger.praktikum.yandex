import { compile } from "handlebars";
import userChangePassTemplateSource from "./user-change-password.hbs?raw";
import avatarImg from "../../../assets/icons/avatar-img.svg";
import backBtn from "../../../assets/icons/back-btn.svg";
import "../../../partials/btn/btn.js";
import "../../../partials/user-label-input/user-label-input.js";
import "./user-change-password.css";

const userChangePassTemplate = compile(userChangePassTemplateSource);

export function renderUserChangePassForm() {
  const html = userChangePassTemplate({ avatarImg, backBtn });
  document.getElementById("app").innerHTML = html;

  const renderBackBtn = document.querySelector(
    ".user-change-pass-goback-block"
  );
  renderBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../user-info/user-info.js").then(({ renderUserInfoForm }) => {
      renderUserInfoForm();
    });
  });
}
