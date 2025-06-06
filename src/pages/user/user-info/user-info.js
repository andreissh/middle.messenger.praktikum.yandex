import { compile } from "handlebars";
import userInfoTemplateSource from "./user-info.hbs?raw";
import "./user-info.css";

const userInfoTemplate = compile(userInfoTemplateSource);

export function renderUserInfoForm() {
  const html = userInfoTemplate();
  document.getElementById("app").innerHTML = html;

  const renderBackBtn = document.querySelector(".user-info-goback-btn");
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
      ({ renderUserDataForm }) => {
        renderUserDataForm();
      }
    );
  });

  const renderChangePassBtn = document.querySelector("#renderChangePassBtn");
  renderChangePassBtn.addEventListener("click", (e) => {
    e.preventDefault();
    import("../user-change-password/user-change-password.js").then(
      ({ renderUserPassForm }) => {
        renderUserPassForm();
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
