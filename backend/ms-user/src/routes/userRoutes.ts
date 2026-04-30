import { FastifyInstance } from "fastify";
import { registerUserSchema, loginSchema, updateSchema } from "../schemas/schemas";
import { UserService } from "../services/service";
import { ApiError } from "../errors/apiError";
import { authenticate } from "../hooks/auth";
import { logger } from "../utils/logger";

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
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Registration failed | email=${(request.body as any)?.email || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Registration failed." });
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
			const body = request.body as any;
			//logger.warn(
			//	`login failed  email=${body?.email || "?"}  reason=${err.message}`,
			//);
			return reply.status(401).send({ error: err.message });
		}
	});

	// - Protected routes - require authentication

	app.register(async (protected_) => {
		protected_.addHook("preHandler", authenticate);

		// Get a user by ID
		protected_.get("/profile", async (request, reply) => {
			try {
				const result = await service.getUserById(request.id);
				return reply.status(200).send(result);
			} catch (err: any) {
				if (err instanceof ApiError) {
					return reply
						.status(err.statusCode)
						.send({ error: err.message });
				}
				return reply
					.status(500)
					.send({ error: "Internal server error" });
			}
		});

		// List all users
		protected_.get("/", async (request, reply) => {
			try {
				const result = await service.getUsers();
				return reply.status(200).send(result);
			} catch (err: any) {
				if (err instanceof ApiError) {
					return reply
						.status(err.statusCode)
						.send({ error: err.message });
				}
				return reply
					.status(500)
					.send({ error: "Internal server error" });
			}
		});

		// Update an existing user
		protected_.patch("/profile", async (request, reply) => {
			try {
				const input = updateSchema.parse(request.body);
				const result = await service.updateUser(request.id, input);
				return reply.status(200).send(result);
			} catch (err: any) {
				if (err instanceof ApiError) {
					return reply
						.status(err.statusCode)
						.send({ error: err.message });
				}
				return reply
					.status(500)
					.send({ error: "Internal server error" });
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

		// Delete a user by ID
		protected_.delete("/profile", async (request, reply) => {
			try {
				const result = await service.deleteUser(request.id);
				return reply.status(200).send(result);
			} catch (err: any) {
				if (err instanceof ApiError) {
					return reply
						.status(err.statusCode)
						.send({ error: err.message });
				}
				return reply
					.status(500)
					.send({ error: "Internal server error" });
			}
		});
	});
}
