import { jest } from "@jest/globals";
import EventBus from "./EventBus";

describe("EventBus", () => {
	let bus: EventBus;

	beforeEach(() => {
		bus = new EventBus();
	});

	it("should register and call a listener", () => {
		const cb = jest.fn();

		bus.on("test", cb);
		bus.emit("test", "abc", 123);

		expect(cb).toHaveBeenCalledWith("abc", 123);
	});

	it("should register multiple listeners", () => {
		const cb1 = jest.fn();
		const cb2 = jest.fn();

		bus.on("multiple", cb1);
		bus.on("multiple", cb2);
		bus.emit("multiple", "abc");

		expect(cb1).toHaveBeenCalledWith("abc");
		expect(cb2).toHaveBeenCalledWith("abc");
	});

	it("should remove a listener", () => {
		const callback = jest.fn();

		bus.on("remove", callback);
		bus.off("remove", callback);
		bus.emit("remove", "abc");

		expect(callback).not.toHaveBeenCalled();
	});

	it("should throw if off is called on non-existent event", () => {
		const fn = jest.fn();

		expect(() => bus.off("non-existent", fn)).toThrow(
			"Нет события: non-existent"
		);
	});

	it("should throw if emit is called on non-existent event", () => {
		expect(() => bus.emit("non-existent")).toThrow("Нет события: non-existent");
	});

	it("should throw wrapped error if listener throws", () => {
		bus.on("event", () => {
			throw new Error("error");
		});

		expect(() => bus.emit("event")).toThrow(
			"Ошибка в обработчике события event"
		);
	});
});
