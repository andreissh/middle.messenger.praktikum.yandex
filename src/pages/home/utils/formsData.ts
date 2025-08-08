import { FieldProps } from "@/types/types";

export const signinFields: FieldProps[] = [
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
		value: "",
		autocomplete: "login",
	},
	{
		id: "password",
		label: "Пароль",
		type: "password",
		name: "password",
		value: "",
		autocomplete: "password",
	},
];

export const signupFields: FieldProps[] = [
	{
		id: "email",
		label: "Почта",
		type: "text",
		name: "email",
		value: "",
		autocomplete: "email",
	},
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
		value: "",
		autocomplete: "login",
	},
	{
		id: "first_name",
		label: "Имя",
		type: "text",
		name: "first_name",
		value: "",
		autocomplete: "first_name",
	},
	{
		id: "second_name",
		label: "Фамилия",
		type: "text",
		name: "second_name",
		value: "",
		autocomplete: "second_name",
	},
	{
		id: "phone",
		label: "Телефон",
		type: "text",
		name: "phone",
		value: "",
		autocomplete: "phone",
	},
	{
		id: "password",
		label: "Пароль",
		type: "password",
		name: "password",
		value: "",
		autocomplete: "password",
	},
	{
		id: "password_repeat",
		label: "Пароль (еще раз)",
		type: "password",
		name: "password_repeat",
		value: "",
		autocomplete: "password_repeat",
	},
];
