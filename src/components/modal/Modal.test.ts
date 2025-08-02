/* eslint-disable max-classes-per-file */
import Block from "@/framework/Block";

describe("Modal", () => {
	it("renders component with attributes and children", () => {
		class Button extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", props);
			}

			render() {
				return this.compile(`<button>
					{{btnText}}
				</button>`);
			}
		}

		class Modal extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", {
					...props,
					CloseBtn: new Button({
						btnText: "btnText",
					}),
				});
			}

			render() {
				return this.compile(`<div id="{{ id }}">
					<div>
						<div>
							{{{ CloseBtn }}}
							<h2>{{ title }}</h2>
						</div>
						<div>
							{{{ children }}}
						</div>
					</div>
				</div>`);
			}
		}

		const component = new Modal({
			id: "id",
			title: "title",
			children: "<div>child</div>",
		});
		const content = component.getContent();

		expect(content.getAttribute("id")).toBe("id");
		expect(content.textContent).toContain("title");
		expect(content.textContent).toContain("child");
	});
});
