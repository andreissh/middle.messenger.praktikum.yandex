import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import arrowIcon from "@/assets/icons/arrow-right.svg";
import sendBtn from "@/assets/icons/back-btn.svg";
import ChatList from "./components/chat-list/ChatList";
import "./chats.css";
import { router } from "@/routes/Router";

type ChatConfig = {
	name: string;
	text: string;
	time: string;
	count: string;
};

const chats: ChatConfig[] = [
	{
		name: "Андрей",
		text: "Изображение",
		time: "12:49",
		count: "2",
	},
	{
		name: "Киноклуб",
		text: "Вы: стикер",
		time: "12:00",
		count: "",
	},
	{
		name: "Илья",
		text: "Друзья, у меня для вас особенный выпуск новостей!...",
		time: "15:12",
		count: "4",
	},
];

const template = `
  <div class="chats-container">
    <aside class="chats-aside">
      <div class="chats-aside-top-section">
        {{{ ProfileLink }}}
        <input
          type="search"
          name="search"
          class="chats-aside-search"
          placeholder="Поиск"
        />
      </div>
      {{{ ChatList }}}
    </aside>
    <main class="chats-main">
		<div class="chats-main-content">
			<div class="chats-main-content-header"></div>
			<div class="chats-main-content-body">
				<span class="chats-main-content-text-default">Выберите чат, чтобы
					отправить сообщение</span>
			</div>
			<div class="chats-main-content-footer">
				<input
					type="text"
					name="message"
					class="message"
					placeholder="Сообщение"
				/>
				<button class="message-send-btn" >
					<img src=${sendBtn} alt="send" />
				</button>
			</div>
		</div>
    </main>
  </div>
`;

export default class ChatsPage extends Block {
	constructor() {
		super("div", {
			ProfileLink: new Link({
				href: "#",
				id: "renderProfileInfoBtn",
				class: "chats-aside-to-profile-btn",
				children: `
					<span class="chats-aside-to-profile-btn-text">Профиль</span>
					<img src="${arrowIcon}" alt="" />
				`,
				events: {
					click: () => router.go("/profile"),
				},
			}) as Link,
			arrowIcon,
			ChatList: new ChatList({
				chats,
			}) as ChatList,
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
