import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import router from "@/routes/Router";
import arrowIcon from "@/assets/icons/arrow-right.svg";
import plusIcon from "@/assets/icons/plus.svg";
import formatChatDate from "@/utils/formatChatDate";
import Form from "@/components/form/Form";
import ChatsService from "@/services/ChatsService";
import UserService from "@/services/UserService";
import Input from "@/components/input/Input";
import ChatsList from "./components/chats-list/ChatsList";
import ChatPage from "../chat-page/ChatPage";
import "./chats-page.css";

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
				id: "renderProfileInfoBtn",
				class: "chats-aside-to-profile-btn",
				children: `
					<span class="chats-aside-to-profile-btn-text">Профиль</span>
					<img src="${arrowIcon}" alt="profile" />
				`,
				events: {
					click: () => ChatsPage.handleProfileClick(),
				},
			}),
			SearchInput: new Input({
				id: "search",
				class: "chats-aside-search",
				type: "search",
				name: "search",
				placeholder: "Поиск",
				autocomplete: "search",
			}),
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
					click: () => ChatsPage.handleCreateChatClick(),
				},
			}),
			ChatPage: new ChatPage({
				chatUsers: [],
			}),
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
							{{{ CreateChatInput }}}
						</label>
						{{{ CreateChatBtn }}}
					`,
					CreateChatBtn: new Button({
						class: "btn create-chat-submit-btn",
						type: "submit",
						children: "Создать",
					}),
					CreateChatInput: new Input({
						id: "createChatInput",
						class: "create-chat-input",
						type: "text",
						name: "createChatInput",
						placeholder: "Введите название",
						autocomplete: "createChatInput",
					}),
					events: {
						submit: (e?: Event) => this.handleCreateChatSubmit(e),
					},
				}),
			}),
			DeleteChatModal: new Modal({
				id: "deleteChatModal",
				title: "Удаление чата",
				children: `
					<div class="delete-chat-modal-btns">
						<span>Вы действительно хотите удалить выбранный чат?</span>
						{{{ DeleteChatConfirmBtn }}}
						{{{ DeleteChatCancelBtn }}}
					</div>
				`,
				DeleteChatCancelBtn: new Button({
					id: "deleteChatCancelBtn",
					class: "btn-secondary",
					children: "Нет",
					events: {
						click: () => ChatsPage.handleDeleteChatCancelClick(),
					},
				}),
				DeleteChatConfirmBtn: new Button({
					id: "deleteChatConfirmBtn",
					class: "btn",
					children: "Да",
					events: {
						click: () => this.handleDeleteChatConfirmClick(),
					},
				}),
			}),
			AddUserModal: new Modal({
				id: "addUserModal",
				title: "Добавьте пользователя",
				children: `
					{{{ AddUserForm }}}
				`,
				AddUserForm: new Form({
					class: "add-user-form",
					children: `
						<label class="add-user-label">
							{{{ AddUserInput }}}
						</label>
						{{{ AddUserBtn }}}
					`,
					AddUserBtn: new Button({
						class: "btn add-user-submit-btn",
						type: "submit",
						children: "Добавить",
					}),
					AddUserInput: new Input({
						id: "addUserInput",
						class: "add-user-input",
						type: "text",
						name: "addUserInput",
						placeholder: "Введите логин",
						autocomplete: "addUserInput",
					}),
					events: {
						submit: (e?: Event) => ChatsPage.handleAddUserSubmit(e),
					},
				}),
			}),
			RemoveUserModal: new Modal({
				id: "removeUserModal",
				title: "Удалите пользователя",
				children: `
					{{{ RemoveUserForm }}}
				`,
				RemoveUserForm: new Form({
					class: "remove-user-form",
					children: `
						<label class="remove-user-label">
							{{{ RemoveUserInput }}}
						</label>
						{{{ RemoveUserBtn }}}
					`,
					RemoveUserBtn: new Button({
						class: "btn remove-user-submit-btn",
						type: "submit",
						children: "Удалить",
					}),
					RemoveUserInput: new Input({
						id: "removeUserInput",
						class: "remove-user-input",
						type: "text",
						name: "removeUserInput",
						placeholder: "Введите логин",
						autocomplete: "removeUserInput",
					}),
					events: {
						submit: (e?: Event) => ChatsPage.handleRemoveUserSubmit(e),
					},
				}),
			}),
			ChatUsersModal: new Modal({
				id: "chatUsersModal",
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

	private static async handleAddUserSubmit(e?: Event): Promise<void> {
		e?.preventDefault();

		const modal = document.querySelector<HTMLElement>("#addUserModal");
		const input = document.querySelector<HTMLInputElement>("#addUserInput");
		const chatId = Number(window.location.pathname.split("/").pop());
		if (!modal || !input || !chatId) return;

		const userData = await UserService.search(input.value);
		await ChatsService.addUser([userData[0].id], chatId as number);
		modal.style.display = "none";
	}

	private static async handleRemoveUserSubmit(e?: Event): Promise<void> {
		e?.preventDefault();

		const modal = document.querySelector<HTMLElement>("#removeUserModal");
		const input = document.querySelector<HTMLInputElement>("#removeUserInput");
		const chatId = Number(window.location.pathname.split("/").pop());
		if (!modal || !input || !chatId) return;

		const userData = await UserService.search(input.value);
		await ChatsService.removeUser([userData[0].id], chatId as number);
		modal.style.display = "none";
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
				chatUsers,
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
