import { FastifyInstance } from "fastify";
import { registerSchemas, updateSchemas } from "../schemas/schemas";
import { templateService } from "../services/templateService";
import { genericErrorHandler } from "../errors";

export async function templateRoutes(app: FastifyInstance) {
	const service = new templateService();

	// Create a new template
	app.post("/", async (request, reply) => {
		try {
			const input = registerSchemas.parse(request.body);
			const result = await service.createTemplate(input);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get a template by ID
	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const result = await service.getTemplateById(id);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all templates
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllTemplates();
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update an existing template
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const input = updateSchemas.parse(request.body);
			const result = await service.updateTemplate(id, input);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a template by ID
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			await service.deleteTemplate(id);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
