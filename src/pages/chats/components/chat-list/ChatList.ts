import Block from "@/framework/Block";
import "./chat-list.css";
import ChatItem, { ChatItemProps } from "../chat-item/ChatItem";

type ChatListProps = {
	chats: ChatItemProps[];
};

const template = `
  <ul class="chat-list">
    {{{ chats }}}
  </ul>
`;

export default class ChatList extends Block {
	constructor(props: ChatListProps) {
		super("div", {
			chats: props.chats.map((chat) => new ChatItem(chat)),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
