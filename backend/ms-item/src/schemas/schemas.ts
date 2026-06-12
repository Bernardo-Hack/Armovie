import { z } from "zod";

// Define the schemas of this microservice here, and export them to be used in the services and controllers

const daysEnum = z.enum([
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
]);

export const machineSchema = z.object({
	name: z.string(),
	model: z.string(),
	observations: z.string().optional(),

	contractId: z.uuid().optional(),
	fragranceId: z.uuid().optional(),
	medianConsumption: z.number().positive().optional(),

	price: z.number().positive(),
	isPaid: z.boolean().default(false).optional(),

	status: z.string().default("active").optional(),
});

export const timeTableSchema = z.object({
	machineId: z.uuid(),
	contractId: z.uuid().optional(),
	timingGradeId: z.uuid(),

	days: z.array(daysEnum),
	startTime: z.string(), // ISO time string (e.g., "08:00")
	endTime: z.string(), // ISO time string (e.g., "18:00")
});

export const timingGradeSchema = z.object({
	name: z.string(),
	timeBetween: z.number().positive(), // minutes between each splash
});

export const serviceLogSchema = z.object({
	machineId: z.uuid(),
	technicianId: z.uuid(),

	observation: z.string(),
	daysSinceLastService: z.number().int().nonnegative(),
	
	serviceType: z.string(),
	mlConsumed: z.number().positive().optional(),
});

export const itemSchema = z.object({
	name: z.string(),
	category: z.string(),
	supplier: z.string(),

	stock: z.number().int().nonnegative(),
	minStock: z.number().int().nonnegative(),
	averageCost: z.number().positive(),
	description: z.string(),
	notes: z.string().optional(),
});

export const consumptionLogSchema = z.object({
	fragranceId: z.uuid(),
	month: z.date(),
	mlConsumed: z.number().positive(),
});

// Discriminated union for the register and update schemas

const createSchemas = z.discriminatedUnion("table", [
	z.object({
		table: z.literal("machine"),
		data: machineSchema,
	}),
	z.object({
		table: z.literal("timeTable"),
		data: timeTableSchema,
	}),
	z.object({
		table: z.literal("timingGrade"),
		data: timingGradeSchema,
	}),
	z.object({
		table: z.literal("serviceLog"),
		data: serviceLogSchema,
	}),
	z.object({
		table: z.literal("item"),
		data: itemSchema,
	}),
	z.object({
		table: z.literal("consumptionLog"),
		data: consumptionLogSchema,
	}),
]);

const updateSchemas = z.discriminatedUnion("table", [
	z.object({
		table: z.literal("machine"),
		data: machineSchema.partial(),
	}),
	z.object({
		table: z.literal("timeTable"),
		data: timeTableSchema.partial(),
	}),
	z.object({
		table: z.literal("timingGrade"),
		data: timingGradeSchema.partial(),
	}),
	z.object({
		table: z.literal("serviceLog"),
		data: serviceLogSchema.partial(),
	}),
	z.object({
		table: z.literal("item"),
		data: itemSchema.partial(),
	}),
	z.object({
		table: z.literal("consumptionLog"),
		data: consumptionLogSchema.partial(),
	}),
]);

// Export the types of the schemas to be used in the services and controllers

export type CreateInput = z.infer<typeof createSchemas>;

export type UpdateInput = z.infer<typeof updateSchemas>;
