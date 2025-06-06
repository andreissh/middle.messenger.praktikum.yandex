import Handlebars from "handlebars";
import chatListTemplate from "./chat-list.hbs?raw";
import "../chat-item/chat-item.js";
import "./chat-list.css";

Handlebars.registerPartial("chat-list", chatListTemplate);
