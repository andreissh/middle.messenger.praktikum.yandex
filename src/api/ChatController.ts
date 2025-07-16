import http from "@/api/http";

class ChatController {
	private socket: WebSocket | null = null;
	private pingInterval: number | null = null;

	async connectToChat(chatId: number, onMessage: (msg: any) => void) {
		const user = await http.get("/auth/user");
		const { token } = await http.post(`/chats/token/${chatId}`);

		const socket = new WebSocket(
			`wss://ya-praktikum.tech/ws/chats/${user.id}/${chatId}/${token}`
		);

		this.socket = socket;

		socket.addEventListener("open", () => {
			console.log("WebSocket открыт");

			this.send({ content: "0", type: "get old" });

			this.pingInterval = window.setInterval(() => {
				this.send({ type: "ping" });
			}, 10000);
		});

		socket.addEventListener("message", (event) => {
			try {
				const data = JSON.parse(event.data);
				if (Array.isArray(data) || data.type === "message") {
					onMessage(data);
				}
			} catch (err) {
				console.error("Ошибка при парсинге сообщения", err);
			}
		});

		socket.addEventListener("close", () => {
			console.log("WebSocket закрыт");
			if (this.pingInterval) clearInterval(this.pingInterval);
		});

		socket.addEventListener("error", (e) => {
			console.error("WebSocket ошибка соединения", e);
		});
	}

	send(data: { content?: string; type: string }) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(data));
		} else {
			console.warn("WebSocket не подключен");
		}
	}

	close() {
		this.socket?.close();
		if (this.pingInterval) clearInterval(this.pingInterval);
	}
}

export default new ChatController();
