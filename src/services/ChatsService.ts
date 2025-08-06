import http from "@/api/HttpClient";
import {
	ChatsToken,
	ChatsUserList,
	ChatsUsers,
	DeleteChat,
	UserChats,
} from "@/types/types";

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

	async getChatUsers(chatId: number): Promise<ChatsUserList[]> {
		try {
			const response = await http.get<ChatsUserList[]>(
				`/chats/${chatId}/users`
			);
			return response;
		} catch (err) {
			throw new Error("Ошибка при получении списка участников чата", {
				cause: err,
			});
		}
	}

	async changeAvatar(formData: FormData): Promise<void> {
		try {
			await http.put("/chats/avatar", { body: formData });
		} catch (err) {
			throw new Error("Ошибка при обновлении аватара", { cause: err });
		}
	}
}

export default new ChatsService();
