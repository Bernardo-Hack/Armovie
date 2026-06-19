import * as schemas from "../schemas/schemas.js";
import { prisma } from "../lib/prisma.js";
import { apiErr } from "../errors/index.js";

// Service class to handle the business logic of the contract module

export class contractService {
	async registerContract(input: schemas.RegisterInput) {
		if (input.table !== "contract") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.contract.create({
			data: {
				...input.data,
			},
		});
	}

	async getAllContracts() {
		return await prisma.contract.findMany();
	}

	async getContractById(id: string) {
		return await prisma.contract.findUniqueOrThrow({
			where: { id },
			include: {
				client: true,
				address: true,
				plan: true,
			},
		});
	}

	async updateContract(contractId: string, input: schemas.UpdateInput) {
		if (input.table !== "contract") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		return await prisma.contract.update({
			where: { id: contractId },
			data: input.data,
			include: {
				client: true,
				address: true,
				plan: true,
			},
		});
	}

	async deleteContract(id: string) {
		await prisma.contract.delete({ where: { id } });
		return { success: true };
	}
}
