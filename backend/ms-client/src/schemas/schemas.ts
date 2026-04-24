import { z } from "zod";

// Define the schemas of this microservice here, and export them to be used in the services and controllers

export const clientSchema = z.object({
	name: z.string(),
	document: z.string(),
	responsible: z.string(),
	email: z.email({ pattern: z.regexes.html5Email }),
	phone: z.string(),
	whatsapp: z.string(),

	segment: z.enum(["Retail", "Hospitality", "Healthcare", "Gastronomy", "Other"]),
	lead: z.enum(["Instagram", "GoogleAds", "Referral", "Other"]),
	sellerId: z.uuid(),
	observations: z.string().optional(),

	status: z.enum(["active", "inactive", "suspended"]),

	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
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
	templateId: z.uuid(),
	planId: z.uuid(),
	type: z.enum(["Subscription", "Rental", "Sale", "Loan"]),

	machines: z.number(),
	fragrance: z.uuid(),
	duration: z.number(),
	
	monthlyValue: z.number(),
	paymentDay: z.number(),
	observations: z.string().optional(),

	status: z.enum(["active", "inactive", "suspended"]),

	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const planSchema = z.object({
	name: z.string(),
	price: z.float32(),

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
		table: z.literal("address"),
		data: addressSchema,
	}),
	z.object({
		table: z.literal("contract"),
		data: contractSchema,
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
		table: z.literal("address"),
		data: addressSchema.partial(),
	}),
	z.object({
		table: z.literal("contract"),
		data: contractSchema.partial(),
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
