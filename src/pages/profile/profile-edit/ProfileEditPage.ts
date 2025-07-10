import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import backBtn from "@/assets/icons/back-btn.svg";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
import { profileEditFields } from "../utils/profileData";
import "./profile-edit.css";
import { router } from "@/routes/Router";

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

	constructor() {
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
					click: () => router.go("/profile"),
				},
			}) as Link,
			ProfileFieldsList: new ProfileFieldsList({
				fields: profileEditFields,
				events: {
					blur: (e?: Event) => this.handleFieldBlur(e as Event),
				},
			}) as ProfileFieldsList,
			SaveLink: new Link({
				href: "#",
				id: "save",
				class: "btn",
				children: "Сохранить",
				events: {
					click: (e?: Event) => this.handleSave(e),
				},
			}) as Link,
		});
	}

	private handleSave(e: Event | undefined): void {
		e?.preventDefault();
		const form = this.element?.querySelector(
			".profile-edit-data-form"
		) as HTMLFormElement;
		if (!form || !this.validator) return;

		router.go("/profile");
		if (this.validator.validateForm()) {
			const data = getFormData(form);
			// if (data) {
			// 	router.go('/profile');
			// }
		}
	}

	private handleFieldBlur(e: Event): void {
		if (!this.validator) return;
		this.validator.handleBlur(e);
	}

	componentDidMount() {
		const form = this.element?.querySelector(
			".profile-edit-data-form"
		) as HTMLFormElement;
		if (!form) return;

		this.validator = new FormValidator(form, ".profile-field-item");
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
