import Block from "@/framework/Block";
import ChatController from "@/api/ChatController";
import sendBtn from "@/assets/icons/arrow-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import arrowIcon from "@/assets/icons/arrow-right.svg";
import Button from "@/components/button/Button";
import Form from "@/components/form/Form";
import Input from "@/components/input/Input";
import Avatar from "@/components/avatar/Avatar";
import { resourcesUrl } from "@/utils/utils";
import ChatsService from "@/services/ChatsService";
import router from "@/routes/Router";
import { EventsType } from "@/types/types";
import handleImageUpload from "@/utils/imageUpload";
import "./chat-page.css";

type ChatPageProps = {
	chatUsers: string[];
	chatId?: number;
	title?: string;
	events?: EventsType;
};

const template = `
	<div class="chat-content">
		{{#if chatId}}
			<div class="chat-header">
				<div class="chat-header-info">
					{{{ BackBtn }}}
					{{{ AvatarBtn }}}
					<div class="chat-header-info-text-block">
						<h5 class="chat-title">{{ title }}</h5>
						{{{ ChatUsersBtn }}}
					</div>
				</div>
				<div class="chat-options">
					{{{ ChatOptionsBtn }}}
					<div id="chatDropdown" class="chat-dropdown">
						{{{ AddUserBtn }}}
						{{{ RemoveUserBtn }}}
					</div>
				</div>
			</div>
		{{/if}}
		<div class="chat-body">
			{{#if chatId}}
				<div class="chat-messages"></div>
			{{else}}
				<span class="chat-text-default">Выберите чат, чтобы
					отправить сообщение</span>
			{{/if}}
		</div>
		{{#if chatId}}
			<div class="chat-footer">
				{{{ SendMessageForm }}}
			</div>
		{{/if}}
	</div>
`;

export default class ChatPage extends Block {
	constructor(props: ChatPageProps) {
		super("div", {
			...props,
			BackBtn: new Button({
				attributes: {
					id: "backBtn",
					class: "chat-back-btn",
				},
				children: `<img src="${arrowIcon}" alt="backBtn" />`,
				events: {
					click: () => this.handleBackClick(),
				},
			}),
			AvatarBtn: new Button({
				attributes: {
					id: "avatarBtn",
				},
				children: "{{{ Avatar }}}",
				Avatar: new Avatar({
					attributes: {
						class: "chat-avatar",
					},
					children: `<img src=${avatarImg} alt="avatar" />`,
				}),
				events: {
					click: () => this.handleAvatarClick(),
				},
			}),
			ChatUsersBtn: new Button({
				attributes: {
					class: "chat-users-btn",
				},
				children: "<span>Участников: {{ chatUsersCount }}</span>",
				chatUsersCount: (props.chatUsers as string[]).length,
				events: {
					click: () => ChatPage.handleChatUsersClick(),
				},
			}),
			ChatOptionsBtn: new Button({
				attributes: {
					class: "chat-options-btn",
				},
				children: `
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 20" width="4" height="20" fill="none">
						<circle cx="2" cy="2" r="2" fill="#999"/>
						<circle cx="2" cy="10" r="2" fill="#999"/>
						<circle cx="2" cy="18" r="2" fill="#999"/>
					</svg>
				`,
				events: {
					click: (e?: Event) => ChatPage.handleChatOptionsClick(e),
				},
			}),
			AddUserBtn: new Button({
				attributes: {
					id: "addUserBtn",
					class: "chat-dropdown-item",
				},
				children: "Добавить пользователя",
				events: {
					click: () => ChatPage.handleAddUserClick(),
				},
			}),
			RemoveUserBtn: new Button({
				attributes: {
					id: "removeUserBtn",
					class: "chat-dropdown-item",
				},
				children: "Удалить пользователя",
				events: {
					click: () => ChatPage.handleRemoveUserClick(),
				},
			}),
			SendMessageForm: new Form({
				attributes: {
					class: "send-msg-form",
				},
				children: `
					{{{ SendMessageInput }}}
					{{{ SendMessageBtn }}}
				`,
				SendMessageBtn: new Button({
					attributes: {
						type: "submit",
						class: "chat-send-btn",
					},
					children: `
						<img src=${sendBtn} alt="send" />
					`,
				}),
				SendMessageInput: new Input({
					attributes: {
						id: "message",
						type: "text",
						name: "message",
						class: "message",
						placeholder: "Сообщение",
						autocomplete: "message",
					},
				}),
				events: {
					submit: (e?: Event) => ChatPage.handleSendMessageSubmit(e),
				},
			}),
		});
	}

