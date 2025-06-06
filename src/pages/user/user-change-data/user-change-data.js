import { compile } from "handlebars";
import userChangeDataTemplateSource from "./user-change-data.hbs?raw";
import avatarImg from "../../../assets/icons/avatar-img.svg";
import backBtn from "../../../assets/icons/back-btn.svg";
import "../../../partials/btn/btn.js";
import "../../../partials/user-label-input/user-label-input.js";
import "./user-change-data.css";

const userChangeDataTemplate = compile(userChangeDataTemplateSource);

export function renderUserChangeDataForm() {
  const html = userChangeDataTemplate({ avatarImg, backBtn });
  document.getElementById("app").innerHTML = html;

  const renderBackBtn = document.querySelector(
    ".user-change-data-goback-block"
  );
  renderBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../user-info/user-info.js").then(({ renderUserInfoForm }) => {
      renderUserInfoForm();
    });
  });
}
