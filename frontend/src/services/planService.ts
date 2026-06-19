import { apiFetch } from "./api";
import { Plan } from "@/assets/types/ms-client/Contract";

export type PlanData = Omit<Plan, "id" | "createdAt" | "updatedAt">;

const BASE_URL = "/api/clients/plans/";

export const planService = {
	createPlan: async (planData: PlanData): Promise<Plan> => {
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
		return apiFetch(BASE_URL, {
			method: "GET",
		});
	},

	getPlanById: async (planId: string): Promise<Plan> => {
		return apiFetch(`${BASE_URL}${planId}`, {
			method: "GET",
		});
	},

	updatePlan: async (
		planId: string,
		planData: Partial<PlanData>,
	): Promise<Plan> => {
		const payload = {
			data: planData,
			table: "plan",
		};

		return apiFetch(`${BASE_URL}${planId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deletePlan: async (planId: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${planId}`, {
			method: "DELETE",
		});
	},
};
