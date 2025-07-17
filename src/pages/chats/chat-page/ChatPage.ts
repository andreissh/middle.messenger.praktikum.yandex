import Block from "@/framework/Block";
import ChatController from "@/api/ChatController";
import sendBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import "./chat-page.css";

const template = `
	<div class="chat-content">
		{{#if chatId}}
			<div class="chat-header">
				<span class="chat-avatar">
					<img src=${avatarImg} alt="avatar" />
				</span>
				<h5 class="chat-title">chat name</h5>
				<span class="chat-options"></span>
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
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
