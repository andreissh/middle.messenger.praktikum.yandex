import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import { InputProps } from "@/pages/profile/utils/profileData";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import Form from "@/components/form/Form";
import AuthService from "@/services/AuthService";
import { AuthData } from "@/types/types";
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
      {{{ SigninForm }}}
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
			SignupBtn: new Button({
				id: "renderSignupBtn",
				class: "btn-secondary",
				children: "Нет аккаунта?",
				events: {
					click: () => SigninPage.handleSignupClick(),
				},
			}),
			SigninForm: new Form({
				class: "signin-form",
				children: `
				    {{{ fields }}}
					<div class="signin-form-signin-btn-container">
						{{{ SigninBtn }}}
					</div>
				`,
				fields: new LoginFields({
					fields,
					events: {
						blur: (e?: Event) => this.handleFieldBlur(e),
					},
				}),
				SigninBtn: new Button({
					id: "renderChatsBtn",
					class: "btn",
					children: "Войти",
					type: "submit",
				}),
				events: {
					submit: (e?: Event) => this.handleSigninSubmit(e),
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

	private async handleSigninSubmit(e?: Event): Promise<void> {
		e?.preventDefault();
		const form = this.element?.querySelector(".signin-form") as HTMLFormElement;
		if (!form) return;

		if (this.validator && this.validator.validateForm()) {
			const data = getFormData(form) as AuthData;
			if (data) {
				await AuthService.signin(data);
				const { id } = await AuthService.userInfo();
				localStorage.setItem("userId", String(id));
				router.go("/messenger");
			}
		}
	}

	private static handleSignupClick(): void {
		router.go("/sign-up");
	}

	componentDidMount() {
		this.validator = this.initValidator();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
