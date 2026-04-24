import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { genericErrorHandler, apiErr } from "../errors";

// Service class to handle the business logic of the plan module

export class planService {
	async registerPlan(input: schemas.RegisterInput) {
		try {
			if (input.table !== "plan") {
				throw new apiErr.BadRequestError("Invalid table for this service");
			}

			return await prisma.plan.create({
				data: {
					...input.data,
				},
				include: {
					contracts: true,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async getPlanById(id: string) {
		try {
			return await prisma.plan.findUnique({
				where: { id },
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async getAllPlans() {
		try {
			return await prisma.plan.findMany();
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async updatePlan(planId: string, input: schemas.UpdateInput) {
		try {
			if (input.table !== "plan") {
				throw new apiErr.BadRequestError("Invalid table for this service!");
			}

			return await prisma.plan.update({
				where: { id: planId },
				data: input.data,
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async deletePlan(planId: string) {
		try {
			await prisma.plan.delete({ where: { id: planId } });
			
			return;
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}
}
