type Callback<T extends unknown[] = unknown[]> = (...args: T) => void;
type ListenersMap = Record<string, Callback[]>;

export default class EventBus {
	private listeners: ListenersMap;

	constructor() {
		this.listeners = {};
	}

	on<T extends unknown[]>(event: string, callback: Callback<T>): void {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}

		this.listeners[event].push(callback as Callback);
	}

	off<T extends unknown[]>(event: string, callback: Callback<T>): void {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`);
		}

		this.listeners[event] = this.listeners[event].filter(
			(listener) => listener !== callback
		);
	}

	emit<T extends unknown[]>(event: string, ...args: T): void {
		if (!this.listeners[event]) {
			throw new Error(`Нет события: ${event}`);
		}

		this.listeners[event].forEach((listener) => {
			try {
				listener(...args);
			} catch (err) {
				throw new Error(`Ошибка в обработчике события ${event}:`, {
					cause: err,
				});
			}
		});
	}
}
