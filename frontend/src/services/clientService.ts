import { apiFetch } from "./api";
import { Client } from "@/assets/types/Client";

export interface ClientData {
	fullName: string;
	fantasyName?: string;
	document: string;
	municipalID?: string;
	stateID?: string;

	fieldOfActivity?: string;
	lead: string;
	segment: string;

	phone: string;
	whatsapp: string;

	hasIss: boolean;
	financesEmail: string;
	alertsEmail?: string;
	foundingDate: string | Date;
	observations?: string;

	sellerId: string;
}

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
