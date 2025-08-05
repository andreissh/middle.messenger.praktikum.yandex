import Block from "@/framework/Block";

describe("Form", () => {
	it("renders component with attributes and children", () => {
		class Form extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", props);
			}

			render() {
				return this.compile(`<form class="{{ class }}">
					{{{ children }}}
				</form>`);
			}
		}

		const component = new Form({
			class: "class",
			children: "<div>child</div>",
		});
		const content = component.getContent();

		expect(content.getAttribute("class")).toBe("class");
		expect(content.textContent).toContain("child");
	});
});
