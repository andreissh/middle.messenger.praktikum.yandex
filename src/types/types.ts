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
