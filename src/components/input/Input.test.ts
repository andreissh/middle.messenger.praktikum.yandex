import Block from "@/framework/Block";

describe("Input", () => {
	it("renders component with attributes and children", () => {
		class Input extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", props);
			}

			render() {
				return this.compile(`<input
					id="{{ id }}"
					class="{{ class }}"
					type="{{ type }}"
					name="{{ name }}"
					value="{{ value }}"
					placeholder="{{ placeholder }}"
					autocomplete="{{ autocomplete }}"
					{{#if readonly}}readonly{{/if}}
				/>`);
			}
		}

		const component = new Input({
			id: "id",
			class: "class",
			type: "type",
			value: "value",
		});
		const content = component.getContent();

		expect(content.getAttribute("id")).toBe("id");
		expect(content.getAttribute("class")).toBe("class");
		expect(content.getAttribute("type")).toBe("type");
		expect(content.getAttribute("value")).toBe("value");
	});
});
