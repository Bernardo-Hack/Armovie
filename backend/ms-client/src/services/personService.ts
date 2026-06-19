import * as schemas from "../schemas/schemas.js";
import { prisma } from "../lib/prisma.js";
import { apiErr } from "../errors/index.js";

// Service class to handle the business logic of the Person module

export class personService {
	async registerPerson(input: schemas.RegisterInput) {
		const validated = schemas.registerSchemas.parse(input);

		if (validated.table !== "person") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		console.log("Payload de criação validado:", validated.data);

		try {
			return await prisma.person.create({
				data: validated.data as any,
			});
		} catch (error: any) {
			if (error.code === "P2002") {
				const targets = error.meta?.target as string[];
				throw new apiErr.BadRequestError(
					`Conflito: Os dados informados (${targets?.join(", ")}) já estão em uso.`,
				);
			}
			throw error;
		}
	}

	async getPeople() {
		return await prisma.person.findMany({});
	}

	async getPeopleByClient(clientId: string) {
		return await prisma.person.findMany({ where: { clientId: clientId } });
	}

	async updatePerson(PersonId: string, input: schemas.UpdateInput) {
		const validated = schemas.updateSchemas.parse(input);

		if (validated.table !== "person") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		console.log("Payload de atualização validado:", validated.data);

		try {
			return await prisma.person.update({
				where: { id: PersonId },
				data: validated.data as any,
			});
		} catch (error: any) {
			if (error.code === "P2002") {
				const targets = error.meta?.target as string[];
				throw new apiErr.BadRequestError(
					`Conflito: Os dados informados (${targets?.join(", ")}) já estão em uso.`,
				);
			}
			throw error;
		}
	}

	async deletePerson(id: string) {
		await prisma.person.delete({ where: { id } });
		return { success: true };
	}
}
