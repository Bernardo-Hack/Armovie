import { FastifyInstance } from "fastify";
import { fragranceService } from "../services/fragranceService.js";
import { createSchemas, updateSchemas } from "../schemas/schemas.js";
import { genericErrorHandler } from "../errors/index.js";
import { logger } from "../utils/logger.js";

export async function fragranceRoutes(app: FastifyInstance) {
	const service = new fragranceService();

	// Create a new fragrance
	app.post("/", async (request, reply) => {
		try {
			const input = createSchemas.parse(request.body);
			const result = await service.createFragrance(input);
			logger.info(`Fragrance created with id: ${result.id}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get an fragrance by ID
	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const result = await service.getFragranceById(id);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all fragrances, optionally filtered by family
	app.get("/", async (request, reply) => {
		try {
			const { family } = request.query as { family?: string };
			const result = family
				? await service.getFragrancesByFamily(family)
				: await service.getAllFragrances();

			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update an fragrance
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const input = updateSchemas.parse(request.body);
			const result = await service.updateFragrance(id, input);
			logger.info(`Fragrance updated with id: ${id}`);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete an fragrance
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			await service.deleteFragrance(id);
			logger.info(`Fragrance deleted with id: ${id}`);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// - Consumption Logs -

	// Create a new consumption log for a specific fragrance
	app.post("/:fragranceId/consumption-logs", async (request, reply) => {
		try {
			const { fragranceId } = request.params as any;
			const body = request.body as any;
			if (body.data) {
				body.data.fragranceId = fragranceId;
			}
			const input = createSchemas.parse(body);
			const result = await service.createConsumptionLog(input);
			logger.info(`Consumption log created for fragranceId: ${fragranceId}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all consumption logs for a specific fragrance
	app.get("/:fragranceId/consumption-logs", async (request, reply) => {
		try {
			const { fragranceId } = request.params as any;
			const result = await service.getConsumptionLogsByFragranceId(fragranceId);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all consumption logs across all fragrances
	app.get("/consumption-logs", async (request, reply) => {
		try {
			const result = await service.getAllConsumptionLogs();
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
