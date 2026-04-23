import * as schemas from "../schema/schemas";
import { prisma } from "../lib/prisma";
import { formatData, genericErrorHandler } from "../utils/utils";

// Service class to handle the business logic of the client module

export class ClientService {
    async registerClient(input: schemas.RegisterInput) {
        try {
            if (input.table !== "client") {
                throw new Error("Invalid table for this service");
            }

            const existingClient = await prisma.client.findFirst({
                where: { document: input.data.document },
            });

            if (existingClient) {
                throw new Error("Client with this document already exists!");
            }

            // Use input.data diretamente, pois o TypeScript já sabe o tipo correto aqui
            const client = await prisma.client.create({
				data: {
					...input.data,
				},
				include: {
					segment: true,
					lead: true,
				},
			});

            return {
                client: client,
            };
        } catch (err: any) {
            genericErrorHandler(err);
        }
    }

	async getClientById(id: string) {
		const client = await prisma.client.findUnique({
			where: { id },
			include: {
				segment: true,
				lead: true,
			},
		});

		if (!client) {
			throw new Error("Client not found!");
		}

		return {
			client: client,
		};
	}

	async getAllClients() {
		const clients = await prisma.client.findMany({
			include: {
				segment: true,
				lead: true,
			},
		});

		return {
			clients: clients,
		};
	}

	async updateClient(clientId: string, input: schemas.UpdateInput) {
		const client = await prisma.client.findUnique({
			where: { id: clientId },
		});

		try {
			if (!client) {
				throw new Error("Client not found!");
			}

			if (input.table !== "client") {
				throw new Error("Invalid table for this service!");
			}

			const dataForUpdate = formatData(input);

			const updatedClient = await prisma.client.update({
				where: { id: clientId },
				data: dataForUpdate,
				include: {
					segment: true,
					lead: true,
				},
			});

			return {
				client: updatedClient,
			};
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async deleteClient(id: string) {
		const client = await prisma.client.findUnique({
			where: { id },
		});

		if (!client) {
			throw new Error("Client not found!");
		}

		await prisma.client.delete({ where: { id } });

		return {
			message: "Client deleted successfully!",
		};
	}
}
