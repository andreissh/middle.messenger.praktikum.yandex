import http, { HttpStatus } from "@/api/HttpClient";
import { AuthData, SignupReq, UserData } from "@/types/types";
import { jest } from "@jest/globals";
import AuthService from "./AuthService";

jest.mock("@/api/HttpClient");
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

describe("AuthService", () => {
	beforeEach(() => {
		window.localStorage.clear();
		jest.clearAllMocks();
	});

	describe("signin", () => {
		it("should successfully sign in and set localStorage", async () => {
			const authData: AuthData = { login: "login", password: "password" };
			jest.spyOn(http, "post").mockResolvedValueOnce({});

			await AuthService.signin(authData);

			expect(http.post).toHaveBeenCalledWith("/auth/signin", {
				body: authData,
			});
			expect(localStorage.setItem).toHaveBeenCalledWith("isSignedIn", "true");
		});

		it("should throw error for bad credentials", async () => {
			const authData: AuthData = { login: "wrong_login", password: "wrong" };
			const error = { status: HttpStatus.BadRequest };
			jest.spyOn(http, "post").mockRejectedValueOnce(error);

			await expect(AuthService.signin(authData)).rejects.toThrow(
				"Неверный логин или пароль"
			);
		});

		it("should throw generic error for other failures", async () => {
			const authData: AuthData = { login: "wrong_login", password: "wrong" };
			const error = { status: HttpStatus.InternalServerError };
			jest.spyOn(http, "post").mockRejectedValueOnce(error);

			await expect(AuthService.signin(authData)).rejects.toThrow(
				"Ошибка при авторизации пользователя"
			);
		});
	});

	describe("signup", () => {
		it("should successfully sign up and set localStorage", async () => {
			const signupData: SignupReq = {
				first_name: "Ivan",
				second_name: "Ivanov",
				login: "login",
				email: "mail@example.com",
				password: "password",
				phone: "79999999999",
			};
			jest.spyOn(http, "post").mockResolvedValueOnce({ id: 1 });

			await AuthService.signup(signupData);

			expect(http.post).toHaveBeenCalledWith("/auth/signup", {
				body: signupData,
			});
			expect(localStorage.setItem).toHaveBeenCalledWith("isSignedIn", "true");
			expect(localStorage.setItem).toHaveBeenCalledWith("userId", "1");
		});

		it("should throw error for bad request", async () => {
			const signupData: SignupReq = {
				first_name: "Ivan",
				second_name: "Ivanov",
				login: "login",
				email: "mail@example.com",
				password: "password",
				phone: "79999999999",
			};
			const error = { status: HttpStatus.BadRequest };
			jest.spyOn(http, "post").mockRejectedValueOnce(error);

			await expect(AuthService.signup(signupData)).rejects.toThrow(
				"Неверный логин или пароль"
			);
		});

		it("should throw generic error for other failures", async () => {
			const signupData: SignupReq = {
				first_name: "Ivan",
				second_name: "Ivanov",
				login: "login",
				email: "mail@example.com",
				password: "password",
				phone: "79999999999",
			};
			const error = { status: HttpStatus.InternalServerError };
			jest.spyOn(http, "post").mockRejectedValueOnce(error);

			await expect(AuthService.signup(signupData)).rejects.toThrow(
				"Ошибка при регистрации"
			);
		});
	});

	describe("logout", () => {
		it("should successfully logout and clear localStorage", async () => {
			jest.spyOn(http, "post").mockResolvedValueOnce({});

			await AuthService.logout();

			expect(http.post).toHaveBeenCalledWith("/auth/logout");
			expect(localStorage.setItem).toHaveBeenCalledWith("isSignedIn", "false");
			expect(localStorage.removeItem).toHaveBeenCalledWith("userId");
		});

		it("should throw error on failure", async () => {
			const error = { status: HttpStatus.InternalServerError };
			jest.spyOn(http, "post").mockRejectedValueOnce(error);

			await expect(AuthService.logout()).rejects.toThrow(
				"Ошибка при выходе из системы"
			);
		});
	});

	describe("userInfo", () => {
		it("should return user data on success", async () => {
			const mockUserData: UserData = {
				id: 1,
				first_name: "Ivan",
				second_name: "Ivanov",
				display_name: "display_name",
				phone: "79999999999",
				login: "login",
				avatar: "avatar",
				email: "mail@example.com",
			};

			jest.spyOn(http, "get").mockResolvedValueOnce(mockUserData);

			const result = await AuthService.userInfo();

			expect(http.get).toHaveBeenCalledWith("/auth/user");
			expect(result).toEqual(mockUserData);
		});

		it("should throw error on failure", async () => {
			const error = { status: HttpStatus.InternalServerError };
			jest.spyOn(http, "get").mockRejectedValueOnce(error);

			await expect(AuthService.userInfo()).rejects.toThrow(
				"Ошибка при загрузке данных пользователя"
			);
		});
	});
});
