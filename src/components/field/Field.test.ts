import { jest } from "@jest/globals";
import Field from "./Field";

describe("Field", () => {
	it("renders component with attributes and children", () => {
		const mockFn = jest.fn();
		const mockEvents = {
			blur: () => mockFn(),
		};
		const component = new Field({
			attributes: {
				liClass: "liClass",
				labelClass: "labelClass",
				inputClass: "inputClass",
			},
			id: "id",
			label: "label",
			type: "type",
			name: "name",
			value: "value",
			autocomplete: "autocomplete",
			events: mockEvents,
		});
		const content = component.getContent();
		const label = content.querySelector("label");

		expect(content.className).toBe("liClass");
		expect(label?.className).toContain("labelClass");
		expect(label?.textContent).toContain("label");
	});
});
