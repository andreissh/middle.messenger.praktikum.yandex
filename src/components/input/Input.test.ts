import Input from "./Input";

describe("Input", () => {
	it("renders component with attributes and children", () => {
		const component = new Input({
			attributes: {
				id: "id",
				class: "class",
				type: "type",
				value: "value",
				name: "name",
				autocomplete: "autocomplete",
			},
		});
		const content = component.getContent();

		expect(content.id).toBe("id");
		expect(content.className).toBe("class");
		expect(content.getAttribute("type")).toBe("type");
		expect(content.getAttribute("value")).toBe("value");
	});
});
