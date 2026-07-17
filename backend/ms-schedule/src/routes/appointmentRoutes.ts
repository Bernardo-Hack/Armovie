import { FastifyInstance } from "fastify";
import { registerSchemas, updateSchemas } from "../schemas/schemas.js";
import { appointmentService } from "../services/appointmentService.js";
import { genericErrorHandler } from "../errors/index.js";

export async function appointmentRoutes(app: FastifyInstance) {
	const service = new appointmentService();

	// Create a new appointment
	app.post("/", async (request, reply) => {
		try {
			const input = registerSchemas.parse(request.body);
			const result = await service.createAppointment(input);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all appointments
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllAppointments();
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get appointments by date (e.g. GET /appointment?date=2026-07-17)
	app.get("/by-date", async (request, reply) => {
		try {
			const { date } = request.query as { date?: string };
			if (!date) {
				return reply.status(400).send({ error: "Query param 'date' is required (YYYY-MM-DD)." });
			}
			const result = await service.getAppointmentsByDate(date);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get appointments by client
	app.get("/client/:clientId", async (request, reply) => {
		try {
			const { clientId } = request.params as { clientId: string };
			const result = await service.getAppointmentsByClient(clientId);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get appointments by technician
	app.get("/technician/:technicianId", async (request, reply) => {
		try {
			const { technicianId } = request.params as { technicianId: string };
			const result = await service.getAppointmentsByTechnician(technicianId);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get a single appointment by ID
	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const result = await service.getAppointmentById(id);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update an appointment
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const input = updateSchemas.parse(request.body);
			const result = await service.updateAppointment(id, input);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete an appointment (cascade deletes its checklist items)
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as { id: string };
			const result = await service.deleteAppointment(id);
			return reply.status(200).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
