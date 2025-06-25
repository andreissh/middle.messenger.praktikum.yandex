import Block from "../../../../framework/Block";
import ChatItem from "../chat-item/ChatItem";
import "./chat-list.css";

const template = `
  <ul class="chat-list">
    {{{ chats }}}
  </ul>
`;

export default class ChatList extends Block {
  constructor(props) {
    super("ul", {
      ...props,
      chats: props.chats.map((chat) => new ChatItem(chat)),
    });
  }
  render() {
    return this.compile(template);
  }
}
