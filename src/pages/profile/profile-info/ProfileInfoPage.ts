import { resourcesUrl } from "@/utils/utils";
import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import renderDOM from "@/utils/renderDOM";
import { UserData } from "@/types/types";
import backBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import AuthService from "@/services/AuthService";
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
					click: () => ProfileInfoPage.handleBackClick(),
				},
			}),
			AvatarBtn: new Button({
				id: "avatarBtn",
				children: `
					<span class="profile-info-avatar" name="avatar">
						<img src="${avatarImg}" class="profile-info-default-avatar-img" />
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
					click: () => ProfileInfoPage.handleChangeDataClick(),
				},
			}),
			ChangePasswordBtn: new Button({
				id: "renderProfileEditPassBtn",
				class: "profile-info-btns-item-btn",
				children: "Изменить пароль",
				events: {
					click: () => ProfileInfoPage.handleChangePassClick(),
				},
			}),
			LogoutBtn: new Button({
				id: "renderSigninBtn",
				class: "profile-info-btns-item-btn profile-info-btns-item-btn--danger",
				children: "Выйти",
				events: {
					click: () => ProfileInfoPage.handleLogoutClick(),
				},
			}),
		});
	}

	private static handleBackClick(): void {
		router.go("/messenger");
	}

	private static handleAvatarClick(e?: Event): void {
		e?.preventDefault();
	}

	private static handleChangeDataClick(): void {
		const profileEditPage = new ProfileEditPage();
		renderDOM("#app", profileEditPage);
	}

	private static handleChangePassClick(): void {
		const profileEditPassPage = new ProfileEditPassPage();
		renderDOM("#app", profileEditPassPage);
	}

	private static async handleLogoutClick(): Promise<void> {
		await AuthService.logout();
		router.go("/");
	}

	componentDidMount() {
		const getUserData = async () => {
			const userData = await AuthService.userInfo();
			let profileFieldsClone = structuredClone(profileFields);
			profileFieldsClone = profileFieldsClone.map((field) => ({
				...field,
				value: String(userData[field.id as keyof UserData]) ?? field.value,
			}));
			const imgSrc = userData.avatar
				? `${resourcesUrl}${userData.avatar}`
				: `${avatarImg}`;
			const imgClass = userData.avatar
				? "profile-info-avatar-img"
				: "profile-info-default-avatar-img";

			this.setProps({
				ProfileFieldsList: new ProfileFieldsList({
					fields: profileFieldsClone,
				}),
				AvatarBtn: new Button({
					id: "avatarBtn",
					children: `
						<span class="profile-info-avatar" name="avatar">
							<img src="${imgSrc}" class="${imgClass}" />
						</span>
					`,
					events: {
						click: (e?: Event) => ProfileInfoPage.handleAvatarClick(e),
					},
				}),
			});
		};
		getUserData();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
