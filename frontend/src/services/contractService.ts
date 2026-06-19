import { apiFetch } from "./api";
import { Contract, Plan, Template } from "@/assets/types/ms-client/Contract";

export type ContractData = Omit<Contract, "id" | "createdAt" | "updatedAt">;
export type PlanData = Omit<Plan, "id" | "createdAt" | "updatedAt">;
export type TemplateData = Omit<Template, "id" | "createdAt" | "updatedAt">;

const BASE_URL_CONTRACT = "/api/clients/contract/";
const BASE_URL_PLAN = "/api/clients/plan/";
const BASE_URL_TEMPLATE = "/api/clients/template/";

export const contractService = {
	createContract: async (contractData: ContractData): Promise<Contract> => {
		const payload = {
			data: contractData,
			table: "contract",
		};
		return apiFetch(BASE_URL_CONTRACT, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllContracts: async (): Promise<Contract[]> => {
		return apiFetch(BASE_URL_CONTRACT, { method: "GET" });
	},

	getContractById: async (contractId: string): Promise<Contract> => {
		return apiFetch(`${BASE_URL_CONTRACT}${contractId}`, { method: "GET" });
	},

	updateContract: async (
		contractId: string,
		contractData: Partial<ContractData>,
	): Promise<Contract> => {
		const payload = {
			data: contractData,
			table: "contract",
		};
		return apiFetch(`${BASE_URL_CONTRACT}${contractId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deleteContract: async (contractId: string): Promise<void> => {
		await apiFetch(`${BASE_URL_CONTRACT}${contractId}`, {
			method: "DELETE",
		});
	},

	// --- Plans ---
	createPlan: async (planData: PlanData): Promise<Plan> => {
		const payload = {
			data: planData,
			table: "plan",
		};
		return apiFetch(BASE_URL_PLAN, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllPlans: async (): Promise<Plan[]> => {
		return apiFetch(BASE_URL_PLAN, { method: "GET" });
	},

	getPlanById: async (planId: string): Promise<Plan> => {
		return apiFetch(`${BASE_URL_PLAN}${planId}`, { method: "GET" });
	},

	deletePlan: async (planId: string): Promise<void> => {
		return apiFetch(`${BASE_URL_PLAN}${planId}`, { method: "DELETE" });
	},

	// --- Templates ---
	createTemplate: async (templateData: TemplateData): Promise<Template> => {
		const payload = {
			data: templateData,
			table: "template",
		};
		return apiFetch(BASE_URL_TEMPLATE, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllTemplates: async (): Promise<Template[]> => {
		return apiFetch(BASE_URL_TEMPLATE, { method: "GET" });
	},

	getTemplateById: async (templateId: string): Promise<Template> => {
		return apiFetch(`${BASE_URL_TEMPLATE}${templateId}`, { method: "GET" });
	},

	updateTemplate: async (
		templateId: string,
		templateData: Partial<TemplateData>,
	): Promise<Template> => {
		const payload = {
			data: templateData,
			table: "template",
		};

		return apiFetch(`${BASE_URL_TEMPLATE}${templateId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deleteTemplate: async (templateId: string): Promise<void> => {
		await apiFetch(`${BASE_URL_TEMPLATE}${templateId}`, {
			method: "DELETE",
		});
	},
};
