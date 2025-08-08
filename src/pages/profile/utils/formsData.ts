import { FieldProps } from "@/types/types";

export const profileFields: FieldProps[] = [
	{
		id: "email",
		label: "Почта",
		type: "text",
		name: "email",
		value: "",
		autocomplete: "email",
		readonly: true,
	},
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
		value: "",
		autocomplete: "username",
		readonly: true,
	},
	{
		id: "first_name",
		label: "Имя",
		type: "text",
		name: "first_name",
		value: "",
		autocomplete: "given-name",
		readonly: true,
	},
	{
		id: "second_name",
		label: "Фамилия",
		type: "text",
		name: "second_name",
		value: "",
		autocomplete: "family-name",
		readonly: true,
	},
	{
		id: "display_name",
		label: "Имя в чате",
		type: "text",
		name: "display_name",
		value: "",
		autocomplete: "nickname",
		readonly: true,
	},
	{
		id: "phone",
		label: "Телефон",
		type: "text",
		name: "phone",
		value: "",
		autocomplete: "tel",
		readonly: true,
	},
];

export const profileEditFields: FieldProps[] = structuredClone(
	profileFields
).map((field) => {
	const newField = { ...field };
	delete newField.readonly;
	return newField;
});

export const passwordFields: FieldProps[] = [
	{
		id: "oldPassword",
		label: "Старый пароль",
		type: "password",
		name: "oldPassword",
		value: "",
		autocomplete: "current-password",
	},
	{
		id: "newPassword",
		label: "Новый пароль",
		type: "password",
		name: "password",
		value: "",
		autocomplete: "new-password",
	},
	{
		id: "repeatPassword",
		label: "Повторите пароль",
		type: "password",
		name: "password_repeat",
		value: "",
		autocomplete: "repeat-password",
	},
];
