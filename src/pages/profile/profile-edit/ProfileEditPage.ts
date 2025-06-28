import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import backBtn from "@/assets/icons/back-btn.svg";
import { PageProps } from "@/types/types";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
import { profileEditFields } from "../utils/profileData";
import "./profile-edit.css";

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
        <form class="profile-edit-data-form">
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
	private validator?: FormValidator;

	constructor(props: PageProps) {
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
						props.onChangePage("ProfileInfoPage");
					},
				},
			}) as Link,
			ProfileFieldsList: new ProfileFieldsList({
				fields: profileEditFields,
			}) as ProfileFieldsList,
			SaveLink: new Link({
				href: "#",
				id: "save",
				class: "btn",
				children: "Сохранить",
				events: {
					click: (e?: Event) => {
						e?.preventDefault();
						const form = this.element?.querySelector(
							".profile-edit-data-form"
						) as HTMLFormElement;
						if (!form || !this.validator) return;

						if (this.validator.validateForm()) {
							const data = getFormData(form);
							if (data) {
								props.onChangePage("ProfileInfoPage");
							}
						}
					},
				},
			}) as Link,
		});
	}

	componentDidMount() {
		const form = this.element?.querySelector(
			".profile-edit-data-form"
		) as HTMLFormElement;
		if (!form) return;

		this.validator = new FormValidator(form, ".profile-field-item");
		this.validator.attachBlurListeners();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
