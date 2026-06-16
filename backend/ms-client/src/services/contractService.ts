import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { apiErr } from "../errors";

// Service class to handle the business logic of the contract module

export class contractService {
	async registerContract(input: schemas.RegisterInput) {
		if (input.table !== "contract") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		try {
			return await prisma.contract.create({
				data: {
					...input.data,
				},
			});
		} catch (error: any) {
			if (error.code === "P2003") {
				throw new apiErr.BadRequestError("Referência inválida: Um dos IDs relacionados (Cliente, Plano, Endereço ou Template) não existe no banco.");
			}
			throw error;
		}
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

		try {
			return await prisma.contract.update({
				where: { id: contractId },
				data: input.data,
				include: {
					client: true,
					address: true,
					plan: true,
				},
			});
		} catch (error: any) {
			if (error.code === "P2003") {
				throw new apiErr.BadRequestError("Referência inválida: Um dos IDs relacionados (Cliente, Plano, Endereço ou Template) não existe no banco.");
			}
			throw error;
		}
	}

	async deleteContract(id: string) {
		await prisma.contract.delete({ where: { id } });
		return { success: true };
	}
}
