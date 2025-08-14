import { jest } from "@jest/globals";
import { ValidationResult } from "@/types/types";

jest.unstable_mockModule("@/utils/validateField", () => ({
	__esModule: true,
	default: jest.fn(),
}));

const validateField = (await import("@/utils/validateField")).default;
const FormValidator = (await import("./FormValidator")).default;

const validateFieldSpy = jest.mocked(validateField);

describe("FormValidator", () => {
	let form: HTMLFormElement;
	let input: HTMLInputElement;
	let validator: InstanceType<typeof FormValidator>;

	beforeEach(() => {
		document.body.innerHTML = `
      <form>
        <div class="login-field-item">
          <input type="text" name="username" value="ivan" />
        </div>
        <div class="login-field-item">
          <input type="password" name="password" value="secret" />
        </div>
        <div class="login-field-item">
          <input type="password" name="password_repeat" value="secret" />
        </div>
      </form>
    `;

		form = document.querySelector("form")!;
		input = form.querySelector<HTMLInputElement>('input[name="username"]')!;

		validator = new FormValidator(form);

		validateFieldSpy.mockReset();
	});

	it("validates a normal input and shows error if invalid", () => {
		const result: ValidationResult = { valid: false, error: "Required" };
		validateFieldSpy.mockReturnValue(result);

		const isValid = validator.validateInput(input);

		expect(validateFieldSpy).toHaveBeenCalledWith("username", "ivan");
		expect(isValid).toBe(false);

		const errorEl = input.closest(".login-field-item")!
			.nextElementSibling as HTMLElement;

		expect(errorEl).not.toBeNull();
		expect(errorEl.textContent).toBe("Required");
	});

	it("removes error message when input becomes valid", () => {
		validateFieldSpy.mockReturnValueOnce({ valid: false, error: "Required" });
		validator.validateInput(input);

		expect(document.querySelector(".error-message")).not.toBeNull();

		validateFieldSpy.mockReturnValueOnce({ valid: true });
		validator.validateInput(input);

		expect(document.querySelector(".error-message")).toBeNull();
	});

	it("validates password_repeat with password value context", () => {
		const repeatInput = form.querySelector<HTMLInputElement>(
			'input[name="password_repeat"]'
		)!;
		validateFieldSpy.mockReturnValue({ valid: true });

		validator.validateInput(repeatInput);

		expect(validateFieldSpy).toHaveBeenCalledWith("password_repeat", "secret", {
			password: "secret",
		});
	});

	it("validateForm returns true only if all inputs are valid", () => {
		validateFieldSpy.mockReturnValue({ valid: true });

		const result = validator.validateForm();

		expect(result).toBe(true);
		expect(validateFieldSpy).toHaveBeenCalledTimes(3);
	});

	it("handleBlur triggers validation on the blurred input", () => {
		const spy = jest.spyOn(validator, "validateInput").mockReturnValue(true);

		const event = new Event("blur");
		Object.defineProperty(event, "target", { value: input });
		validator.handleBlur(event);

		expect(spy).toHaveBeenCalledWith(input);
	});
});
