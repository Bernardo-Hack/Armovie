import { FastifyInstance } from "fastify";
import {
	createRoleSchema,
	updateRoleSchema,
} from "../schemas/schemas.js";
import { RoleService } from "../services/roleService.js";
import { genericErrorHandler } from "../errors/index.js";
import { authenticate } from "../hooks/auth.js";

export async function roleRoutes(app: FastifyInstance) {
	const service = new RoleService();

	app.register(async (protected_) => {
		protected_.addHook("preHandler", authenticate);

		// List all roles
		protected_.get("/", async (_request, reply) => {
			try {
				const result = await service.getAllRoles();
				return reply.status(200).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});

		// Get a role by ID
		protected_.get("/:id", async (request, reply) => {
			try {
				const { id } = request.params as { id: string };
				const result = await service.getRoleById(id);
				if (!result) return reply.status(404).send({ error: "Role not found" });
				return reply.status(200).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});

		// Create a new role
		protected_.post("/", async (request, reply) => {
			try {
				const input = createRoleSchema.parse(request.body);
				const result = await service.createRole(input);
				return reply.status(201).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});

		// Update a role
		protected_.patch("/:id", async (request, reply) => {
			try {
				const { id } = request.params as { id: string };
				const input = updateRoleSchema.parse(request.body);
				const result = await service.updateRole(id, input);
				return reply.status(200).send(result);
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});

		// Delete a role
		protected_.delete("/:id", async (request, reply) => {
			try {
				const { id } = request.params as { id: string };
				await service.deleteRole(id);
				return reply.status(200).send({ message: "Role deleted successfully" });
			} catch (err: any) {
				genericErrorHandler(err, reply);
			}
		});
	});
}
