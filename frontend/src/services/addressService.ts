import { apiFetch } from "./api";

import { Address } from "@/assets/types/ms-client/Address";

export type AddressData = Omit<Address, "id">;

const BASE_URL = "/api/clients/address/";

export const addressService = {
	createAddress: async (
		addressData: Partial<AddressData>,
	): Promise<Address> => {
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
