import { z } from "zod";

// - RegisterSchema -

export const registerUserSchema = z.object({
	name: z.string(),
	email: z.email({ pattern: z.regexes.html5Email }),
	roleId: z.string().uuid().optional(),
	password: z.string(),
	position: z.string(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

// - UpdateSchema -

export const updateSchema = registerUserSchema.partial();

export type UpdateInput = z.infer<typeof updateSchema>;

// - LoginSchema -

export const loginSchema = z.object({
	email: z.email({ pattern: z.regexes.html5Email }),
	password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// - Role Schemas -

export const createRoleSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	permissions: z.array(z.string()).default([]),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = createRoleSchema.partial();

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
