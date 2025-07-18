import Block from "@/framework/Block";
import { ChatsItemProps } from "../chats-item/ChatsItem";
import ChatsItem from "../chats-item/ChatsItem";
import "./chats-list.css";

type ChatsListProps = {
	chats: ChatsItemProps[];
};

const template = `
  <ul class="chat-list">
	{{#if hasChats}}
		{{{ chats }}}
	{{ else }} 
		<p>Список чатов пуст</p>
	{{/if}}
  </ul>
`;

export default class ChatsList extends Block {
	constructor(props: ChatsListProps) {
		super("div", {
			hasChats: props.chats.length > 0,
			chats: props.chats.map(
				(chat) => new ChatsItem({ ...chat, onRefresh: props.onRefresh })
			),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
