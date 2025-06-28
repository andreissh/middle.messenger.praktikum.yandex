type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions<TBody = unknown> = {
	params?: Record<string, string | number>;
	body?: TBody;
};

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
		method: HttpMethod,
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
			xhr.setRequestHeader("Content-Type", "application/json");

			xhr.onload = () => {
				const contentType = xhr.getResponseHeader("Content-Type") || "";
				const isJson = contentType.includes("application/json");
				const responseData = isJson
					? JSON.parse(xhr.responseText)
					: xhr.responseText;

				if (xhr.status >= 200 && xhr.status < 300) {
					resolve(responseData as TResponse);
				} else {
					reject(new Error(`Request failed with status ${xhr.status}`));
				}
			};

			xhr.onerror = () => {
				reject(new Error(`Request failed`));
			};

			if (body && method !== "GET") {
				xhr.send(JSON.stringify(body));
			} else {
				xhr.send();
			}
		});
	}

	get<TResponse>(
		url: string,
		params?: Record<string, string | number>
	): Promise<TResponse> {
		return this._request<TResponse>("GET", url, { params });
	}

	post<TResponse, TBody = unknown>(
		url: string,
		body?: TBody
	): Promise<TResponse> {
		return this._request<TResponse, TBody>("POST", url, { body });
	}

	put<TResponse, TBody = unknown>(
		url: string,
		body?: TBody
	): Promise<TResponse> {
		return this._request<TResponse, TBody>("PUT", url, { body });
	}

	delete<TResponse, TBody = unknown>(
		url: string,
		body?: TBody
	): Promise<TResponse> {
		return this._request<TResponse, TBody>("DELETE", url, { body });
	}
}
