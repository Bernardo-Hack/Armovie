import { FastifyInstance } from "fastify";
import { supplierService } from "../services/supplierService.js";
import { createSchemas, updateSchemas } from "../schemas/schemas.js";
import { genericErrorHandler } from "../errors/index.js";
import { logger } from "../utils/logger.js";

export async function supplierRoutes(app: FastifyInstance) {
	const service = new supplierService();

	// Create a new supplier
	app.post("/", async (request, reply) => {
		try {
			const input = createSchemas.parse(request.body);
			const result = await service.createSupplier(input);
			logger.info(`Supplier created with id: ${result.id}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get a supplier by ID
	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const result = await service.getSupplierById(id);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all suppliers
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllSuppliers();
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update a supplier
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const input = updateSchemas.parse(request.body);
			const result = await service.updateSupplier(id, input);
			logger.info(`Supplier updated with id: ${id}`);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a supplier
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			await service.deleteSupplier(id);
			logger.info(`Supplier deleted with id: ${id}`);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
