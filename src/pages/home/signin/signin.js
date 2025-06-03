import { compile } from "handlebars";
import signinTemplateSource from "./signin.handlebars?raw";
import "./signin.css";

const signinTemplate = compile(signinTemplateSource);

export function renderSigninForm() {
  const html = signinTemplate();
  document.getElementById("app").innerHTML = html;
}
