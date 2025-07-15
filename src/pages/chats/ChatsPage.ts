import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import { router } from "@/routes/Router";
import arrowIcon from "@/assets/icons/arrow-right.svg";
import sendBtn from "@/assets/icons/back-btn.svg";
import ChatList from "./components/chat-list/ChatList";
import "./chats.css";
import http from "@/api/http";

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
	{{{ CreateChatModal }}}
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
			CreateChatModal: new Modal({
				id: "createChatModal",
				title: "Создайте чат",
				children: `
					<form>
						<label class="create-chat-label">
							<span class="create-chat-label-text">Название:</span>
							<input type="text" id="createChatInput" class="create-chat-input" />
						</label>
						<button type="submit" class="btn create-chat-submit-btn">Создать</button>
					</form>
				`,
			}),
		});
	}

	private handleProfileClick(e?: Event): void {
		e?.preventDefault();
		router.go("/settings");
	}

	private handleCreateChatClick(e?: Event): void {
		e?.preventDefault();
		const modal: HTMLElement | null =
			document.querySelector("#createChatModal");
		if (!modal) return;
		modal.style.display = "block";

		const input: HTMLInputElement | null =
			document.querySelector("#createChatInput");
		const submitBtn = document.querySelector(".create-chat-submit-btn");

		submitBtn?.addEventListener("click", async () => {
			if (!input || !input.value) return;

			try {
				const chat = await http.post("/chats", {
					body: {
						title: input.value,
					},
				});
				modal.style.display = "none";
				console.log(chat);
			} catch (err) {
				console.log(err);
			}
		});
	}

	componentDidMount() {
		const getChats = async () => {
			try {
				const chats = await http.get("/chats");
				console.log(chats);
			} catch (err) {
				console.log(err);
			}
		};
		getChats();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
