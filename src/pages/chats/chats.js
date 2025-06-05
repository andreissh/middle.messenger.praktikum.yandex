import { compile } from "handlebars";
import chatsTemplateSource from "./chats.handlebars?raw";
import "./chats.css";

const chatsTemplate = compile(chatsTemplateSource);

export function renderChatsForm() {
  const html = chatsTemplate();
  document.getElementById("app").innerHTML = html;

  const renderUserInfoBtn = document.querySelector('#renderUserInfoBtn')
  renderUserInfoBtn.addEventListener('click', (e) => {
    e.preventDefault()
    import('../user/user-info/user-info.js').then(({ renderUserInfoForm}) => {
      renderUserInfoForm()
    }) 
  })
}
