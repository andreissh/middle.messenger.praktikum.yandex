import { UserData } from "@/types/types";
import { baseWsUrl } from "@/utils/utils";
import ChatsService from "@/services/ChatsService";
import http from "./HttpClient";

class ChatController {
	private socket: WebSocket | null = null;

	async connectToChat(chatId: number, onMessage: (msg: unknown) => void) {
		const user = await http.get<UserData>("/auth/user");
		const { token } = await ChatsService.getWSToken(chatId);

		const socket = new WebSocket(`${baseWsUrl}/${user.id}/${chatId}/${token}`);

		this.socket = socket;

		socket.addEventListener("open", () => {
			console.log("WebSocket открыт");

			this.send({ content: "0", type: "get old" });
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

		socket.addEventListener("error", (e) => {
			throw new Error("Ошибка WebSocket соединения", { cause: e });
		});
	}

	send(data: { content?: string; type: string }) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(data));
		} else {
			console.log("WebSocket не подключен");
		}
	}

	close() {
		this.socket?.close();
	}
}

export default new ChatController();
