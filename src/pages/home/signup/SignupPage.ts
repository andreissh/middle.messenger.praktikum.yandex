import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import { InputProps } from "@/pages/profile/utils/profileData";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { ValidationResult } from "@/types/types";
import Form from "@/components/form/Form";
import AuthService from "@/services/AuthService";
import LoginFields from "@/components/fields/Fields";
import "./signup.css";

const fields: Array<InputProps & { label: string }> = [
	{
		id: "email",
		label: "Почта",
		type: "text",
		name: "email",
		autocomplete: "email",
	},
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
		autocomplete: "login",
	},
	{
		id: "first_name",
		label: "Имя",
		type: "text",
		name: "first_name",
		autocomplete: "first_name",
	},
	{
		id: "second_name",
		label: "Фамилия",
		type: "text",
		name: "second_name",
		autocomplete: "second_name",
	},
	{
		id: "phone",
		label: "Телефон",
		type: "text",
		name: "phone",
		autocomplete: "phone",
	},
	{
		id: "password",
		label: "Пароль",
		type: "password",
		name: "password",
		autocomplete: "password",
	},
	{
		id: "password_repeat",
		label: "Пароль (еще раз)",
		type: "password",
		name: "password_repeat",
		autocomplete: "password_repeat",
	},
];

const template = `
  <div class="signup-wrapper">
    <div class="signup-container">
      <h1 class="signup-header">Регистрация</h1>
      {{{ SignupForm }}}
      <div class="signup-form-signin-btn-container">
        {{{ SigninBtn }}}
      </div>
    </div>
  </div>
`;

export default class SignupPage extends Block {
	private validator?: FormValidator;

	private customChecks = {
		password_repeat: () => this.checkPasswordsMatch(),
	};

	constructor() {
		super("div", {
			SignupForm: new Form({
				attributes: {
					class: "signup-form",
				},
				children: `
				    {{{ LoginFields }}}
					<div class="signup-form-signup-btn-container">
						{{{ SignupBtn }}}
					</div>
				`,
				LoginFields: new LoginFields({
					fields,
					events: {
						blur: (e?: Event) => this.handleFieldBlur(e),
					},
				}),
				SignupBtn: new Button({
					attributes: {
						id: "signup",
						class: "btn",
						type: "submit",
					},
					children: "Зарегистрироваться",
				}),
				events: {
					submit: (e?: Event) => this.handleSignupSubmit(e),
				},
			}),
			SigninBtn: new Button({
				attributes: {
					id: "signin",
					class: "btn-secondary",
				},
				children: "Войти",
				events: {
					click: () => SignupPage.handleSigninClick(),
				},
			}),
		});

		this.validator = this.initValidator();
	}

	private initValidator(): FormValidator {
		const form = this.element?.querySelector(".signup-form") as HTMLFormElement;
		if (!form) {
			throw new Error("Не найдена форма для инициализации валидатора");
		}

		return new FormValidator(form, ".login-field-item");
	}

	private checkPasswordsMatch(): ValidationResult {
		const form = this.element?.querySelector(".signup-form");
		if (!form) return { valid: false };

		const password = form.querySelector<HTMLInputElement>(
			'input[name="password"]'
		)?.value;
		const repeat = form.querySelector<HTMLInputElement>(
			'input[name="password_repeat"]'
		)?.value;

		const valid = password === repeat;
		return {
			valid,
			error: valid ? undefined : "Пароли не совпадают",
		};
	}

	private async handleSignupSubmit(e?: Event): Promise<void> {
		e?.preventDefault();
		const form = this.element?.querySelector(".signup-form") as HTMLFormElement;
		if (!form || !this.validator) return;

		if (this.validator.validateForm(this.customChecks)) {
			const data = getFormData(form);
			if (data) {
				await AuthService.signup(data);
				router.go("/messenger");
			}
		}
	}

	private static handleSigninClick(): void {
		router.go("/");
	}

	private handleFieldBlur(e?: Event) {
		if (!this.validator) return;
		if (e) {
			this.validator.handleBlur(e, this.customChecks);
		}
	}

	componentDidMount() {
		this.validator = this.initValidator();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
