import ProfileEditPage from "./ProfileEditPage";

describe("ProfileEditPage", () => {
	it("renders profile edit page content on initial render", () => {
		const component = new ProfileEditPage();
		const content = component.getContent();
		const backBtn = content.querySelector("#backBtn");
		const avatar = content.querySelector(".profile-edit-avatar");
		const labels = content.querySelectorAll(".profile-field-label");
		const submitBtn = content.querySelector("#save");

		expect(backBtn).not.toBe(null);
		expect(avatar).not.toBe(null);
		expect(labels[0].textContent).toBe("Почта");
		expect(labels[1].textContent).toBe("Логин");
		expect(labels[2].textContent).toBe("Имя");
		expect(labels[3].textContent).toBe("Фамилия");
		expect(labels[4].textContent).toBe("Имя в чате");
		expect(labels[5].textContent).toBe("Телефон");
		expect(submitBtn?.textContent).toContain("Сохранить");
	});
});
