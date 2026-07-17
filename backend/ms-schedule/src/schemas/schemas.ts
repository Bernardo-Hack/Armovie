import { z } from "zod";

// ─── Appointment ──────────────────────────────────────────────────────────────

export const appointmentSchema = z.object({
	// Cross-service references (plain UUIDs, no FK enforcement across microservices)
	clientId:     z.uuid(),
	technicianId: z.uuid().optional(),
	machineId:    z.uuid().optional(),

	// Scheduling
	scheduledDate:     z.coerce.date(),
	estimatedDuration: z.number().int().positive().optional(), // minutes

	// Classification
	type:   z.enum(["Manutenção", "Instalação", "Retirada", "Visita"]),
	status: z.enum(["Pendente", "Confirmado", "Em Andamento", "Concluído", "Cancelado", "Pulado"]).optional(),

	// Route context
	routeOrder: z.number().int().nonnegative().optional(),

	// Execution tracking
	startedAt:  z.coerce.date().optional(),
	finishedAt: z.coerce.date().optional(),

	// Extra info
	notes:         z.string().optional(),
	nextVisitDate: z.coerce.date().optional(),
});

// ─── ChecklistItem ────────────────────────────────────────────────────────────

export const checklistItemSchema = z.object({
	appointmentId: z.uuid(),
	label:         z.string().min(1),
	done:          z.boolean().optional(),
	order:         z.number().int().nonnegative(),
});

// ─── Register (create) discriminated union ────────────────────────────────────

export const registerSchemas = z.discriminatedUnion("table", [
	z.object({
		table: z.literal("appointment"),
		data:  appointmentSchema,
	}),
	z.object({
		table: z.literal("checklistItem"),
		data:  checklistItemSchema,
	}),
]);

export type RegisterInput = z.infer<typeof registerSchemas>;

// ─── Update (patch) discriminated union ───────────────────────────────────────

export const updateSchemas = z.discriminatedUnion("table", [
	z.object({
		table: z.literal("appointment"),
		data:  appointmentSchema.partial(),
	}),
	z.object({
		table: z.literal("checklistItem"),
		data:  checklistItemSchema.partial(),
	}),
]);

export type UpdateInput = z.infer<typeof updateSchemas>;
