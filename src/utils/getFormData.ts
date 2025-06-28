export default function getFormData(form: HTMLFormElement): void {
	if (!form) {
		console.log("Форма не найдена");
		return;
	}

	const formData = new FormData(form);
	const data: Record<string, string> = {};

	formData.forEach((value, key) => {
		data[key] = value.toString();
	});

	console.log("Данные из формы:", data);
}
