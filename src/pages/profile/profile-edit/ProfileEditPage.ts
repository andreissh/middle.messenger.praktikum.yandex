import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { UserData, UserProfileReq } from "@/types/types";
import backBtn from "@/assets/icons/arrow-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import { resourcesUrl } from "@/utils/utils";
import Form from "@/components/form/Form";
import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";
import Avatar from "@/components/avatar/Avatar";
import ProfileFields from "../components/profile-fields/ProfileFields";
import { profileEditFields } from "../utils/profileData";
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
						{{{ ProfileFields }}}
					</div>
					<div class="profile-edit-btns-container">
						{{{ SaveBtn }}}
					</div>
				`,
				ProfileFields: new ProfileFields({
					fields: profileEditFields,
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

	private selectedAvatarFile: File | null = null;

	private initValidator(): FormValidator {
		const form = this.element?.querySelector(
			".profile-edit-data-form"
		) as HTMLFormElement;
		if (!form) {
			throw new Error("Не найдена форма для инициализации валидатора");
		}

		return new FormValidator(form, ".profile-field-item");
	}

	private static handleBackClick(): void {
		router.go("/settings");
	}

	private async handleAvatarClick(): Promise<void> {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept =
			"image/jpeg, image/jpg, image/png, image/gif, image/webp";

		const file = await new Promise<File | null>((resolve) => {
			fileInput.onchange = (event: Event) => {
				resolve((event.target as HTMLInputElement).files?.[0] || null);
			};
			fileInput.click();
		});

		if (!file) return;

		const allowedTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
			"image/webp",
		];
		if (!allowedTypes.includes(file.type)) {
			throw new Error("Недопустимый тип файла");
		}

		this.selectedAvatarFile = file;

		const previewUrl = URL.createObjectURL(file);
		this.setProps({
			AvatarBtn: new Button({
				id: "avatarBtn",
				children: `
					{{{ Avatar }}}
				`,
				Avatar: new Avatar({
					attributes: {
						class: "profile-edit-avatar",
						name: "avatar",
					},
					children: `
						<img src="${previewUrl}" class="profile-edit-avatar-img" />
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

		const form = this.element?.querySelector(
			".profile-edit-data-form"
		) as HTMLFormElement;
		if (!form || !this.validator) return;

		if (this.validator.validateForm()) {
			const data = getFormData(form);
			if (data) {
				try {
					const inputFields: NodeListOf<HTMLInputElement> =
						document.querySelectorAll(".profile-field-input");
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
	}

	private handleFieldBlur(e?: Event): void {
		if (!this.validator) return;
		if (e) {
			this.validator.handleBlur(e);
		}
	}

	componentDidMount() {
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
							{{{ ProfileFields }}}
						</div>
						<div class="profile-edit-btns-container">
							{{{ SaveBtn }}}
						</div>
					`,
					ProfileFields: new ProfileFields({
						fields: profileEditFieldsClone,
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
				AvatarBtn: new Button({
					id: "avatarBtn",
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
