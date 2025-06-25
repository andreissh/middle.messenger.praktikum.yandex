import Link from "../../../components/btn/Link";
import Block from "../../../framework/Block";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
import "./profile-edit.css";
import backBtn from "../../../assets/icons/back-btn.svg";
import { profileEditFields } from "../utils/profileData";

const template = `
  <div class="profile-edit">
    {{{ BackLink }}}
    <div class="profile-edit-content-wrapper">
      <div class="profile-edit-content">
        <div class="profile-edit-avatar-block">
          <span class="profile-edit-avatar">
            <img src="{{avatarImg}}" class="profile-edit-avatar-img" />
          </span>
        </div>
        <form>
          <div class="profile-edit-data-block">
            {{{ ProfileFieldsList }}}
          </div>
          <div class="profile-edit-links-container">
            {{{ SaveLink }}}
          </div>
        </form>
      </div>
    </div>
  </div>
`;

export default class ProfileEditPage extends Block {
  constructor(app) {
    super("div", {
      BackLink: new Link({
        href: "#",
        id: "backBtn",
        children: `
          <div class="profile-edit-goback-block">
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
        fields: profileEditFields,
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
