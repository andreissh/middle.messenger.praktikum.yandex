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
