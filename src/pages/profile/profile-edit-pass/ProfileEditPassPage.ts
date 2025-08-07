import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { UserPassReq, ValidationResult } from "@/types/types";
import backBtn from "@/assets/icons/arrow-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import { resourcesUrl } from "@/utils/utils";
import Form from "@/components/form/Form";
import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";
import Avatar from "@/components/avatar/Avatar";
import ProfileFields from "../components/profile-fields/ProfileFields";
import { passwordFields } from "../utils/profileData";
import "./profile-edit-pass.css";

const template = `
  <div class="profile-edit-pass">
    {{{ BackBtn }}}
    <div class="profile-edit-pass-content-wrapper">
      <div class="profile-edit-pass-content">
        <div class="profile-edit-pass-avatar-block">
          {{{ Avatar }}}
        </div>
        {{{ ProfileEditPassForm }}}
      </div>
    </div>
  </div>
`;

export default class ProfileEditPassPage extends Block {
	private validator?: FormValidator;

	constructor() {
		super("div", {
			BackBtn: new Button({
				attributes: {
					id: "backBtn",
				},
				children: `
					<div class="profile-edit-pass-goback-block">
						<img src="${backBtn}" alt="backBtn" />
					</div>
				`,
				events: {
					click: () => ProfileEditPassPage.handleBackClick(),
				},
			}),
			Avatar: new Avatar({
				attributes: {
					class: "profile-edit-pass-avatar",
					name: "avatar",
				},
				children: `
					<img src="${avatarImg}" class="profile-edit-pass-default-avatar-img" />
				`,
			}),
			ProfileEditPassForm: new Form({
				attributes: {
					class: "profile-edit-pass-data-form",
				},
				children: `
				    <div class="profile-edit-pass-data-block">
						{{{ ProfileFields }}}
					</div>
					<div class="profile-edit-pass-btns-container">
						{{{ SaveBtn }}}
					</div>
				`,
				ProfileFields: new ProfileFields({
					fields: passwordFields,
					events: {
						blur: (e?: Event) => this.handleFieldBlur(e),
					},
				}),
				SaveBtn: new Button({
					attributes: {
						id: "save",
						class: "btn",
						type: "submit",
					},
					children: "Сохранить",
				}),
				events: {
					submit: (e?: Event) => this.handleSaveSubmit(e),
				},
			}),
		});

		this.validator = this.initValidator();
	}

	private initValidator(): FormValidator {
		const form = this.element?.querySelector(
			".profile-edit-pass-data-form"
		) as HTMLFormElement;
		if (!form) {
			throw new Error("Не найдена форма для инициализации валидатора");
		}

		return new FormValidator(form, ".profile-field-item");
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

	private static handleBackClick(): void {
		router.go("/settings");
	}

	private handleFieldBlur(e?: Event): void {
		if (!this.validator) return;

		const input = e?.target as HTMLInputElement;
		if (input.name === "repeatPassword") {
			this.validator.validateInput(input, () => this.checkPasswordsMatch());
		} else {
			this.validator.validateInput(input);
		}
	}

	private async handleSaveSubmit(e?: Event): Promise<void> {
		e?.preventDefault();
		if (!this.validator) return;

		const isValid = this.validator.validateForm({
			repeatPassword: () => this.checkPasswordsMatch(),
		});

		if (isValid) {
			const form = this.element?.querySelector(
				".profile-edit-pass-data-form"
			) as HTMLFormElement;
			const data = getFormData(form);
			if (data) {
				const inputFields: NodeListOf<HTMLInputElement> =
					document.querySelectorAll(".profile-field-input");
				const reqBody: UserPassReq = {} as UserPassReq;
				passwordFields.forEach((field, i) => {
					if (field.id !== "repeatPassword") {
						reqBody[field.id as keyof UserPassReq] =
							inputFields[i].value ?? field.value;
					}
				});

				await UserService.changePass(reqBody);
				router.go("/settings");
			}
		}
	}

	componentDidMount(): void {
		const getUserData = async () => {
			const userData = await AuthService.userInfo();

			const imgSrc = userData.avatar
				? `${resourcesUrl}${userData.avatar}`
				: `${avatarImg}`;
			const imgClass = userData.avatar
				? "profile-edit-pass-avatar-img"
				: "profile-edit-pass-default-avatar-img";

			this.setProps({
				Avatar: new Avatar({
					attributes: {
						class: "profile-edit-pass-avatar",
						name: "avatar",
					},
					children: `
						<img src="${imgSrc}" class="${imgClass}" />
					`,
				}),
			});

			this.validator = this.initValidator();
		};
		getUserData();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
