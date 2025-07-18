import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import router from "@/routes/Router";
import http from "@/api/http";
import arrowIcon from "@/assets/icons/arrow-right.svg";
import plusIcon from "@/assets/icons/plus.svg";
import formatChatDate from "@/utils/formatChatDate";
import ChatsList from "./components/chats-list/ChatsList";
import ChatPage from "../chat-page/ChatPage";
import "./chats-page.css";

const template = `
  <div class="chats-container">
    <aside class="chats-aside">
      <div class="chats-aside-top-section">
		<div class="chats-profile-btn-wrapper">
			{{{ ProfileBtn }}}
		 </div>
        <input
          type="search"
          name="search"
          class="chats-aside-search"
          placeholder="Поиск"
        />
      </div>
      {{{ ChatsList }}}
	   <div class="create-chat-btn-wrapper">
	  	{{{ CreateChatBtn }}}
	   </div>
    </aside>
    <main class="chats-main">
		{{{ ChatPage }}}
    </main>
	{{{ CreateChatModal }}}
  </div>
`;

export default class ChatsPage extends Block {
	constructor() {
		const chatId = Number(window.location.pathname.split("/").pop());

		super("div", {
			ProfileBtn: new Button({
				id: "renderProfileInfoBtn",
				class: "chats-aside-to-profile-btn",
				children: `
					<span class="chats-aside-to-profile-btn-text">Профиль</span>
					<img src="${arrowIcon}" alt="" />
				`,
				events: {
					click: (e?: Event) => ChatsPage.handleProfileClick(e),
				},
			}),
			arrowIcon,
			ChatsList: new ChatsList({
				chats: [],
				onRefresh: null,
			}),
			CreateChatBtn: new Button({
				id: "createChatBtn",
				class: "create-chat-btn",
				children: `
					<img src=${plusIcon} alt="add chat" />
				`,
				events: {
					click: (e?: Event) => this.handleCreateChatClick(e),
				},
			}),
			ChatPage: new ChatPage({ chatId, title: "Название чата" }),
			CreateChatModal: new Modal({
				id: "createChatModal",
				title: "Создайте чат",
				children: `
					<form>
						<label class="create-chat-label">
							<input type="text" id="createChatInput" class="create-chat-input" placeholder="Введите название" />
						</label>
						<button type="submit" class="btn create-chat-submit-btn">Создать</button>
					</form>
				`,
			}),
			test: true,
		});
	}

	private static handleProfileClick(e?: Event): void {
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
				await http.post("/chats", {
					body: {
						title: input.value,
					},
				});
				modal.style.display = "none";
				this.getChats();
			} catch (err) {
				console.log(err);
			}
		});
	}

	getChats = async () => {
		try {
			const newChats = [];
			const userChats = await http.get("/chats");
			const chatId = Number(window.location.pathname.split("/").pop());
			let title;

			userChats.forEach((chat) => {
				newChats.push({
					id: chat.id,
					name: chat.title,
					text: chat?.last_message?.content ?? "",
					time: formatChatDate(chat?.last_message?.time) ?? "",
					count: chat.unread_count,
				});

				if (chat.id === chatId) {
					title = chat.title;
				}
			});

			const props = {
				ChatsList: new ChatsList({
					chats: newChats,
					onRefresh: () => this.getChats(),
				}),
				ChatPage: new ChatPage({
					chatId,
					title,
				}),
			};

			this.setProps(props);
			props.ChatPage.dispatchComponentDidMount();
		} catch (err) {
			console.log(err);
		}
	};

	componentDidMount() {
		this.getChats();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
