import { jest } from "@jest/globals";
import ChatController from "@/api/ChatController";
import http from "@/api/HttpClient";
import ChatsService from "@/services/ChatsService";
import { baseWsUrl } from "@/utils/utils";

describe("ChatController", () => {
	let mockSocket: any;
	let onOpenHandler: any;
	let onMessageHandler: any;
	let onErrorHandler: any;

	beforeEach(() => {
		jest.clearAllMocks();

		jest.spyOn(http, "get").mockResolvedValue({ id: 123 });
		jest
			.spyOn(ChatsService, "getWSToken")
			.mockResolvedValue({ token: "token" });

		mockSocket = {
			readyState: WebSocket.OPEN,
			send: jest.fn(),
			addEventListener: jest.fn((event, cb) => {
				if (event === "open") {
					onOpenHandler = cb;
				}
				if (event === "message") {
					onMessageHandler = cb;
				}
				if (event === "error") {
					onErrorHandler = cb;
				}
			}),
			close: jest.fn(),
		};

		global.WebSocket = jest.fn().mockImplementation(() => mockSocket) as any;
		(global.WebSocket as any).OPEN = 1;
		(global.WebSocket as any).CLOSED = 3;
	});

	it("should send message when socket is open", () => {
		(ChatController as any).socket = mockSocket;

		ChatController.send({ type: "message", content: "Hello" });

		expect(mockSocket.send).toHaveBeenCalledWith(
			JSON.stringify({ type: "message", content: "Hello" })
		);
	});

	it("should not send if socket is not open", () => {
		(ChatController as any).socket = {
			...mockSocket,
			readyState: WebSocket.CLOSED,
		};

		const spy = jest.spyOn(console, "log").mockImplementation(() => {});

		ChatController.send({ type: "message", content: "Hello" });

		expect(spy).toHaveBeenCalledWith("WebSocket не подключен");
		spy.mockRestore();
	});

	it("should close socket", () => {
		(ChatController as any).socket = mockSocket;

		ChatController.close();

		expect(mockSocket.close).toHaveBeenCalled();
	});

	it("should throw error when WebSocket encounters an error", async () => {
		const messageCallback = jest.fn();
		await ChatController.connectToChat(456, messageCallback);

		expect(() => {
			onErrorHandler(new Event("error"));
		}).toThrow("Ошибка WebSocket соединения");
	});

	it("should open websocket and send get old message", async () => {
		const messageCallback = jest.fn();
		await ChatController.connectToChat(456, messageCallback);

		onOpenHandler();

		expect(http.get).toHaveBeenCalledWith("/auth/user");
		expect(ChatsService.getWSToken).toHaveBeenCalledWith(456);
		expect(global.WebSocket).toHaveBeenCalledWith(`${baseWsUrl}/123/456/token`);
		expect(mockSocket.addEventListener).toHaveBeenCalledWith(
			"open",
			expect.any(Function)
		);
		expect(mockSocket.send).toHaveBeenCalledWith(
			JSON.stringify({ content: "0", type: "get old" })
		);
	});

	it("should call onMessage when valid message received", async () => {
		const messageCallback = jest.fn();
		await ChatController.connectToChat(456, messageCallback);

		onOpenHandler();
		onMessageHandler({
			data: JSON.stringify({ type: "message", content: "Hello" }),
		});

		expect(messageCallback).toHaveBeenCalledWith({
			type: "message",
			content: "Hello",
		});
	});

	it("should not call onMessage for invalid JSON", async () => {
		const messageCallback = jest.fn();
		await ChatController.connectToChat(456, messageCallback);

		expect(() => {
			onMessageHandler({ data: "invalid json" });
		}).toThrow("Ошибка при парсинге сообщения");
	});
});
