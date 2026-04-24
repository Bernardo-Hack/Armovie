import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { genericErrorHandler, apiErr } from "../errors";

// Service class to handle the business logic of the client module

export class clientService {
	async registerClient(input: schemas.RegisterInput) {
		try {
			if (input.table !== "client") {
				throw new apiErr.BadRequestError("Invalid table for this service");
			}

			return await prisma.client.create({
				data: {
					...input.data,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async getClientById(id: string) {
		try {
			return await prisma.client.findUniqueOrThrow({
				where: { id },
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async getAllClients() {
		try {
			return await prisma.client.findMany({});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async updateClient(clientId: string, input: schemas.UpdateInput) {
		try {
			if (input.table !== "client") {
				throw new apiErr.BadRequestError("Invalid table for this service!");
			}

			const updatedClient = await prisma.client.update({
				where: { id: clientId },
				data: input.data,
			});

			return updatedClient;
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async deleteClient(id: string) {
		try {
			await prisma.client.delete({ where: { id } });

			return;
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}
}
