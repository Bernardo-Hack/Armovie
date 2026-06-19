import { FastifyInstance } from "fastify";
import { registerSchemas, updateSchemas } from "../schemas/schemas.js";
import { contractService } from "../services/contractService.js";
import { genericErrorHandler } from "../errors/index.js";

export async function contractRoutes(app: FastifyInstance) {
	const service = new contractService();

	// Create a new contract
	app.post("/", async (request, reply) => {
		try {
			const input = registerSchemas.parse(request.body);
			const result = await service.registerContract(input);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get a contract by ID
	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const result = await service.getContractById(id);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all contracts
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllContracts();
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update an existing contract
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const input = updateSchemas.parse(request.body);
			const result = await service.updateContract(id, input);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a contract by ID
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const result = await service.deleteContract(id);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
