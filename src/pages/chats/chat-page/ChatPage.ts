import Block from "@/framework/Block";
import ChatController from "@/api/ChatController";
import sendBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import Button from "@/components/button/Button";
import Form from "@/components/form/Form";
import "./chat-page.css";

const template = `
	<div class="chat-content">
		{{#if chatId}}
			<div class="chat-header">
				<div class="chat-header-info">
					<span class="chat-avatar">
						<img src=${avatarImg} alt="avatar" />
					</span>
					<div>
						<h5 class="chat-title">{{ title }}</h5>
						<button class="chat-users-btn">
							<span>Участников: {{ chatUsersCount }}</span>
						</button>
					</div>
				</div>
				<div class="chat-options">
					<button class="chat-options-btn" aria-label="Опции чата">
						<svg width="4" height="20" viewBox="0 0 4 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="2" cy="2" r="2" fill="#999"/>
							<circle cx="2" cy="10" r="2" fill="#999"/>
							<circle cx="2" cy="18" r="2" fill="#999"/>
						</svg>
					</button>
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
			chatUsersCount: props.chatUsers
				? (props.chatUsers as string[]).length
				: 0,
			ChatUsersBtn: new Button({
				children: `
					<span>Участников: {{ chatUsersCount }}</span>
				`,
			}),
			AddUserBtn: new Button({
				id: "addUserBtn",
				class: "chat-dropdown-item",
				children: `Добавить пользователя`,
				events: {
					click: (e?: Event) => ChatPage.handleAddUserClick(e),
				},
			}),
			RemoveUserBtn: new Button({
				id: "removeUserBtn",
				class: "chat-dropdown-item",
				children: `Удалить пользователя`,
				events: {
					click: (e?: Event) => ChatPage.handleRemoveUserClick(e),
				},
			}),
			SendMessageForm: new Form({
				class: "send-msg-form",
				children: `
					<input
						id="message"
						type="text"
						name="message"
						class="message"
						placeholder="Сообщение"
					/>
					<button type="submit" class="chat-send-btn" >
						<img src=${sendBtn} alt="send" />
					</button>
				`,
				events: {
					submit: (e?: Event) => ChatPage.handleSendMessageSubmit(e),
				},
			}),
		});
	}

	private static handleAddUserClick(e?: Event) {
		e?.preventDefault();
		const modal = document.querySelector<HTMLElement>("#addUserModal");
		if (!modal) return;
		modal.style.display = "block";
	}

	private static handleRemoveUserClick(e?: Event) {
		e?.preventDefault();
		const modal = document.querySelector<HTMLElement>("#removeUserModal");
		if (!modal) return;
		modal.style.display = "block";
	}

	static handleSendMessageSubmit(e?: Event): void {
		e?.preventDefault();
	}

	private addUsersToModal() {
		const chatUsersList =
			document.querySelector<HTMLElement>(".chat-users-list");
		if (!chatUsersList) return;
		const users = this.lists.chatUsers as string[];
		if (!chatUsersList.hasChildNodes()) {
			users.forEach((user) => {
				const li = document.createElement("li");
				li.textContent = user;
				chatUsersList.appendChild(li);
			});
		}
	}

	private handleChatUsersClick() {
		const chatUsersBtn =
			document.querySelector<HTMLButtonElement>(".chat-users-btn");
		const chatUsersModal =
			document.querySelector<HTMLElement>("#chatUsersModal");
		if (!chatUsersBtn || !chatUsersModal) return;

		chatUsersBtn.addEventListener("click", () => {
			chatUsersModal.style.display = "block";
		});
	}

	componentDidMount() {
		if (!this.props.chatId) return;

		this.addUsersToModal();
		this.handleChatUsersClick();

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

		const btn = document.querySelector<HTMLButtonElement>(".chat-send-btn");
		const input = document.querySelector<HTMLInputElement>("#message");

		btn?.addEventListener("click", () => {
			if (!input) return;

			ChatController.send({
				type: "message",
				content: input.value,
			});

			input.value = "";
		});

		const optionsBtn =
			document.querySelector<HTMLButtonElement>(".chat-options-btn");
		const dropdown = document.getElementById("chatDropdown");

		optionsBtn?.addEventListener("click", (e) => {
			if (!dropdown) return;
			e.stopPropagation();
			dropdown.classList.toggle("open");
			dropdown.style.display = dropdown.classList.contains("open")
				? "flex"
				: "none";
		});

		document.addEventListener("click", (e) => {
			if (!dropdown) return;
			if (
				dropdown.contains(e.target as Node) &&
				optionsBtn?.contains(e.target as Node)
			) {
				dropdown.classList.remove("open");
				dropdown.style.display = "none";
			}
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
