import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage", () => {
	it("renders component with attributes and children", () => {
		const component = new NotFoundPage();
		const content = component.getContent();

		const h1 = content.querySelector("h1");
		const button = content.querySelector("button");

		expect(h1).not.toBe(null);
		expect(h1?.textContent).toBe("404");
		expect(button?.textContent).toContain("Назад к чатам");
	});
});
