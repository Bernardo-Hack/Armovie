import * as schemas from "../schemas/schemas.js";
import { prisma } from "../lib/prisma.js";
import { apiErr } from "../errors/index.js";
import { logger } from "../utils/logger.js";

const AUTOMATION_URL = process.env.AUTOMATION_URL;

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

		const updated = await prisma.appointment.update({
			where: { id },
			data: { ...validated.data },
			include: this.include,
		});

		// ── Fire appointment-completed hook (fire-and-forget) ───────────────
		if (validated.data.status === "Concluído" && AUTOMATION_URL) {
			fetch(`${AUTOMATION_URL}/hooks/appointment-completed`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					appointmentId: updated.id,
					clientId:      updated.clientId,
					machineId:     updated.machineId,
					technicianId:  updated.technicianId,
					type:          updated.type,
					notes:         updated.notes,
					nextVisitDate: updated.nextVisitDate,
					// ServiceLog fields (mlBefore, mlAfter, fragranceId, serviceId)
					// must be provided by the frontend modal at completion time.
					// They are not stored in the Appointment — pass them via notes or
					// directly in the status PATCH body as extra fields (ignored by Zod partial).
				}),
			}).catch((err) =>
				logger.warn(`appointment-completed hook failed: ${err.message}`),
			);
		}

		return updated;
	}

	async deleteAppointment(id: string) {
		await prisma.appointment.delete({ where: { id } });
		return { success: true };
	}
}
