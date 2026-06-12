import { apiFetch } from "./api";
import { Plan } from "@/assets/types/Plan";

const BASE_URL = "/api/clients/plan/";

export const planService = {
	createPlan: async (planData: Partial<Plan>): Promise<Plan> => {
		const payload = {
			data: planData,
			table: "plan",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllPlans: async (): Promise<Plan[]> => {
		return apiFetch(BASE_URL, { method: "GET" });
	},
	
	deletePlan: async (planId: string): Promise<void> => {
		return apiFetch(`${BASE_URL}${planId}`, { method: "DELETE" });
	},
};
