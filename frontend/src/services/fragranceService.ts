import { apiFetch } from "./api";
import { Fragrance } from "@/assets/types/ms-item/Fragrance";

export type FragranceData = Omit<Fragrance, "id" | "createdAt" | "updatedAt">;

const BASE_URL = "/api/items/fragrances/";

export const fragranceService = {
	createFragrance: async (data: FragranceData): Promise<Fragrance> => {
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify({ data, table: "fragrance" }),
		});
	},

	getAllFragrances: async (): Promise<Fragrance[]> => {
		return apiFetch(BASE_URL, { method: "GET" });
	},

	getFragranceById: async (id: string): Promise<Fragrance> => {
		return apiFetch(`${BASE_URL}${id}`, { method: "GET" });
	},

	updateFragrance: async (
		id: string,
		data: Partial<FragranceData>,
	): Promise<Fragrance> => {
		return apiFetch(`${BASE_URL}${id}`, {
			method: "PATCH",
			body: JSON.stringify({ data, table: "fragrance" }),
		});
	},

	deleteFragrance: async (id: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${id}`, { method: "DELETE" });
	},

	getConsumptionLogsByFragranceId: async (id: string): Promise<any[]> => {
		return apiFetch(`${BASE_URL}${id}/consumption-logs`, { method: "GET" });
	},
};
