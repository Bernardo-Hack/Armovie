import { prisma } from "../lib/prisma.js";

type LogStatus = "success" | "failed" | "partial";

export const automationLogService = {
	async create(trigger: string, payload: unknown) {
		return prisma.automationLog.create({
			data: {
				trigger,
				status: "success", // optimistic — updated on error
				payload: payload as any,
			},
		});
	},

	async updateSuccess(id: string, result: unknown) {
		return prisma.automationLog.update({
			where: { id },
			data: { status: "success", result: result as any },
		});
	},

	async updateFailed(id: string, error: string, result?: unknown) {
		return prisma.automationLog.update({
			where: { id },
			data: {
				status: "failed",
				error,
				result: result as any ?? undefined,
			},
		});
	},

	async updatePartial(id: string, error: string, result: unknown) {
		return prisma.automationLog.update({
			where: { id },
			data: {
				status: "partial",
				error,
				result: result as any,
			},
		});
	},

	async getAll() {
		return prisma.automationLog.findMany({
			orderBy: { createdAt: "desc" },
			take: 100,
		});
	},

	async getByTrigger(trigger: string) {
		return prisma.automationLog.findMany({
			where: { trigger },
			orderBy: { createdAt: "desc" },
			take: 50,
		});
	},
};
