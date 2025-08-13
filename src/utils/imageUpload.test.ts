import { jest } from "@jest/globals";
import handleImageUpload from "./imageUpload";

describe("handleImageUpload", () => {
	let mockInput: HTMLInputElement;

	beforeEach(() => {
		mockInput = {
			tagName: "INPUT",
			type: "file",
			files: null,
			click: jest.fn(),
			onchange: null,
			addEventListener: jest.fn((_, cb) => {
				(mockInput.onchange as any) = cb;
			}),
		} as unknown as HTMLInputElement;

		jest
			.spyOn(document, "createElement")
			.mockImplementation((tagName) =>
				tagName === "input" ? mockInput : document.createElement(tagName)
			);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const triggerChange = () => {
		if (mockInput.onchange) {
			mockInput.onchange({ target: mockInput } as unknown as Event);
		}
	};

	test("returns null when dialog cancelled", async () => {
		mockInput.files = null;
		const promise = handleImageUpload();
		triggerChange();
		const result = await promise;
		expect(result).toBeNull();
	});

	test("returns null when empty selection", async () => {
		mockInput.files = [] as unknown as FileList;
		const promise = handleImageUpload();
		triggerChange();
		const result = await promise;
		expect(result).toBeNull();
	});

	test("throws for invalid file type", async () => {
		mockInput.files = [
			new File([""], "test.txt", { type: "text/plain" }),
		] as unknown as FileList;
		const promise = handleImageUpload();
		triggerChange();
		await expect(promise).rejects.toThrow("Недопустимый тип файла");
	});

	test("returns file for valid selection", async () => {
		const testFile = new File([""], "test.png", { type: "image/png" });
		mockInput.files = [testFile] as unknown as FileList;
		const promise = handleImageUpload();
		triggerChange();
		const result = await promise;
		expect(result).toEqual(testFile);
	});
});
