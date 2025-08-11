import { jest } from "@jest/globals";
import Fields from "./Fields";

describe("Fields", () => {
	it("renders component with attributes and children", () => {
		const mockFn = jest.fn();
		const mockEvents = {
			blur: () => mockFn(),
		};
		const component = new Fields({
			attributes: {
				class: "class",
				liClass: "liClass",
				labelClass: "labelClass",
				inputClass: "inputClass",
			},
			fields: [],
			events: mockEvents,
		});
		const content = component.getContent();

		expect(content.className).toBe("class");
	});

	it("renders li item per field item", () => {
		const mockFn = jest.fn();
		const mockEvents = {
			blur: () => mockFn(),
		};
		const component = new Fields({
			attributes: {
				class: "class",
				liClass: "liClass",
				labelClass: "labelClass",
				inputClass: "inputClass",
			},
			fields: [
				{
					id: "id",
					label: "label",
					type: "type",
					name: "name",
					value: "value",
					autocomplete: "autocomplete",
				},
				{
					id: "id_2",
					label: "label_2",
					type: "type_2",
					name: "name_2",
					value: "value_2",
					autocomplete: "autocomplete_2",
				},
			],
			events: mockEvents,
		});
		const content = component.getContent();
		const listItems = content.querySelectorAll("li");

		expect(listItems.length).toBe(2);
	});
});
