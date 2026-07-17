import * as schemas from "../schemas/schemas.js";
import { prisma } from "../lib/prisma.js";
import { apiErr } from "../errors/index.js";

export class appointmentService {
	// Include checklist items in all queries by default
	private readonly include = { checklist: { orderBy: { order: "asc" as const } } };

	async createAppointment(input: schemas.RegisterInput) {
		const validated = schemas.registerSchemas.parse(input);

		if (validated.table !== "appointment") {
			throw new apiErr.BadRequestError("Invalid table for this service.");
		}

		return await prisma.appointment.create({
			data: { ...validated.data },
			include: this.include,
		});
	}

	async getAllAppointments() {
		return await prisma.appointment.findMany({
			include: this.include,
			orderBy: { scheduledDate: "asc" },
		});
	}

	async getAppointmentById(id: string) {
		return await prisma.appointment.findUniqueOrThrow({
			where: { id },
			include: this.include,
		});
	}

	async getAppointmentsByClient(clientId: string) {
		return await prisma.appointment.findMany({
			where: { clientId },
			include: this.include,
			orderBy: { scheduledDate: "asc" },
		});
	}

	async getAppointmentsByTechnician(technicianId: string) {
		return await prisma.appointment.findMany({
			where: { technicianId },
			include: this.include,
			orderBy: { scheduledDate: "asc" },
		});
	}

	async getAppointmentsByDate(date: string) {
		const start = new Date(date);
		start.setHours(0, 0, 0, 0);
		const end = new Date(date);
		end.setHours(23, 59, 59, 999);

		return await prisma.appointment.findMany({
			where: {
				scheduledDate: { gte: start, lte: end },
			},
			include: this.include,
			orderBy: [{ routeOrder: "asc" }, { scheduledDate: "asc" }],
		});
	}

	async updateAppointment(id: string, input: schemas.UpdateInput) {
		const validated = schemas.updateSchemas.parse(input);

		if (validated.table !== "appointment") {
			throw new apiErr.BadRequestError("Invalid table for this service.");
		}

		return await prisma.appointment.update({
			where: { id },
			data: { ...validated.data },
			include: this.include,
		});
	}

	async deleteAppointment(id: string) {
		await prisma.appointment.delete({ where: { id } });
		return { success: true };
	}
}
