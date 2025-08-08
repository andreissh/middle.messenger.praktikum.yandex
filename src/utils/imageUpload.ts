async function handleImageUpload(): Promise<File | null> {
	const fileInput = document.createElement("input");
	fileInput.type = "file";
	const allowedTypes = [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/gif",
		"image/webp",
	];
	fileInput.accept = allowedTypes.join(", ");

	try {
		const file = await new Promise<File | null>((resolve) => {
			fileInput.click();
			fileInput.onchange = (event: Event) => {
				resolve((event.target as HTMLInputElement).files?.[0] || null);
			};
		});

		if (!file) return null;

		if (!allowedTypes.includes(file.type)) {
			throw new Error("Недопустимый тип файла");
		}

		return file;
	} catch (err) {
		throw new Error("Недопустимый тип файла");
	}
}

export default handleImageUpload;
