import { apiFetch } from "./api";
import { Supplier } from "@/assets/types/ms-item/Supplier";

const BASE_URL = "/api/items/suppliers/";

export const supplierService = {
	createSupplier: async (
		data: Omit<Supplier, "id" | "createdAt" | "updatedAt">,
	): Promise<Supplier> => {
		const payload = {
			data: data,
			table: "supplier",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllSuppliers: async (): Promise<Supplier[]> => {
		return apiFetch(BASE_URL, {
			method: "GET",
		});
	},

	getSupplierById: async (id: string): Promise<Supplier> => {
		return apiFetch(`${BASE_URL}${id}`, {
			method: "GET",
		});
	},

	updateSupplier: async (
		id: string,
		data: Partial<Omit<Supplier, "id" | "createdAt" | "updatedAt">>,
	): Promise<Supplier> => {
		const payload = {
			data: data,
			table: "supplier",
		};
		return apiFetch(`${BASE_URL}${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deleteSupplier: async (id: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${id}`, {
			method: "DELETE",
		});
	},
};
