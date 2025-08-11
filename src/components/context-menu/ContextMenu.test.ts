import ContextMenu from "./ContextMenu";

describe("ContextMenu", () => {
	it("renders component with attributes and children", () => {
		const component = new ContextMenu({
			x: 10,
			y: 20,
			children: "<div>child</div>",
		});
		const content = component.getContent();

		expect(content.getAttribute("style")).toContain("10");
		expect(content.getAttribute("style")).toContain("20");
		expect(content.textContent).toContain("child");
	});
});
