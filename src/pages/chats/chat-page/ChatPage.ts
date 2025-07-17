import Block from "@/framework/Block";
import ChatController from "@/api/ChatController";
import sendBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import "./chat-page.css";

const template = `
	<div class="chat-content">
		<div class="chat-header">
			<span class="chat-avatar">
				<img src=${avatarImg} alt="avatar" />
			</span>
			<h5 class="chat-title">chat name</h5>
			<span class="chat-options"></span>
		</div>
		<div class="chat-body">
			<span class="chat-text-default">Выберите чат, чтобы
				отправить сообщение</span>
		</div>
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
	</div>
`;

export default class ChatPage extends Block {
	constructor(props: Record<string, unknown>) {
		super("div", props);
	}

	componentDidMount() {
		const chatId = Number(window.location.pathname.split("/").pop());

		ChatController.connectToChat(chatId, (data) => {
			const container = document.querySelector(".chat-content");
			if (!container) return;

			const messages = Array.isArray(data) ? data.reverse() : [data];

			messages.forEach((msg) => {
				const msgEl = document.createElement("div");
				msgEl.textContent = msg.content;
				container.append(msgEl);
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
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
