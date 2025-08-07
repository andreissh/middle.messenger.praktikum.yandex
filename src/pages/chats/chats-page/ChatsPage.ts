import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import router from "@/routes/Router";
import arrowIcon from "@/assets/icons/arrow-right.svg";
import plusIcon from "@/assets/icons/plus-btn.svg";
import formatChatDate from "@/utils/formatChatDate";
import Form from "@/components/form/Form";
import ChatsService from "@/services/ChatsService";
import UserService from "@/services/UserService";
import Input from "@/components/input/Input";
import ChatsList from "./components/chats-list/ChatsList";
import ChatPage from "../chat-page/ChatPage";
import "./chats-page.css";

type UserChatListData = {
	attributes: {
		id: string;
	};
	name: string;
	text: string;
	time: string;
	count: number;
	avatar: string;
};

const template = `
	<div class="chats-container">
		<aside class="chats-aside">
			<div class="chats-aside-top-section">
				<div class="chats-profile-btn-wrapper">
					{{{ ProfileBtn }}}
				</div>
				{{{ SearchInput }}}
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
		{{{ DeleteChatModal }}}
		{{{ AddUserModal }}}
		{{{ RemoveUserModal }}}
		{{{ ChatUsersModal }}}
	</div>
`;

export default class ChatsPage extends Block {
	constructor() {
		super("div", {
			ProfileBtn: new Button({
				attributes: {
					id: "renderProfileInfoBtn",
					class: "chats-aside-to-profile-btn",
				},
				children: `
					<span class="chats-aside-to-profile-btn-text">Профиль</span>
					<img src="${arrowIcon}" alt="profile" />
				`,
				events: {
					click: () => ChatsPage.handleProfileClick(),
				},
			}),
			SearchInput: new Input({
				attributes: {
					id: "search",
					class: "chats-aside-search",
					type: "search",
					name: "search",
					placeholder: "Поиск",
					autocomplete: "search",
				},
			}),
			ChatsList: new ChatsList({
				chats: [],
			}),
			CreateChatBtn: new Button({
				attributes: {
					id: "createChatBtn",
					class: "create-chat-btn",
				},
				children: `
					<img src=${plusIcon} alt="add chat" />
				`,
				events: {
					click: () => ChatsPage.handleCreateChatClick(),
				},
			}),
			ChatPage: new ChatPage({
				chatUsers: [],
			}),
			CreateChatModal: new Modal({
				attributes: {
					id: "createChatModal",
				},
				title: "Создайте чат",
				children: `
					{{{ CreateChatForm }}}
				`,
				CreateChatForm: new Form({
					attributes: {
						class: "create-chat-form",
					},
					children: `
						<label class="create-chat-label">
							Введите название
							{{{ CreateChatInput }}}
						</label>
						{{{ CreateChatBtn }}}
					`,
					CreateChatInput: new Input({
						attributes: {
							id: "createChatInput",
							class: "create-chat-input",
							type: "text",
							name: "createChatInput",
							autocomplete: "createChatInput",
						},
					}),
					CreateChatBtn: new Button({
						attributes: {
							class: "btn create-chat-submit-btn",
							type: "submit",
						},
						children: "Создать",
					}),
					events: {
						submit: (e?: Event) => this.handleCreateChatSubmit(e),
					},
				}),
			}),
			DeleteChatModal: new Modal({
				attributes: {
					id: "deleteChatModal",
				},
				title: "Удаление чата",
				children: `
					<div class="delete-chat-modal-btns">
						<span>Вы действительно хотите удалить выбранный чат?</span>
						{{{ DeleteChatConfirmBtn }}}
						{{{ DeleteChatCancelBtn }}}
					</div>
				`,
				DeleteChatCancelBtn: new Button({
					attributes: {
						id: "deleteChatCancelBtn",
						class: "btn-secondary",
					},
					children: "Нет",
					events: {
						click: () => ChatsPage.handleDeleteChatCancelClick(),
					},
				}),
				DeleteChatConfirmBtn: new Button({
					attributes: {
						id: "deleteChatConfirmBtn",
						class: "btn",
					},
					children: "Да",
					events: {
						click: () => this.handleDeleteChatConfirmClick(),
					},
				}),
			}),
			AddUserModal: new Modal({
				attributes: {
					id: "addUserModal",
				},
				title: "Добавьте пользователя",
				children: `
					{{{ AddUserForm }}}
					<div class="chat-users-list-container">
						<span class="chat-users-list-title">Список участников:</span>
						<ul class="chat-users-list"></ul>
					</div>
				`,
				AddUserForm: new Form({
					attributes: {
						class: "add-user-form",
					},
					children: `
						<label class="add-user-label">
							Логин
							{{{ AddUserInput }}}
						</label>
						{{{ AddUserBtn }}}
					`,
					AddUserBtn: new Button({
						attributes: {
							class: "btn add-user-submit-btn",
							type: "submit",
						},
						children: "Добавить",
					}),
					AddUserInput: new Input({
						attributes: {
							id: "addUserInput",
							class: "add-user-input",
							type: "text",
							name: "addUserInput",
							autocomplete: "addUserInput",
						},
					}),
					events: {
						submit: (e?: Event) => this.handleAddUserSubmit(e),
					},
				}),
			}),
			RemoveUserModal: new Modal({
				attributes: {
					id: "removeUserModal",
				},
				title: "Удалите пользователя",
				children: `
					{{{ RemoveUserForm }}}
					<div class="chat-users-list-container">
						<span class="chat-users-list-title">Список участников:</span>
						<ul class="chat-users-list"></ul>
					</div>
				`,
				RemoveUserForm: new Form({
					attributes: {
						class: "remove-user-form",
					},
					children: `
						<label class="remove-user-label">
							Логин
							{{{ RemoveUserInput }}}
						</label>
						{{{ RemoveUserBtn }}}
					`,
					RemoveUserBtn: new Button({
						attributes: {
							class: "btn remove-user-submit-btn",
							type: "submit",
						},
						children: "Удалить",
					}),
					RemoveUserInput: new Input({
						attributes: {
							id: "removeUserInput",
							class: "remove-user-input",
							type: "text",
							name: "removeUserInput",
							autocomplete: "removeUserInput",
						},
					}),
					events: {
						submit: (e?: Event) => this.handleRemoveUserSubmit(e),
					},
				}),
			}),
			ChatUsersModal: new Modal({
				attributes: {
					id: "chatUsersModal",
				},
				title: "Участники чата",
				children: `
					<div class="chat-users-list-container">
						<span class="chat-users-list-title">Список участников:</span>
						<ul class="chat-users-list"></ul>
					</div>
				`,
			}),
		});
	}

