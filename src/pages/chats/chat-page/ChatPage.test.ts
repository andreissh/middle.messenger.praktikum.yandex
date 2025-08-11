import { jest } from "@jest/globals";
import ChatPage from "./ChatPage";

describe("ChatPage", () => {
	it("renders default message on initial render", () => {
		const component = new ChatPage({
			chatUsers: [],
		});
		const content = component.getContent();
		const text = content.querySelector(".chat-text-default");

		expect(text).not.toBe(null);
		expect(text?.textContent).toContain(
			"Выберите чат, чтобы отправить сообщение"
		);
	});

	it("renders component with attributes and children", () => {
		const mockFn = jest.fn();
		const mockEvents = {
			onRefresh: () => mockFn,
		};
		const component = new ChatPage({
			chatId: 1,
			title: "title",
			chatUsers: [],
			events: mockEvents,
		});
		const content = component.getContent();
		const backBtn = content.querySelector("#backBtn");
		const avatarBtn = content.querySelector("#avatarBtn");
		const usersCount = content.querySelector(".chat-users-btn span");
		const optionsBtn = content.querySelector(".chat-options-btn");
		const addUser = content.querySelector("#addUserBtn");
		const removeUser = content.querySelector("#removeUserBtn");
		const sendForm = content.querySelector(".send-msg-form");

		expect(backBtn).not.toBe(null);
		expect(avatarBtn).not.toBe(null);
		expect(usersCount?.textContent).not.toBe(null);
		expect(optionsBtn).not.toBe(null);
		expect(addUser?.textContent).toContain("Добавить пользователя");
		expect(removeUser?.textContent).toContain("Удалить пользователя");
		expect(sendForm).not.toBe(null);
	});

	it("shows users count equal to chatUsers array length", () => {
		const mockFn = jest.fn();
		const mockEvents = {
			onRefresh: () => mockFn,
		};
		const component = new ChatPage({
			chatId: 1,
			title: "title",
			chatUsers: ["user1", "user2"],
			events: mockEvents,
		});
		const content = component.getContent();
		const usersCount = content.querySelector(".chat-users-btn span");

		expect(usersCount?.textContent).toContain("2");
	});
});
