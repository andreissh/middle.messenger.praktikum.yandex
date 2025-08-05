import { jest } from "@jest/globals";
import router from "@/routes/Router";
import { HttpClient, HttpStatus } from "./HttpClient";

describe("HttpClient", () => {
	let http: HttpClient;
	let mockXhr: any;
	let xhrMockClass: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(router, "go").mockImplementation(jest.fn());
		http = new HttpClient("https://api.example.com");

		mockXhr = {
			open: jest.fn(),
			setRequestHeader: jest.fn(),
			send: jest.fn(),
			withCredentials: false,
			onload: null,
			onerror: null,
			getResponseHeader: jest.fn().mockReturnValue("application/json"),
			status: 200,
			statusText: "OK",
			responseText: JSON.stringify({ success: true }),
		};

		xhrMockClass = jest.fn().mockImplementation(() => mockXhr);
		global.XMLHttpRequest = xhrMockClass as any;
		jest.clearAllMocks();
	});

	it("should perform GET request with query params", async () => {
		const promise = http.get("/route", { params: { q: "test" } });

		mockXhr.onload();

		expect(mockXhr.open).toHaveBeenCalledWith(
			"GET",
			"https://api.example.com/route?q=test"
		);
		await expect(promise).resolves.toEqual({ success: true });
	});

	it("should perform POST request with JSON body", async () => {
		const body = { key: "value" };
		const promise = http.post("/submit", { body });

		mockXhr.onload();

		expect(mockXhr.open).toHaveBeenCalledWith(
			"POST",
			"https://api.example.com/submit"
		);
		expect(mockXhr.send).toHaveBeenCalledWith(JSON.stringify(body));
		await expect(promise).resolves.toEqual({ success: true });
	});

	it("should perform PUT request", async () => {
		const promise = http.put("/update", { body: { key: "value" } });

		mockXhr.onload();

		expect(mockXhr.open).toHaveBeenCalledWith(
			"PUT",
			"https://api.example.com/update"
		);
		await expect(promise).resolves.toEqual({ success: true });
	});

	it("should perform DELETE request", async () => {
		const promise = http.delete("/delete");

		mockXhr.onload();

		expect(mockXhr.open).toHaveBeenCalledWith(
			"DELETE",
			"https://api.example.com/delete"
		);
		await expect(promise).resolves.toEqual({ success: true });
	});

	it("should handle FormData correctly", async () => {
		const formData = new FormData();
		formData.append("file", new Blob(["file content"]), "file.txt");

		const promise = http.post("/upload", { body: formData });

		mockXhr.onload();

		expect(mockXhr.setRequestHeader).not.toHaveBeenCalledWith(
			"Content-Type",
			"application/json"
		);
		expect(mockXhr.send).toHaveBeenCalledWith(formData);
		await expect(promise).resolves.toEqual({ success: true });
	});

	it("should redirect to '/' on 401 Unauthorized", async () => {
		mockXhr.status = HttpStatus.Unauthorized;
		mockXhr.responseText = JSON.stringify({ error: "unauthorized" });

		const promise = http.get("/private");
		mockXhr.onload();

		await expect(promise).rejects.toThrow();
		expect(router.go).toHaveBeenCalledWith("/");
	});

	it("should redirect to /404 on 404 Not Found", async () => {
		mockXhr.status = HttpStatus.NotFound;
		mockXhr.responseText = JSON.stringify({ error: "not-found" });

		const promise = http.get("/not-found");
		mockXhr.onload();

		await expect(promise).rejects.toThrow();
		expect(router.go).toHaveBeenCalledWith("/404");
	});

	it("should redirect to /500 on server error", async () => {
		mockXhr.status = HttpStatus.InternalServerError;
		mockXhr.responseText = JSON.stringify({ error: "server error" });

		const promise = http.get("/error");
		mockXhr.onload();

		await expect(promise).rejects.toThrow();
		expect(router.go).toHaveBeenCalledWith("/500");
	});

	it("should reject on network error", async () => {
		const promise = http.get("/fail");
		mockXhr.onerror();

		await expect(promise).rejects.toThrow("Request failed");
	});
});
