import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import { PageProps } from "@/types/types";
import getFormData from "@/utils/getFormData";
import { validateField } from "@/utils/validate";
import LoginFields from "../components/login-fields/LoginFields";
import "./signup.css";

type SignupFieldConfig = {
	id: string;
	label: string;
	type: string;
	name: string;
};

const fields: SignupFieldConfig[] = [
	{
		id: "email",
		label: "Почта",
		type: "text",
		name: "email",
	},
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
	},
	{
		id: "first_name",
		label: "Имя",
		type: "text",
		name: "first_name",
	},
	{
		id: "second_name",
		label: "Фамилия",
		type: "text",
		name: "second_name",
	},
	{
		id: "phone",
		label: "Телефон",
		type: "text",
		name: "phone",
	},
	{
		id: "password",
		label: "Пароль",
		type: "password",
		name: "password",
	},
	{
		id: "password_repeat",
		label: "Пароль (еще раз)",
		type: "password",
		name: "password_repeat",
	},
];

const template = `
  <div class="signup-wrapper">
    <div class="signup-container">
      <h1 class="signup-header">Регистрация</h1>
      <form class="signup-form">
        {{{ LoginFields }}}
        <div class="signup-form-signup-btn-container">
          {{{ SignupLink }}}
        </div>
      </form>

      <div class="signup-form-signin-btn-container">
        {{{ SigninLink }}}
      </div>
    </div>
  </div>
`;

export default class SignupPage extends Block {
	constructor(props: PageProps) {
		super("div", {
			LoginFields: new LoginFields({
				fields,
			}) as LoginFields,
			SignupLink: new Link({
				href: "#",
				id: "signup",
				class: "btn renderSigninBtn",
				children: "Зарегистрироваться",
				events: {
					click: (e?: Event) => {
						e?.preventDefault();
						const form = this.element?.querySelector(
							".signup-form"
						) as HTMLFormElement;
						if (this.validateForm(form)) {
							const data = getFormData(form);
							if (data && data.password !== data.password_repeat) {
								const input = form.querySelector(
									'input[name="password_repeat"]'
								) as HTMLInputElement;
								SignupPage.showValidationResult(input, {
									valid: false,
									error: "Пароли не совпадают",
								});
								return;
							}
							props.onChangePage("SigninPage");
						}
					},
				},
			}) as Link,
			SigninLink: new Link({
				href: "#",
				id: "signin",
				class: "btn-secondary renderSigninBtn",
				children: "Войти",
				events: {
					click: () => {
						props.onChangePage("SigninPage");
					},
				},
			}) as Link,
		});
	}

	validateInput(input: HTMLInputElement) {
		const { name, value } = input;
		if (name === "password_repeat") {
			const passwordInput = this.element?.querySelector(
				'input[name="password"]'
			) as HTMLInputElement;
			const valid = value === passwordInput.value;
			SignupPage.showValidationResult(input, {
				valid,
				error: "Пароли не совпадают",
			});
			return valid;
		}
		const result = validateField(name, value);
		SignupPage.showValidationResult(input, result);
		return result.valid;
	}

	static showValidationResult(
		input: HTMLInputElement,
		result: { valid: boolean; error?: string }
	) {
		const fieldContainer = input.closest(".login-field-item");
		if (!fieldContainer) return;

		let errorEl = fieldContainer.nextElementSibling as HTMLElement | null;

		if (!result.valid) {
			if (!errorEl || !errorEl.classList.contains("error-message")) {
				errorEl = document.createElement("span");
				errorEl.className = "error-message";
				fieldContainer.after(errorEl);
			}
			errorEl.textContent = result.error || "Ошибка";
			return;
		}

		if (errorEl && errorEl.classList.contains("error-message")) {
			errorEl.remove();
		}
	}

	validateForm(form: HTMLFormElement) {
		const inputs = Array.from(form.elements).filter(
			(el): el is HTMLInputElement => el instanceof HTMLInputElement
		);

		return inputs.every((input) => this.validateInput(input));
	}

	componentDidMount() {
		const form = this.element?.querySelector(".signup-form") as HTMLFormElement;
		if (form) {
			form.querySelectorAll("input").forEach((input) => {
				input.addEventListener("blur", () => this.validateInput(input));
			});
		}
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
