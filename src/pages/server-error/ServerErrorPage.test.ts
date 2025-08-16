import ServerErrorPage from "./ServerErrorPage";

describe("NotFoundPage", () => {
	it("renders component with attributes and children", () => {
		const component = new ServerErrorPage();
		const content = component.getContent();

		const h1 = content.querySelector("h1");
		const button = content.querySelector("button");

		expect(h1).not.toBe(null);
		expect(h1?.textContent).toBe("500");
		expect(button?.textContent).toContain("Назад к чатам");
	});
});
