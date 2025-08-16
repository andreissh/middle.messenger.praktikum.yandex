import ProfileInfoPage from "./ProfileInfoPage";

describe("ProfileInfoPage", () => {
	it("renders profile info page content on initial render", () => {
		const component = new ProfileInfoPage();
		const content = component.getContent();
		const backBtn = content.querySelector("#backBtn");
		const avatar = content.querySelector(".profile-info-avatar");
		const name = content.querySelector(".profile-info-username");
		const labels = content.querySelectorAll(".profile-field-label");
		const editBtn = content.querySelector("#renderProfileEditBtn");
		const editPassBtn = content.querySelector("#renderProfileEditPassBtn");
		const logoutBtn = content.querySelector("#renderSigninBtn");

		expect(backBtn).not.toBe(null);
		expect(avatar).not.toBe(null);
		expect(name?.textContent).not.toBe(null);
		expect(labels[0].textContent).toBe("Почта");
		expect(labels[1].textContent).toBe("Логин");
		expect(labels[2].textContent).toBe("Имя");
		expect(labels[3].textContent).toBe("Фамилия");
		expect(labels[4].textContent).toBe("Имя в чате");
		expect(labels[5].textContent).toBe("Телефон");
		expect(editBtn?.textContent).toContain("Изменить данные");
		expect(editPassBtn?.textContent).toContain("Изменить пароль");
		expect(logoutBtn?.textContent).toContain("Выйти");
	});
});
