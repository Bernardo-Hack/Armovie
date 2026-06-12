import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { apiErr } from "../errors";

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
			include: {
				client: true,
				address: true,
				plan: true,
			},
		});
	}

	async getAllContracts() {
		return await prisma.contract.findMany({
			include: {
				client: true,
				address: true,
				plan: true,
				type: true,
			},
		});
	}

	async getContractById(id: string) {
		return await prisma.contract.findUniqueOrThrow({
			where: { id },
			include: {
				client: true,
				address: true,
				plan: true,
				type: true,
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
				type: true,
			},
		});
	}

	async deleteContract(id: string) {
		await prisma.contract.delete({ where: { id } });
		return { success: true };
	}
}
