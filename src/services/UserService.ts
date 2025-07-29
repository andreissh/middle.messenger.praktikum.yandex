import http from "@/api/HttpClient";
import { UserData, UserPassReq, UserProfileReq } from "@/types/types";

class UserService {
	async search(value: string): Promise<UserData[]> {
		try {
			const response = await http.post<UserData[]>("/user/search", {
				body: {
					login: value,
				},
			});
			return response;
		} catch (err) {
			throw new Error("Ошибка при поиске пользователя", { cause: err });
		}
	}

	async changeAvatar(formData: FormData): Promise<void> {
		try {
			await http.put("/user/profile/avatar", { body: formData });
		} catch (err) {
			throw new Error("Ошибка при обновлении аватара", { cause: err });
		}
	}

	async changeProfile(reqBody: UserProfileReq): Promise<void> {
		try {
			await http.put<UserData>("/user/profile", {
				body: {
					...reqBody,
				},
			});
		} catch (err) {
			throw new Error("Ошибка при изменении данных пользователя", {
				cause: err,
			});
		}
	}

	async changePass(reqBody: UserPassReq): Promise<void> {
		try {
			await http.put("/user/password", {
				body: {
					...reqBody,
				},
			});
		} catch (err) {
			throw new Error("Ошибка при смене пароля", { cause: err });
		}
	}
}

export default new UserService();
