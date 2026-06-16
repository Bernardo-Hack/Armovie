import { FastifyInstance } from "fastify";
import { registerSchemas } from "../schemas/schemas";
import { planService } from "../services/planService";
import { genericErrorHandler } from "../errors";
import { logger } from "../utils/logger";

export async function planRoutes(app: FastifyInstance) {
	const service = new planService();

	// Create a new plan
	app.post("/", async (request, reply) => {
		try {
			const input = registerSchemas.parse(request.body);
			const result = await service.createPlan(input);
			logger.info(`Plan created with id: ${result.id}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all plans
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllPlans();
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get plan by id

	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const result = await service.getPlanById(id);
			return reply.send(result)
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a plan
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			await service.deletePlan(id);
			logger.info(`Plan deleted with id: ${id}`);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
