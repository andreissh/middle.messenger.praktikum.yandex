import Handlebars from "handlebars";
import labelInputTemplate from "./label-input.hbs?raw";
import "./label-input.css";

Handlebars.registerPartial("label-input", labelInputTemplate);
