export default function getFormData(
	form: HTMLFormElement
): Record<string, string> | null {
	if (!form) {
		console.log("Форма не найдена");
		return null;
	}

	const formData = new FormData(form);
	const data: Record<string, string> = {};

	formData.forEach((value, key) => {
		data[key] = value.toString();
	});

	console.log("Данные из формы:", data);

	return data;
}
