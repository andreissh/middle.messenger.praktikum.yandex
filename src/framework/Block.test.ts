/* eslint-disable max-classes-per-file */
import { jest } from "@jest/globals";
import Block from "./Block";

describe("Block component with Handlebars", () => {
	it("should handle basic props", () => {
		class TestComponent extends Block {
			render() {
				return this.compile("<div>{{text}}</div>");
			}
		}

		const component = new TestComponent("div", { text: "Text" });
		const content = component.getContent();

		expect(content.textContent).toBe("Text");
	});

	it("should handle events", () => {
		const mockClickHandler = jest.fn();

		class TestComponent extends Block {
			render() {
				return this.compile("<div>{{text}}</div>");
			}
		}

		const component = new TestComponent("div", {
			text: "Click me",
			events: {
				click: mockClickHandler,
			},
		});

		const content = component.getContent();
		content.click();

		expect(mockClickHandler).toHaveBeenCalledTimes(1);
	});

	it("should handle attributes", () => {
		class TestComponent extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", props);
			}

			render() {
				return this.compile(`<div id="{{attributes.id}}">{{text}}</div>`);
			}
		}

		const component = new TestComponent({
			text: "Click me",
			attributes: {
				id: "test-id",
			},
		});
		const content = component.getContent();

		expect(content.getAttribute("id")).toBe("test-id");
	});

	it("should handle child components", () => {
		class ChildComponent extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", props);
			}

			render() {
				return this.compile("<div>{{childText}}</div>");
			}
		}

		class ParentComponent extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", {
					...props,
					child: new ChildComponent({ childText: "Child Text" }),
				});
			}

			render() {
				return this.compile("<div>{{text}} {{{child}}}</div>");
			}
		}

		const parent = new ParentComponent({ text: "Parent Text" });
		const content = parent.getContent();

		expect(content.textContent).toContain("Parent Text");
		expect(content.textContent).toContain("Child Text");
	});

	it("should handle lists with basic props", () => {
		const items = [`Item 1`, `Item 2`];

		class ListComponent extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", {
					...props,
					items,
				});
			}

			render() {
				return this.compile("<div>{{{items}}}</div>");
			}
		}

		const listComponent = new ListComponent();
		const content = listComponent.getContent();

		expect(content.innerHTML).toContain("Item 1");
		expect(content.innerHTML).toContain("Item 2");
	});

	it("should handle lists of components", () => {
		class ListItem extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", props);
			}

			render() {
				return this.compile("<li>{{itemText}}</li>");
			}
		}

		const items = [
			new ListItem({ itemText: "Item 1" }),
			new ListItem({ itemText: "Item 2" }),
		];

		class ListComponent extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", {
					...props,
					items,
				});
			}

			render() {
				return this.compile("<ul>{{{items}}}</ul>");
			}
		}

		const listComponent = new ListComponent();
		const content = listComponent.getContent();

		expect(content.innerHTML).toContain("Item 1");
		expect(content.innerHTML).toContain("Item 2");
	});

	it("should update when props change", () => {
		class TestComponent extends Block {
			render() {
				return this.compile("<div>{{text}}</div>");
			}
		}

		const component = new TestComponent("div", { text: "Initial" });
		const initialContent = component.getContent();
		expect(initialContent.textContent).toBe("Initial");

		component.setProps({ text: "Updated" });
		const updatedContent = component.getContent();
		expect(updatedContent.textContent).toBe("Updated");
	});

	it("should handle child components via children prop", () => {
		class ChildComponent extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", props);
			}

			render() {
				return this.compile("<div>{{childText}}</div>");
			}
		}

		class ParentComponent extends Block {
			constructor(props: Record<string, unknown> = {}) {
				super("div", {
					...props,
					children: `<div>{{childrenPropText}} {{{Child}}}</div>`,
					childrenPropText: "Children Prop Text",
					Child: new ChildComponent({
						childText: "Child Text",
					}),
				});
			}

			render() {
				return this.compile("<div>{{text}} {{{children}}}</div>");
			}
		}

		const parent = new ParentComponent({ text: "Parent Text" });
		const content = parent.getContent();

		expect(content.textContent).toContain("Parent Text");
		expect(content.textContent).toContain("Children Prop Text");
		expect(content.textContent).toContain("Child Text");
	});
});

describe("Block methods", () => {
	it("should proxy props correctly", () => {
		class TestComponent extends Block {
			render() {
				return this.compile("<div>{{text}}</div>");
			}
		}

		const component = new TestComponent("div", {
			text: "Text",
		});

		expect(component.props.text).toBe("Text");

		component.setProps({ text: "New Text" });
		expect(component.props.text).toBe("New Text");

		expect(() => delete component.props.text).toThrow("Нет доступа");
	});
});

describe("Block Lifecycle", () => {
	it("should trigger componentDidMount for parent and children", () => {
		const mockChild = {
			dispatchComponentDidMount: jest.fn(),
		} as unknown as Block;

		class TestComponent extends Block {
			public didMountCalled = false;

			componentDidMount() {
				this.didMountCalled = true;
			}

			constructor() {
				super("div", {});
				(this as any).children = { child: mockChild };
			}

			render() {
				return this.compile("<div></div>");
			}
		}

		const component = new TestComponent();
		component.dispatchComponentDidMount();

		expect(component.didMountCalled).toBe(true);

		expect(mockChild.dispatchComponentDidMount).toHaveBeenCalled();
	});

	it("should trigger componentDidUpdate and conditionally re-render", () => {
		const renderSpy = jest.spyOn(Block.prototype as any, "_render");

		class TestComponent extends Block {
			public updateCalled = false;

			componentDidUpdate() {
				this.updateCalled = true;
				return true;
			}

			render() {
				return this.compile("<div></div>");
			}
		}

		const component = new TestComponent("div", { prop: "old" });

		component.setProps({ prop: "new" });

		expect(component.updateCalled).toBe(true);
		expect(renderSpy).toHaveBeenCalled();
		renderSpy.mockRestore();
	});

	it("should not re-render when componentDidUpdate returns false", () => {
		class TestComponent extends Block {
			constructor() {
				super("div", {});
				(this as any)._eventBus = {
					emit: jest.fn(),
					on: jest.fn(),
					off: jest.fn(),
				};
			}

			component() {
				return false;
			}

			render() {
				return this.compile("<div></div>");
			}
		}

		const component = new TestComponent();
		component.setProps({ newProp: "value" });

		const { emit } = (component as any)._eventBus;

		expect(emit).toHaveBeenCalledWith(
			Block.EVENTS.FLOW_CDU,
			expect.anything(),
			expect.anything()
		);

		expect(emit).not.toHaveBeenCalledWith(Block.EVENTS.FLOW_RENDER);
	});
});
