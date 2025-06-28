import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import { PageProps } from "@/types/types";
import getFormData from "@/utils/getFormData";
import { validateField } from "@/utils/validate";
import LoginFields from "../components/login-fields/LoginFields";
import "./signin.css";

type SigninFieldConfig = {
	id: string;
	label: string;
	type: string;
	name: string;
};

const fields: SigninFieldConfig[] = [
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
	},
	{
		id: "password",
		label: "Пароль",
		type: "password",
		name: "password",
	},
];

const template = `
  <div class="signin-wrapper">
    <div class="signin-container">
      <h1 class="signin-header">Вход</h1>
      <form class="signin-form">
        {{{ fields }}}
        <div class="signin-form-signin-btn-container">
          {{{ SigninLink }}}
        </div>
      </form>

      <div class="signin-form-signup-btn-container">
        {{{ SignupLink }}}
      </div>
    </div>
  </div>
`;

export default class SigninPage extends Block {
	constructor(props: PageProps) {
		super("div", {
			fields: new LoginFields({
				fields,
			}) as LoginFields,
			SigninLink: new Link({
				href: "#",
				id: "renderChatsBtn",
				class: "btn",
				children: "Войти",
				events: {
					click: (e?: Event) => {
						e?.preventDefault();
						const form = this.element?.querySelector(
							".signin-form"
						) as HTMLFormElement;
						if (SigninPage.validateForm(form)) {
							const data = getFormData(form);
							if (data) {
								props.onChangePage("ChatsPage");
							}
						}
					},
				},
			}) as Link,
			SignupLink: new Link({
				href: "#",
				id: "renderSignupBtn",
				class: "btn-secondary",
				children: "Нет аккаунта?",
				events: {
					click: () => {
						props.onChangePage("SignupPage");
					},
				},
			}) as Link,
		});
	}

	static validateInput(input: HTMLInputElement) {
		const { name } = input;
		const { value } = input;
		const result = validateField(name, value);
		SigninPage.showValidationResult(input, result);
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

	static validateForm(form: HTMLFormElement) {
		let valid = true;
		const inputs = Array.from(form.elements).filter(
			(el): el is HTMLInputElement => el instanceof HTMLInputElement
		);

		valid = inputs.every((input) => SigninPage.validateInput(input));
		return valid;
	}

	render(): HTMLElement {
		return this.compile(template);
	}

	componentDidMount() {
		const form = this.element?.querySelector(".signin-form") as HTMLFormElement;
		if (form) {
			form.querySelectorAll("input").forEach((input) => {
				input.addEventListener("blur", () => SigninPage.validateInput(input));
			});
		}
	}
}
