import { z } from "zod";

// Define the schemas of this microservice here, and 
// export them to be used in the services and controllers

export const clientSchema = z.object({
	fullName: z.string(),
	fantasyName: z.string().optional(),
	document: z.string(),
	municipalID: z.string().optional(),
	stateID: z.string().optional(),

	fieldOfActivity: z.string().optional(),
	lead: z.string(),
	segment: z.string(),

	phone: z.string(),
	whatsapp: z.string(),

	hasIss: z.boolean(),

	financesEmail: z.string().email(),
	alertsEmail: z.string().email().optional(),

	foundingDate: z.coerce.date(),
	observations: z.string().optional(),

	sellerId: z.string().uuid(),
	status: z.string().optional(),
});

export const personSchema = z.object({
	clientId: z.string().uuid(),
	rg: z.string(),
	cpf: z.string(),

	birthday: z.coerce.date(),
	civilState: z.string(),
	nationality: z.string(),

	doesSign: z.boolean(),
	isRepresentative: z.boolean(),
	role: z.string(),

	email: z.string().email(),
	phone: z.string(),
	observations: z.string().optional(),
});

export const addressSchema = z.object({
	clientId: z.string().uuid().optional(),
	personId: z.string().uuid().optional(),

	street: z.string(),
	number: z.number().int(),
	zip_code: z.string(),
	city: z.string(),
	state: z.string(),
	complement: z.string().optional(),
});

export const contractSchema = z.object({
	name: z.string(),
	clientId: z.string().uuid(),
	addressId: z.string().uuid(),
	templateId: z.string().uuid(),
	planId: z.string().uuid(),
	type: z.string(),

	machines: z.number().int(),
	fragrance: z.string().uuid(),
	duration: z.number().int(),
	
	monthlyValue: z.number(),
	paymentDay: z.number().int(),
	observations: z.string().optional(),
	status: z.string().optional(),
});

export const planSchema = z.object({
	name: z.string(),
	price: z.number(),
});

export const templateSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	content: z.string(),
});

// Export the types of the schemas to be 
// used in the services and controllers

export const registerSchemas = z.discriminatedUnion("table", [
	z.object({
		table: z.literal("client"),
		data: clientSchema,
	}),
	z.object({
		table: z.literal("person"),
		data: personSchema,
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

export type RegisterInput = z.infer<typeof registerSchemas>;

// Export update schemas

export const updateSchemas = z.discriminatedUnion("table", [
	z.object({
		table: z.literal("client"),
		data: clientSchema.partial(),
	}),
	z.object({
		table: z.literal("person"),
		data: personSchema.partial(),
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
