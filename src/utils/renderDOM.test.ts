/* eslint-disable max-classes-per-file */
import { jest } from "@jest/globals";
import Block from "@/framework/Block";
import renderDOM from "./renderDOM";

class TestComponent extends Block {
	constructor() {
		super("div");
	}

	render(): HTMLElement {
		const element = document.createElement("div");
		element.textContent = "Test Content";
		return element;
	}
}

describe("renderDOM", () => {
	let testComponent: TestComponent;

	beforeEach(() => {
		testComponent = new TestComponent();
		document.body.innerHTML = '<div id="app"></div><div id="other"></div>';
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should throw an error if root element is not found", () => {
		expect(() => renderDOM("#nonexistent", testComponent)).toThrow(
			'Не найден корневой элемент: "#nonexistent"'
		);
	});

	it("should clear the root element before appending content", () => {
		const root = document.querySelector("#app")!;
		root.innerHTML = "<p>existing content</p>";

		renderDOM("#app", testComponent);

		expect(root.innerHTML).toBe("<div>Test Content</div>");
		expect(root.hasChildNodes()).toBe(true);
	});

	it("should append block content to the root element", () => {
		renderDOM("#app", testComponent);

		const root = document.querySelector("#app")!;
		expect(root.firstChild?.textContent).toBe("Test Content");
	});

	it("should call dispatchComponentDidMount by default", () => {
		const spy = jest.spyOn(testComponent, "dispatchComponentDidMount");
		renderDOM("#app", testComponent);

		expect(spy).toHaveBeenCalledTimes(1);
	});

	it("should not call dispatchComponentDidMount when didMount is true", () => {
		const spy = jest.spyOn(testComponent, "dispatchComponentDidMount");
		renderDOM("#app", testComponent, true);

		expect(spy).not.toHaveBeenCalled();
	});

	it("should work with different selectors", () => {
		renderDOM("#other", testComponent);

		const root = document.querySelector("#other")!;
		expect(root.firstChild?.textContent).toBe("Test Content");
	});

	it("should handle multiple render calls", () => {
		renderDOM("#app", testComponent);
		const root = document.querySelector("#app")!;
		expect(root.firstChild?.textContent).toBe("Test Content");

		class SecondComponent extends Block {
			render(): HTMLElement {
				const element = document.createElement("div");
				element.textContent = "Second Content";
				return element;
			}
		}

		const secondComponent = new SecondComponent();
		renderDOM("#app", secondComponent);
		expect(root.firstChild?.textContent).toBe("Second Content");
	});
});
