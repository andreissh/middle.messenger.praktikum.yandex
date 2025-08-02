import Block from "@/framework/Block";

describe("Avatar", () => {
	it("renders component with attributes and children", () => {
		class Avatar extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", props);
			}

			render() {
				return this.compile(`<span class="{{ class }}" name="{{ name }}">
					{{{ children }}}
				</span>`);
			}
		}

		const component = new Avatar({
			class: "class",
			name: "name",
			children: "<div>child</div>",
		});
		const content = component.getContent();

		expect(content.getAttribute("class")).toBe("class");
		expect(content.getAttribute("name")).toBe("name");
		expect(content.textContent).toContain("child");
	});
});
