import { z } from 'zod';

// - RegisterSchema -

export const registerUserSchema = z.object({
	name: z.string(),
	email: z.email({ pattern: z.regexes.html5Email }),
	passwordHash: z.hash("sha512"),
	position: z.string(),
	roleId: z.uuid(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

// - UpdateSchema -

export const updateSchema = registerUserSchema.partial();

export type UpdateInput = z.infer<typeof updateSchema>;

// - LoginSchema -

export const loginSchema = z.object({
	email: z.email({ pattern: z.regexes.html5Email }),
	passwordHash: z.hash("sha512"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerRoleSchema = z.object({
	name: z.string(),
	description: z.string(),
});

export type RegisterRoleInput = z.infer<typeof registerRoleSchema>;
