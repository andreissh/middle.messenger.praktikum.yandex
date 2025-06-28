import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import { PageProps } from "@/types/types";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import LoginFields from "../components/login-fields/LoginFields";
import "./signin.css";

type SigninFieldConfig = {
	id: string;
	label: string;
	type: string;
	name: string;
	autocomplete: string;
};

const fields: SigninFieldConfig[] = [
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

	constructor(props: PageProps) {
		super("div", {
			fields: new LoginFields({ fields }) as LoginFields,
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
						if (!form) return;
						if (this.validator && this.validator.validateForm()) {
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

	componentDidMount() {
		const form = this.element?.querySelector(".signin-form") as HTMLFormElement;
		if (!form) return;

		this.validator = new FormValidator(form, ".login-field-item");
		this.validator.attachBlurListeners();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
