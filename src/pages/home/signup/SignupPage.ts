import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { SignupReq } from "@/types/types";
import Form from "@/components/form/Form";
import AuthService from "@/services/AuthService";
import Fields from "@/components/fields/Fields";
import { signupFields } from "../utils/formsData";
import "./signup.css";

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
					attributes: {
						class: "fields",
						liClass: "field-item",
						labelClass: "field-label",
						inputClass: "field-input",
					},
					fields: signupFields,
					events: {
						blur: (e?: Event) => this.handleFieldBlur(e),
					},
				}),
				SignupBtn: new Button({
					attributes: {
						type: "submit",
						id: "signup",
						class: "btn",
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
				await AuthService.signup(data as SignupReq);
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
