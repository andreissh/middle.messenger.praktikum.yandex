import { validateField } from "@/utils/validate";

type ValidationResult = { valid: boolean; error?: string };

export default class FormValidator {
	private form: HTMLFormElement;

	private fieldItemSelector: string;

	constructor(form: HTMLFormElement, fieldItemSelector = ".login-field-item") {
		this.form = form;
		this.fieldItemSelector = fieldItemSelector;
	}

	validateInput(
		input: HTMLInputElement,
		customCheck?: () => ValidationResult
	): boolean {
		let result: ValidationResult;
		if (customCheck) {
			result = customCheck();
		} else {
			const { name, value } = input;
			result = validateField(name, value);
		}
		this.showValidationResult(input, result);
		return result.valid;
	}

	showValidationResult(input: HTMLInputElement, result: ValidationResult) {
		const fieldContainer = input.closest(this.fieldItemSelector);
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

	validateForm(
		customChecks: Record<string, () => ValidationResult> = {}
	): boolean {
		const inputs = Array.from(this.form.elements).filter(
			(el): el is HTMLInputElement => el instanceof HTMLInputElement
		);

		return inputs.every((input) => {
			if (input.name in customChecks) {
				return this.validateInput(input, customChecks[input.name]);
			}
			return this.validateInput(input);
		});
	}

	attachBlurListeners(
		customChecks: Record<string, () => ValidationResult> = {}
	) {
		this.form.querySelectorAll("input").forEach((input) => {
			input.addEventListener("blur", () => {
				if (input.name in customChecks) {
					this.validateInput(input, customChecks[input.name]);
				} else {
					this.validateInput(input);
				}
			});
		});
	}
}
