import Block from "@/framework/Block";

describe("ContextMenu", () => {
	it("renders component with attributes and children", () => {
		class ContextMenu extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", props);
			}

			render() {
				return this
					.compile(`<div class="context-menu" style="left: {{ x }}px; top: {{ y }}px;">
					{{{ children }}}
				</div>`);
			}
		}

		const component = new ContextMenu({
			x: "10",
			y: "20",
			children: "<div>child</div>",
		});
		const content = component.getContent();

		expect(content.getAttribute("style")).toContain("10");
		expect(content.getAttribute("style")).toContain("20");
		expect(content.textContent).toContain("child");
	});
});
