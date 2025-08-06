import { resourcesUrl } from "@/utils/utils";
import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import renderDOM from "@/utils/renderDOM";
import { UserData } from "@/types/types";
import backBtn from "@/assets/icons/arrow-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import AuthService from "@/services/AuthService";
import Avatar from "@/components/avatar/Avatar";
import ProfileFields from "../components/profile-fields/ProfileFields";
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
          {{{ Avatar }}}
          <span class="profile-info-username">Иван</span>
        </div>
        <div class="profile-info-data-block">
          {{{ ProfileFields }}}
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
				attributes: {
					id: "backBtn",
				},
				children: `
					<div class="profile-info-goback-block">
						<img src="${backBtn}" alt="backBtn" />
					</div>
				`,
				events: {
					click: () => ProfileInfoPage.handleBackClick(),
				},
			}),
			Avatar: new Avatar({
				attributes: {
					class: "profile-info-avatar",
					name: "avatar",
				},
				children: `
					<img src="${avatarImg}" class="profile-info-default-avatar-img" />
				`,
			}),
			ProfileFields: new ProfileFields({
				fields: profileFields,
			}),
			ChangeDataBtn: new Button({
				attributes: {
					id: "renderProfileEditBtn",
					class: "profile-info-btns-item-btn",
				},
				children: "Изменить данные",
				events: {
					click: () => ProfileInfoPage.handleChangeDataClick(),
				},
			}),
			ChangePasswordBtn: new Button({
				attributes: {
					id: "renderProfileEditPassBtn",
					class: "profile-info-btns-item-btn",
				},
				children: "Изменить пароль",
				events: {
					click: () => ProfileInfoPage.handleChangePassClick(),
				},
			}),
			LogoutBtn: new Button({
				attributes: {
					id: "renderSigninBtn",
					class:
						"profile-info-btns-item-btn profile-info-btns-item-btn--danger",
				},
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
				ProfileFields: new ProfileFields({
					fields: profileFieldsClone,
				}),
				Avatar: new Avatar({
					attributes: {
						class: "profile-info-avatar",
						name: "avatar",
					},
					children: `
						<img src="${imgSrc}" class="${imgClass}" />
					`,
				}),
			});
		};
		getUserData();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
