import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import FormValidator from "@/utils/FormValidator";
import { UserData, UserProfileReq } from "@/types/types";
import backBtn from "@/assets/icons/arrow-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import { resourcesUrl } from "@/utils/utils";
import Form from "@/components/form/Form";
import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";
import Avatar from "@/components/avatar/Avatar";
import Fields from "@/components/fields/Fields";
import handleImageUpload from "@/utils/imageUpload";
import { profileEditFields } from "../utils/formsData";
import "./profile-edit.css";

const template = `
  <div class="profile-edit">
    {{{ BackBtn }}}
    <div class="profile-edit-content-wrapper">
      <div class="profile-edit-content">
        <div class="profile-edit-avatar-block">
          {{{ AvatarBtn }}}
        </div>
        {{{ ProfileEditForm }}}
      </div>
    </div>
  </div>
`;

export default class ProfileEditPage extends Block {
	private validator?: FormValidator;

	private selectedAvatarFile: File | null = null;

	private selectedAvatarUrl: string | null = null;

	constructor() {
		super("div", {
			BackBtn: new Button({
				attributes: {
					id: "backBtn",
				},
				children: `
					<div class="profile-edit-goback-block">
						<img src="${backBtn}" alt="backBtn" />
					</div>
				`,
				events: {
					click: () => ProfileEditPage.handleBackClick(),
				},
			}),
			AvatarBtn: new Button({
				attributes: {
					id: "avatarBtn",
				},
				children: `
					{{{ Avatar }}}
				`,
				Avatar: new Avatar({
					attributes: {
						class: "profile-edit-avatar",
						name: "avatar",
					},
					children: `
						<img src="${avatarImg}" class="profile-edit-default-avatar-img" />
						<span class="avatar-overlay-text">Поменять аватар</span>
					`,
				}),
				events: {
					click: () => this.handleAvatarClick(),
				},
			}),
			ProfileEditForm: new Form({
				attributes: {
					class: "profile-edit-data-form",
				},
				children: `
					<div class="profile-edit-data-block">
						{{{ Fields }}}
					</div>
					<div class="profile-edit-btns-container">
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
					fields: profileEditFields,
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
			".profile-edit-data-form"
		);
		if (!form) {
			throw new Error("Не найдена форма для инициализации валидатора");
		}

		return new FormValidator(form, ".profile-field-item");
	}

	private static handleBackClick(): void {
		router.go("/settings");
	}

	private async handleAvatarClick(): Promise<void> {
		const file = await handleImageUpload();
		if (!file) return;

		if (this.selectedAvatarUrl) URL.revokeObjectURL(this.selectedAvatarUrl);
		this.selectedAvatarFile = file;
		this.selectedAvatarUrl = URL.createObjectURL(file);

		this.setProps({
			AvatarBtn: new Button({
				attributes: {
					id: "avatarBtn",
				},
				children: `
					{{{ Avatar }}}
				`,
				Avatar: new Avatar({
					attributes: {
						class: "profile-edit-avatar",
						name: "avatar",
					},
					children: `
						<img src="${this.selectedAvatarUrl}" class="profile-edit-avatar-img" />
					`,
				}),
				events: {
					click: () => this.handleAvatarClick(),
				},
			}),
		});
	}

	private async handleSaveSubmit(e?: Event): Promise<void> {
		e?.preventDefault();

		const form = document.querySelector<HTMLFormElement>(
			".profile-edit-data-form"
		);
		if (!form || !this.validator) return;

		if (this.validator.validateForm()) {
			try {
				const inputFields = document.querySelectorAll<HTMLInputElement>(
					".profile-field-input"
				);
				const reqBody: UserProfileReq = {} as UserProfileReq;
				profileEditFields.forEach((field, i) => {
					reqBody[field.id as keyof UserProfileReq] =
						inputFields[i].value ?? field.value;
				});

				await UserService.changeProfile(reqBody);

				if (this.selectedAvatarFile) {
					const formData = new FormData();
					formData.append("avatar", this.selectedAvatarFile);
					await UserService.changeAvatar(formData);
				}

				router.go("/settings");
			} catch (err) {
				throw new Error("Ошибка при сохранении профиля", { cause: err });
			}
		}
	}

	private handleFieldBlur(e?: Event): void {
		const target = e?.target as HTMLElement;
		const input = target.closest<HTMLInputElement>(".profile-field-input");
		if (!this.validator || !input) return;

		this.validator.validateInput(input);
	}

	componentDidMount(): void {
		const getUserData = async () => {
			const userData = await AuthService.userInfo();
			let profileEditFieldsClone = structuredClone(profileEditFields);
			profileEditFieldsClone = profileEditFieldsClone.map((field) => ({
				...field,
				value: String(userData[field.id as keyof UserData]) ?? field.value,
			}));

			const imgSrc = userData.avatar
				? `${resourcesUrl}${userData.avatar}`
				: `${avatarImg}`;
			const imgClass = userData.avatar
				? "profile-edit-avatar-img"
				: "profile-edit-default-avatar-img";

			this.setProps({
				ProfileEditForm: new Form({
					attributes: {
						class: "profile-edit-data-form",
					},
					children: `
						<div class="profile-edit-data-block">
							{{{ Fields }}}
						</div>
						<div class="profile-edit-btns-container">
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
						fields: profileEditFieldsClone,
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
				AvatarBtn: new Button({
					attributes: {
						id: "avatarBtn",
					},
					children: `
						<span class="profile-edit-avatar" name="avatar">
							<img src="${imgSrc}" class="${imgClass}" />
							<span class="avatar-overlay-text">Поменять аватар</span>
						</span>
					`,
					events: {
						click: () => this.handleAvatarClick(),
					},
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
