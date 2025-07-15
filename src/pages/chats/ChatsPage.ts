import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import { router } from "@/routes/Router";
import arrowIcon from "@/assets/icons/arrow-right.svg";
import sendBtn from "@/assets/icons/back-btn.svg";
import closeBtn from "@/assets/icons/close.png";
import ChatList from "./components/chat-list/ChatList";
import "./chats.css";

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
        {{{ ProfileBtn }}}
        <input
          type="search"
          name="search"
          class="chats-aside-search"
          placeholder="Поиск"
        />
      </div>
      {{{ ChatList }}}
	   <div class="create-chat-btn-wrapper">
	  	{{{ CreateChatBtn }}}
	   </div>
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
	<div class="create-chat-modal-wrapper" style="display: none;">
		<div class="create-chat-modal">
			<button class="modal-close-btn">
				<img src=${closeBtn} alt="close" />
			</button>
			<h2 class="create-chat-title">Создайте чат</h2>
			<label class="create-chat-label">
				<span>Название:</span>
				<input type="text" id="createChatInput" class="create-chat-input" />
			</label>
		</div>
	</div>
  </div>
`;

export default class ChatsPage extends Block {
	constructor() {
		super("div", {
			ProfileBtn: new Button({
				id: "renderProfileInfoBtn",
				class: "chats-aside-to-profile-btn",
				children: `
					<span class="chats-aside-to-profile-btn-text">Профиль</span>
					<img src="${arrowIcon}" alt="" />
				`,
				events: {
					click: (e?: Event) => this.handleProfileClick(e),
				},
			}),
			arrowIcon,
			ChatList: new ChatList({
				chats,
			}),
			CreateChatBtn: new Button({
				id: "createChatBtn",
				class: "create-chat-btn",
				events: {
					click: (e?: Event) => this.handleCreateChatClick(e),
				},
			}),
		});
	}

	private handleProfileClick(e?: Event): void {
		e?.preventDefault();
		router.go("/settings");
	}

	private handleCreateChatClick(e?: Event): void {
		e?.preventDefault();
		const modalWrapper = document.querySelector(".create-chat-modal-wrapper");
		modalWrapper.style.display = "block";

		const closeBtn = modalWrapper.querySelector(".modal-close-btn");
		closeBtn.addEventListener("click", () => {
			modalWrapper.style.display = "none";
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
