import Block from "@/framework/Block";
import ChatController from "@/api/ChatController";
import sendBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import "./chat-page.css";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/Modal";
import http from "@/api/http";

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
				<input
					id="message"
					type="text"
					name="message"
					class="message"
					placeholder="Сообщение"
				/>
				<button class="chat-send-btn" >
					<img src=${sendBtn} alt="send" />
				</button>
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
			AddUserModal: new Modal({
				id: "addUserModal",
				title: "Добавьте пользователя",
				children: `
					<form>
						<label class="add-user-label">
							<input type="text" id="addUserInput" class="add-user-input" placeholder="Введите логин" />
						</label>
						<button type="submit" class="btn add-user-submit-btn">Добавить</button>
					</form>
				`,
			}),
			RemoveUserModal: new Modal({
				id: "removeUserModal",
				title: "Удалите пользователя",
				children: `
					<form>
						<label class="remove-user-label">
							<input type="text" id="removeUserInput" class="remove-user-input" placeholder="Введите логин" />
						</label>
						<button type="submit" class="btn remove-user-submit-btn">Удалить</button>
					</form>
				`,
			}),
		});
	}

	handleAddUserClick(e?: Event) {
		e?.preventDefault();
		const modal: HTMLElement | null = document.querySelector("#addUserModal");
		if (!modal) return;
		modal.style.display = "block";

		const input: HTMLInputElement | null =
			document.querySelector("#addUserInput");
		const submitBtn = document.querySelector(".add-user-submit-btn");

		submitBtn?.addEventListener("click", async () => {
			if (!input || !input.value) return;

			try {
				const userData = await http.post("user/search", {
					body: {
						login: input.value,
					},
				});

				await http.put("/chats/users", {
					body: {
						users: [userData[0].id],
						chatId: this.props.chatId,
					},
				});

				modal.style.display = "none";
			} catch (err) {
				console.log(err);
			}
		});
	}

	handleRemoveUserClick(e?: Event) {
		console.log("click");
		e?.preventDefault();
		const modal: HTMLElement | null =
			document.querySelector("#removeUserModal");
		if (!modal) return;
		console.log(modal);
		modal.style.display = "block";

		const input: HTMLInputElement | null =
			document.querySelector("#removeUserInput");
		const submitBtn = document.querySelector(".remove-user-submit-btn");

		submitBtn?.addEventListener("click", async () => {
			if (!input || !input.value) return;

			try {
				const userData = await http.post("user/search", {
					body: {
						login: input.value,
					},
				});
				console.log(userData);

				await http.delete("chats/users", {
					body: {
						users: [userData[0].id],
						chatId: this.props.chatId,
					},
				});

				modal.style.display = "none";
			} catch (err) {
				console.log(err);
			}
		});
	}

	componentDidMount() {
		if (!this.props.chatId) return;

		const containerMsgs = document.querySelector(".chat-messages");
		if (containerMsgs) {
			containerMsgs.replaceChildren();
		}

		ChatController.connectToChat(this.props.chatId, (data) => {
			const container = document.querySelector(".chat-body");
			if (!container) return;

			const messages = Array.isArray(data) ? data.reverse() : [data];
			console.log(messages);

			messages.forEach((msg) => {
				const msgEl = document.createElement("p");
				if (msg.user_id === Number(localStorage.getItem("userId"))) {
					msgEl.classList.add("my-messages");
				} else {
					msgEl.classList.add("users-messages");
				}
				msgEl.textContent = msg.content;
				containerMsgs?.append(msgEl);
			});
		});

		const btn = document.querySelector(".chat-send-btn");
		const input = document.querySelector("#message");

		btn?.addEventListener("click", () => {
			if (!input?.value) return;

			ChatController.send({
				type: "message",
				content: input.value,
			});

			input.value = "";
		});

		const optionsBtn = document.querySelector(".chat-options-btn");
		const dropdown = document.getElementById("chatDropdown");

		optionsBtn?.addEventListener("click", (e) => {
			e.stopPropagation();
			dropdown?.classList.toggle("open");
			dropdown!.style.display = dropdown!.classList.contains("open")
				? "flex"
				: "none";
		});

		document.addEventListener("click", (e) => {
			if (
				!dropdown?.contains(e.target as Node) &&
				!optionsBtn?.contains(e.target as Node)
			) {
				dropdown?.classList.remove("open");
				dropdown!.style.display = "none";
			}
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
