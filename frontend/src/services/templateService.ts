import { apiFetch } from "./api";
import { Template } from "@/components/pages/contracts/TemplateModal";

export interface TemplateData {
	name: string;
	description?: string;
	content: string;
}

const BASE_URL = "/api/clients/template/";

export const templateService = {
	createTemplate: async (templateData: TemplateData): Promise<Template> => {
		const payload = {
			data: templateData,
			table: "template",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllTemplates: async (): Promise<Template[]> => {
		return apiFetch(BASE_URL, {
			method: "GET",
		});
	},

	getTemplateById: async (templateId: string): Promise<Template> => {
		return apiFetch(`${BASE_URL}${templateId}`, {
			method: "GET",
		});
	},

	updateTemplate: async (
		templateId: string,
		templateData: Partial<TemplateData>,
	): Promise<Template> => {
		const payload = {
			data: templateData,
			table: "template",
		};

		return apiFetch(`${BASE_URL}${templateId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deleteTemplate: async (templateId: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${templateId}`, {
			method: "DELETE",
		});
	},
};
