import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import { PageProps } from "@/types/types";
import LoginFields from "../components/login-fields/LoginFields";
import "./signup.css";

type SignupFieldConfig = {
	id: string;
	label: string;
	type: string;
	name: string;
};

const fields: SignupFieldConfig[] = [
	{
		id: "email",
		label: "Почта",
		type: "text",
		name: "email",
	},
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
	},
	{
		id: "first_name",
		label: "Имя",
		type: "text",
		name: "first_name",
	},
	{
		id: "second_name",
		label: "Фамилия",
		type: "text",
		name: "second_name",
	},
	{
		id: "phone",
		label: "Телефон",
		type: "text",
		name: "phone",
	},
	{
		id: "password",
		label: "Пароль",
		type: "password",
		name: "password",
	},
	{
		id: "password_repeat",
		label: "Пароль (еще раз)",
		type: "password",
		name: "password_repeat",
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
	constructor(props: PageProps) {
		super("div", {
			LoginFields: new LoginFields({
				fields,
			}) as LoginFields,
			SignupLink: new Link({
				href: "#",
				id: "signup",
				class: "btn renderSigninBtn",
				children: "Зарегистрироваться",
				events: {
					click: () => {
						props.onChangePage("SigninPage");
					},
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

	render(): HTMLElement {
		return this.compile(template);
	}
}
