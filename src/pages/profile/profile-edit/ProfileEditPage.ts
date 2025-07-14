import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import { router } from "@/routes/Router";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import backBtn from "@/assets/icons/back-btn.svg";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
import { profileEditFields } from "../utils/profileData";
import "./profile-edit.css";
import http from "@/api/http";
import { UserData } from "@/types/types";
import renderDOM from "@/utils/renderDOM";

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
					click: (e?: Event) => this.handleBackClick(e),
				},
			}) as Link,
			ProfileFieldsList: new ProfileFieldsList({
				fields: profileEditFields,
				events: {
					blur: (e?: Event) => this.handleFieldBlur(e),
				},
			}) as ProfileFieldsList,
			SaveLink: new Link({
				href: "#",
				id: "save",
				class: "btn",
				children: "Сохранить",
				events: {
					click: (e?: Event) => this.handleSaveClick(e),
				},
			}) as Link,
		});

		this.validator = this.initValidator();
	}

	private initValidator(): FormValidator {
		const form = this.element?.querySelector(
			".profile-edit-data-form"
		) as HTMLFormElement;
		if (!form) {
			throw new Error("Form not found for validator initialization");
		}

		return new FormValidator(form, ".profile-field-item");
	}

	private handleBackClick(e?: Event): void {
		e?.preventDefault();
		router.go("/settings");
	}

	private handleSaveClick(e?: Event): void {
		e?.preventDefault();
		const form = this.element?.querySelector(
			".profile-edit-data-form"
		) as HTMLFormElement;
		if (!form || !this.validator) return;

		if (this.validator.validateForm()) {
			const data = getFormData(form);
			if (data) {
				const inputFields = document.querySelectorAll(".profile-field-input");
				const reqBody = {};
				profileEditFields.forEach((field, i) => {
					reqBody[field.id] = inputFields[i].value ?? field.value;
				});
				const setUserData = async () => {
					try {
						await http.put<UserData>("user/profile", {
							body: {
								...reqBody,
							},
						});

						router.go("/settings");
					} catch (err) {
						console.log(err);
					}
				};
				setUserData();
			}
		}
	}

	private handleFieldBlur(e?: Event): void {
		if (!this.validator) return;
		if (e) {
			this.validator.handleBlur(e);
		}
	}

	componentDidMount() {
		const getUserData = async () => {
			try {
				const userData = await http.get<UserData>("auth/user");
				let profileEditFieldsClone = structuredClone(profileEditFields);
				profileEditFieldsClone = profileEditFieldsClone.map((field) => {
					return {
						...field,
						value: userData[field.id] ?? field.value,
					};
				});

				this.setProps({
					ProfileFieldsList: new ProfileFieldsList({
						fields: profileEditFieldsClone,
					}) as ProfileFieldsList,
				});

				renderDOM("#app", this, true);
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
