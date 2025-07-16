import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import { router } from "@/routes/Router";
import http from "@/api/http";
import renderDOM from "@/utils/renderDOM";
import { HttpError, UserData } from "@/types/types";
import backBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
import { profileFields } from "../utils/profileData";
import ProfileEditPage from "../profile-edit/ProfileEditPage";
import ProfileEditPassPage from "../profile-edit-pass/ProfileEditPassPage";
import "./profile-info.css";

const template = `
  <div class="profile-info">
    {{{ BackBtn }}}
    <div class="profile-info-content-wrapper">
      <div class="profile-info-content">
        <div class="profile-info-avatar-block">
          {{{ AvatarBtn }}}
          <span class="profile-info-username">Иван</span>
        </div>
        <div class="profile-info-data-block">
          {{{ ProfileFieldsList }}}
        </div>
        <div class="profile-info-btns-block">
          <ul class="profile-info-btns-list">
            <li class="profile-info-btns-item">
              {{{ ChangeDataBtn }}}
            </li>
            <li class="profile-info-btns-item">
              {{{ ChangePasswordBtn }}}
            </li>
            <li class="profile-info-btns-item">
              {{{ LogoutBtn }}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
`;

export default class ProfileInfoPage extends Block {
	constructor() {
		super("div", {
			BackBtn: new Button({
				id: "backBtn",
				children: `
					<div class="profile-info-goback-block">
						<img src="${backBtn}" alt="backBtn" />
					</div>
				`,
				events: {
					click: (e?: Event) => this.handleBackClick(e),
				},
			}),
			AvatarBtn: new Button({
				id: "avatarBtn",
				children: `
					<span class="profile-info-avatar" name="avatar">
						<img src="${avatarImg}" class="profile-info-avatar-img" />
					</span>
				`,
				events: {
					click: (e?: Event) => this.handleAvatarClick(e),
				},
			}),
			ProfileFieldsList: new ProfileFieldsList({
				fields: profileFields,
			}),
			ChangeDataBtn: new Button({
				id: "renderProfileEditBtn",
				class: "profile-info-btns-item-btn",
				children: "Изменить данные",
				events: {
					click: (e?: Event) => this.handleChangeDataClick(e),
				},
			}),
			ChangePasswordBtn: new Button({
				id: "renderProfileEditPassBtn",
				class: "profile-info-btns-item-btn",
				children: "Изменить пароль",
				events: {
					click: (e?: Event) => this.handleChangePassClick(e),
				},
			}),
			LogoutBtn: new Button({
				id: "renderSigninBtn",
				class: "profile-info-btns-item-btn profile-info-btns-item-btn--danger",
				children: "Выйти",
				events: {
					click: (e?: Event) => this.handleLogoutClick(e),
				},
			}),
		});
	}

	private handleBackClick(e?: Event): void {
		e?.preventDefault();
		router.go("/messenger");
	}

	private handleAvatarClick(e?: Event): void {
		e?.preventDefault();

		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept =
			"image/jpeg, image/jpg, image/png, image/gif, image/webp";

		fileInput.onchange = (event: Event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (!file) return;

			console.log("Selected file:", file);

			const allowedTypes = [
				"image/jpeg",
				"image/jpg",
				"image/png",
				"image/gif",
				"image/webp",
			];
			if (!allowedTypes.includes(file.type)) {
				console.error("Недопустимый тип файла");
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				const avatarImg = document.querySelector(
					".profile-info-avatar-img"
				) as HTMLImageElement;
				if (avatarImg && e.target?.result) {
					avatarImg.src = e.target.result as string;
				}
			};
			reader.readAsDataURL(file);

			const formData = new FormData();
			formData.append("avatar", file);

			http
				.put("user/profile/avatar", {
					body: formData,
				})
				.then((response) => console.log("Успешно:", response))
				.catch((error) => console.error("Ошибка:", error));
		};

		fileInput.click();
	}

	private handleChangeDataClick(e?: Event): void {
		e?.preventDefault();
		const profileEditPage = new ProfileEditPage();
		renderDOM("#app", profileEditPage);
	}

	private handleChangePassClick(e?: Event): void {
		e?.preventDefault();
		const profileEditPassPage = new ProfileEditPassPage();
		renderDOM("#app", profileEditPassPage);
	}

	private async handleLogoutClick(e?: Event): Promise<void> {
		e?.preventDefault();
		try {
			await http.post("auth/logout");

			localStorage.setItem("isSignedIn", "false");
			router.go("/");
		} catch (err) {
			const error = err as HttpError;
			if (error) {
				console.error("Ошибка:", error);
			}
		}
	}

	componentDidMount() {
		const getUserData = async () => {
			try {
				const userData = await http.get<UserData>("auth/user");
				localStorage.setItem("userId", String(userData.id));
				let profileFieldsClone = structuredClone(profileFields);
				profileFieldsClone = profileFieldsClone.map((field) => ({
					...field,
					value: String(userData[field.id as keyof UserData]) ?? field.value,
				}));

				this.setProps({
					ProfileFieldsList: new ProfileFieldsList({
						fields: profileFieldsClone,
					}),
				});
			} catch (err) {
				console.log(err);
			}
		};
		getUserData();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
