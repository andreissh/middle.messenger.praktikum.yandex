export const profileFields = [
	{
		id: "email",
		label: "Почта",
		type: "text",
		name: "email",
		value: "pochta@yandex.ru",
		readonly: "true",
	},
	{
		id: "login",
		label: "Логин",
		type: "text",
		name: "login",
		value: "ivanivanov",
		readonly: "true",
	},
	{
		id: "first_name",
		label: "Имя",
		type: "text",
		name: "first_name",
		value: "Иван",
		readonly: "true",
	},
	{
		id: "second_name",
		label: "Фамилия",
		type: "text",
		name: "second_name",
		value: "Иванов",
		readonly: "true",
	},
	{
		id: "display_name",
		label: "Имя в чате",
		type: "text",
		name: "display_name",
		value: "Иван",
		readonly: "true",
	},
	{
		id: "phone",
		label: "Телефон",
		type: "text",
		name: "phone",
		value: "+7 (909) 967 30 30",
		readonly: "true",
	},
];

export const profileEditFields = structuredClone(profileFields).map(
	(field) => ({ ...field, readonly: "false" }),
);

export const passwordFields = [
	{
		id: "oldPassword",
		label: "Старый пароль",
		type: "password",
		name: "oldPassword",
	},
	{
		id: "newPassword",
		label: "Новый пароль",
		type: "password",
		name: "newPassword",
	},
	{
		id: "repeatPassword",
		label: "Повторите пароль",
		type: "password",
		name: "newPassword",
	},
];
