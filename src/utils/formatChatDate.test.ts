import { jest } from "@jest/globals";
import formatChatDate from "./formatChatDate";

describe("formatChatDate", () => {
	const mockCurrentDate = new Date("2025-08-14T12:00:00");

	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(mockCurrentDate);
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("should format today's date as HH:MM", () => {
		const todayDate = new Date("2025-08-14T12:00:00");
		expect(formatChatDate(todayDate.toISOString())).toBe("12:00");

		const todayEarlyHours = new Date("2025-08-14T08:00:00");
		expect(formatChatDate(todayEarlyHours.toISOString())).toBe("08:00");
	});

	it("should format dates within the same week as weekday name", () => {
		expect(formatChatDate("2025-08-13T12:00:00")).toBe("Ср");
		expect(formatChatDate("2025-08-10T12:00:00")).toBe("Вс");
		expect(formatChatDate("2025-08-08T12:00:00")).toBe("Пт");
	});

	it('should format dates older than a week as "DD MMM YYYY"', () => {
		expect(formatChatDate("2025-08-01T12:00:00")).toBe("1 авг 2025");
		expect(formatChatDate("2025-07-31T12:00:00")).toBe("31 июл 2025");
		expect(formatChatDate("2024-12-31T12:00:00")).toBe("31 дек 2024");
		expect(formatChatDate("2024-01-01T12:00:00")).toBe("1 янв 2024");
	});

	it("should handle edge cases correctly", () => {
		expect(formatChatDate("2025-08-14T00:00:00")).toBe("00:00");
		expect(formatChatDate("2025-08-14T23:59:00")).toBe("23:59");
		expect(formatChatDate("2025-08-07T12:00:00")).toBe("7 авг 2025");
		expect(formatChatDate("2025-08-08T12:00:00")).toBe("Пт");
	});

	it("should pad single-digit hours and minutes with leading zeros", () => {
		expect(formatChatDate("2025-08-14T09:09:00")).toBe("09:09");
	});

	it("should use correct month abbreviations", () => {
		expect(formatChatDate("2025-01-14T12:00:00")).toBe("14 янв 2025");
		expect(formatChatDate("2025-02-14T12:00:00")).toBe("14 фев 2025");
		expect(formatChatDate("2025-03-14T12:00:00")).toBe("14 мар 2025");
		expect(formatChatDate("2025-04-14T12:00:00")).toBe("14 апр 2025");
		expect(formatChatDate("2025-05-14T12:00:00")).toBe("14 мая 2025");
		expect(formatChatDate("2025-06-14T12:00:00")).toBe("14 июн 2025");
		expect(formatChatDate("2025-07-14T12:00:00")).toBe("14 июл 2025");
		expect(formatChatDate("2025-08-14T12:00:00")).toBe("12:00");
		expect(formatChatDate("2025-09-14T12:00:00")).toBe("14 сен 2025");
		expect(formatChatDate("2025-10-14T12:00:00")).toBe("14 окт 2025");
		expect(formatChatDate("2025-11-14T12:00:00")).toBe("14 ноя 2025");
		expect(formatChatDate("2025-12-14T12:00:00")).toBe("14 дек 2025");
	});

	it("should use correct weekday abbreviations", () => {
		expect(formatChatDate("2025-08-08T12:00:00")).toBe("Пт");
		expect(formatChatDate("2025-08-09T12:00:00")).toBe("Сб");
		expect(formatChatDate("2025-08-10T12:00:00")).toBe("Вс");
		expect(formatChatDate("2025-08-11T12:00:00")).toBe("Пн");
		expect(formatChatDate("2025-08-12T12:00:00")).toBe("Вт");
		expect(formatChatDate("2025-08-13T12:00:00")).toBe("Ср");
		expect(formatChatDate("2025-08-14T12:00:00")).toBe("12:00");
	});
});
