import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import { PageProps } from "@/types/types";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { ValidationResult } from "@/utils/validate";
import { InputProps } from "@/pages/profile/utils/profileData";
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
	private validator?: FormValidator;

	private customChecks = {
		password_repeat: () => this.checkPasswordsMatch(),
	};

	constructor(props: PageProps) {
		super("div", {
			LoginFields: new LoginFields({
				fields,
				events: {
					blur: (e?: Event) => this.handleFieldBlur(e as Event),
				},
			}) as LoginFields,
			SignupLink: new Link({
				href: "#",
				id: "signup",
				class: "btn renderSigninBtn",
				children: "Зарегистрироваться",
				events: {
					click: (e?: Event) => this.handleSignup(e, props),
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

	private handleSignup(e: Event | undefined, props: PageProps): void {
		e?.preventDefault();
		const form = this.element?.querySelector(".signup-form") as HTMLFormElement;
		if (!form || !this.validator) return;

		if (this.validator.validateForm(this.customChecks)) {
			const data = getFormData(form);
			if (data) {
				props.onChangePage("SigninPage");
			}
		}
	}

	private handleFieldBlur(e: Event) {
		if (!this.validator) return;
		this.validator.handleBlur(e, this.customChecks);
	}

	componentDidMount() {
		const form = this.element?.querySelector(".signup-form") as HTMLFormElement;
		if (!form) return;

		this.validator = new FormValidator(form, ".login-field-item");
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
