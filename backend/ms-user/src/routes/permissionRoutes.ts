import { FastifyInstance } from "fastify";
import { registerRoleSchema } from "../schemas/schemas";
import { UserService } from "../services/service";
import { ApiError, InvalidCredentialsError } from "../errors/apiError";
import { authenticate } from "../hooks/auth";

export async function permissionRoutes(app: FastifyInstance) {
	const service = new UserService();

	// - Protected routes - require authentication

	app.register(async (protected_) => {
		protected_.addHook("preHandler", authenticate);

		// Create a new role
		protected_.post("/", async (request, reply) => {
			try {
				if (request.user.roleId !== "admin") {
					throw new InvalidCredentialsError(
						"Access denied. Insufficient permissions.",
					);
				}

				const input = registerRoleSchema.parse(request.body);
				const result = await service.createRole(input);
				return reply.status(201).send(result);
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

		// Get all roles
		protected_.get("/", async (request, reply) => {
			try {
				if (request.user.roleId !== "admin") {
					throw new InvalidCredentialsError(
						"Access denied. Insufficient permissions.",
					);
				}
				
				const result = await service.getRoles();
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

		// Delete a role
		protected_.delete<{ Params: { id: string } }>(
			"/:id",
			async (request, reply) => {
				try {
					if (request.user.roleId !== "admin") {
						throw new InvalidCredentialsError(
							"Access denied. Insufficient permissions.",
						);
					}

					await service.deleteRole(request.params.id);
					return reply.status(204).send();
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
			},
		);
	});
}
