import SigninPage from "./SigninPage";

describe("SigninPage", () => {
	it("renders page content on initial render", () => {
		const component = new SigninPage();
		const content = component.getContent();
		const header = content.querySelector(".signin-header");
		const form = content.querySelector(".signin-form");
		const labels = content.querySelectorAll(".field-label");
		const submitBtn = content.querySelector("#renderChatsBtn");
		const signupBtn = content.querySelector("#renderSignupBtn");

		expect(header?.textContent).toBe("Вход");
		expect(form).not.toBe(null);
		expect(labels[0].textContent).toBe("Логин");
		expect(labels[1].textContent).toBe("Пароль");
		expect(submitBtn?.textContent).toContain("Войти");
		expect(signupBtn?.textContent).toContain("Нет аккаунта?");
	});
});
