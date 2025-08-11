import ChatsItem from "./ChatsItem";

describe("ChatsItem", () => {
	it("renders component with attributes and children", () => {
		const component = new ChatsItem({
			attributes: {
				id: "id",
			},
			name: "name",
			text: "text",
			time: "time",
			count: 0,
			avatar: "avatar",
		});
		const content = component.getContent();
		const header = content.querySelector(".chat-item-header");
		const message = content.querySelector(".chat-item-message");
		const time = content.querySelector(".chat-item-msg-time");
		const count = content.querySelector(".chat-item-msg-count");
		const deleteBtn = content.querySelector(".chat-item-delete-btn");

		expect(header?.textContent).toBe("name");
		expect(message?.textContent).toBe("text");
		expect(time?.textContent).toBe("time");
		expect(count).toBe(null);
		expect(deleteBtn).not.toBe(null);
	});

	it("renders count element", () => {
		const component = new ChatsItem({
			attributes: {
				id: "id",
			},
			name: "name",
			text: "text",
			time: "time",
			count: 1,
			avatar: "avatar",
		});
		const content = component.getContent();
		const count = content.querySelector(".chat-item-msg-count");

		expect(count?.textContent).toBe("1");
	});
});
