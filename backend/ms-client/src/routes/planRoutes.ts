import { FastifyInstance } from "fastify";
import { registerSchema } from "../schemas/schemas";
import { planService } from "../services/planService";
import { ApiError } from "../errors/apiError";

export async function planRoutes(app: FastifyInstance) {
	const service = new planService();

	// Create a new plan
	app.post("/register", async (request, reply) => {
		try {
			const input = registerSchema.parse(request.body);
			const result = await service.registerPlan(input);
			return reply.status(201).send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Get a plan by ID
	app.get("/:id", async (request, reply) => {
		try {
			const result = await service.getPlanById(request.id);
			return reply.status(200).send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			return reply.status(404).send({ error: err.message });
		}
	});

	// Get all plans
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllPlans();
			return reply.status(200).send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Update an existing plan
	app.patch("/:id", async (request, reply) => {
		try {
			const input = registerSchema.parse(request.body);
			const result = await service.updatePlan(request.id, input);
			return reply.status(200).send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Delete a plan by ID
	app.delete("/:id", async (request, reply) => {
		try {
			await service.deletePlan(request.id);
			return reply.status(204).send();
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			return reply.status(500).send({ error: "Internal server error" });
		}
	});
}
