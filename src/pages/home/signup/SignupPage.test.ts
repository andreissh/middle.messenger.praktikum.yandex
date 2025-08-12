import SignupPage from "./SignupPage";

describe("SignupPage", () => {
	it("renders page content on initial render", () => {
		const component = new SignupPage();
		const content = component.getContent();
		const header = content.querySelector(".signup-header");
		const form = content.querySelector(".signup-form");
		const labels = content.querySelectorAll(".field-label");
		const signupBtn = content.querySelector("#signup");
		const signinBtn = content.querySelector("#signin");

		expect(header?.textContent).toBe("Регистрация");
		expect(form).not.toBe(null);
		expect(labels[0].textContent).toBe("Почта");
		expect(labels[1].textContent).toBe("Логин");
		expect(labels[2].textContent).toBe("Имя");
		expect(labels[3].textContent).toBe("Фамилия");
		expect(labels[4].textContent).toBe("Телефон");
		expect(labels[5].textContent).toBe("Пароль");
		expect(labels[6].textContent).toBe("Пароль (еще раз)");
		expect(signupBtn?.textContent).toContain("Зарегистрироваться");
		expect(signinBtn?.textContent).toContain("Войти");
	});
});
