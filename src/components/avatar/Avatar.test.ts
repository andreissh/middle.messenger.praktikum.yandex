import Avatar from "@/components/avatar/Avatar";

describe("Avatar", () => {
	it("renders component with attributes and children", () => {
		const component = new Avatar({
			attributes: {
				class: "class",
				name: "name",
			},
			children: "<div>child</div>",
		});
		const content = component.getContent();

		expect(content.className).toBe("class");
		expect(content.getAttribute("name")).toBe("name");
		expect(content.textContent).toContain("child");
	});
});
