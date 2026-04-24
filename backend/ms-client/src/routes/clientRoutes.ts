import { FastifyInstance } from "fastify";
import { registerSchema } from "../schemas/schemas";
import { clientService } from "../services/clientService";
import { ApiError } from "../errors/apiError";

export async function clientRoutes(app: FastifyInstance) {
	const service = new clientService();

	// Create a new client
	app.post("/register", async (request, reply) => {
		try {
			const input = registerSchema.parse(request.body);
			const result = await service.registerClient(input);
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

	// Get a client by ID
	app.get("/:id", async (request, reply) => {
		try {
			const result = await service.getClientById(request.id);
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

	// Get all clients
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllClients();
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

	// Update an existing client
	app.patch("/:id", async (request, reply) => {
		try {
			const input = registerSchema.parse(request.body);
			const result = await service.updateClient(request.id, input);
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

	// Delete a client by ID
	app.delete("/:id", async (request, reply) => {
		try {
			const result = await service.deleteClient(request.id);
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
