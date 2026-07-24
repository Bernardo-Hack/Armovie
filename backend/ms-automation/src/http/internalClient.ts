import { logger } from "../utils/logger.js";

/**
 * Thin HTTP client for internal service-to-service calls.
 * Throws on non-2xx responses so callers can catch and log failures.
 */
export async function internalPost(url: string, body: unknown): Promise<any> {
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const text = await res.text().catch(() => "no body");
		throw new Error(`[${res.status}] POST ${url} → ${text}`);
	}

	return res.json();
}

export async function internalPatch(url: string, body: unknown): Promise<any> {
	const res = await fetch(url, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const text = await res.text().catch(() => "no body");
		throw new Error(`[${res.status}] PATCH ${url} → ${text}`);
	}

	return res.json();
}
