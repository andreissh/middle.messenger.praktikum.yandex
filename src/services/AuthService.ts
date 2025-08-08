import http, { HttpStatus } from "@/api/HttpClient";
import {
	AuthData,
	HttpError,
	SignupReq,
	SignupRes,
	UserData,
} from "@/types/types";

class AuthService {
	async signin(data: AuthData): Promise<void> {
		try {
			await http.post<void, AuthData>("/auth/signin", {
				body: data,
			});

			localStorage.setItem("isSignedIn", "true");
		} catch (err) {
			const error = err as HttpError;
			if (error.status === HttpStatus.BadRequest) {
				throw new Error("Неверный логин или пароль", { cause: error });
			}
			throw new Error("Ошибка при авторизации пользователя", { cause: error });
		}
	}

	async signup(data: SignupReq): Promise<void> {
		try {
			const response: { id: number } = await http.post<SignupRes, SignupReq>(
				"/auth/signup",
				{
					body: data,
				}
			);

			localStorage.setItem("isSignedIn", "true");
			localStorage.setItem("userId", String(response.id));
		} catch (err) {
			const error = err as HttpError;
			if (error.status === HttpStatus.BadRequest) {
				throw new Error("Неверный логин или пароль", { cause: err });
			} else {
				throw new Error("Ошибка при регистрации", { cause: err });
			}
		}
	}

	async logout(): Promise<void> {
		try {
			await http.post<void>("/auth/logout");

			localStorage.setItem("isSignedIn", "false");
			localStorage.removeItem("userId");
		} catch (err) {
			throw new Error("Ошибка при выходе из системы", { cause: err });
		}
	}

	async userInfo(): Promise<UserData> {
		try {
			const response = await http.get<UserData>("/auth/user");
			return response;
		} catch (err) {
			throw new Error("Ошибка при загрузке данных пользователя", {
				cause: err,
			});
		}
	}
}

export default new AuthService();
