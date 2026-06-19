import { FastifyInstance } from "fastify";
import { registerSchemas, updateSchemas } from "../schemas/schemas.js";
import { personService } from "../services/personService.js";
import { genericErrorHandler } from "../errors/index.js";

export async function personRoutes(app: FastifyInstance) {
	const service = new personService();

	// Create a new person
	app.post("/", async (request, reply) => {
		try {
			const input = registerSchemas.parse(request.body);
			const result = await service.registerPerson(input);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all people or filter by clientId
	app.get("/", async (request, reply) => {
		try {
			const { clientId } = request.query as { clientId?: string };
			
			const result = clientId 
				? await service.getPeopleByClient(clientId)
				: await service.getPeople();
					
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
	
	// Update an existing person
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const input = updateSchemas.parse(request.body);
			const result = await service.updatePerson(id, input);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a person
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			await service.deletePerson(id);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
