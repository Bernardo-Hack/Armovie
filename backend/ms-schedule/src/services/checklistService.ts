import * as schemas from "../schemas/schemas.js";
import { prisma } from "../lib/prisma.js";
import { apiErr } from "../errors/index.js";

export class checklistService {
	async createItem(input: schemas.RegisterInput) {
		const validated = schemas.registerSchemas.parse(input);

		if (validated.table !== "checklistItem") {
			throw new apiErr.BadRequestError("Invalid table for this service.");
		}

		return await prisma.checklistItem.create({
			data: { ...validated.data },
		});
	}

	async getItemsByAppointment(appointmentId: string) {
		return await prisma.checklistItem.findMany({
			where: { appointmentId },
			orderBy: { order: "asc" },
		});
	}

	async updateItem(id: string, input: schemas.UpdateInput) {
		const validated = schemas.updateSchemas.parse(input);

		if (validated.table !== "checklistItem") {
			throw new apiErr.BadRequestError("Invalid table for this service.");
		}

		return await prisma.checklistItem.update({
			where: { id },
			data: { ...validated.data },
		});
	}

	async deleteItem(id: string) {
		await prisma.checklistItem.delete({ where: { id } });
		return { success: true };
	}
}
