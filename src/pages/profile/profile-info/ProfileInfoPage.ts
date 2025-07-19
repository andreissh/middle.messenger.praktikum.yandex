import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import renderDOM from "@/utils/renderDOM";
import { HttpError, UserData } from "@/types/types";
import backBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import http from "@/api/HttpClient";
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
					click: (e?: Event) => ProfileInfoPage.handleBackClick(e),
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
					click: (e?: Event) => ProfileInfoPage.handleAvatarClick(e),
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
					click: (e?: Event) => ProfileInfoPage.handleChangeDataClick(e),
				},
			}),
			ChangePasswordBtn: new Button({
				id: "renderProfileEditPassBtn",
				class: "profile-info-btns-item-btn",
				children: "Изменить пароль",
				events: {
					click: (e?: Event) => ProfileInfoPage.handleChangePassClick(e),
				},
			}),
			LogoutBtn: new Button({
				id: "renderSigninBtn",
				class: "profile-info-btns-item-btn profile-info-btns-item-btn--danger",
				children: "Выйти",
				events: {
					click: (e?: Event) => ProfileInfoPage.handleLogoutClick(e),
				},
			}),
		});
	}

	private static handleBackClick(e?: Event): void {
		e?.preventDefault();
		router.go("/messenger");
	}

	private static async handleAvatarClick(e?: Event): Promise<void> {
		e?.preventDefault();
	}

	private static handleChangeDataClick(e?: Event): void {
		e?.preventDefault();
		const profileEditPage = new ProfileEditPage();
		renderDOM("#app", profileEditPage);
	}

	private static handleChangePassClick(e?: Event): void {
		e?.preventDefault();
		const profileEditPassPage = new ProfileEditPassPage();
		renderDOM("#app", profileEditPassPage);
	}

	private static async handleLogoutClick(e?: Event): Promise<void> {
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
					AvatarBtn: new Button({
						id: "avatarBtn",
						children: `
							<span class="profile-info-avatar" name="avatar">
								<img src="https://ya-praktikum.tech/api/v2/resources${userData.avatar}" class="profile-info-avatar-img" />
							</span>
						`,
						events: {
							click: (e?: Event) => this.handleAvatarClick(e),
						},
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
