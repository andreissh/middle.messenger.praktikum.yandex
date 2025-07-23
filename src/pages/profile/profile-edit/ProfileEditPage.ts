import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { UserData } from "@/types/types";
import backBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import http from "@/api/HttpClient";
import { resourcesUrl } from "@/utils/utils";
import Form from "@/components/form/Form";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
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
				id: "backBtn",
				children: `
					<div class="profile-edit-goback-block">
						<img src="${backBtn}" alt="backBtn" />
					</div>
				`,
				events: {
					click: (e?: Event) => ProfileEditPage.handleBackClick(e),
				},
			}),
			AvatarBtn: new Button({
				id: "avatarBtn",
				children: `
					<span class="profile-edit-avatar" name="avatar">
						<img src="${avatarImg}" class="profile-edit-avatar-img" />
					</span>
				`,
				events: {
					click: (e?: Event) => this.handleAvatarClick(e),
				},
			}),
			ProfileEditForm: new Form({
				class: "profile-edit-data-form",
				children: `
					<div class="profile-edit-data-block">
						{{{ ProfileFieldsList }}}
					</div>
					<div class="profile-edit-btns-container">
						{{{ SaveBtn }}}
					</div>
				`,
				ProfileFieldsList: new ProfileFieldsList({
					fields: profileEditFields,
					events: {
						blur: (e?: Event) => this.handleFieldBlur(e),
					},
				}),
				SaveBtn: new Button({
					id: "save",
					class: "btn",
					children: "Сохранить",
					type: "submit",
				}),
				events: {
					onsubmit: (e?: Event) => this.handleSaveSubmit(e),
				},
			}),
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

	private static handleBackClick(e?: Event): void {
		e?.preventDefault();
		router.go("/settings");
	}

	private async handleAvatarClick(e?: Event): Promise<void> {
		e?.preventDefault();

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

		const reader = new FileReader();
		reader.onload = (event) => {
			const avatarImgEl = document.querySelector(
				".profile-edit-avatar-img"
			) as HTMLImageElement;
			if (avatarImgEl && event.target?.result) {
				avatarImgEl.src = event.target.result as string;
			}
		};
		reader.readAsDataURL(file);

		try {
			const formData = new FormData();
			formData.append("avatar", file);
			await http.put("/user/profile/avatar", { body: formData });

			const userData = await http.get<UserData>("/auth/user");

			this.setProps({
				AvatarBtn: new Button({
					id: "avatarBtn",
					children: `
						<span class="profile-edit-avatar" name="avatar">
							<img src="${resourcesUrl}${userData.avatar}" class="profile-edit-avatar-img" />
						</span>
					`,
					events: {
						click: (event?: Event) => this.handleAvatarClick(event),
					},
				}),
			});
		} catch (err) {
			throw new Error("Ошибка при обновлении аватара", { cause: err });
		}
	}

	private handleSaveSubmit(e?: Event): void {
		e?.preventDefault();
		const form = this.element?.querySelector(
			".profile-edit-data-form"
		) as HTMLFormElement;
		if (!form || !this.validator) return;

		if (this.validator.validateForm()) {
			const data = getFormData(form);
			if (data) {
				const inputFields: NodeListOf<HTMLInputElement> =
					document.querySelectorAll(".profile-field-input");
				const reqBody: Record<string, string> = {};
				profileEditFields.forEach((field, i) => {
					reqBody[field.id] = inputFields[i].value ?? field.value;
				});
				const setUserData = async () => {
					try {
						await http.put<UserData>("/user/profile", {
							body: {
								...reqBody,
							},
						});

						router.go("/settings");
					} catch (err) {
						throw new Error("Ошибка при изменении данных пользователя", {
							cause: err,
						});
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
				const userData = await http.get<UserData>("/auth/user");
				let profileEditFieldsClone = structuredClone(profileEditFields);
				profileEditFieldsClone = profileEditFieldsClone.map((field) => ({
					...field,
					value: String(userData[field.id as keyof UserData]) ?? field.value,
				}));

				this.setProps({
					ProfileEditForm: new Form({
						class: "profile-edit-data-form",
						children: `
							<div class="profile-edit-data-block">
								{{{ ProfileFieldsList }}}
							</div>
							<div class="profile-edit-btns-container">
								{{{ SaveBtn }}}
							</div>
						`,
						ProfileFieldsList: new ProfileFieldsList({
							fields: profileEditFieldsClone,
							events: {
								blur: (e?: Event) => this.handleFieldBlur(e),
							},
						}),
						SaveBtn: new Button({
							id: "save",
							class: "btn",
							children: "Сохранить",
							type: "submit",
						}),
						events: {
							onsubmit: (e?: Event) => this.handleSaveSubmit(e),
						},
					}),
					AvatarBtn: new Button({
						id: "avatarBtn",
						children: `
							<span class="profile-edit-avatar" name="avatar">
								<img src="https://ya-praktikum.tech/api/v2/resources${userData.avatar}" class="profile-edit-avatar-img" />
							</span>
						`,
						events: {
							click: (e?: Event) => this.handleAvatarClick(e),
						},
					}),
				});
			} catch (err) {
				throw new Error("Ошибка при загрузке данных пользователя", {
					cause: err,
				});
			}
		};
		getUserData();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
