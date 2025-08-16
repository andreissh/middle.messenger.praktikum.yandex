import ChatsPage from "./ChatsPage";

describe("ChatsPage", () => {
	it("renders component with attributes and children (no modals)", () => {
		const component = new ChatsPage();
		const content = component.getContent();
		const aside = content.querySelector("aside");
		const profileText = content.querySelector(
			".chats-profile-btn-wrapper span"
		);
		const search = content.querySelector(".chats-aside-search");
		const list = content.querySelector(".chat-list");
		const body = content.querySelector(".chat-body");
		const text = content.querySelector(".chat-text-default");

		expect(aside).not.toBe(null);
		expect(profileText?.textContent).toBe("Профиль");
		expect(search).not.toBe(null);
		expect(list).not.toBe(null);
		expect(body).not.toBe(null);
		expect(text?.textContent).toContain(
			"Выберите чат, чтобы отправить сообщение"
		);
	});

	it("renders create chat modal", () => {
		const component = new ChatsPage();
		const content = component.getContent();
		const createChat = content.querySelector("#createChatModal");
		const title = createChat?.querySelector(".modal-title");
		const label = createChat?.querySelector(".create-chat-label");
		const input = createChat?.querySelector(".create-chat-input");
		const submitBtn = createChat?.querySelector(".create-chat-submit-btn");

		expect(createChat).not.toBe(null);
		expect(title?.textContent).toBe("Создайте чат");
		expect(label?.textContent).toContain("Введите название");
		expect(input).not.toBe(null);
		expect(submitBtn).not.toBe(null);
	});

	it("renders delete chat modal", () => {
		const component = new ChatsPage();
		const content = component.getContent();
		const deleteChat = content.querySelector("#deleteChatModal");
		const title = deleteChat?.querySelector(".modal-title");
		const confirm = deleteChat?.querySelector(".delete-chat-modal-btns span");
		const buttons = deleteChat?.querySelectorAll(
			".delete-chat-modal-btns button"
		);

		expect(title?.textContent).toBe("Удаление чата");
		expect(confirm?.textContent).toBe(
			"Вы действительно хотите удалить выбранный чат?"
		);
		expect(buttons?.length).toBe(2);
	});

	it("renders add user modal", () => {
		const component = new ChatsPage();
		const content = component.getContent();
		const addUser = content.querySelector("#addUserModal");
		const title = addUser?.querySelector(".modal-title");
		const label = addUser?.querySelector(".add-user-label");
		const input = addUser?.querySelector(".add-user-input");
		const submitBtn = addUser?.querySelector(".add-user-submit-btn");
		const usersContainer = addUser?.querySelector(".chat-users-list-container");

		expect(title?.textContent).toBe("Добавьте пользователя");
		expect(label?.textContent).toContain("Логин");
		expect(input).not.toBe(null);
		expect(submitBtn).not.toBe(null);
		expect(usersContainer).not.toBe(null);
	});

	it("renders remove user modal", () => {
		const component = new ChatsPage();
		const content = component.getContent();
		const removeUser = content.querySelector("#removeUserModal");
		const title = removeUser?.querySelector(".modal-title");
		const label = removeUser?.querySelector(".remove-user-label");
		const input = removeUser?.querySelector(".remove-user-input");
		const submitBtn = removeUser?.querySelector(".remove-user-submit-btn");
		const usersContainer = removeUser?.querySelector(
			".chat-users-list-container"
		);

		expect(title?.textContent).toBe("Удалите пользователя");
		expect(label?.textContent).toContain("Логин");
		expect(input).not.toBe(null);
		expect(submitBtn).not.toBe(null);
		expect(usersContainer).not.toBe(null);
	});

	it("renders chat users modal", () => {
		const component = new ChatsPage();
		const content = component.getContent();
		const chatUsers = content.querySelector("#chatUsersModal");
		const title = chatUsers?.querySelector(".modal-title");
		const usersContainer = chatUsers?.querySelector(
			".chat-users-list-container"
		);
		const listTitle = chatUsers?.querySelector(".chat-users-list-title");

		expect(title?.textContent).toBe("Участники чата");
		expect(usersContainer).not.toBe(null);
		expect(listTitle?.textContent).toContain("Список участников");
	});
});
