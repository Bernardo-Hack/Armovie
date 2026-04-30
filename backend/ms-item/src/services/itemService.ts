import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { genericErrorHandler, apiErr } from "../errors";

// Service class to handle the business logic of the item module

export class itemService {
	// Create a new item
	async createItem(input: schemas.CreateInput) {
		try {
			if (input.table !== "item") {
				throw new apiErr.BadRequestError(
					"Invalid table for this service",
				);
			}

			return await prisma.item.create({
				data: {
					...input.data,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get an item by its ID
	async getItemById(id: string) {
		try {
			return await prisma.item.findUniqueOrThrow({
				where: { id },
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get all items
	async getAllItems() {
		try {
			return await prisma.item.findMany({});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Update an existing item
	async updateItem(itemId: string, input: schemas.UpdateInput) {
		try {
			if (input.table !== "item") {
				throw new apiErr.BadRequestError(
					"Invalid table for this service!",
				);
			}

			const updatedItem = await prisma.item.update({
				where: { id: itemId },
				data: input.data,
			});

			return updatedItem;
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Delete an item by its ID
	async deleteItem(id: string) {
		try {
			await prisma.item.delete({ where: { id } });

			return;
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// - Consumption log specific methods -

	// Create a new consumption log
	async createConsumptionLog(input: schemas.CreateInput) {
		try {
			if (input.table !== "consumptionLog") {
				throw new apiErr.BadRequestError(
					"Invalid table for this service",
				);
			}

			return await prisma.consumptionLog.create({
				data: {
					...input.data,
				},
				include: {
					fragrance: true,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get consumption logs for a specific fragrance
	async getConsumptionLogsByFragranceId(fragranceId: string) {
		try {
			return await prisma.consumptionLog.findMany({
				where: { fragranceId },
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get all consumption logs
	async getAllConsumptionLogs() {
		try {
			return await prisma.consumptionLog.findMany({});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}
}
