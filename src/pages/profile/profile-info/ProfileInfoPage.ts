import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import backBtn from "@/assets/icons/back-btn.svg";
import { PageProps } from "@/types/types";
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
	constructor(props: PageProps) {
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
					click: () => props.onChangePage("ChatsPage"),
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
					click: () => props.onChangePage("ProfileEditPage"),
				},
			}) as Link,
			ChangePasswordLink: new Link({
				href: "#",
				id: "renderProfileEditPassBtn",
				class: "profile-info-links-item-link",
				children: "Изменить пароль",
				events: {
					click: () => props.onChangePage("ProfileEditPassPage"),
				},
			}) as Link,
			LogoutLink: new Link({
				href: "#",
				id: "renderSigninBtn",
				class:
					"profile-info-links-item-link profile-info-links-item-link--danger",
				children: "Выйти",
				events: {
					click: () => props.onChangePage("SigninPage"),
				},
			}) as Link,
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
