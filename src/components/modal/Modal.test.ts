import Modal from "./Modal";

describe("Modal", () => {
	it("renders component with attributes and children", () => {
		const component = new Modal({
			attributes: {
				id: "id",
			},
			title: "title",
			children: "<div>child</div>",
		});
		const content = component.getContent();

		expect(content.id).toBe("id");
		expect(content.textContent).toContain("title");
		expect(content.textContent).toContain("child");
	});
});
