import { z } from "zod";

// Define the schemas of this microservice here, and export them to be used in the services and controllers

const machineSchema = z.object({
	name: z.string(),
	model: z.string(),
	observations: z.string().nullish(),

	contractId: z.uuid().nullish(),
	localInstalled: z.string().nullish(),
	fragranceId: z.uuid().nullish(),
	medianConsumption: z.number().nonnegative().nullish(),

	price: z.number().positive(),
	amountPaid: z.number().nonnegative(),

	status: z.string().optional(),
});

const operatingHoursSchema = z.object({
	machineId: z.uuid(),
	contractId: z.uuid().nullish(),
	timingGradeId: z.uuid(),

	startTime: z.coerce.date(), // ISO time string
	endTime: z.coerce.date(), // ISO time string

	monday: z.boolean(),
	tuesday: z.boolean(),
	wednesday: z.boolean(),
	thursday: z.boolean(),
	friday: z.boolean(),
	saturday: z.boolean(),
	sunday: z.boolean(),
});

const timingGradeSchema = z.object({
	name: z.string(),
	interval: z.number().positive(), // interval in minutes between each splash
});

const serviceLogSchema = z.object({
	machineId: z.uuid(),
	technicianId: z.uuid(),

	serviceId: z.uuid(),
	description: z.string(),
	machinePayment: z.number().int().nonnegative(),

	mlBefore: z.number().positive().nullish(),
	mlAfter: z.number().positive().nullish(),
	fragranceId: z.uuid().nullish(),
});

const fragranceSchema = z.object({
	name: z.string(),
	family: z.string(),
	description: z.string(),

	stock: z.number().int().nonnegative(),
	unitCost: z.number().nonnegative(),
	supplier: z.string(),

	isActive: z.boolean(),
});

const consumptionLogSchema = z.object({
	fragranceId: z.uuid(),
	month: z.date(),
	mlConsumed: z.number().positive(),
});

const serviceTypeSchema = z.object({
	name: z.string(),
	description: z.string(),
});

const mlStepsSchema = z.object({
	quantity: z.number().int().positive(),
});

// Discriminated union for the register and update schemas

export const createSchemas = z.discriminatedUnion("table", [
	z.object({
		table: z.literal("machine"),
		data: machineSchema,
	}),
	z.object({
		table: z.literal("operatingHours"),
		data: operatingHoursSchema,
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
		table: z.literal("fragrance"),
		data: fragranceSchema,
	}),
	z.object({
		table: z.literal("consumptionLog"),
		data: consumptionLogSchema,
	}),
	z.object({
		table: z.literal("serviceType"),
		data: serviceTypeSchema,
	}),
	z.object({
		table: z.literal("mlSteps"),
		data: mlStepsSchema,
	}),
]);

export const updateSchemas = z.discriminatedUnion("table", [
	z.object({
		table: z.literal("machine"),
		data: machineSchema.partial(),
	}),
	z.object({
		table: z.literal("operatingHours"),
		data: operatingHoursSchema.partial(),
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
		table: z.literal("fragrance"),
		data: fragranceSchema.partial(),
	}),
	z.object({
		table: z.literal("consumptionLog"),
		data: consumptionLogSchema.partial(),
	}),
	z.object({
		table: z.literal("serviceType"),
		data: serviceTypeSchema.partial(),
	}),
	z.object({
		table: z.literal("mlSteps"),
		data: mlStepsSchema.partial(),
	}),
]);

// Export the types of the schemas to be used in the services and controllers

export type CreateInput = z.infer<typeof createSchemas>;

export type UpdateInput = z.infer<typeof updateSchemas>;
