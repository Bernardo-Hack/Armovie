import { z } from "zod";

// Define the schemas of this microservice here, and export them to be used in the services and controllers

export const clientSchema = z.object({
	name: z.string(),
	document: z.string(),
	responsible: z.string(),
	email: z.email({ pattern: z.regexes.html5Email }),
	phone: z.string(),
	whatsapp: z.string(),

	segmentId: z.uuid(),
	planId: z.uuid(),
	sellerId: z.uuid(),
	leadId: z.uuid(),

	status: z.enum(["active", "inactive", "suspended"]),

	observations: z.string().optional(),

	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const segmentSchema = z.object({
	name: z.string(),
});

export const leadSchema = z.object({
	name: z.string(),
});

export const addressSchema = z.object({
	street: z.string(),
	number: z.string(),
	zip_code: z.string(),
	city: z.string(),
	state: z.string(),
	clientId: z.uuid(),
});

export const contractSchema = z.object({
	clientId: z.uuid(),
	addressId: z.uuid(),
	typeId: z.uuid(),
	planId: z.uuid(),
	machines: z.number(),
	monthlyValue: z.number(),
	duration: z.number(),
	paymentDay: z.number(),
	fragrance: z.uuid(),
	observations: z.string().optional(),
	templateId: z.uuid().optional(),
	status: z.enum(["active", "inactive", "suspended"]),

	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const typeSchema = z.object({
	name: z.string(),
});

export const planSchema = z.object({
	name: z.string(),
	price: z.string().optional(),

	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const templateSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	content: z.string(),

	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

// Export the types of the schemas to be used in the services and controllers

export const registerSchema = z.discriminatedUnion("table", [
	z.object({
		table: z.literal("client"),
		data: clientSchema,
	}),
	z.object({
		table: z.literal("segment"),
		data: segmentSchema,
	}),
	z.object({
		table: z.literal("lead"),
		data: leadSchema,
	}),
	z.object({
		table: z.literal("address"),
		data: addressSchema,
	}),
	z.object({
		table: z.literal("contract"),
		data: contractSchema,
	}),
	z.object({
		table: z.literal("type"),
		data: typeSchema,
	}),
	z.object({
		table: z.literal("plan"),
		data: planSchema,
	}),
	z.object({
		table: z.literal("template"),
		data: templateSchema,
	}),
]);

export type RegisterInput = z.infer<typeof registerSchema>;

// Export update schemas

export const updateSchemas = z.discriminatedUnion("table", [
	z.object({
		table: z.literal("client"),
		data: clientSchema.partial(),
	}),
	z.object({
		table: z.literal("segment"),
		data: segmentSchema.partial(),
	}),
	z.object({
		table: z.literal("lead"),
		data: leadSchema.partial(),
	}),
	z.object({
		table: z.literal("address"),
		data: addressSchema.partial(),
	}),
	z.object({
		table: z.literal("contract"),
		data: contractSchema.partial(),
	}),
	z.object({
		table: z.literal("type"),
		data: typeSchema.partial(),
	}),
	z.object({
		table: z.literal("plan"),
		data: planSchema.partial(),
	}),
	z.object({
		table: z.literal("template"),
		data: templateSchema.partial(),
	}),
]);

export type UpdateInput = z.infer<typeof updateSchemas>;
