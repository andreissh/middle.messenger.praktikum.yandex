export type EventsType = Record<string, (e?: Event) => void>;

export type PageName =
	| "SigninPage"
	| "SignupPage"
	| "ChatsPage"
	| "ProfileInfoPage"
	| "ProfileEditPage"
	| "ProfileEditPassPage"
	| "NotFoundPage"
	| "ServerErrorPage";

export type PageProps = {
	onChangePage: (pageName: PageName) => void;
};

export type PageConstructor = new (
	props: PageProps
) => import("@/framework/Block").default;

export type ValidationResult = { valid: boolean; error?: string };

export type HttpError = {
	status?: number;
};

export type AuthData = {
	login: string;
	password: string;
};

export type UserData = {
	id: number;
	first_name: string;
	second_name: string;
	display_name: string;
	phone: string;
	login: string;
	avatar: string;
	email: string;
};

export type ChatsToken = {
	token: string;
};

export type ChatsUsers = {
	users: number[];
	chatId: number;
};

export type UserChats = {
	id: number;
	title: string;
	avatar: string;
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
	};
};

export type DeleteChat = {
	userId: number;
	result: {
		id: number;
		title: string;
		avatar: string;
		created_by: number;
	};
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

export type ChatsUserList = {
	id: number;
	first_name: string;
	second_name: string;
	display_name: string;
	login: string;
	avatar: string;
	role: string;
};
