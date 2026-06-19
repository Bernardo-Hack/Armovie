import { apiFetch } from "./api";
import { Client } from "@/assets/types/ms-client/Client";

export type ClientData = Omit<Client, "id" | "createdAt" | "updatedAt">;

const BASE_URL = "/api/clients/";

export const clientService = {
	createClient: async (clientData: ClientData): Promise<Client> => {
		const payload = {
			data: clientData,
			table: "client",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllClients: async (): Promise<Client[]> => {
		return apiFetch(BASE_URL, {
			method: "GET",
		});
	},

	getClientById: async (clientId: string): Promise<Client> => {
		return apiFetch(`${BASE_URL}${clientId}`, {
			method: "GET",
		});
	},

	updateClient: async (
		clientId: string,
		clientData: Partial<ClientData>,
	): Promise<Client> => {
		const payload = {
			data: clientData,
			table: "client",
		};

		return apiFetch(`${BASE_URL}${clientId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deleteClient: async (clientId: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${clientId}`, {
			method: "DELETE",
		});
	},
};
