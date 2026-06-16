import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { apiErr } from "../errors";

export class templateService {
	async createTemplate(input: schemas.RegisterInput) {
		if (input.table !== "template") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}
		return await prisma.template.create({
			data: input.data,
		});
	}

	async getAllTemplates() {
		return await prisma.template.findMany();
	}

	async getTemplateById(id: string) {
		return await prisma.template.findUniqueOrThrow({
			where: { id },
		});
	}

	async updateTemplate(templateId: string, input: schemas.UpdateInput) {
		if (input.table !== "template") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}
		return await prisma.template.update({
			where: { id: templateId },
			data: input.data,
		});
	}

	async deleteTemplate(id: string) {
		await prisma.template.delete({ where: { id } });
		return { success: true };
	}
}
