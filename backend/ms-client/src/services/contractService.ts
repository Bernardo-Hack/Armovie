import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { genericErrorHandler, apiErr } from "../errors";

// Service class to handle the business logic of the contract module

export class contractService {
	async registerContract(input: schemas.RegisterInput) {
		try {
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
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async getContractById(id: string) {
		try {
			return await prisma.contract.findUniqueOrThrow({
				where: { id },
				include: {
					client: true,
					address: true,
					plan: true,
					type: true,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async getAllContracts() {
		try {
			return await prisma.contract.findMany({
				include: {
					client: true,
					address: true,
					plan: true,
					type: true,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async updateContract(contractId: string, input: schemas.UpdateInput) {
		try {
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
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async deleteContract(id: string) {
		try{
			await prisma.contract.delete({ where: { id } });

			return;
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}
}
