import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import { InputProps } from "@/pages/profile/utils/profileData";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { HttpError, ValidationResult } from "@/types/types";
import http from "@/api/HttpClient";
import { IRouteManager } from "@/interfaces/IRouteManager";
import Form from "@/components/form/Form";
import LoginFields from "../components/login-fields/LoginFields";
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
				class: "signup-form",
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
					id: "signup",
					class: "btn",
					children: "Зарегистрироваться",
					type: "submit",
				}),
				events: {
					submit: (e?: Event) => this.handleSignupSubmit(e),
				},
			}),
			SigninBtn: new Button({
				id: "signin",
				class: "btn-secondary",
				children: "Войти",
				events: {
					click: (e?: Event) => SignupPage.handleSigninClick(e),
				},
			}),
		});

		this.validator = this.initValidator();
	}

	private static routeManager?: IRouteManager;

	static setRouteManager(manager: IRouteManager) {
		this.routeManager = manager;
	}

	private initValidator(): FormValidator {
		const form = this.element?.querySelector(".signup-form") as HTMLFormElement;
		if (!form) {
			throw new Error("Form not found for validator initialization");
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
				try {
					const response: { id: number } = await http.post("/auth/signup", {
						body: {
							first_name: data.first_name,
							second_name: data.second_name,
							login: data.login,
							email: data.email,
							password: data.password,
							phone: data.phone,
						},
					});

					localStorage.setItem("isSignedIn", "true");
					localStorage.setItem("userId", String(response.id));
					SignupPage.routeManager?.updateRoutes();
					router.go("/");
				} catch (err) {
					const error = err as HttpError;
					if (error.status === 400) {
						throw new Error("Неверный логин или пароль", { cause: err });
					} else {
						throw new Error("Ошибка при регистрации", { cause: err });
					}
				}
			}
		}
	}

	private static handleSigninClick(e?: Event): void {
		e?.preventDefault();
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
