import Handlebars from "handlebars";
import profileFieldsListTemplate from "./profile-fields-list.hbs?raw";
import "./profile-fields-list.css";
import "../profile-field/profile-field.js";

Handlebars.registerPartial("profile-fields-list", profileFieldsListTemplate);
