import { baseWsUrl } from "@/utils/utils";
import ChatsService from "@/services/ChatsService";
import AuthService from "@/services/AuthService";

class ChatController {
	private socket: WebSocket | null = null;

	async connectToChat(
		chatId: number,
		onMessage: (msg: unknown) => void
	): Promise<void> {
		const user = await AuthService.userInfo();
		const { token } = await ChatsService.getWSToken(chatId);

		const socket = new WebSocket(`${baseWsUrl}/${user.id}/${chatId}/${token}`);

		this.socket = socket;

		socket.addEventListener("open", () => {
			console.log("WebSocket открыт");

			this.getOldMessages(0);
		});

		socket.addEventListener("message", (event) => {
			try {
				const data = JSON.parse(event.data);
				if (Array.isArray(data) || data.type === "message") {
					onMessage(data);
				}
			} catch (err) {
				throw new Error("Ошибка при парсинге сообщения", { cause: err });
			}
		});

		socket.addEventListener("close", () => {
			console.log("WebSocket закрыт");
		});

		socket.addEventListener("error", (err) => {
			throw new Error("Ошибка WebSocket соединения", { cause: err });
		});
	}

	isConnected(): boolean {
		return !!this.socket && this.socket.readyState === WebSocket.OPEN;
	}

	send(data: { content?: string; type: string }): void {
		if (this.isConnected()) {
			if (this.socket) {
				this.socket.send(JSON.stringify(data));
			}
		} else {
			console.log("WebSocket не подключен");
		}
	}

	getOldMessages(offset: number): void {
		if (this.isConnected()) {
			this.send({ content: String(offset), type: "get old" });
		}
	}

	close(): void {
		if (this.socket) {
			this.socket.close();
			this.socket = null;
		}
	}
}

export default new ChatController();
