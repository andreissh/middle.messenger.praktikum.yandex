import Block from "@/framework/Block";
import ChatController from "@/api/ChatController";
import sendBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import http from "@/api/HttpClient";
import { ChatsUsers, UserData } from "@/types/types";
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
					<h5 class="chat-title">{{ title }}</h5>
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
		{{{ AddUserModal }}}
		{{{ RemoveUserModal }}}
	</div>
`;

export default class ChatPage extends Block {
	constructor(props: Record<string, unknown>) {
		super("div", {
			...props,
			AddUserBtn: new Button({
				id: "addUserBtn",
				class: "chat-dropdown-item",
				children: `Добавить пользователя`,
				events: {
					click: (e?: Event) => this.handleAddUserClick(e),
				},
			}),
			RemoveUserBtn: new Button({
				id: "removeUserBtn",
				class: "chat-dropdown-item",
				children: `Удалить пользователя`,
				events: {
					click: (e?: Event) => this.handleRemoveUserClick(e),
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
							<input type="text" id="addUserInput" class="add-user-input" placeholder="Введите логин" />
						</label>
						<button type="submit" class="btn add-user-submit-btn">Добавить</button>
					`,
				}),
				events: {
					submit: (e?: Event) => this.handleAddUserSubmit(e),
				},
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
							<input type="text" id="removeUserInput" class="remove-user-input" placeholder="Введите логин" />
						</label>
						<button type="submit" class="btn remove-user-submit-btn">Удалить</button>
					`,
				}),
				events: {
					submit: (e?: Event) => this.handleRemoveUserSubmit(e),
				},
			}),
		});
	}

	handleAddUserClick(e?: Event) {
		e?.preventDefault();
		const modal: HTMLElement | null = document.querySelector("#addUserModal");
		if (!modal) return;
		modal.style.display = "block";
	}

	private async handleAddUserSubmit(e?: Event): Promise<void> {
		e?.preventDefault();

		const modal: HTMLElement | null = document.querySelector("#addUserModal");
		const input: HTMLInputElement | null =
			document.querySelector("#addUserInput");
		if (!modal || !input) return;

		try {
			const userData = await http.post<UserData[]>("/user/search", {
				body: {
					login: input.value,
				},
			});

			await http.put<ChatsUsers>("/chats/users", {
				body: {
					users: [userData[0].id],
					chatId: this.props.chatId as number,
				},
			});

			modal.style.display = "none";
		} catch (err) {
			modal.style.display = "none";
			throw new Error("Ошибка при добавлении пользователя", { cause: err });
		}
	}

	handleRemoveUserClick(e?: Event) {
		e?.preventDefault();
		const modal: HTMLElement | null =
			document.querySelector("#removeUserModal");
		if (!modal) return;
		modal.style.display = "block";
	}

	private async handleRemoveUserSubmit(e?: Event): Promise<void> {
		e?.preventDefault();

		const modal: HTMLElement | null =
			document.querySelector("#removeUserModal");
		const input: HTMLInputElement | null =
			document.querySelector("#removeUserInput");
		if (!modal || !input) return;

		try {
			const userData = await http.post<UserData[]>("/user/search", {
				body: {
					login: input.value,
				},
			});

			await http.delete<ChatsUsers>("/chats/users", {
				body: {
					users: [userData[0].id],
					chatId: this.props.chatId,
				},
			});

			modal.style.display = "none";
		} catch (err) {
			modal.style.display = "none";
			throw new Error("Ошибка при удалении пользователя", { cause: err });
		}
	}

	static handleSendMessageSubmit(e?: Event): void {
		e?.preventDefault();
	}

	componentDidMount() {
		if (!this.props.chatId) return;

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

		const btn: HTMLButtonElement | null =
			document.querySelector(".chat-send-btn");
		const input: HTMLInputElement | null = document.querySelector("#message");

		btn?.addEventListener("click", () => {
			if (!input) return;

			ChatController.send({
				type: "message",
				content: input.value,
			});

			input.value = "";
		});

		const optionsBtn: HTMLButtonElement | null =
			document.querySelector(".chat-options-btn");
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
