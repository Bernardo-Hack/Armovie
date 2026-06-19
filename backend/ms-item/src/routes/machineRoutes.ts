import { FastifyInstance } from "fastify";
import { machineService } from "../services/machineService.js";
import { createSchemas, updateSchemas } from "../schemas/schemas.js";
import { genericErrorHandler } from "../errors/index.js";
import { logger } from "../utils/logger.js";

export async function machineRoutes(app: FastifyInstance) {
	const service = new machineService();

	// Create a new machine
	app.post("/", async (request, reply) => {
		try {
			const input = createSchemas.parse(request.body);
			const result = await service.createMachine(input);
			logger.info(`Machine created with id: ${result.id}`);
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
			const { contractId } = request.query as { contractId?: string };
			const result = contractId
				? await service.getMachinesByContract(contractId)
				: await service.getAllMachines();
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update a machine
	app.patch("/:id", async (request, reply) => {
		try {
			const { id } = request.params as any;
			const input = updateSchemas.parse(request.body);
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

	// - Operating Hours -

	// Create operating hours for a machine
	app.post("/:machineId/operating-hours", async (request, reply) => {
		try {
			const { machineId } = request.params as any;
			const body = request.body as any;
			if (body.data) body.data.machineId = machineId;
			const input = createSchemas.parse(body);
			const result = await service.createOperatingHours(input);
			logger.info(`Operating hours created for machine id: ${machineId}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get operating hours by either machineId or contractId
	app.get("/operating-hours", async (request, reply) => {
		try {
			const { machineId, contractId } = request.query as any;

			if (machineId) {
				const result =
					await service.getOperatingHoursByMachineId(machineId);
				return reply.send(result);
			} else if (contractId) {
				const result =
					await service.getOperatingHoursByContractId(contractId);
				return reply.send(result);
			} else {
				return reply
					.status(400)
					.send({ error: "Forneça machineId ou contractId" });
			}
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update operating hours
	app.put("/operating-hours/:operatingHoursId", async (request, reply) => {
		try {
			const { operatingHoursId } = request.params as any;
			const input = updateSchemas.parse(request.body);
			const result = await service.updateOperatingHours(operatingHoursId, input);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete operating hours
	app.delete("/operating-hours/:operatingHoursId", async (request, reply) => {
		try {
			const { operatingHoursId } = request.params as any;
			await service.deleteOperatingHours(operatingHoursId);
			logger.info(`Operating hours deleted with id: ${operatingHoursId}`);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// - Time Grades - (similar structure to time tables, can be implemented here)

	// Create a time grade
	app.post("/timegrades", async (request, reply) => {
		try {
			const input = createSchemas.parse(request.body);
			const result = await service.createTimingGrade(input);
			logger.info(`Time grade created with id: ${result.id}`);
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

	// Update a time grade
	app.patch("/timegrades/:timeGradeId", async (request, reply) => {
		try {
			const { timeGradeId } = request.params as any;
			const input = updateSchemas.parse(request.body);
			const result = await service.updateTimingGrade(timeGradeId, input);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a time grade
	app.delete("/timegrades/:timeGradeId", async (request, reply) => {
		try {
			const { timeGradeId } = request.params as any;
			await service.deleteTimingGrade(timeGradeId);
			logger.info(`Time grade deleted with id: ${timeGradeId}`);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// - Service Types -

	// Get all service types
	app.get("/service-types", async (request, reply) => {
		try {
			const result = await service.getAllServiceTypes();
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Create a service type
	app.post("/service-types", async (request, reply) => {
		try {
			const input = createSchemas.parse(request.body);
			const result = await service.createServiceType(input);
			logger.info(`Service type created with id: ${result.id}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update a service type
	app.patch("/service-types/:serviceTypeId", async (request, reply) => {
		try {
			const { serviceTypeId } = request.params as any;
			const input = updateSchemas.parse(request.body);
			const result = await service.updateServiceType(serviceTypeId, input);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete a service type
	app.delete("/service-types/:serviceTypeId", async (request, reply) => {
		try {
			const { serviceTypeId } = request.params as any;
			await service.deleteServiceType(serviceTypeId);
			logger.info(`Service type deleted with id: ${serviceTypeId}`);
			return reply.status(204).send();
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// - MlSteps -

	// Create an ml steps entry
	app.post("/ml-steps", async (request, reply) => {
		try {
			const input = createSchemas.parse(request.body);
			const result = await service.createMlSteps(input);
			logger.info(`Ml steps created with id: ${result.id}`);
			return reply.status(201).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Get all ml steps
	app.get("/ml-steps", async (request, reply) => {
		try {
			const result = await service.getAllMlSteps();
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Update an ml steps entry
	app.patch("/ml-steps/:mlStepsId", async (request, reply) => {
		try {
			const { mlStepsId } = request.params as any;
			const input = updateSchemas.parse(request.body);
			const result = await service.updateMlSteps(mlStepsId, input);
			return reply.send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// Delete an ml steps entry
	app.delete("/ml-steps/:mlStepsId", async (request, reply) => {
		try {
			const { mlStepsId } = request.params as any;
			await service.deleteMlSteps(mlStepsId);
			logger.info(`Ml steps deleted with id: ${mlStepsId}`);
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
			const body = request.body as any;
			if (body.data) body.data.machineId = machineId;
			const input = createSchemas.parse(body);
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
