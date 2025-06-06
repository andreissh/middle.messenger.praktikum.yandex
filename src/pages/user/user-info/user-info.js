import { compile } from "handlebars";
import userInfoTemplateSource from "./user-info.hbs?raw";
import avatarImg from "../../../assets/icons/avatar-img.svg";
import backBtn from "../../../assets/icons/back-btn.svg";
import "../../../partials/user-label-input/user-label-input.js";
import "./user-info.css";

const userInfoTemplate = compile(userInfoTemplateSource);

export function renderUserInfoForm() {
  const html = userInfoTemplate({ avatarImg, backBtn });
  document.getElementById("app").innerHTML = html;

  const renderBackBtn = document.querySelector(".user-info-goback-block");
  renderBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../../chats/chats.js").then(({ renderChatsForm }) => {
      renderChatsForm();
    });
  });

  const renderChangeDataBtn = document.querySelector("#renderChangeDataBtn");
  renderChangeDataBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../user-change-data/user-change-data.js").then(
      ({ renderUserChangeDataForm }) => {
        renderUserChangeDataForm();
      }
    );
  });

  const renderChangePassBtn = document.querySelector("#renderChangePassBtn");
  renderChangePassBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../user-change-password/user-change-password.js").then(
      ({ renderUserChangePassForm }) => {
        renderUserChangePassForm();
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
