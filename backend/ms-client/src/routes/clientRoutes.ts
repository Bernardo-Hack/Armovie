import { FastifyInstance } from "fastify";
import { registerSchemas, updateSchemas } from "../schemas/schemas";
import { clientService } from "../services/clientService";
import { genericErrorHandler } from "../errors";

export async function clientRoutes(app: FastifyInstance) {
	const service = new clientService();

	// Create a new client
	app.post("/", async (request, reply) => {
		try {
			const input = registerSchemas.parse(request.body);
			const result = await service.registerClient(input);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get a client by ID
	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const result = await service.getClientById(id);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all clients
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllClients();
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update an existing client
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const input = updateSchemas.parse(request.body);
			const result = await service.updateClient(id, input);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a client by ID
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const result = await service.deleteClient(id);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
