import http from "@/api/HttpClient";
import { UserData, UserPassReq, UserProfileReq } from "@/types/types";
import { jest } from "@jest/globals";
import UserService from "./UserService";

jest.mock("@/api/HttpClient");

describe("UserService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("search", () => {
		it("should return list of users matching search", async () => {
			const mockUser: UserData = {
				id: 1,
				first_name: "Ivan",
				second_name: "Ivanov",
				display_name: "display_name",
				login: "login",
				email: "mail@example.com",
				phone: "+79999999999",
				avatar: "/avatar.jpg",
			};

			const searchQuery = "login";
			jest.spyOn(http, "post").mockResolvedValueOnce([mockUser]);

			const result = await UserService.search(searchQuery);

			expect(http.post).toHaveBeenCalledWith("/user/search", {
				body: { login: searchQuery },
			});
			expect(result).toEqual([mockUser]);
		});

		it("should throw error on search failure", async () => {
			const searchQuery = "login";
			const error = new Error("Network error");
			jest.spyOn(http, "post").mockRejectedValueOnce(error);

			await expect(UserService.search(searchQuery)).rejects.toThrow(
				"Ошибка при поиске пользователя"
			);
		});
	});

	describe("changeAvatar", () => {
		it("should successfully change avatar", async () => {
			const formData = new FormData();
			formData.append("avatar", new Blob(), "avatar.jpg");

			jest.spyOn(http, "put").mockResolvedValueOnce({});

			await UserService.changeAvatar(formData);

			expect(http.put).toHaveBeenCalledWith("/user/profile/avatar", {
				body: formData,
			});
		});

		it("should throw error on avatar change failure", async () => {
			const formData = new FormData();
			const error = new Error("Network error");
			jest.spyOn(http, "put").mockRejectedValueOnce(error);

			await expect(UserService.changeAvatar(formData)).rejects.toThrow(
				"Ошибка при обновлении аватара"
			);
		});
	});

	describe("changeProfile", () => {
		it("should successfully update profile", async () => {
			const profileData: UserProfileReq = {
				first_name: "Ivan",
				second_name: "Ivanov",
				display_name: "display_name",
				login: "login",
				email: "mail@example.com",
				phone: "+79999999999",
			};

			jest.spyOn(http, "put").mockResolvedValueOnce({});

			await UserService.changeProfile(profileData);

			expect(http.put).toHaveBeenCalledWith("/user/profile", {
				body: profileData,
			});
		});

		it("should throw error on profile update failure", async () => {
			const profileData: UserProfileReq = {
				first_name: "Ivan",
				second_name: "Ivanov",
				display_name: "display_name",
				login: "login",
				email: "mail@example.com",
				phone: "+79999999999",
			};
			const error = new Error("Network error");
			jest.spyOn(http, "put").mockRejectedValueOnce(error);

			await expect(UserService.changeProfile(profileData)).rejects.toThrow(
				"Ошибка при изменении данных пользователя"
			);
		});
	});

	describe("changePass", () => {
		it("should successfully change password", async () => {
			const passwordData: UserPassReq = {
				oldPassword: "oldPass123",
				newPassword: "newPass456",
			};

			jest.spyOn(http, "put").mockResolvedValueOnce({});

			await UserService.changePass(passwordData);

			expect(http.put).toHaveBeenCalledWith("/user/password", {
				body: passwordData,
			});
		});

		it("should throw error on password change failure", async () => {
			const passwordData: UserPassReq = {
				oldPassword: "oldPass123",
				newPassword: "newPass456",
			};
			const error = new Error("Network error");
			jest.spyOn(http, "put").mockRejectedValueOnce(error);

			await expect(UserService.changePass(passwordData)).rejects.toThrow(
				"Ошибка при смене пароля"
			);
		});
	});
});
