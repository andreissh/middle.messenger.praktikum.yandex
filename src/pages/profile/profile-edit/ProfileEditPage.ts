import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import backBtn from "@/assets/icons/back-btn.svg";
import { PageProps } from "@/types/types";
import getFormData from "@/utils/getFormData";
import { validateField } from "@/utils/validate";
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
						if (!form) return;

						const inputs = Array.from(form.elements).filter(
							(el): el is HTMLInputElement => el instanceof HTMLInputElement
						);

						const isValid = inputs.every((input) => {
							const valid = ProfileEditPage.validateInput(input);
							return valid;
						});

						if (isValid) {
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

	static validateInput(input: HTMLInputElement) {
		const { name, value } = input;
		const result = validateField(name, value);
		ProfileEditPage.showValidationResult(input, result);
		return result.valid;
	}

	static showValidationResult(
		input: HTMLInputElement,
		result: { valid: boolean; error?: string }
	) {
		const fieldContainer = input.closest(".profile-field-item");
		if (!fieldContainer) return;

		let errorEl = fieldContainer.nextElementSibling as HTMLElement | null;

		if (!result.valid) {
			if (!errorEl || !errorEl.classList.contains("error-message")) {
				errorEl = document.createElement("span");
				errorEl.className = "error-message";
				fieldContainer.after(errorEl);
			}
			errorEl.textContent = result.error || "Ошибка";
			return;
		}

		if (errorEl && errorEl.classList.contains("error-message")) {
			errorEl.remove();
		}
	}

	static validateForm(form: HTMLFormElement) {
		return Array.from(form.elements)
			.filter((el): el is HTMLInputElement => el instanceof HTMLInputElement)
			.map((input) => ProfileEditPage.validateInput(input))
			.every(Boolean);
	}

	render(): HTMLElement {
		return this.compile(template);
	}

	componentDidMount() {
		const form = this.element?.querySelector(
			".profile-edit-data-form"
		) as HTMLFormElement;
		if (form) {
			form.querySelectorAll("input").forEach((input) => {
				input.addEventListener("blur", () =>
					ProfileEditPage.validateInput(input)
				);
			});
		}
	}
}
