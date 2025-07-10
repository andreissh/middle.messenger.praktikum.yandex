import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { InputProps } from "@/pages/profile/utils/profileData";
import LoginFields from "../components/login-fields/LoginFields";
import "./signin.css";
import { router } from "@/routes/Router";
import http from "@/api/http";
import { HttpError } from "@/types/types";

const fields: Array<InputProps & { label: string }> = [
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
		autocomplete: "login",
	},
	{
		id: "password",
		label: "Пароль",
		type: "password",
		name: "password",
		autocomplete: "password",
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
	private validator?: FormValidator;

	constructor() {
		super("div", {
			fields: new LoginFields({
				fields,
				events: {
					blur: (e?: Event) => this.handleFieldBlur(e as Event),
				},
			}) as LoginFields,
			SigninLink: new Link({
				href: "#",
				id: "renderChatsBtn",
				class: "btn",
				children: "Войти",
				events: {
					click: (e?: Event) => this.handleSigninClick(e),
				},
			}) as Link,
			SignupLink: new Link({
				href: "#",
				id: "renderSignupBtn",
				class: "btn-secondary",
				children: "Нет аккаунта?",
				events: {
					click: () => router.go("/signup"),
				},
			}) as Link,
		});

		this.validator = this.initValidator();
	}

	private initValidator(): FormValidator {
		const form = this.element?.querySelector(".signin-form") as HTMLFormElement;
		if (!form) {
			throw new Error("Form not found for validator initialization");
		}
		return new FormValidator(form, ".login-field-item");
	}

	private handleFieldBlur(e: Event): void {
		const input = (e.target as HTMLElement).closest("input.login-field-input");

		if (!this.validator || !input) return;

		this.validator.validateInput(input as HTMLInputElement);
	}

	private async handleSigninClick(e: Event | undefined): Promise<void> {
		e?.preventDefault();
		const form = this.element?.querySelector(".signin-form") as HTMLFormElement;
		if (!form) return;

		if (this.validator && this.validator.validateForm()) {
			const data = getFormData(form);
			if (data) {
				try {
					await http.post("auth/signin", {
						body: {
							login: data.login,
							password: data.password,
						},
					});

					router.go("/chats");
				} catch (err) {
					const error = err as HttpError;
					if (error.status === 400) {
						console.error("Неверный логин или пароль");
					} else {
						console.error("Ошибка:", error);
					}
				}
			}
		}
	}

	componentDidMount() {
		this.validator = this.initValidator();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