	private static handleProfileClick(): void {
		router.go("/settings");
	}

	private static handleCreateChatClick(): void {
		const modal = document.querySelector<HTMLElement>("#createChatModal");
		if (!modal) return;
		modal.style.display = "block";
	}

	private static handleDeleteChatCancelClick(): void {
		const modal = document.querySelector<HTMLElement>("#deleteChatModal");
		if (!modal) return;
		modal.style.display = "none";
		sessionStorage.removeItem("chatId");
	}

	private async handleDeleteChatConfirmClick(): Promise<void> {
		const chatId = sessionStorage.getItem("chatId");
		const chatIdFromRoute = window.location.pathname.split("/").pop();
		const modal = document.querySelector<HTMLElement>("#deleteChatModal");
		if (!modal) return;
		await ChatsService.deleteChat(Number(chatId));
		modal.style.display = "none";
		sessionStorage.removeItem("chatId");
		if (chatId === chatIdFromRoute) {
			router.go("/messenger");
		}
		this.getChats();
	}

	private async handleCreateChatSubmit(e?: Event): Promise<void> {
		e?.preventDefault();

		const modal = document.querySelector<HTMLElement>("#createChatModal");
		const input = document.querySelector<HTMLInputElement>("#createChatInput");
		if (!modal || !input) return;

		await ChatsService.addChat(input.value);

		modal.style.display = "none";
		this.getChats();
	}

	private async handleAddUserSubmit(e?: Event): Promise<void> {
		e?.preventDefault();

		const modal = document.querySelector<HTMLElement>("#addUserModal");
		const input = document.querySelector<HTMLInputElement>("#addUserInput");
		const chatId = Number(window.location.pathname.split("/").pop());
		if (!modal || !input || !chatId) return;

		const userData = await UserService.search(input.value);
		await ChatsService.addUser([userData[0].id], chatId as number);
		modal.style.display = "none";
		this.getChats();
	}

	private async handleRemoveUserSubmit(e?: Event): Promise<void> {
		e?.preventDefault();

		const modal = document.querySelector<HTMLElement>("#removeUserModal");
		const input = document.querySelector<HTMLInputElement>("#removeUserInput");
		const chatId = Number(window.location.pathname.split("/").pop());
		if (!modal || !input || !chatId) return;

		const userData = await UserService.search(input.value);
		await ChatsService.removeUser([userData[0].id], chatId as number);
		modal.style.display = "none";
		this.getChats();
	}

	private async getChats() {
		const userChats = await ChatsService.getChats();
		const newChats: UserChatListData[] = [];
		const chatId = Number(window.location.pathname.split("/").pop());
		const chatUsers: string[] = [];
		if (chatId) {
			const users = await ChatsService.getChatUsers(chatId);
			users.forEach((user) => {
				chatUsers.push(user.login);
			});
		}
		let title;

		userChats.forEach((chat) => {
			newChats.push({
				attributes: {
					id: String(chat.id),
				},
				name: chat.title,
				text: chat.last_message?.content ?? "",
				time: chat.last_message
					? formatChatDate(chat.last_message?.time) ?? ""
					: "",
				count: chat.unread_count,
				avatar: chat.avatar,
			});

			if (chat.id === chatId) {
				title = chat.title;
			}
		});

		const props = {
			ChatsList: new ChatsList({
				chats: newChats,
				active: sessionStorage.getItem("chatId") || null,
			}),
			ChatPage: new ChatPage({
				chatId,
				title,
				chatUsers,
				events: {
					onRefresh: () => this.getChats(),
				},
			}),
		};

		this.setProps(props);
		props.ChatPage.dispatchComponentDidMount();
	}

	componentDidMount() {
		this.getChats();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
