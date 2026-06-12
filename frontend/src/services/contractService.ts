import { apiFetch } from "./api";
import { Contract } from "@/assets/types/Contract";

const BASE_URL = "/api/clients/contracts/";

export const contractService = {
	createContract: async (contractData: Partial<Contract>): Promise<Contract> => {
		const payload = {
			data: contractData,
			table: "contract",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllContracts: async (): Promise<Contract[]> => {
		return apiFetch(BASE_URL, {
			method: "GET",
		});
	},

	getContractById: async (contractId: string): Promise<Contract> => {
		return apiFetch(`${BASE_URL}${contractId}`, {
			method: "GET",
		});
	},

	updateContract: async (contractId: string, contractData: Partial<Contract>): Promise<Contract> => {
		const payload = {
			data: contractData,
			table: "contract",
		};
		return apiFetch(`${BASE_URL}${contractId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deleteContract: async (contractId: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${contractId}`, {
			method: "DELETE",
		});
	},
};
