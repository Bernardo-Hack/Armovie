import * as schemas from "../schemas/schemas.js";
import { prisma } from "../lib/prisma.js";
import { apiErr } from "../errors/index.js";

// Service class to handle the business logic of the fragrance module

export class fragranceService {
	// Create a new fragrance
	async createFragrance(input: schemas.CreateInput) {
		if (input.table !== "fragrance") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.fragrance.create({
			data: {
				...input.data,
			},
		});
	}

	// Get an fragrance by its ID
	async getFragranceById(id: string) {
		return await prisma.fragrance.findUniqueOrThrow({
			where: { id },
		});
	}

	// Get all fragrances
	async getAllFragrances() {
		return await prisma.fragrance.findMany({});
	}

	// Get fragrances by family
	async getFragrancesByFamily(family: string) {
		return await prisma.fragrance.findMany({
			where: { family },
		});
	}

	// Update an existing fragrance
	async updateFragrance(fragranceId: string, input: schemas.UpdateInput) {
		if (input.table !== "fragrance") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		return await prisma.fragrance.update({
			where: { id: fragranceId },
			data: {
				...input.data,
			},
		});
	}

	// Delete an fragrance by its ID
	async deleteFragrance(id: string) {
		await prisma.fragrance.delete({ where: { id } });

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
