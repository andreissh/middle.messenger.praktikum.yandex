import Block from "../../../framework/Block";
import "./profile-edit-pass.css";
import backBtn from "../../../assets/icons/back-btn.svg";
import Link from "../../../components/btn/Link.ts";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
import { passwordFields } from "../utils/profileData";

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
  constructor(app) {
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
      }),
      ProfileFieldsList: new ProfileFieldsList({
        fields: passwordFields,
      }),
      SaveLink: new Link({
        href: "#",
        id: "save",
        class: "btn",
        children: "Сохранить",
      }),
    });
  }

  render() {
    return this.compile(template);
  }
}
