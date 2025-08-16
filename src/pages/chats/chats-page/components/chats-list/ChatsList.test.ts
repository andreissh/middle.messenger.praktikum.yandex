import ChatsList from "./ChatsList";

describe("ChatsList", () => {
	it("renders default message if chats list is empty", () => {
		const component = new ChatsList({
			chats: [],
		});
		const content = component.getContent();
		const list = content.querySelector(".chat-list p");

		expect(list?.textContent).toContain("Список чатов пуст");
	});

	it("renders chat item if chats list contains data", () => {
		const component = new ChatsList({
			chats: [
				{
					attributes: { id: "id" },
					name: "name",
					text: "text",
					time: "time",
					count: 0,
					avatar: "avatar",
				},
			],
		});
		const content = component.getContent();
		const chatItem = content.querySelector(".chat-item");

		expect(chatItem).not.toBe(null);
	});
});
