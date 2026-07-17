import { FastifyInstance } from "fastify";
import { registerSchemas, updateSchemas } from "../schemas/schemas.js";
import { checklistService } from "../services/checklistService.js";
import { genericErrorHandler } from "../errors/index.js";

export async function checklistRoutes(app: FastifyInstance) {
	const service = new checklistService();

	// Get all checklist items for an appointment
	app.get("/appointment/:appointmentId", async (request, reply) => {
		try {
			const { appointmentId } = request.params as { appointmentId: string };
			const result = await service.getItemsByAppointment(appointmentId);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Create a new checklist item
	app.post("/", async (request, reply) => {
		try {
			const input = registerSchemas.parse(request.body);
			const result = await service.createItem(input);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update a checklist item (e.g. toggle done, rename label)
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const input = updateSchemas.parse(request.body);
			const result = await service.updateItem(id, input);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a checklist item
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const result = await service.deleteItem(id);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
