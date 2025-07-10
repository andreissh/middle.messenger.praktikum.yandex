import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import backBtn from "@/assets/icons/back-btn.svg";
import { ValidationResult } from "@/types/types";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
import { passwordFields } from "../utils/profileData";
import "./profile-edit-pass.css";
import { router } from "@/routes/Router";

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
        <form class="profile-edit-pass-data-form">
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
	private validator?: FormValidator;

	constructor() {
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
					click: () => router.go("/profile"),
				},
			}) as Link,
			ProfileFieldsList: new ProfileFieldsList({
				fields: passwordFields,
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

	private checkPasswordsMatch(): ValidationResult {
		const form = this.element?.querySelector(".profile-edit-pass-data-form");
		if (!form) return { valid: false };

		const newPassword = form.querySelector<HTMLInputElement>(
			'input[name="newPassword"]'
		)?.value;
		const repeatPassword = form.querySelector<HTMLInputElement>(
			'input[name="repeatPassword"]'
		)?.value;

		const valid = newPassword === repeatPassword;
		return {
			valid,
			error: valid ? undefined : "Пароли не совпадают",
		};
	}

	private handleFieldBlur(e: Event): void {
		if (!this.validator) return;

		const input = e.target as HTMLInputElement;
		if (input.name === "repeatPassword") {
			this.validator.validateInput(input, () => this.checkPasswordsMatch());
		} else {
			this.validator.validateInput(input);
		}
	}

	private handleSave(e: Event | undefined): void {
		e?.preventDefault();
		if (!this.validator) return;

		const isValid = this.validator.validateForm({
			repeatPassword: () => this.checkPasswordsMatch(),
		});

		router.go("/profile");
		if (isValid) {
			const form = this.element?.querySelector(
				".profile-edit-pass-data-form"
			) as HTMLFormElement;
			const data = getFormData(form);
			// if (data) {
			// 	router.go('/profile')
			// }
		}
	}

	componentDidMount(): void {
		const form = this.element?.querySelector(
			".profile-edit-pass-data-form"
		) as HTMLFormElement;
		if (!form) return;

		this.validator = new FormValidator(form, ".profile-field-item");
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
