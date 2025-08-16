import { jest } from "@jest/globals";
import Button from "./Button";

describe("Button", () => {
	it("renders component with attributes and children", () => {
		const mockFn = jest.fn();
		const mockEvents = {
			click: () => mockFn,
			submit: () => mockFn,
		};
		const component = new Button({
			attributes: {
				type: "type",
				id: "id",
				class: "class",
			},
			children: "<div>child</div>",
			events: mockEvents,
		});
		const content = component.getContent();

		expect(content.getAttribute("type")).toBe("type");
		expect(content.id).toBe("id");
		expect(content.className).toBe("class");
		expect(content.textContent).toContain("child");
	});
});