	private handleBackClick(): void {
		router.go("/messenger");
	}

	private async handleAvatarClick(): Promise<void> {
		const file = await handleImageUpload();
		if (!file) return;

		const formData = new FormData();
		formData.append("chatId", String(this.props.chatId));
		formData.append("avatar", file);
		await ChatsService.changeAvatar(formData);

		if (this.props.events) {
			this.props.events.onRefresh();
		}
	}

	private static handleAddUserClick(): void {
		const modal = document.querySelector<HTMLElement>("#addUserModal");
		if (!modal) return;

		modal.style.display = "block";
	}

	private static handleRemoveUserClick(): void {
		const modal = document.querySelector<HTMLElement>("#removeUserModal");
		if (!modal) return;

		modal.style.display = "block";
	}

	private static handleSendMessageSubmit(e?: Event): void {
		e?.preventDefault();

		const input = document.querySelector<HTMLInputElement>("#message");
		if (!input || !input.value.trim()) return;

		ChatController.send({
			type: "message",
			content: input.value.trim(),
		});

		input.value = "";
	}

	private addUsersToModal(): void {
		const chatUsersLists =
			document.querySelectorAll<HTMLUListElement>(".chat-users-list");
		const users = this.lists.chatUsers as string[];
		chatUsersLists.forEach((chatUsersList) => {
			chatUsersList.replaceChildren();
			users.forEach((user) => {
				const li = document.createElement("li");
				li.textContent = user;
				chatUsersList.appendChild(li);
			});
		});
	}

	private static handleChatUsersClick(): void {
		const modal = document.querySelector<HTMLElement>("#chatUsersModal");
		if (!modal) return;

		modal.style.display = "block";
	}

	private static handleChatOptionsClick(e?: Event): void {
		e?.stopPropagation();
		const dropdown = document.querySelector<HTMLElement>("#chatDropdown");
		if (!dropdown) return;

		dropdown.classList.toggle("open");
		dropdown.style.display = dropdown.classList.contains("open")
			? "flex"
			: "none";
	}

	private static closeChatOptionsDropdown(): void {
		const optionsBtn =
			document.querySelector<HTMLButtonElement>(".chat-options-btn");
		const dropdown = document.getElementById("chatDropdown");
		if (!dropdown || !optionsBtn) return;

		dropdown.classList.remove("open");
		dropdown.style.display = "none";
	}

	private async setupAvatar(): Promise<void> {
		const chatsData = await ChatsService.getChats();
		const chatData = chatsData.filter((chat) => chat.id === this.props.chatId);

		const imgSrc = chatData[0].avatar
			? `${resourcesUrl}${chatData[0].avatar}`
			: `${avatarImg}`;
		const imgClass = chatData[0].avatar
			? "chat-avatar-img"
			: "chat-default-avatar-img";

		this.setProps({
			AvatarBtn: new Button({
				attributes: {
					id: "avatarBtn",
				},
				children: `
						{{{ Avatar }}}
					`,
				Avatar: new Avatar({
					attributes: {
						class: "chat-avatar",
					},
					children: `
							<img src="${imgSrc}" class="${imgClass}" />
						`,
				}),
				events: {
					click: () => this.handleAvatarClick(),
				},
			}),
		});
	}

	private static scrollToBottom(): void {
		const messagesContainer = document.querySelector(".chat-body");
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	private setupChatConnection(): void {
		const containerMsgs = document.querySelector(".chat-messages");
		if (!containerMsgs) return;

		containerMsgs.replaceChildren();

		ChatController.connectToChat(this.props.chatId as number, (data) => {
			const container = document.querySelector(".chat-body");
			if (!container) return;

			const messages = Array.isArray(data) ? data.reverse() : [data];

			messages.forEach((msg) => {
				const msgEl = document.createElement("p");
				if (msg.user_id === Number(localStorage.getItem("userId"))) {
					msgEl.classList.add("chat-my-messages");
				} else {
					msgEl.classList.add("chat-users-messages");
				}
				msgEl.textContent = msg.content;
				containerMsgs.append(msgEl);
			});

			ChatPage.scrollToBottom();
		});
	}

	private async initializeChat(): Promise<void> {
		if (!this.props.chatId) return;

		await this.setupAvatar();
		this.addUsersToModal();
		this.setupChatConnection();
		document.addEventListener("click", ChatPage.closeChatOptionsDropdown);
	}

	componentDidMount(): void {
		this.initializeChat();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
