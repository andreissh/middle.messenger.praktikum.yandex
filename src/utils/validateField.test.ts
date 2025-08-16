import validateField from "./validateField";

describe("validateField", () => {
	describe("empty field validation", () => {
		it("should return error for empty field", () => {
			const result = validateField("first_name", "   ");
			expect(result).toEqual({
				valid: false,
				error: "Поле не может быть пустым",
			});
		});
	});

	describe("name fields validation", () => {
		const nameFields = ["first_name", "second_name"];
		const errorMessage =
			"Первая буква должна быть заглавной, только буквы и дефис, без пробелов и цифр";

		nameFields.forEach((field) => {
			it(`should validate ${field} correctly`, () => {
				expect(validateField(field, "Иван")).toEqual({ valid: true });
				expect(validateField(field, "Анна-Мария")).toEqual({ valid: true });

				expect(validateField(field, "иван")).toEqual({
					valid: false,
					error: errorMessage,
				});
				expect(validateField(field, "Иван1")).toEqual({
					valid: false,
					error: errorMessage,
				});
				expect(validateField(field, "Иван Иванов")).toEqual({
					valid: false,
					error: errorMessage,
				});
				expect(validateField(field, "")).toEqual({
					valid: false,
					error: "Поле не может быть пустым",
				});
			});
		});
	});

	describe("login validation", () => {
		const errorMessage =
			"От 3 до 20 символов, латиница, цифры, дефис, нижнее подчёркивание; не может состоять только из цифр";

		it("should validate login correctly", () => {
			expect(validateField("login", "user123")).toEqual({ valid: true });
			expect(validateField("login", "user_name")).toEqual({ valid: true });
			expect(validateField("login", "user-name")).toEqual({ valid: true });
			expect(validateField("login", "User123")).toEqual({ valid: true });

			expect(validateField("login", "us")).toEqual({
				valid: false,
				error: errorMessage,
			});
			expect(validateField("login", "this_login_is_way_too_long")).toEqual({
				valid: false,
				error: errorMessage,
			});
			expect(validateField("login", "123456")).toEqual({
				valid: false,
				error: errorMessage,
			});
			expect(validateField("login", "user@name")).toEqual({
				valid: false,
				error: errorMessage,
			});
			expect(validateField("login", "")).toEqual({
				valid: false,
				error: "Поле не может быть пустым",
			});
		});
	});

	describe("email validation", () => {
		it("should validate email correctly", () => {
			expect(validateField("email", "user@example.com")).toEqual({
				valid: true,
			});
			expect(validateField("email", "user.name@example.com")).toEqual({
				valid: true,
			});
			expect(validateField("email", "user123@example.com")).toEqual({
				valid: true,
			});

			expect(validateField("email", "user@example")).toEqual({
				valid: false,
				error: "Неверный формат email",
			});
			expect(validateField("email", "user.example.com")).toEqual({
				valid: false,
				error: "Неверный формат email",
			});
			expect(validateField("email", "user@.com")).toEqual({
				valid: false,
				error: "Неверный формат email",
			});
			expect(validateField("email", "")).toEqual({
				valid: false,
				error: "Поле не может быть пустым",
			});
		});
	});

	describe("password validation", () => {
		const errorMessage =
			"От 8 до 40 символов, обязательно заглавная буква и цифра";

		it("should validate password correctly", () => {
			expect(validateField("password", "Password1")).toEqual({ valid: true });
			expect(validateField("password", "Пароль123")).toEqual({ valid: true });
			expect(validateField("password", "A1b2C3d4")).toEqual({ valid: true });
			expect(validateField("password", "PASSWORD1")).toEqual({ valid: true });

			expect(validateField("password", "password1")).toEqual({
				valid: false,
				error: errorMessage,
			});
			expect(validateField("password", "Pass word1")).toEqual({
				valid: false,
				error: errorMessage,
			});
			expect(validateField("password", "Pass1")).toEqual({
				valid: false,
				error: errorMessage,
			});
			expect(validateField("password", "")).toEqual({
				valid: false,
				error: "Поле не может быть пустым",
			});
		});
	});

	describe("password_repeat validation", () => {
		it("should validate password_repeat correctly", () => {
			expect(
				validateField("password_repeat", "Password1", { password: "Password1" })
			).toEqual({ valid: true });
			expect(
				validateField("password_repeat", "Password1", { password: "Password2" })
			).toEqual({ valid: false, error: "Пароли не совпадают" });
			expect(
				validateField("password_repeat", "pass", { password: "pass" })
			).toEqual({
				valid: false,
				error: "От 8 до 40 символов, обязательно заглавная буква и цифра",
			});
		});
	});

	describe("phone validation", () => {
		it("should validate phone correctly", () => {
			expect(validateField("phone", "+79161234567")).toEqual({ valid: true });
			expect(validateField("phone", "89161234567")).toEqual({ valid: true });
			expect(validateField("phone", "9161234567")).toEqual({ valid: true });
			expect(validateField("phone", "+7 (916) 123-45-67")).toEqual({
				valid: true,
			});

			expect(validateField("phone", "916123")).toEqual({
				valid: false,
				error: "Телефон от 10 до 15 цифр, может начинаться с +",
			});
			expect(validateField("phone", "+791612345678901234")).toEqual({
				valid: false,
				error: "Телефон от 10 до 15 цифр, может начинаться с +",
			});
			expect(validateField("phone", "phone")).toEqual({
				valid: false,
				error: "Телефон от 10 до 15 цифр, может начинаться с +",
			});
			expect(validateField("phone", "")).toEqual({
				valid: false,
				error: "Поле не может быть пустым",
			});
		});
	});

	describe("password change fields", () => {
		const errorMessage =
			"От 8 до 40 символов, обязательно заглавная буква и цифра";

		it("should validate oldPassword correctly", () => {
			expect(validateField("oldPassword", "Password1")).toEqual({
				valid: true,
			});

			expect(validateField("oldPassword", "pass")).toEqual({
				valid: false,
				error: errorMessage,
			});
		});

		it("should validate newPassword correctly", () => {
			expect(validateField("newPassword", "Password1")).toEqual({
				valid: true,
			});

			expect(validateField("newPassword", "pass")).toEqual({
				valid: false,
				error: errorMessage,
			});
		});
	});

	describe("unknown field type", () => {
		it("should return valid for unknown field types", () => {
			expect(validateField("unknown_field", "any value")).toEqual({
				valid: true,
			});
		});
	});
});
