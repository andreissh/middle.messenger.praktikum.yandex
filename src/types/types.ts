export type EventsType = Record<string, (e?: Event) => void>;

export type ValidationResult = { valid: boolean; error?: string };

export type HttpError = {
	status?: number;
};

export type FieldProps = {
	[key: string]: unknown;
	id: string;
	label: string;
	type: string;
	name: string;
	value: string;
	autocomplete: string;
	readonly?: boolean;
	events?: EventsType;
};

export type TFieldProps = FieldProps & {
	attributes?: {
		liClass: string;
		labelClass: string;
		inputClass: string;
	};
};

export type AuthData = {
	login: string;
	password: string;
};

export type SignupReq = {
	first_name: string;
	second_name: string;
	login: string;
	email: string;
	password: string;
	phone: string;
};

export type SignupRes = {
	id: number;
};

export type UserData = {
	id: number;
	first_name: string;
	second_name: string;
	display_name: string;
	phone: string;
	login: string;
	avatar: string | null;
	email: string;
};

export type ChatToken = {
	token: string;
};

export type AddUserReq = {
	users: number[];
	chatId: number;
};

export type RemoveUserReq = {
	users: number[];
	chatId: number;
};

export type UserChat = {
	id: number;
	title: string;
	avatar: string | null;
	unread_count: number;
	created_by: number;
	last_message: {
		user: {
			first_name: string;
			second_name: string;
			avatar: string;
			email: string;
			login: string;
			phone: string;
		};
		time: string;
		content: string;
	} | null;
};

export type DeleteChatRes = {
	userId: number;
	result: {
		id: number;
		title: string;
		avatar: string;
		created_by: number;
	};
};

export type DeleteChatReq = {
	chatId: number;
};

export type UserProfileReq = {
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	email: string;
	phone: string;
};

export type UserPassReq = {
	oldPassword: string;
	newPassword: string;
};

export type ChatUser = {
	id: number;
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	avatar: string | null;
	role: string;
};

export type ChatUsersReq = {
	id: number;
	offset?: number;
	limit?: number;
	name?: string;
	email?: string;
};

export type AddChatReq = {
	title: string;
};

export type AddChatRes = {
	id: number;
};

export type UserSearchReq = {
	login: string;
};
