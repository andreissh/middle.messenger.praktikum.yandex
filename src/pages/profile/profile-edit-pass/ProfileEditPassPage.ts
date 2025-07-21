import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import getFormData from "@/utils/getFormData";
import FormValidator from "@/utils/FormValidator";
import { UserData, ValidationResult } from "@/types/types";
import backBtn from "@/assets/icons/back-btn.svg";
import avatarImg from "@/assets/icons/avatar-img.svg";
import http from "@/api/HttpClient";
import ProfileFieldsList from "../components/profile-fields-list/ProfileFieldsList";
import { passwordFields } from "../utils/profileData";
import "./profile-edit-pass.css";

const template = `
  <div class="profile-edit-pass">
    {{{ BackBtn }}}
    <div class="profile-edit-pass-content-wrapper">
      <div class="profile-edit-pass-content">
        <div class="profile-edit-pass-avatar-block">
          {{{ AvatarBtn }}}
        </div>
        <form class="profile-edit-pass-data-form">
          <div class="profile-edit-pass-data-block">
            {{{ ProfileFieldsList }}}
          </div>
          <div class="profile-edit-pass-btns-container">
            {{{ SaveBtn }}}
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
			BackBtn: new Button({
				id: "backBtn",
				children: `
					<div class="profile-edit-pass-goback-block">
						<img src="${backBtn}" alt="backBtn" />
					</div>
				`,
				events: {
					click: (e?: Event) => ProfileEditPassPage.handleBackClick(e),
				},
			}),
			AvatarBtn: new Button({
				id: "avatarBtn",
				children: `
					<span class="profile-edit-pass-avatar" name="avatar">
						<img src="${avatarImg}" class="profile-edit-pass-avatar-img" />
					</span>
				`,
				events: {
					click: (e?: Event) => ProfileEditPassPage.handleAvatarClick(e),
				},
			}),
			ProfileFieldsList: new ProfileFieldsList({
				fields: passwordFields,
				events: {
					blur: (e?: Event) => this.handleFieldBlur(e),
				},
			}),
			SaveBtn: new Button({
				id: "save",
				class: "btn",
				children: "Сохранить",
				events: {
					click: (e?: Event) => this.handleSaveClick(e),
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
			throw new Error("Form not found for validator initialization");
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

	private static handleBackClick(e?: Event): void {
		e?.preventDefault();
		router.go("/settings");
	}

	private static handleAvatarClick(e?: Event): void {
		e?.preventDefault();
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

	private handleSaveClick(e?: Event): void {
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
				const reqBody: Record<string, string> = {};
				passwordFields.forEach((field, i) => {
					if (field.id !== "repeatPassword") {
						reqBody[field.id] = inputFields[i].value ?? field.value;
					}
				});
				const setUserData = async () => {
					try {
						await http.put("/user/password", {
							body: {
								...reqBody,
							},
						});

						router.go("/settings");
					} catch (err) {
						throw new Error("Ошибка при смене пароля", { cause: err });
					}
				};
				setUserData();
			}
		}
	}

	componentDidMount(): void {
		this.validator = this.initValidator();
		const getUserData = async () => {
			try {
				const userData = await http.get<UserData>("/auth/user");

				this.setProps({
					AvatarBtn: new Button({
						id: "avatarBtn",
						children: `
							<span class="profile-edit-pass-avatar" name="avatar">
								<img src="https://ya-praktikum.tech/api/v2/resources${userData.avatar}" class="profile-edit-pass-avatar-img" />
							</span>
						`,
						events: {
							click: (e?: Event) => ProfileEditPassPage.handleAvatarClick(e),
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
