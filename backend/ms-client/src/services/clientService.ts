import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { apiErr } from "../errors";

// Service class to handle the business logic of the client module

export class clientService {
	async registerClient(input: schemas.RegisterInput) {
		const validated = schemas.registerSchemas.parse(input);

		if (validated.table !== "client") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		console.log("Payload de criação validado:", validated.data);

		try {
			return await prisma.client.create({
				data: {
					...validated.data,
				},
			});
		} catch (error: any) {
			if (error.code === "P2002") {
				const targets = error.meta?.target as string[];
				throw new apiErr.BadRequestError(`Conflito: Os dados informados (${targets?.join(", ")}) já estão em uso.`);
			}
			throw error;
		}
	}
	
	async getAllClients() {
		return await prisma.client.findMany({});
	}

	async getClientById(id: string) {
		return await prisma.client.findUniqueOrThrow({
			where: { id },
		});
	}

	async updateClient(clientId: string, input: schemas.UpdateInput) {
		const validated = schemas.updateSchemas.parse(input);

		if (validated.table !== "client") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		console.log("Payload de atualização validado:", validated.data);

		try {
			return await prisma.client.update({
				where: { id: clientId },
				data: {
					...validated.data,
				}
			});
		} catch (error: any) {
			if (error.code === "P2002") {
				const targets = error.meta?.target as string[];
				throw new apiErr.BadRequestError(`Conflito: Os dados informados (${targets?.join(", ")}) já estão em uso.`);
			}
			throw error;
		}
	}

	async deleteClient(id: string) {
		await prisma.client.delete({ where: { id } });
		return { success: true };
	}
}
