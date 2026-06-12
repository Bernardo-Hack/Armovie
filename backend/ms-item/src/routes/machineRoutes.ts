import { FastifyInstance } from "fastify";
import { machineService } from "../services/machineService";
import { genericErrorHandler } from "../errors";
import { logger } from "../utils/logger";

export async function machineRoutes(app: FastifyInstance) {
	const service = new machineService();

	// Create a new machine
	app.post("/", async (request, reply) => {
		try {
			const input = request.body as any;
			const result = await service.createMachine(input);
			logger.info(`Machine created with id: ${input.id}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get a machine by ID
	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const result = await service.getMachineById(id);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all machines
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllMachines();
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update a machine
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const input = request.body as any;
			const result = await service.updateMachine(id, input);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a machine
	app.delete("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			await service.deleteMachine(id);
			logger.info(`Machine deleted with id: ${id}`);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// - Time Tables -

	// Create a time table for a machine
	app.post("/:machineId/timetables", async (request, reply) => {
		try {
			const { machineId } = request.params as any;
			const input = request.body as any;
			input.machineId = machineId; // Ensure the machineId is included in the input
			const result = await service.createTimeTable(input);
			logger.info(`Time table created for machine id: ${machineId}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get time tables for a machine
	app.get("/:machineId/timetables", async (request, reply) => {
		try {
			const { machineId } = request.params as any;
			const result = await service.getTimeTablesByMachineId(machineId);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all time tables
	app.get("/timetables", async (request, reply) => {
		try {
			const result = await service.getAllTimeTables();
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update a time table
	app.put("/timetables/:timeTableId", async (request, reply) => {
		try {
			const { timeTableId } = request.params as any;
			const input = request.body as any;
			const result = await service.updateTimeTable(timeTableId, input);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a time table
	app.delete("/timetables/:timeTableId", async (request, reply) => {
		try {
			const { timeTableId } = request.params as any;
			await service.deleteTimeTable(timeTableId);
			logger.info(`Time table deleted with id: ${timeTableId}`);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// - Time Grades - (similar structure to time tables, can be implemented here)

	// Create a time grade
	app.post("/timegrades", async (request, reply) => {
		try {
			const input = request.body as any;
			const result = await service.createTimeGrade(input);
			logger.info(`Time grade created with id: ${input.id}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all time grades
	app.get("/timegrades", async (request, reply) => {
		try {
			const result = await service.getAllTimingGrades();
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a time grade
	app.delete("/timegrades/:timeGradeId", async (request, reply) => {
		try {
			const { timeGradeId } = request.params as any;
			await service.deleteTimeGrade(timeGradeId);
			logger.info(`Time grade deleted with id: ${timeGradeId}`);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// - Service Logs -

	// Create a service log
	app.post("/:machineId/service-logs", async (request, reply) => {
		try {
			const { machineId } = request.params as any;
			const input = request.body as any;
			input.machineId = machineId; // Ensure the machineId is included in the input
			const result = await service.createServiceLog(input);
			logger.info(`Service log created for machine id: ${machineId}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get service logs for a machine
	app.get("/:machineId/service-logs", async (request, reply) => {
		try {
			const { machineId } = request.params as any;
			const result = await service.getServiceLogsByMachineId(machineId);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all service logs
	app.get("/service-logs", async (request, reply) => {
		try {
			const result = await service.getAllServiceLogs();
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a service log
	app.delete("/service-logs/:serviceLogId", async (request, reply) => {
		try {
			const { serviceLogId } = request.params as any;
			await service.deleteServiceLog(serviceLogId);
			logger.info(`Service log deleted with id: ${serviceLogId}`);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
