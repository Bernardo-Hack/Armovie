import * as schemas from "../schemas/schemas.js";
import { prisma } from "../lib/prisma.js";
import { apiErr } from "../errors/index.js";

// Service class to handle the business logic of the supplier module

export class supplierService {
	// Create a new supplier
	async createSupplier(input: schemas.CreateInput) {
		if (input.table !== "supplier") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.supplier.create({
			data: {
				...input.data,
			},
		});
	}

	// Get a supplier by its ID (includes related fragrances)
	async getSupplierById(id: string) {
		return await prisma.supplier.findUniqueOrThrow({
			where: { id },
			include: {
				fragrances: true,
			},
		});
	}

	// Get all suppliers
	async getAllSuppliers() {
		return await prisma.supplier.findMany({
			include: {
				fragrances: {
					select: { id: true, name: true, isActive: true },
				},
			},
		});
	}

	// Update an existing supplier
	async updateSupplier(supplierId: string, input: schemas.UpdateInput) {
		if (input.table !== "supplier") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		return await prisma.supplier.update({
			where: { id: supplierId },
			data: {
				...input.data,
			},
		});
	}

	// Delete a supplier by its ID
	async deleteSupplier(id: string) {
		// Check if supplier has associated fragrances before deleting
		const supplier = await prisma.supplier.findUnique({
			where: { id },
			include: { fragrances: { select: { id: true } } },
		});

		if (!supplier) {
			throw new apiErr.NotFoundError("Supplier not found");
		}

		if (supplier.fragrances.length > 0) {
			throw new apiErr.BadRequestError(
				"Cannot delete supplier with associated fragrances. Reassign or delete them first."
			);
		}

		await prisma.supplier.delete({ where: { id } });

		return { success: true };
	}
}
