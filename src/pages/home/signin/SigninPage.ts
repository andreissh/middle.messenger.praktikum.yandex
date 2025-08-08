import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import Form from "@/components/form/Form";
import AuthService from "@/services/AuthService";
import { AuthData } from "@/types/types";
import Fields from "@/components/fields/Fields";
import { signinFields } from "../utils/formsData";
import "./signin.css";

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
				attributes: {
					id: "renderSignupBtn",
					class: "btn-secondary",
				},
				children: "Нет аккаунта?",
				events: {
					click: () => SigninPage.handleSignupClick(),
				},
			}),
			SigninForm: new Form({
				attributes: {
					class: "signin-form",
				},
				children: `
				  {{{ Fields }}}
					<div class="signin-form-signin-btn-container">
						{{{ SigninBtn }}}
					</div>
				`,
				Fields: new Fields({
					attributes: {
						class: "fields",
						liClass: "field-item",
						labelClass: "field-label",
						inputClass: "field-input",
					},
					fields: signinFields,
					events: {
						blur: (e?: Event) => this.handleFieldBlur(e),
					},
				}),
				SigninBtn: new Button({
					attributes: {
						type: "submit",
						id: "renderChatsBtn",
						class: "btn",
					},
					children: "Войти",
				}),
				events: {
					submit: (e?: Event) => this.handleSigninSubmit(e),
				},
			}),
		});
	}

	private initValidator(): FormValidator {
		const form = document.querySelector<HTMLFormElement>(".signin-form");
		if (!form) {
			throw new Error("Не найдена форма для инициализации валидатора");
		}

		return new FormValidator(form, ".field-item");
	}

	private handleFieldBlur(e?: Event): void {
		const target = e?.target as HTMLElement;
		const input = target.closest<HTMLInputElement>(".field-input");
		if (!this.validator || !input) return;

		this.validator.validateInput(input);
	}

	private async handleSigninSubmit(e?: Event): Promise<void> {
		e?.preventDefault();
		const form = document.querySelector<HTMLFormElement>(".signin-form");
		if (!form || !this.validator) return;

		if (this.validator.validateForm()) {
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
