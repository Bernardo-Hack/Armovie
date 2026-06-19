import { FastifyInstance } from "fastify";
import {
	registerUserSchema,
	loginSchema,
	updateSchema,
} from "../schemas/schemas.js";
import { UserService } from "../services/userService.js";
import { genericErrorHandler } from "../errors/index.js";
import { authenticate } from "../hooks/auth.js";
import { logger } from "../utils/logger.js";

export async function userRoutes(app: FastifyInstance) {
	const service = new UserService();

	// Register a new user
	app.post("/register", async (request, reply) => {
		try {
			const input = registerUserSchema.parse(request.body);
			const result = await service.createUser(input);
			logger.info(`User Registered in email: ${input.email}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Login a user
	app.post("/login", async (request, reply) => {
		try {
			const data = loginSchema.parse(request.body);
			const result = await service.loginUser(data);
			logger.info(`User logged in with email: ${data.email}`);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Refresh access token
	app.post("/refresh", async (request, reply) => {
		try {
			const { refresh_token } = request.body as {
				refresh_token: string;
			};
			const result = await service.refreshToken(refresh_token);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// - Protected routes - require authentication

	app.register(async (protected_) => {
		protected_.addHook("preHandler", authenticate);

		// Get a logged-in user's profile
		protected_.get("/profile", async (request, reply) => {
			try {
				const result = await service.getUserById(request.user.id);
				return reply.status(200).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});

		// Get a user by ID
		protected_.get("/:id", async (request, reply) => {
			try {
				const { id } = request.params as { id: string };
				const result = await service.getUserById(id);
				return reply.status(200).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});

		// List all users
		protected_.get("/", async (request, reply) => {
			try {
				const { role } = request.query as { role?: string };
				const result = role
					? await service.getUsersByRole(role)
					: await service.getUsers();
				return reply.status(200).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});

		// Update a user by ID
		protected_.patch("/:id", async (request, reply) => {
			try {
				const { id } = request.params as { id: string };
				const input = updateSchema.parse(request.body);
				const result = await service.updateUser(id, input);
				return reply.status(200).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});

		// Update an existing user
		protected_.patch("/profile", async (request, reply) => {
			try {
				const input = updateSchema.parse(request.body);
				const result = await service.updateUser(request.user.id, input);
				return reply.status(200).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});

		// Logout a user
		protected_.post("/logout", async (request, reply) => {
			const { refresh_token } = request.body as {
				refresh_token?: string;
			};
			if (refresh_token) {
				await service.logoutUser(refresh_token);
			}
			//logger.info(`user logged out  user=${request.user.id}`);
			return reply
				.status(200)
				.send({ message: "Usuário deslogado com sucesso" });
		});

		// Delete logged-in user's account
		protected_.delete("/profile", async (request, reply) => {
			try {
				const result = await service.deleteUser(request.user.id);
				return reply.status(200).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});

		// Delete a user by ID
		protected_.delete("/:id", async (request, reply) => {
			try {
				const { id } = request.params as { id: string };
				const result = await service.deleteUser(id);
				return reply.status(200).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});
	});
}
