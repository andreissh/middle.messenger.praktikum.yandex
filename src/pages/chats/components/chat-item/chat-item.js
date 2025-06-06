import Handlebars from "handlebars";
import chatItemTemplate from "./chat-item.hbs?raw";
import "./chat-item.css";

Handlebars.registerPartial("chat-item", chatItemTemplate);
