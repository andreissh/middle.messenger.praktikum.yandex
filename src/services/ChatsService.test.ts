import http from "@/api/HttpClient";
import { ChatToken, ChatUser, UserChat } from "@/types/types";
import { jest } from "@jest/globals";
import ChatsService from "./ChatsService";

jest.mock("@/api/HttpClient");

describe("ChatsService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockChats: UserChat[] = [
		{
			id: 1,
			title: "Chat 1",
			avatar: null,
			unread_count: 0,
			created_by: 1,
			last_message: null,
		},
		{
			id: 2,
			title: "Chat 2",
			avatar: null,
			unread_count: 3,
			created_by: 1,
			last_message: null,
		},
	];

	const mockChatUsers: ChatUser[] = [
		{
			id: 1,
			first_name: "User1",
			second_name: "Test",
			display_name: "User1",
			login: "user1",
			avatar: null,
			role: "user",
		},
		{
			id: 2,
			first_name: "User2",
			second_name: "Test",
			display_name: "User2",
			login: "user2",
			avatar: null,
			role: "user",
		},
	];

	const mockChatToken: ChatToken = { token: "test-token" };

	describe("getChats", () => {
		it("should return list of chats", async () => {
			jest.spyOn(http, "get").mockResolvedValueOnce(mockChats);

			const result = await ChatsService.getChats();

			expect(http.get).toHaveBeenCalledWith("/chats");
			expect(result).toEqual(mockChats);
		});

		it("should throw error on failure", async () => {
			const error = new Error("Network error");
			jest.spyOn(http, "get").mockRejectedValueOnce(error);

			await expect(ChatsService.getChats()).rejects.toThrow(
				"Ошибка при получении списка чатов"
			);
		});
	});

	describe("addChat", () => {
		it("should successfully add a chat", async () => {
			const title = "New Chat";
			jest.spyOn(http, "post").mockResolvedValueOnce({});

			await ChatsService.addChat(title);

			expect(http.post).toHaveBeenCalledWith("/chats", {
				body: { title },
			});
		});

		it("should throw error on failure", async () => {
			const title = "New Chat";
			const error = new Error("Network error");
			jest.spyOn(http, "post").mockRejectedValueOnce(error);

			await expect(ChatsService.addChat(title)).rejects.toThrow(
				"Ошибка при добавлении чата"
			);
		});
	});

	describe("deleteChat", () => {
		it("should successfully delete a chat", async () => {
			const chatId = 1;
			jest.spyOn(http, "delete").mockResolvedValueOnce({});

			await ChatsService.deleteChat(chatId);

			expect(http.delete).toHaveBeenCalledWith("/chats", {
				body: { chatId },
			});
		});

		it("should throw error on failure", async () => {
			const chatId = 1;
			const error = new Error("Network error");
			jest.spyOn(http, "delete").mockRejectedValueOnce(error);

			await expect(ChatsService.deleteChat(chatId)).rejects.toThrow(
				"Ошибка при удалении чата"
			);
		});
	});

	describe("addUser", () => {
		it("should successfully add users to chat", async () => {
			const users = [1, 2];
			const chatId = 1;
			jest.spyOn(http, "put").mockResolvedValueOnce({});

			await ChatsService.addUser(users, chatId);

			expect(http.put).toHaveBeenCalledWith("/chats/users", {
				body: { users, chatId },
			});
		});

		it("should throw error on failure", async () => {
			const users = [1, 2];
			const chatId = 1;
			const error = new Error("Network error");
			jest.spyOn(http, "put").mockRejectedValueOnce(error);

			await expect(ChatsService.addUser(users, chatId)).rejects.toThrow(
				"Ошибка при добавлении пользователя"
			);
		});
	});

	describe("removeUser", () => {
		it("should successfully remove users from chat", async () => {
			const users = [1, 2];
			const chatId = 1;
			jest.spyOn(http, "delete").mockResolvedValueOnce({});

			await ChatsService.removeUser(users, chatId);

			expect(http.delete).toHaveBeenCalledWith("/chats/users", {
				body: { users, chatId },
			});
		});

		it("should throw error on failure", async () => {
			const users = [1, 2];
			const chatId = 1;
			const error = new Error("Network error");
			jest.spyOn(http, "delete").mockRejectedValueOnce(error);

			await expect(ChatsService.removeUser(users, chatId)).rejects.toThrow(
				"Ошибка при удалении пользователя"
			);
		});
	});

	describe("getWSToken", () => {
		it("should return WebSocket token", async () => {
			const chatId = 1;
			jest.spyOn(http, "post").mockResolvedValueOnce(mockChatToken);

			const result = await ChatsService.getWSToken(chatId);

			expect(http.post).toHaveBeenCalledWith(`/chats/token/${chatId}`);
			expect(result).toEqual(mockChatToken);
		});

		it("should throw error on failure", async () => {
			const chatId = 1;
			const error = new Error("Network error");
			jest.spyOn(http, "post").mockRejectedValueOnce(error);

			await expect(ChatsService.getWSToken(chatId)).rejects.toThrow(
				"Ошибка при получении токена"
			);
		});
	});

	describe("getChatUsers", () => {
		it("should return list of chat users", async () => {
			const chatId = 1;
			jest.spyOn(http, "get").mockResolvedValueOnce(mockChatUsers);

			const result = await ChatsService.getChatUsers({ id: chatId });

			expect(http.get).toHaveBeenCalledWith(`/chats/${chatId}/users`);
			expect(result).toEqual(mockChatUsers);
		});

		it("should throw error on failure", async () => {
			const chatId = 1;
			const error = new Error("Network error");
			jest.spyOn(http, "get").mockRejectedValueOnce(error);

			await expect(ChatsService.getChatUsers({ id: chatId })).rejects.toThrow(
				"Ошибка при получении списка участников чата"
			);
		});
	});

	describe("changeAvatar", () => {
		it("should successfully change chat avatar", async () => {
			const formData = new FormData();
			formData.append("avatar", new Blob(), "avatar.jpg");
			formData.append("chatId", "1");

			jest.spyOn(http, "put").mockResolvedValueOnce({});

			await ChatsService.changeAvatar(formData);

			expect(http.put).toHaveBeenCalledWith("/chats/avatar", {
				body: formData,
			});
		});

		it("should throw error on failure", async () => {
			const formData = new FormData();
			const error = new Error("Network error");
			jest.spyOn(http, "put").mockRejectedValueOnce(error);

			await expect(ChatsService.changeAvatar(formData)).rejects.toThrow(
				"Ошибка при обновлении аватара"
			);
		});
	});
});
