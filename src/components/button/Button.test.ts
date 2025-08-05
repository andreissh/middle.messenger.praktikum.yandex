import Block from "@/framework/Block";

describe("Button", () => {
	it("renders component with attributes and children", () => {
		class Button extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", props);
			}

			render() {
				return this.compile(`
					<button type="{{ type }}" id="{{ id }}" class="{{ class }}">
						{{{ children }}}
					</button>
				`);
			}
		}

		const component = new Button({
			type: "type",
			id: "id",
			class: "class",
			children: "<div>child</div>",
		});
		const content = component.getContent();

		expect(content.getAttribute("type")).toBe("type");
		expect(content.getAttribute("id")).toBe("id");
		expect(content.getAttribute("class")).toBe("class");
		expect(content.textContent).toContain("child");
	});
});
