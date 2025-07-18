import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import { InputProps } from "@/pages/profile/utils/profileData";
import http from "@/api/http";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { HttpError } from "@/types/types";
import LoginFields from "../components/login-fields/LoginFields";
import "./signin.css";

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
          {{{ SigninBtn }}}
        </div>
      </form>
      <div class="signin-form-signup-btn-container">
        {{{ SignupBtn }}}
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
					blur: (e?: Event) => this.handleFieldBlur(e),
				},
			}) as LoginFields,
			SigninBtn: new Button({
				id: "renderChatsBtn",
				class: "btn",
				children: "Войти",
				events: {
					click: (e?: Event) => this.handleSigninClick(e),
				},
			}),
			SignupBtn: new Button({
				id: "renderSignupBtn",
				class: "btn-secondary",
				children: "Нет аккаунта?",
				events: {
					click: (e?: Event) => SigninPage.handleSignupClick(e),
				},
			}),
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

	private handleFieldBlur(e?: Event): void {
		const input = (e?.target as HTMLElement).closest("input.login-field-input");

		if (!this.validator || !input) return;

		this.validator.validateInput(input as HTMLInputElement);
	}

	private async handleSigninClick(e?: Event): Promise<void> {
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

					localStorage.setItem("isSignedIn", "true");
					router.go("/messenger");
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

	private static handleSignupClick(e?: Event): void {
		e?.preventDefault();
		router.go("/sign-up");
	}

	componentDidMount() {
		this.validator = this.initValidator();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
