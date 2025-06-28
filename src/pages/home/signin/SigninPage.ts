import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import { PageProps } from "@/types/types";
import getFormData from "@/utils/getFormData";
import LoginFields from "../components/login-fields/LoginFields";
import "./signin.css";

type SigninFieldConfig = {
	id: string;
	label: string;
	type: string;
	name: string;
};

const fields: SigninFieldConfig[] = [
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
	},
	{
		id: "password",
		label: "Пароль",
		type: "password",
		name: "password",
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
	constructor(props: PageProps) {
		super("div", {
			fields: new LoginFields({
				fields,
			}) as LoginFields,
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
						getFormData(form);
						props.onChangePage("ChatsPage");
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

	render(): HTMLElement {
		return this.compile(template);
	}
}
