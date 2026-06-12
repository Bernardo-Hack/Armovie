import { apiFetch } from "./api";
import { Item } from "@/assets/types/Item";

export interface ItemData {
	name: string;
	category: string;
	supplier: string;
	stock: number;
	minStock: number;
	averageCost: number;
	description: string;
	notes?: string;
}

const BASE_URL = "/api/items/";

export const itemService = {
	createItem: async (itemData: ItemData): Promise<Item> => {
		const payload = {
			data: itemData,
			table: "item",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllItems: async (): Promise<Item[]> => {
		return apiFetch(BASE_URL, {
			method: "GET",
		});
	},

	getItemById: async (itemId: string): Promise<Item> => {
		return apiFetch(`${BASE_URL}${itemId}`, {
			method: "GET",
		});
	},

	updateItem: async (
		itemId: string,
		itemData: Partial<ItemData>,
	): Promise<Item> => {
		const payload = {
			data: itemData,
			table: "item",
		};

		return apiFetch(`${BASE_URL}${itemId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deleteItem: async (itemId: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${itemId}`, {
			method: "DELETE"
		});
	},
};
