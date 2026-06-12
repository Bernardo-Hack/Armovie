import storageUtil from "@/utils/storage";

export const EXPO_PUBLIC_GATEWAY_URL =
	process.env.EXPO_PUBLIC_GATEWAY_URL || "http://localhost:3000";

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function notifyQueue(token: string | null) {
	refreshQueue.forEach((cb) => cb(token));
	refreshQueue = [];
}

async function attemptTokenRefresh(): Promise<string | null> {
	const refreshToken = await storageUtil.getItem("system_refresh_token");
	if (!refreshToken) return null;

	try {
		const response = await fetch(
			`${EXPO_PUBLIC_GATEWAY_URL}/api/users/refresh`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refresh_token: refreshToken }),
			},
		);

		if (!response.ok) {
			await storageUtil.deleteItem("system_access_token");
			await storageUtil.deleteItem("system_refresh_token");
			await storageUtil.deleteItem("system_user");
			return null;
		}

		const data = await response.json();
		await storageUtil.setItem("system_access_token", data.accessToken);
		if (data.refreshToken) {
			await storageUtil.setItem("system_refresh_token", data.refreshToken);
		}
		return data.accessToken;
	} catch (error) {
		console.error("Token refresh failed:", error);
		return null;
	}
}

async function retryRequest(
	endpoint: string,
	options: RequestInit,
	newToken: string,
) {
	const retryHeaders = new Headers(options.headers || {});
	retryHeaders.set("Authorization", `Bearer ${newToken}`);
	if (
		!retryHeaders.has("Content-Type") &&
		!(options.body instanceof FormData)
	) {
		retryHeaders.set("Content-Type", "application/json");
	}

	const retryResponse = await fetch(`${EXPO_PUBLIC_GATEWAY_URL}${endpoint}`, {
		...options,
		headers: retryHeaders,
	});

	if (!retryResponse.ok) {
		let errorData;
		try {
			errorData = await retryResponse.json();
		} catch {
			errorData = {};
		}
		throw new Error(errorData.error || retryResponse.statusText);
	}
	if (retryResponse.status === 204) return null; // No content
	const text = await retryResponse.text();
	return text ? JSON.parse(text) : null; // Handle empty body for 200 OK
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
	const token = await storageUtil.getItem("system_access_token");
	const headers = new Headers(options.headers || {});

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}
	if (
		!headers.has("Content-Type") &&
		!(options.body instanceof FormData) &&
		options.method !== "DELETE"
	) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(`${EXPO_PUBLIC_GATEWAY_URL}${endpoint}`, {
		...options,
		headers,
	});

	if (response.status === 401 && endpoint !== "/api/users/refresh") {
		if (isRefreshing) {
			// Waits for the ongoing refresh to complete and gets the new token from the queue
			const newToken = await new Promise<string | null>((resolve) => {
				refreshQueue.push(resolve);
			});
			if (!newToken)
				throw new Error("Sessão expirada. Faça login novamente.");
			return retryRequest(endpoint, options, newToken);
		}

		isRefreshing = true;
		try {
			const newToken = await attemptTokenRefresh();
			notifyQueue(newToken); // Notifies all waiting requests with the new token (or null if refresh failed)
			if (!newToken)
				throw new Error("Sessão expirada. Faça login novamente.");
			return retryRequest(endpoint, options, newToken);
		} finally {
			isRefreshing = false;
		}
	}

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
		} catch {
			errorData = { error: "Ocorreu um erro na requisição" };
		}
		throw new Error(errorData.error || response.statusText);
	}

	if (response.status === 204) return null; // No content
	const text = await response.text();
	return text ? JSON.parse(text) : null; // Handle empty body for 200 OK
}
