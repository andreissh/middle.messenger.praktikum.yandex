import { compile } from "handlebars";
import userDataTemplateSource from "./user-change-data.handlebars?raw";
import "./user-change-data.css";

const userDataTemplate = compile(userDataTemplateSource);

export function renderUserDataForm() {
  const html = userDataTemplate();
  document.getElementById("app").innerHTML = html;

  const renderBackBtn = document.querySelector('.user-data-goback-btn')
  renderBackBtn.addEventListener('click', (e) => {
    e.preventDefault()
    import('../../chats/chats.js').then(({renderChatsForm}) => {
        renderChatsForm()
    })
  })
}
