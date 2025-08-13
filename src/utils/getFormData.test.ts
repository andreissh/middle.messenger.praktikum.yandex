import getFormData from "./getFormData";

describe("getFormData", () => {
	beforeEach(() => {
		document.body.innerHTML = `
      <form id="test-form">
        <input type="text" name="username" value="username">
        <input type="email" name="email" value="mail@example.com">
        <input type="number" name="age" value="30">
        <input type="checkbox" name="subscribe" checked>
      </form>
      <form id="empty-form"></form>
    `;
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("should return form data as object", () => {
		const form = document.querySelector("#test-form") as HTMLFormElement;
		const result = getFormData(form);

		expect(result).toEqual({
			username: "username",
			email: "mail@example.com",
			age: "30",
			subscribe: "on",
		});
	});

	it("should return empty object for form with no inputs", () => {
		const form = document.querySelector("#empty-form") as HTMLFormElement;
		const result = getFormData(form);

		expect(result).toEqual({});
	});

	it("should return null when no form is provided", () => {
		expect(getFormData(null as any)).toBeNull();
		expect(getFormData(undefined as any)).toBeNull();
	});
});
