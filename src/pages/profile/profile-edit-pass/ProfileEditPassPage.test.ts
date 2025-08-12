import ProfileEditPassPage from "./ProfileEditPassPage";

describe("ProfileEditPassPage", () => {
	it("renders profile edit pass page content on initial render", () => {
		const component = new ProfileEditPassPage();
		const content = component.getContent();
		const backBtn = content.querySelector("#backBtn");
		const avatar = content.querySelector(".profile-edit-pass-avatar");
		const labels = content.querySelectorAll(".profile-field-label");
		const submitBtn = content.querySelector("#save");

		expect(backBtn).not.toBe(null);
		expect(avatar).not.toBe(null);
		expect(labels[0].textContent).toBe("Старый пароль");
		expect(labels[1].textContent).toBe("Новый пароль");
		expect(labels[2].textContent).toBe("Повторите пароль");
		expect(submitBtn?.textContent).toContain("Сохранить");
	});
});
