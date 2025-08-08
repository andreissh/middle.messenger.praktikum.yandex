import http from "@/api/HttpClient";
import {
	AddChatReq,
	AddChatRes,
	AddUserReq,
	ChatToken,
	ChatUser,
	ChatUsersReq,
	DeleteChatReq,
	DeleteChatRes,
	RemoveUserReq,
	UserChat,
} from "@/types/types";

class ChatsService {
	async getChats(): Promise<UserChat[]> {
		try {
			const response = await http.get<UserChat[]>("/chats");
			return response;
		} catch (err) {
			throw new Error("Ошибка при получении списка чатов", { cause: err });
		}
	}

	async addChat(value: string): Promise<void> {
		try {
			await http.post<AddChatRes, AddChatReq>("/chats", {
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
			await http.delete<DeleteChatRes, DeleteChatReq>("/chats", {
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
			await http.put<void, AddUserReq>("/chats/users", {
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
			await http.delete<void, RemoveUserReq>("/chats/users", {
				body: {
					users,
					chatId,
				},
			});
		} catch (err) {
			throw new Error("Ошибка при удалении пользователя", { cause: err });
		}
	}

	async getWSToken(chatId: number): Promise<ChatToken> {
		try {
			const response = await http.post<ChatToken>(`/chats/token/${chatId}`);
			return response;
		} catch (err) {
			throw new Error("Ошибка при получении токена", { cause: err });
		}
	}

	async getChatUsers({ id }: ChatUsersReq): Promise<ChatUser[]> {
		try {
			const response = await http.get<ChatUser[]>(`/chats/${id}/users`);
			return response;
		} catch (err) {
			throw new Error("Ошибка при получении списка участников чата", {
				cause: err,
			});
		}
	}

	async changeAvatar(formData: FormData): Promise<void> {
		try {
			await http.put<UserChat, FormData>("/chats/avatar", { body: formData });
		} catch (err) {
			throw new Error("Ошибка при обновлении аватара", { cause: err });
		}
	}
}

export default new ChatsService();
