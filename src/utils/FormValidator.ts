import { ValidationResult } from "@/types/types";
import validateField from "./validate";

export default class FormValidator {
	private form: HTMLFormElement;

	private fieldItemSelector: string;

	constructor(form: HTMLFormElement, fieldItemSelector = ".login-field-item") {
		this.form = form;
		this.fieldItemSelector = fieldItemSelector;
	}

	validateInput(input: HTMLInputElement): boolean {
		let result: ValidationResult;

		const { name, value } = input;
		if (input.name === "password_repeat") {
			const password = document.querySelector<HTMLInputElement>(
				'input[name="password"]'
			);
			if (!password) return false;
			result = validateField(name, value, { [password.name]: password.value });
		} else {
			result = validateField(name, value);
		}

		this.showValidationResult(input, result);
		return result.valid;
	}

	showValidationResult(
		input: HTMLInputElement,
		result: ValidationResult
	): void {
		const fieldContainer = input.closest(this.fieldItemSelector);
		if (!fieldContainer) return;

		let errorEl = fieldContainer.nextElementSibling;

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

	validateForm(): boolean {
		const inputs = Array.from(this.form.elements).filter(
			(el): el is HTMLInputElement => el instanceof HTMLInputElement
		);

		return inputs.every((input) => this.validateInput(input));
	}

	handleBlur(e: Event): void {
		const input = e.target as HTMLInputElement;
		this.validateInput(input);
	}
}
