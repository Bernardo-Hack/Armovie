import { z } from "zod";

// ─── appointment-completed hook ───────────────────────────────────────────────

export const appointmentCompletedSchema = z.object({
	appointmentId: z.string().uuid(),
	machineId:     z.string().uuid().optional(),
	technicianId:  z.string().uuid().optional(),
	type:          z.enum(["Manutenção", "Instalação", "Retirada", "Visita"]),

	// ServiceLog fields (only relevant for Manutenção / Instalação)
	serviceId:      z.string().uuid().optional(),
	description:    z.string().optional(),
	machinePayment: z.number().int().optional(),
	mlBefore:       z.number().int().optional(),
	mlAfter:        z.number().int().optional(),
	fragranceId:    z.string().uuid().optional(),

	// Next visit (triggers auto-scheduling)
	nextVisitDate:   z.coerce.date().optional(),
	nextVisitType:   z.enum(["Manutenção", "Instalação", "Retirada", "Visita"]).optional(),
	clientId:        z.string().uuid().optional(),
	notes:           z.string().optional(),
});

export type AppointmentCompletedPayload = z.infer<typeof appointmentCompletedSchema>;

// ─── stock-low hook ───────────────────────────────────────────────────────────

export const stockLowSchema = z.object({
	fragranceId:   z.string().uuid(),
	fragranceName: z.string(),
	currentStock:  z.number().int(),
	minStock:      z.number().int(),
});

export type StockLowPayload = z.infer<typeof stockLowSchema>;
