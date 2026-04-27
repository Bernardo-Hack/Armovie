import { z } from 'zod';

export const registerSchema = z.object({
	name: z.string(),
	email: z.email({ pattern: z.regexes.html5Email }),
	password_hash: z.hash("sha512"),
	position: z.string(),
	permissionId: z.uuid(),
});

export const updateUserSchema = registerSchema.partial();

export const loginSchema = z.object({
	email: z.email({ pattern: z.regexes.html5Email }),
	password_hash: z.hash("sha512"),
});

