import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { genericErrorHandler, apiErr } from "../errors";

// Service class to handle the business logic of the item module

export class itemService {
	// Create a new item
	async createItem(input: schemas.CreateInput) {
		if (input.table !== "item") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.item.create({
			data: {
				...input.data,
			},
		});
	}

	// Get an item by its ID
	async getItemById(id: string) {
		return await prisma.item.findUniqueOrThrow({
			where: { id },
		});
	}

	// Get all items
	async getAllItems() {
		return await prisma.item.findMany({});
	}

	// Update an existing item
	async updateItem(itemId: string, input: schemas.UpdateInput) {
		if (input.table !== "item") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		await prisma.item.update({
			where: { id: itemId },
			data: {
				...input.data,
			},
		});
	}

	// Delete an item by its ID
	async deleteItem(id: string) {
		await prisma.item.delete({ where: { id } });

		return { success: true };
	}

	// - Consumption log specific methods -

	// Create a new consumption log
	async createConsumptionLog(input: schemas.CreateInput) {
		if (input.table !== "consumptionLog") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.consumptionLog.create({
			data: {
				...input.data,
			},
			include: {
				fragrance: true,
			},
		});
	}

	// Get consumption logs for a specific fragrance
	async getConsumptionLogsByFragranceId(fragranceId: string) {
		return await prisma.consumptionLog.findMany({
			where: { fragranceId },
		});
	}

	// Get all consumption logs
	async getAllConsumptionLogs() {
		return await prisma.consumptionLog.findMany({});
	}
}
