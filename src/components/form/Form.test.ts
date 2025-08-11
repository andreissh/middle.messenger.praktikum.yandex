import { jest } from "@jest/globals";
import Form from "./Form";

describe("Form", () => {
	it("renders component with attributes and children", () => {
		const mockFn = jest.fn();
		const mockEvents = {
			submit: () => mockFn,
		};
		const component = new Form({
			attributes: {
				class: "class",
			},
			children: "<div>child</div>",
			events: mockEvents,
		});
		const content = component.getContent();

		expect(content.className).toBe("class");
		expect(content.textContent).toContain("child");
	});
});
