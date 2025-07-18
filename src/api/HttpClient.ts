import router from "@/routes/Router";

type HttpMethodName = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions<TBody = unknown> = {
	params?: Record<string, string | number>;
	body?: TBody;
};

type HTTPMethod = <TResponse, TBody = unknown>(
	url: string,
	options?: RequestOptions<TBody>
) => Promise<TResponse>;

export default class HttpClient {
	private baseURL: string;

	constructor(baseURL: string = "") {
		this.baseURL = baseURL;
	}

	private static _buildQueryString(
		params?: Record<string, string | number>
	): string {
		if (!params) return "";
		const query = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			query.append(key, String(value));
		});
		return `?${query.toString()}`;
	}

	private _request<TResponse, TBody = unknown>(
		method: HttpMethodName,
		url: string,
		options: RequestOptions<TBody> = {}
	): Promise<TResponse> {
		const { params, body } = options;
		const fullUrl =
			this.baseURL +
			url +
			(method === "GET" && params ? HttpClient._buildQueryString(params) : "");

		return new Promise<TResponse>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(method, fullUrl);
			const isFormData = body instanceof FormData;
			if (!isFormData) {
				xhr.setRequestHeader("Content-Type", "application/json");
			}
			xhr.withCredentials = true;

			xhr.onload = () => {
				const contentType = xhr.getResponseHeader("Content-Type") || "";
				const isJson = contentType.includes("application/json");
				const responseData = isJson
					? JSON.parse(xhr.responseText)
					: xhr.responseText;

				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(responseData as TResponse);
				} else {
					if (xhr.status === 401) {
						router.go("/");
					}
					if (xhr.status === 404) {
						router.go("/404");
					} else if (xhr.status >= 500) {
						router.go("/500");
					}

					reject(
						new Error(
							JSON.stringify({
								status: xhr.status,
								message: xhr.statusText,
								data: responseData,
							})
						)
					);
				}
			};

			xhr.onerror = () => {
				reject(new Error(`Request failed`));
			};

			if (body && method !== "GET") {
				xhr.send(isFormData ? (body as FormData) : JSON.stringify(body));
			} else {
				xhr.send();
			}
		});
	}

	get: HTTPMethod = (url, options) => this._request("GET", url, options);

	post: HTTPMethod = (url, options) => this._request("POST", url, options);

	put: HTTPMethod = (url, options) => this._request("PUT", url, options);

	delete: HTTPMethod = (url, options) => this._request("DELETE", url, options);
}
