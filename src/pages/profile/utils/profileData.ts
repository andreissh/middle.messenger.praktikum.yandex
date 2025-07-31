import { EventsType } from "@/types/types";

export type InputProps = {
	id: string;
	class?: string;
	type: string;
	name: string;
	value?: string;
	autocomplete: string;
	placeholder?: string;
	readonly?: boolean;
	events?: EventsType;
};

export const profileFields: Array<InputProps & { label: string }> = [
	{
		id: "email",
		label: "Почта",
		type: "text",
		name: "email",
		value: "",
		readonly: true,
		autocomplete: "email",
	},
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
		value: "",
		readonly: true,
		autocomplete: "username",
	},
	{
		id: "first_name",
		label: "Имя",
		type: "text",
		name: "first_name",
		value: "",
		readonly: true,
		autocomplete: "given-name",
	},
	{
		id: "second_name",
		label: "Фамилия",
		type: "text",
		name: "second_name",
		value: "",
		readonly: true,
		autocomplete: "family-name",
	},
	{
		id: "display_name",
		label: "Имя в чате",
		type: "text",
		name: "display_name",
		value: "",
		readonly: true,
		autocomplete: "nickname",
	},
	{
		id: "phone",
		label: "Телефон",
		type: "text",
		name: "phone",
		value: "",
		readonly: true,
		autocomplete: "tel",
	},
];

export const profileEditFields: Array<InputProps & { label: string }> =
	structuredClone(profileFields).map((field) => {
		const newField = { ...field };
		delete newField.readonly;
		return newField;
	});

export const passwordFields: Array<InputProps & { label: string }> = [
	{
		id: "oldPassword",
		label: "Старый пароль",
		type: "password",
		name: "oldPassword",
		autocomplete: "current-password",
	},
	{
		id: "newPassword",
		label: "Новый пароль",
		type: "password",
		name: "newPassword",
		autocomplete: "new-password",
	},
	{
		id: "repeatPassword",
		label: "Повторите пароль",
		type: "password",
		name: "repeatPassword",
		autocomplete: "new-password",
	},
];
