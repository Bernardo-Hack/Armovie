import { FastifyInstance } from "fastify";
import { registerSchemas, updateSchemas } from "../schemas/schemas";
import { addressService } from "../services/addressService";
import { genericErrorHandler } from "../errors";

export async function addressRoutes(app: FastifyInstance) {
	const service = new addressService();

	// Create a new address
	app.post("/", async (request, reply) => {
		try {
			const input = registerSchemas.parse(request.body);
			const result = await service.registerAddress(input);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get an address by ID
	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const result = await service.getAddressById(id);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all addresses or filter by clientId / personId
	app.get("/", async (request, reply) => {
		try {
			const { clientId, personId } = request.query as { clientId?: string, personId?: string };
			
			const result = clientId 
				? await service.getAddressesByClientId(clientId)
				: personId 
					? await service.getAddressesByPersonId(personId)
					: await service.getAllAddresses();
					
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
	
	// Update an existing address
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const input = updateSchemas.parse(request.body);
			const result = await service.updateAddress(id, input);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	//Delete an address
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			await service.deleteAddress(id);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
