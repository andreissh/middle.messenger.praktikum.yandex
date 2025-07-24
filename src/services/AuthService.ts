import http, { HttpStatus } from "@/api/HttpClient";
import { HttpError } from "@/types/types";

class AuthService {
	// eslint-disable-next-line class-methods-use-this
	async signin(data: unknown) {
		try {
			await http.post("/auth/signin", {
				body: data,
			});

			localStorage.setItem("isSignedIn", "true");
			return true;
		} catch (err) {
			const error = err as HttpError;
			if (error.status === HttpStatus.BadRequest) {
				throw new Error("Неверный логин или пароль", { cause: error });
			}
			throw new Error("Ошибка при авторизации пользователя", { cause: error });
		}
	}

	// eslint-disable-next-line class-methods-use-this
	async signup(data: unknown) {
		try {
			const response: { id: number } = await http.post("/auth/signup", {
				body: data,
			});

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
}

export default new AuthService();
