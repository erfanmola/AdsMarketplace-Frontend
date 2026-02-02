import { settings } from "./settings";
import { store } from "./store";

export class APIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "APIError";
	}
}

export const requestAPI = async (
	path = "/",
	params: { [key: string]: string | Blob | undefined } = {},
	method: "GET" | "POST" = "POST",
): Promise<any> => {
	const headers: { [key: string]: string } = {};

	const FD = new FormData();
	for (const [key, item] of Object.entries(params)) {
		if (item) {
			FD.append(key, item);
		}
	}

	if (store.token) {
		headers.Authorization = `Bearer ${store.token}`;
	}

	headers.locale = settings.language ?? "en";

	const request = await fetch(import.meta.env.VITE_BACKEND_BASE_URL + path, {
		method: method,
		body: method === "POST" ? FD : undefined,
		headers: headers,
	});

	const result = await request.json();

	if (result.status === "success") {
		return result.result ?? result;
	}

	if (result.status === "failed" && result.result?.error) {
		throw new APIError(result.result.error);
	}

	throw new APIError("Failed performing API request");
};
