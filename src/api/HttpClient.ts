type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
	params?: Record<string, string | number>;
	body?: any;
}

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

	private _request<T>(
		method: HttpMethod,
		url: string,
		options: RequestOptions = {}
	): Promise<T> {
		const { params, body } = options;
		const fullUrl =
			this.baseURL +
			url +
			(method === "GET" && params ? HttpClient._buildQueryString(params) : "");

		return new Promise<T>((resolve, reject) => {
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
					resolve(responseData as T);
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

	get<T>(url: string, params?: Record<string, string | number>): Promise<T> {
		return this._request<T>("GET", url, { params });
	}

	post<T>(url: string, body?: any): Promise<T> {
		return this._request<T>("POST", url, { body });
	}

	put<T>(url: string, body?: any): Promise<T> {
		return this._request<T>("PUT", url, { body });
	}

	delete<T>(url: string, body?: any): Promise<T> {
		return this._request<T>("DELETE", url, { body });
	}
}
