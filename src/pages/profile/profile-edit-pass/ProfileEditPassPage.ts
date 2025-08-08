import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { UserPassReq } from "@/types/types";
import backBtn from "@/assets/icons/arrow-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import { resourcesUrl } from "@/utils/utils";
import Form from "@/components/form/Form";
import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";
import Avatar from "@/components/avatar/Avatar";
import Fields from "@/components/fields/Fields";
import { passwordFields } from "../utils/formsData";
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
						{{{ Fields }}}
					</div>
					<div class="profile-edit-pass-btns-container">
						{{{ SaveBtn }}}
					</div>
				`,
				Fields: new Fields({
					attributes: {
						class: "profile-fields",
						liClass: "profile-field-item",
						labelClass: "profile-field-label",
						inputClass: "profile-field-input",
					},
					fields: passwordFields,
					events: {
						blur: (e?: Event) => this.handleFieldBlur(e),
					},
				}),
				SaveBtn: new Button({
					attributes: {
						type: "submit",
						id: "save",
						class: "btn",
					},
					children: "Сохранить",
				}),
				events: {
					submit: (e?: Event) => this.handleSaveSubmit(e),
				},
			}),
		});
	}

	private initValidator(): FormValidator {
		const form = document.querySelector<HTMLFormElement>(
			".profile-edit-pass-data-form"
		);
		if (!form) {
			throw new Error("Не найдена форма для инициализации валидатора");
		}

		return new FormValidator(form, ".profile-field-item");
	}

	private static handleBackClick(): void {
		router.go("/settings");
	}

	private handleFieldBlur(e?: Event): void {
		const target = e?.target as HTMLElement;
		const input = target.closest<HTMLInputElement>(".profile-field-input");
		if (!this.validator || !input) return;

		this.validator.validateInput(input);
	}

	private async handleSaveSubmit(e?: Event): Promise<void> {
		e?.preventDefault();
		const form = document.querySelector<HTMLFormElement>(
			".profile-edit-pass-data-form"
		);
		if (!form || !this.validator) return;

		if (this.validator.validateForm()) {
			const data = getFormData(form);
			if (data) {
				const inputFields = document.querySelectorAll<HTMLInputElement>(
					".profile-field-input"
				);
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

	componentDidMount() {
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
