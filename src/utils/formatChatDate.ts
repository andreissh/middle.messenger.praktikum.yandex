export default function formatChatDate(dateString: string) {
	const date = new Date(dateString);
	const now = new Date();

	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const inputDate = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	);

	const diffTime = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	const months = [
		"янв",
		"фев",
		"мар",
		"апр",
		"мая",
		"июн",
		"июл",
		"авг",
		"сен",
		"окт",
		"ноя",
		"дек",
	];

	const weekdays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

	if (inputDate.getTime() === today.getTime()) {
		return `${String(date.getHours()).padStart(2, "0")}:${String(
			date.getMinutes()
		).padStart(2, "0")}`;
	}

	if (diffDays > 0 && diffDays < 7) {
		return weekdays[date.getDay()];
	}

	return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
