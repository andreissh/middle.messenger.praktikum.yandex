import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import backBtn from "@/assets/icons/back-btn.svg";
import { PageProps } from "@/types/types";
import getFormData from "@/utils/getFormData";
import { validateField } from "@/utils/validate";
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
	constructor(props: PageProps) {
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
						props.onChangePage("ProfileInfoPage");
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
				events: {
					click: (e?: Event) => {
						e?.preventDefault();
						const form = this.element?.querySelector(
							".profile-edit-pass-data-form"
						) as HTMLFormElement;
						if (!form) return;

						const inputs = Array.from(form.elements).filter(
							(el): el is HTMLInputElement => el instanceof HTMLInputElement
						);

						const isValidInputs = inputs.every((input) =>
							ProfileEditPassPage.validateInput(input)
						);

						const newPassword = form.querySelector<HTMLInputElement>(
							'input[name="newPassword"]'
						)?.value;
						const repeatPassword = form.querySelector<HTMLInputElement>(
							'input[name="repeatPassword"]'
						)?.value;

						let isPasswordsMatch = true;
						if (
							newPassword &&
							repeatPassword &&
							newPassword !== repeatPassword
						) {
							const repeatInput = form.querySelector<HTMLInputElement>(
								'input[name="repeatPassword"]'
							);
							ProfileEditPassPage.showValidationResult(repeatInput!, {
								valid: false,
								error: "Пароли не совпадают",
							});
							isPasswordsMatch = false;
						}

						if (isValidInputs && isPasswordsMatch) {
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
		ProfileEditPassPage.showValidationResult(input, result);
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

	static validateForm(form: HTMLFormElement): boolean {
		const inputs = Array.from(form.elements).filter(
			(el): el is HTMLInputElement => el instanceof HTMLInputElement
		);

		let isValid = true;

		inputs.forEach((input) => {
			if (!this.validateInput(input)) isValid = false;
		});

		const newPassword = form.querySelector<HTMLInputElement>(
			'input[name="newPassword"]'
		)?.value;
		const repeatPassword = form.querySelector<HTMLInputElement>(
			'input[name="repeatPassword"]'
		)?.value;

		if (newPassword && repeatPassword && newPassword !== repeatPassword) {
			const repeatInput = form.querySelector<HTMLInputElement>(
				'input[name="repeatPassword"]'
			);
			this.showValidationResult(repeatInput!, {
				valid: false,
				error: "Пароли не совпадают",
			});
			isValid = false;
		}

		return isValid;
	}

	render(): HTMLElement {
		return this.compile(template);
	}

	componentDidMount(): void {
		const form = this.element?.querySelector(
			".profile-edit-pass-data-form"
		) as HTMLFormElement;
		if (form) {
			form.querySelectorAll("input").forEach((input) => {
				input.addEventListener("blur", () =>
					ProfileEditPassPage.validateInput(input)
				);
			});
		}
	}
}
