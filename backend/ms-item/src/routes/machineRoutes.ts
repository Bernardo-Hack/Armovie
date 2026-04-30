import { FastifyInstance } from "fastify";
import { machineService } from "../services/machineService";
import { ApiError } from "../errors/apiError";
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
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to create machine  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to create machine." });
		}
	});

	// Get a machine by ID
	app.get("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const result = await service.getMachineById(id);
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to get machine with id=${(request.params as any)?.id || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get machine." });
		}
	});

	// Get all machines
	app.get("/", async (request, reply) => {
		try {
			const result = await service.getAllMachines();
			return reply.send(result);
		} catch (err: any) {
			logger.error(`Failed to get all machines  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get machines." });
		}
	});

	// Update a machine
	app.put("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const input = request.body as any;
			const result = await service.updateMachine(id, input);
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to update machine with id=${(request.params as any)?.id || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to update machine." });
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
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to delete machine with id=${(request.params as any)?.id || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to delete machine." });
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
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to create time table for machineId=${(request.params as any)?.machineId || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to create time table." });
		}
	});

	// Get time tables for a machine
	app.get("/:machineId/timetables", async (request, reply) => {
		try {
			const { machineId } = request.params as any;
			const result = await service.getTimeTablesByMachineId(machineId);
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to get time tables for machineId=${(request.params as any)?.machineId || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get time tables." });
		}
	});

	// Get all time tables
	app.get("/timetables", async (request, reply) => {
		try {
			const result = await service.getAllTimeTables();
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to get all time tables  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get time tables." });
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
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to update time table with id=${(request.params as any)?.timeTableId || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to update time table." });
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
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to delete time table with id=${(request.params as any)?.timeTableId || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to delete time table." });
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
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to create time grade  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to create time grade." });
		}
	});

	// Get all time grades
	app.get("/timegrades", async (request, reply) => {
		try {
			const result = await service.getAllTimingGrades();
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to get all time grades  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get time grades." });
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
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to delete time grade with id=${(request.params as any)?.timeGradeId || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to delete time grade." });
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
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to create service log for machineId=${(request.params as any)?.machineId || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to create service log." });
		}
	});

	// Get service logs for a machine
	app.get("/:machineId/service-logs", async (request, reply) => {
		try {
			const { machineId } = request.params as any;
			const result = await service.getServiceLogsByMachineId(machineId);
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to get service logs for machineId=${(request.params as any)?.machineId || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get service logs." });
		}
	});

	// Get all service logs
	app.get("/service-logs", async (request, reply) => {
		try {
			const result = await service.getAllServiceLogs();
			return reply.send(result);
		} catch (err: any) {
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to get all service logs  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to get service logs." });
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
			if (err instanceof ApiError) {
				return reply
					.status(err.statusCode)
					.send({ error: err.message });
			}
			logger.error(`Failed to delete service log with id=${(request.params as any)?.serviceLogId || "?"}  reason=${err.message}`);
			return reply.status(500).send({ error: "Failed to delete service log." });
		}
	});
}
