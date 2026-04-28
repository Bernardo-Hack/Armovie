import { FastifyInstance } from "fastify";
import { registerSchemas, updateSchemas } from "../schemas/schemas";
import { contractService } from "../services/contractService";
import { ApiError } from "../errors/apiError";

export async function contractRoutes(app: FastifyInstance) {
	const service = new contractService();

	// Create a new contract
	app.post("/register", async (request, reply) => {
		try {
			const input = registerSchemas.parse(request.body);
			const result = await service.registerContract(input);
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

	// Get a contract by ID
	app.get("/:id", async (request, reply) => {
		try {
			const result = await service.getContractById(request.id);
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

	// Get all contracts
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllContracts();
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

	// Update an existing contract
	app.patch("/:id", async (request, reply) => {
		try {
			const input = updateSchemas.parse(request.body);
			const result = await service.updateContract(request.id, input);
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

	// Delete a contract by ID
	app.delete("/:id", async (request, reply) => {
		try {
			const result = await service.deleteContract(request.id);
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
}
