import Block from "@/framework/Block";
import App from "@/App";
import Link from "@/components/btn/Link";
import backBtn from "@/assets/icons/back-btn.svg";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
import { passwordFields } from "../utils/profileData";
import "./profile-edit-pass.css";

const template = `
  <div class="profile-edit-pass">
    {{{ BackLink }}}
    <div class="profile-edit-pass-content-wrapper">
      <div class="profile-edit-pass-content">
        <div class="profile-edit-pass-avatar-block">
          <span class="profile-edit-pass-avatar">
            <img src="{{avatarImg}}" class="profile-edit-pass-avatar-img" />
          </span>
        </div>
        <form>
          <div class="profile-edit-pass-data-block">
            {{{ ProfileFieldsList }}}
          </div>
          <div class="profile-edit-pass-links-container">
            {{{ SaveLink }}}
          </div>
        </form>
      </div>
    </div>
  </div>
`;

export default class ProfileEditPassPage extends Block {
  constructor(app: App) {
    super("div", {
      BackLink: new Link({
        href: "#",
        id: "backBtn",
        children: `
          <div class="profile-edit-pass-goback-block">
            <img src="${backBtn}" alt="backBtn" />
          </div>
        `,
        events: {
          click: () => {
            app.changePage("ProfileInfoPage");
          },
        },
      }) as Link,
      ProfileFieldsList: new ProfileFieldsList({
        fields: passwordFields,
      }) as ProfileFieldsList,
      SaveLink: new Link({
        href: "#",
        id: "save",
        class: "btn",
        children: "Сохранить",
      }) as Link,
    });
  }

  render(): HTMLElement {
    return this.compile(template);
  }
}
