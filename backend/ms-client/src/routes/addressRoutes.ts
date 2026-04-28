import { FastifyInstance } from "fastify";
import { registerSchemas, updateSchemas } from "../schemas/schemas";
import { addressService } from "../services/addressService";
import { ApiError } from "../errors/apiError";

export async function addressRoutes(app: FastifyInstance) {
	const service = new addressService();

	// Create a new address
	app.post("/register", async (request, reply) => {
		try {
			const input = registerSchemas.parse(request.body);
			const result = await service.registerAddress(input);
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

	// Get an address by ID
	app.get("/:id", async (request, reply) => {
		try {
			const result = await service.getAddressById(request.id);
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

	// Get all addresses
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllAddresses();
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
	
	// Update an existing address
	app.patch("/:id", async (request, reply) => {
		try {
			const input = updateSchemas.parse(request.body);
			const result = await service.updateAddress(request.id, input);
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

	//Delete an address
	app.delete("/:id", async (request, reply) => {
		try {
			await service.deleteAddress(request.id);
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
