import Block from "@/framework/Block";
import ChatController from "@/api/ChatController";

const template = `
  <div class="chat-page">
    <div class="chat-messages" id="messages"></div>
    <input type="text" class="message-input" />
    <button class="send-btn">Отправить</button>
  </div>
`;

export default class ChatPage extends Block {
	constructor(props: Record<string, unknown>) {
		super("div", props);
	}

	componentDidMount() {
		const chatId = Number(window.location.pathname.split("/").pop());

		ChatController.connectToChat(chatId, (data) => {
			const container = document.querySelector("#messages");
			if (!container) return;

			const messages = Array.isArray(data) ? data.reverse() : [data];

			messages.forEach((msg) => {
				const msgEl = document.createElement("div");
				msgEl.textContent = msg.content;
				container.append(msgEl);
			});
		});

		const btn = document.querySelector(".send-btn");
		const input = document.querySelector(".message-input");

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
