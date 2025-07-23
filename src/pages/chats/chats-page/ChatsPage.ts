import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import router from "@/routes/Router";
import arrowIcon from "@/assets/icons/arrow-right.svg";
import plusIcon from "@/assets/icons/plus.svg";
import formatChatDate from "@/utils/formatChatDate";
import http from "@/api/HttpClient";
import { UserChats, UserData } from "@/types/types";
import { IRouteManager } from "@/interfaces/IRouteManager";
import ChatsList from "./components/chats-list/ChatsList";
import ChatPage from "../chat-page/ChatPage";
import "./chats-page.css";
import Form from "@/components/form/Form";

type UserChatListData = {
	id: number;
	name: string;
	text: string;
	time: string;
	count: number;
};

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
					{{{ CreateChatForm }}}
				`,
				CreateChatForm: new Form({
					class: "create-chat-form",
					children: `
						<label class="create-chat-label">
							<input type="text" id="createChatInput" class="create-chat-input" placeholder="Введите название" />
						</label>
						<button type="submit" class="btn create-chat-submit-btn">Создать</button>
					`,
				}),
			}),
		});
	}

	private static routeManager?: IRouteManager;

	static setRouteManager(manager: IRouteManager) {
		this.routeManager = manager;
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
	}

	getChats = async () => {
		try {
			const newChats: UserChatListData[] = [];
			const userChats = await http.get<UserChats[]>("/chats");
			const chatId = Number(window.location.pathname.split("/").pop());
			let title;

			userChats.forEach((chat) => {
				newChats.push({
					id: chat.id,
					name: chat.title,
					text: chat.last_message?.content ?? "",
					time: chat.last_message
						? formatChatDate(chat.last_message?.time) ?? ""
						: "",
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
			throw new Error("Ошибка при получении списка чатов", { cause: err });
		}
	};

	componentDidMount() {
		const getUserData = async () => {
			try {
				const userData = await http.get<UserData>("/auth/user");
				localStorage.setItem("userId", String(userData.id));
			} catch (err) {
				localStorage.setItem("isSignedIn", "false");
				localStorage.removeItem("userId");
				ChatsPage.routeManager?.updateRoutes();
				router.go("/");
				throw new Error("Ошибка при загрузке данных пользователя", {
					cause: err,
				});
			}
		};
		getUserData();

		this.getChats();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
