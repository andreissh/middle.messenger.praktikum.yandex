import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import { InputProps } from "@/pages/profile/utils/profileData";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { SignupData } from "@/types/types";
import Form from "@/components/form/Form";
import AuthService from "@/services/AuthService";
import Fields from "@/components/fields/Fields";
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

	constructor() {
		super("div", {
			SignupForm: new Form({
				attributes: {
					class: "signup-form",
				},
				children: `
				  {{{ Fields }}}
					<div class="signup-form-signup-btn-container">
						{{{ SignupBtn }}}
					</div>
				`,
				Fields: new Fields({
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
	}

	private initValidator(): FormValidator {
		const form = document.querySelector<HTMLFormElement>(".signup-form");
		if (!form) {
			throw new Error("Не найдена форма для инициализации валидатора");
		}

		return new FormValidator(form, ".field-item");
	}

	private async handleSignupSubmit(e?: Event): Promise<void> {
		e?.preventDefault();
		const form = document.querySelector<HTMLFormElement>(".signup-form");
		if (!form || !this.validator) return;

		if (this.validator.validateForm()) {
			const data = getFormData(form);
			if (data) {
				await AuthService.signup(data as SignupData);
				router.go("/messenger");
			}
		}
	}

	private static handleSigninClick(): void {
		router.go("/");
	}

	private handleFieldBlur(e?: Event): void {
		const target = e?.target as HTMLElement;
		const input = target.closest<HTMLInputElement>(".field-input");
		if (!this.validator || !input) return;

		this.validator.validateInput(input);
	}

	componentDidMount() {
		this.validator = this.initValidator();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
