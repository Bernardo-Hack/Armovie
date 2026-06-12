import { apiFetch } from "./api";

export interface Address {
	id: string;
	clientId?: string;
	personId?: string;
	street: string;
	number: number;
	zip_code: string;
	city: string;
	state: string;
	complement?: string;
}

const BASE_URL = "/api/clients/address/";

export const addressService = {
	createAddress: async (addressData: Partial<Address>): Promise<Address> => {
		const payload = {
			data: addressData,
			table: "address",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},
	getAddressesByClientId: async (clientId: string): Promise<Address[]> => {
		return apiFetch(`${BASE_URL}?clientId=${clientId}`, { method: "GET" });
	},
	getAddressesByPersonId: async (personId: string): Promise<Address[]> => {
		return apiFetch(`${BASE_URL}?personId=${personId}`, { method: "GET" });
	},
	deleteAddress: async (addressId: string): Promise<void> => {
		return apiFetch(`${BASE_URL}${addressId}`, { method: "DELETE" });
	},
};
