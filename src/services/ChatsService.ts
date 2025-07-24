import http from "@/api/HttpClient";
import { ChatsToken, ChatsUsers, DeleteChat, UserChats } from "@/types/types";

class ChatsService {
	async getChats(): Promise<UserChats[]> {
		try {
			const response = await http.get<UserChats[]>("/chats");
			return response;
		} catch (err) {
			throw new Error("Ошибка при получении списка чатов", { cause: err });
		}
	}

	async addChat(value: string): Promise<void> {
		try {
			await http.post("/chats", {
				body: {
					title: value,
				},
			});
		} catch (err) {
			throw new Error("Ошибка при добавлении чата", { cause: err });
		}
	}

	async deleteChat(id: number): Promise<void> {
		try {
			await http.delete<DeleteChat>("/chats", {
				body: {
					chatId: id,
				},
			});

			console.log(`Удален чат с ID: ${id}`);
		} catch (err) {
			throw new Error("Ошибка при удалении чата", { cause: err });
		}
	}

	async addUser(users: number[], chatId: number): Promise<void> {
		try {
			await http.put<ChatsUsers>("/chats/users", {
				body: {
					users,
					chatId,
				},
			});
		} catch (err) {
			throw new Error("Ошибка при добавлении пользователя", { cause: err });
		}
	}

	async removeUser(users: number[], chatId: number): Promise<void> {
		try {
			await http.delete<ChatsUsers>("/chats/users", {
				body: {
					users,
					chatId,
				},
			});
		} catch (err) {
			throw new Error("Ошибка при удалении пользователя", { cause: err });
		}
	}

	async getWSToken(chatId: number): Promise<ChatsToken> {
		try {
			const response = await http.post<ChatsToken>(`/chats/token/${chatId}`);
			return response;
		} catch (err) {
			throw new Error("Ошибка при получении токена", { cause: err });
		}
	}
}

export default new ChatsService();
