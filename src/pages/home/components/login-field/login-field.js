import Handlebars from "handlebars";
import loginFieldTemplate from "./login-field.hbs?raw";
import "./login-field.css";

Handlebars.registerPartial("login-field", loginFieldTemplate);
