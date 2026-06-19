import * as schemas from "../schemas/schemas.js";
import { prisma } from "../lib/prisma.js";
import { apiErr } from "../errors/index.js";

export class planService {
	async createPlan(input: schemas.RegisterInput) {
		const validated = schemas.registerSchemas.parse(input);

		if (validated.table !== "plan") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		console.log("Payload de criação de plano validado:", validated.data);

		return await prisma.plan.create({
			data: {
				...validated.data,
			},
		});
	}

	async getAllPlans() {
		return await prisma.plan.findMany();
	}

	async getPlanById(id: string) {
		return await prisma.plan.findUniqueOrThrow({
			where: { id },
		});
	}

	async deletePlan(id: string) {
		await prisma.plan.delete({ where: { id } });
		return { success: true };
	}
}
