import Handlebars from "handlebars";
import profileFieldTemplate from "./profile-field.hbs?raw";
import "./profile-field.css";

Handlebars.registerPartial("profile-field", profileFieldTemplate);
