import { FastifyInstance } from "fastify";
import { itemService } from "../services/itemService";
import { ApiError } from "../errors/apiError";
import { logger } from "../utils/logger";

export async function itemRoutes(app: FastifyInstance) {
	const service = new itemService();

	// Create a new item
	app.post("/", async (request, reply) => {
		try {
			const input = request.body as any;
			const result = await service.createItem(input);
			logger.info(`Item created with id: ${input.id}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to create item  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to create item." });
		}
	});

	// Get an item by ID
	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const result = await service.getItemById(id);
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to get item with id=${(request.params as any)?.id || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get item." });
		}
	});

	// Get all items
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllItems();
			return reply.send(result);
		} catch (err: any) {
			logger.error(`Failed to get all items  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get items." });
		}
	});

	// Update an item
	app.put("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const input = request.body as any;
			const result = await service.updateItem(id, input);
			logger.info(`Item updated with id: ${id}`);
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to update item with id=${(request.params as any)?.id || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to update item." });
		}
	});

	// Delete an item
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			await service.deleteItem(id);
			logger.info(`Item deleted with id: ${id}`);
			return reply.status(204).send();
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to delete item with id=${(request.params as any)?.id || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to delete item." });
		}
	});

	// - Consumption Logs -

	app.post("/consumption-log", async (request, reply) => {
		try {
			const input = request.body as any;
			const result = await service.createConsumptionLog(input);
			logger.info(`Consumption log created for fragranceId: ${input.fragranceId}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to create consumption log for fragranceId=${(request.body as any)?.fragranceId || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to create consumption log." });
		}
	});

	app.get("/consumption-log/fragrance/:fragranceId", async (request, reply) => {
		try {
			const { fragranceId } = request.params as any;
			const result = await service.getConsumptionLogsByFragranceId(fragranceId);
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to get consumption logs for fragranceId=${(request.params as any)?.fragranceId || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get consumption logs." });
		}
	});

	app.get("/consumption-log", async (request, reply) => {
		try {
			const result = await service.getAllConsumptionLogs();
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to get all consumption logs  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get consumption logs." });
		}
	});
}
