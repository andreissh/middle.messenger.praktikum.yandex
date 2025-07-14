import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import { router } from "@/routes/Router";
import http from "@/api/http";
import renderDOM from "@/utils/renderDOM";
import { HttpError, UserData } from "@/types/types";
import backBtn from "@/assets/icons/back-btn.svg";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
import { profileFields } from "../utils/profileData";
import "./profile-info.css";

const template = `
  <div class="profile-info">
    {{{ BackLink }}}
    <div class="profile-info-content-wrapper">
      <div class="profile-info-content">
        <div class="profile-info-avatar-block">
          <span class="profile-info-avatar" name="avatar">
            <img src="{{avatarImg}}" class="profile-info-avatar-img" />
          </span>
          <span class="profile-info-username">Иван</span>
        </div>
        <div class="profile-info-data-block">
          {{{ ProfileFieldsList }}}
        </div>
        <div class="profile-info-links-block">
          <ul class="profile-info-links-list">
            <li class="profile-info-links-item">
              {{{ ChangeDataLink }}}
            </li>
            <li class="profile-info-links-item">
              {{{ ChangePasswordLink }}}
            </li>
            <li class="profile-info-links-item">
              {{{ LogoutLink }}}
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
			BackLink: new Link({
				href: "#",
				id: "backBtn",
				children: `
					<div class="profile-info-goback-block">
						<img src="${backBtn}" alt="backBtn" />
					</div>
				`,
				events: {
					click: (e?: Event) => this.handleBackClick(e),
				},
			}) as Link,
			ProfileFieldsList: new ProfileFieldsList({
				fields: profileFields,
			}) as ProfileFieldsList,
			ChangeDataLink: new Link({
				href: "#",
				id: "renderProfileEditBtn",
				class: "profile-info-links-item-link",
				children: "Изменить данные",
				events: {
					click: (e?: Event) => this.handleChangeDataClick(e),
				},
			}) as Link,
			ChangePasswordLink: new Link({
				href: "#",
				id: "renderProfileEditPassBtn",
				class: "profile-info-links-item-link",
				children: "Изменить пароль",
				events: {
					click: (e?: Event) => this.handleChangePassClick(e),
				},
			}) as Link,
			LogoutLink: new Link({
				href: "#",
				id: "renderSigninBtn",
				class:
					"profile-info-links-item-link profile-info-links-item-link--danger",
				children: "Выйти",
				events: {
					click: (e?: Event) => this.handleLogoutClick(e),
				},
			}) as Link,
		});
	}

	private handleBackClick(e?: Event): void {
		e?.preventDefault();
		router.go("/chats");
	}

	private handleChangeDataClick(e?: Event): void {
		e?.preventDefault();
		router.go("/profile-edit");
	}

	private handleChangePassClick(e?: Event): void {
		e?.preventDefault();
		router.go("/profile-pass-edit");
	}

	private async handleLogoutClick(e?: Event): Promise<void> {
		e?.preventDefault();
		try {
			await http.post("auth/logout");

			router.go("/signin");
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
				localStorage.setItem("userId", userData.id);
				let profileFieldsClone = structuredClone(profileFields);
				profileFieldsClone = profileFieldsClone.map((field) => {
					return {
						...field,
						value: userData[field.id] ?? field.value,
					};
				});

				this.setProps({
					ProfileFieldsList: new ProfileFieldsList({
						fields: profileFieldsClone,
					}) as ProfileFieldsList,
				});

				renderDOM("#app", this);
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
