import Block from "@/framework/Block";
import ChatController from "@/api/ChatController";
import sendBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import "./chat-page.css";

const template = `
	<div class="chat-content">
		{{#if chatId}}
			<div class="chat-header">
				<div class="chat-header-info">
					<span class="chat-avatar">
						<img src=${avatarImg} alt="avatar" />
					</span>
					<h5 class="chat-title">chat name</h5>
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
						<button id="addUserBtn" class="chat-dropdown-item">Добавить пользователя</button>
						<button id="removeUserBtn" class="chat-dropdown-item">Удалить пользователя</button>
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
	</div>
`;

export default class ChatPage extends Block {
	constructor(props: Record<string, unknown>) {
		super("div", props);
	}

	componentDidMount() {
		if (!this.props.chatId) return;

		ChatController.connectToChat(this.props.chatId, (data) => {
			const container = document.querySelector(".chat-body");
			if (!container) return;

			const messages = Array.isArray(data) ? data.reverse() : [data];
			console.log(messages);

			messages.forEach((msg) => {
				const container = document.querySelector(".chat-messages");
				const msgEl = document.createElement("p");
				msgEl.textContent = msg.content;
				container?.append(msgEl);
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

		document.getElementById("addUserBtn")?.addEventListener("click", () => {
			console.log("Добавить пользователя");
		});

		document.getElementById("removeUserBtn")?.addEventListener("click", () => {
			console.log("Удалить пользователя");
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
