import Block from "@/framework/Block";
import ChatController from "@/api/ChatController";
import sendBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import Button from "@/components/button/Button";
import Form from "@/components/form/Form";
import Input from "@/components/input/Input";
import Avatar from "@/components/avatar/Avatar";
import "./chat-page.css";
import { resourcesUrl } from "@/utils/utils";
import ChatsService from "@/services/ChatsService";

const template = `
	<div class="chat-content">
		{{#if chatId}}
			<div class="chat-header">
				<div class="chat-header-info">
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
	constructor(props: Record<string, unknown>) {
		super("div", {
			...props,
			AvatarBtn: new Button({
				id: "avatarBtn",
				children: "{{{ Avatar }}}",
				Avatar: new Avatar({
					class: "chat-avatar",
					children: `
						<img src=${avatarImg} alt="avatar" />
					`,
				}),
				events: {
					click: () => this.handleAvatarClick(),
				},
			}),
			ChatUsersBtn: new Button({
				class: "chat-users-btn",
				children: `
					<span>Участников: {{ chatUsersCount }}</span>
				`,
				events: {
					click: () => ChatPage.handleChatUsersClick(),
				},
				chatUsersCount: (props.chatUsers as string[]).length,
			}),
			ChatOptionsBtn: new Button({
				class: "chat-options-btn",
				children: `
					<svg width="4" height="20" viewBox="0 0 4 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
				id: "addUserBtn",
				class: "chat-dropdown-item",
				children: `Добавить пользователя`,
				events: {
					click: () => ChatPage.handleAddUserClick(),
				},
			}),
			RemoveUserBtn: new Button({
				id: "removeUserBtn",
				class: "chat-dropdown-item",
				children: `Удалить пользователя`,
				events: {
					click: () => ChatPage.handleRemoveUserClick(),
				},
			}),
			SendMessageForm: new Form({
				class: "send-msg-form",
				children: `
					{{{ SendMessageInput }}}
					{{{ SendMessageBtn }}}
				`,
				SendMessageBtn: new Button({
					class: "chat-send-btn",
					type: "submit",
					children: `
						<img src=${sendBtn} alt="send" />
					`,
				}),
				SendMessageInput: new Input({
					id: "message",
					type: "text",
					name: "message",
					class: "message",
					placeholder: "Сообщение",
					autocomplete: "message",
				}),
				events: {
					submit: (e?: Event) => ChatPage.handleSendMessageSubmit(e),
				},
			}),
		});
	}

	private async handleAvatarClick(): Promise<void> {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept =
			"image/jpeg, image/jpg, image/png, image/gif, image/webp";

		const file = await new Promise<File | null>((resolve) => {
			fileInput.onchange = (event: Event) => {
				resolve((event.target as HTMLInputElement).files?.[0] || null);
			};
			fileInput.click();
		});

		if (!file) return;

		const allowedTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
			"image/webp",
		];
		if (!allowedTypes.includes(file.type)) {
			throw new Error("Недопустимый тип файла");
		}

		const formData = new FormData();
		formData.append("chatId", String(this.props.chatId));
		formData.append("avatar", file);
		await ChatsService.changeAvatar(formData);
		const chatsData = await ChatsService.getChats();
		const chatData = chatsData.filter((chat) => chat.id === this.props.chatId);

		this.setProps({
			AvatarBtn: new Button({
				id: "avatarBtn",
				children: `
					{{{ Avatar }}}
				`,
				Avatar: new Avatar({
					class: "chat-avatar",
					children: `
						<img src="${resourcesUrl}${chatData[0].avatar}" class="chat-avatar-img" />
					`,
				}),
				events: {
					click: () => this.handleAvatarClick(),
				},
			}),
		});
	}

	private static handleAddUserClick() {
		const modal = document.querySelector<HTMLElement>("#addUserModal");
		if (!modal) return;
		modal.style.display = "block";
	}

	private static handleRemoveUserClick() {
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

	private addUsersToModal() {
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

	private static handleChatUsersClick() {
		const modal = document.querySelector<HTMLElement>("#chatUsersModal");
		if (!modal) return;
		modal.style.display = "block";
	}

	private static handleChatOptionsClick(e?: Event) {
		const dropdown = document.querySelector<HTMLElement>("#chatDropdown");

		if (!dropdown) return;
		e?.stopPropagation();
		dropdown.classList.toggle("open");
		dropdown.style.display = dropdown.classList.contains("open")
			? "flex"
			: "none";
	}

	private static closeChatOptionsDropdown = () => {
		const optionsBtn =
			document.querySelector<HTMLButtonElement>(".chat-options-btn");
		const dropdown = document.getElementById("chatDropdown");
		if (!dropdown || !optionsBtn) return;

		dropdown.classList.remove("open");
		dropdown.style.display = "none";
	};

	componentDidMount() {
		if (!this.props.chatId) return;

		this.addUsersToModal();

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
					msgEl.classList.add("my-messages");
				} else {
					msgEl.classList.add("users-messages");
				}
				msgEl.textContent = msg.content;
				containerMsgs.append(msgEl);
			});
		});

		document.addEventListener("click", ChatPage.closeChatOptionsDropdown);

		const getChatData = async () => {
			const chatsData = await ChatsService.getChats();
			const chatData = chatsData.filter(
				(chat) => chat.id === this.props.chatId
			);

			const imgSrc = chatData[0].avatar
				? `${resourcesUrl}${chatData[0].avatar}`
				: `${avatarImg}`;
			const imgClass = chatData[0].avatar
				? "profile-edit-avatar-img"
				: "profile-edit-default-avatar-img";

			this.setProps({
				AvatarBtn: new Button({
					id: "avatarBtn",
					children: `
						{{{ Avatar }}}
					`,
					Avatar: new Avatar({
						class: "chat-avatar",
						children: `
							<img src="${imgSrc}" class="${imgClass}" />
						`,
					}),
					events: {
						click: () => this.handleAvatarClick(),
					},
				}),
			});
		};
		getChatData();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
