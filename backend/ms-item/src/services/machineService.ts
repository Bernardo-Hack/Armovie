import * as schemas from "../schemas/schemas.js";
import { prisma } from "../lib/prisma.js";
import { apiErr } from "../errors/index.js";

// Service class to handle the business logic of the machine module

export class machineService {
	// Create a new machine
	async createMachine(input: schemas.CreateInput) {
		if (input.table !== "machine") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.machine.create({
			data: {
				...input.data,
				amountPaid: input.data.price,
			},
		});
	}

	// Get a machine by its ID
	async getMachineById(id: string) {
		return await prisma.machine.findUniqueOrThrow({
			where: { id },
		});
	}

	// Get all machines
	async getAllMachines() {
		return await prisma.machine.findMany({});
	}

	// Get machines by contract
	async getMachinesByContract(contractId: string) {
		return await prisma.machine.findMany({
			where: { contractId },
		});
	}

	// Update an existing machine
	async updateMachine(machineId: string, input: schemas.UpdateInput) {
		if (input.table !== "machine") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		const updatedMachine = await prisma.machine.update({
			where: { id: machineId },
			data: input.data,
		});

		return updatedMachine;
	}

	// Delete a machine by its ID
	async deleteMachine(id: string) {
		await prisma.machine.delete({
			where: { id },
		});
		return { success: true };
	}

	// - Operating Hours related methods -

	// Create a new operating hours entry
	async createOperatingHours(input: schemas.CreateInput) {
		if (input.table !== "operatingHours") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.operatingHours.create({
			data: {
				...input.data,
			},
		});
	}

	// Get operating hours entries by machine ID
	async getOperatingHoursByMachineId(machineId: string) {
		return await prisma.operatingHours.findMany({
			where: { machineId },
		});
	}

	// Get operating hours entries by contract Id
	async getOperatingHoursByContractId(contractId: string) {
		return await prisma.operatingHours.findMany({
			where: { contractId },
		});
	}

	// Update an existing operating hours entry
	async updateOperatingHours(operatingHoursId: string, input: schemas.UpdateInput) {
		if (input.table !== "operatingHours") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		const updatedOperatingHours = await prisma.operatingHours.update({
			where: { id: operatingHoursId },
			data: input.data,
		});

		return updatedOperatingHours;
	}

	// Delete an operating hours entry by its ID
	async deleteOperatingHours(id: string) {
		await prisma.operatingHours.delete({
			where: { id },
		});
		return { success: true };
	}

	// - Timing Grade related methods -

	// Create a new timing grade entry
	async createTimingGrade(input: schemas.CreateInput) {
		if (input.table !== "timingGrade") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.timingGrade.create({
			data: {
				...input.data,
			},
		});
	}

	// Get all timing grade entries
	async getAllTimingGrades() {
		return await prisma.timingGrade.findMany({});
	}

	// Update an existing timing grade entry
	async updateTimingGrade(timingGradeId: string, input: schemas.UpdateInput) {
		if (input.table !== "timingGrade") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		return await prisma.timingGrade.update({
			where: { id: timingGradeId },
			data: input.data,
		});
	}

	// Delete a timing grade entry by its ID
	async deleteTimingGrade(id: string) {
		await prisma.timingGrade.delete({
			where: { id },
		});
		return { success: true };
	}

	// - Service Log related methods -

	// Get all service types
	async getAllServiceTypes() {
		return await prisma.serviceType.findMany({});
	}

	// Create a new service type
	async createServiceType(input: schemas.CreateInput) {
		if (input.table !== "serviceType") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.serviceType.create({
			data: { ...input.data },
		});
	}

	// Update an existing service type
	async updateServiceType(serviceTypeId: string, input: schemas.UpdateInput) {
		if (input.table !== "serviceType") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		return await prisma.serviceType.update({
			where: { id: serviceTypeId },
			data: input.data,
		});
	}

	// Delete a service type by its ID
	async deleteServiceType(id: string) {
		await prisma.serviceType.delete({
			where: { id },
		});
		return { success: true };
	}

	// - MlSteps related methods -

	// Create a new ml steps entry
	async createMlSteps(input: schemas.CreateInput) {
		if (input.table !== "mlSteps") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.mlSteps.create({
			data: { ...input.data },
		});
	}

	// Get all ml steps entries
	async getAllMlSteps() {
		return await prisma.mlSteps.findMany({});
	}

	// Update an existing ml steps entry
	async updateMlSteps(mlStepsId: string, input: schemas.UpdateInput) {
		if (input.table !== "mlSteps") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		return await prisma.mlSteps.update({
			where: { id: mlStepsId },
			data: input.data,
		});
	}

	// Delete a ml steps entry by its ID
	async deleteMlSteps(id: string) {
		await prisma.mlSteps.delete({
			where: { id },
		});
		return { success: true };
	}

	// Create a new service log entry
	async createServiceLog(input: schemas.CreateInput) {
		if (input.table !== "serviceLog") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.serviceLog.create({
			data: {
				...input.data,
			},
		});
	}

	// Get service logs by Machine ID
	async getServiceLogsByMachineId(machineId: string) {
		return await prisma.serviceLog.findMany({
			where: { machineId },
			include: {
				machine: true,
			},
			orderBy: [{ createdAt: "desc" }, { id: "desc" }],
		});
	}

	// Get service logs by Technician ID
	async getServiceLogsByTechnicianId(technicianId: string) {
		return await prisma.serviceLog.findMany({
			where: { technicianId },
			include: {
				machine: true,
			},
			orderBy: [{ createdAt: "desc" }, { id: "desc" }],
		});
	}

	// Delete a service log entry by its ID
	async deleteServiceLog(id: string) {
		await prisma.serviceLog.delete({
			where: { id },
		});
		return { success: true };
	}
}
