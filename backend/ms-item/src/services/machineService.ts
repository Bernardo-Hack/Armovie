import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { apiErr } from "../errors";

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

	// - Time Table related methods -

	// Create a new time table entry
	async createTimeTable(input: schemas.CreateInput) {
		if (input.table !== "timeTable") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.timeTable.create({
			data: {
				...input.data,
			},
		});
	}

	// Get time table entries by machine ID
	async getTimeTablesByMachineId(machineId: string) {
		return await prisma.timeTable.findMany({
			where: { machineId },
		});
	}

	// Get all time table entries
	async getAllTimeTables() {
		return await prisma.timeTable.findMany({});
	}

	// Update an existing time table entry
	async updateTimeTable(timeTableId: string, input: schemas.UpdateInput) {
		if (input.table !== "timeTable") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		const updatedTimeTable = await prisma.timeTable.update({
			where: { id: timeTableId },
			data: input.data,
		});

		return updatedTimeTable;
	}

	// Delete a time table entry by its ID
	async deleteTimeTable(id: string) {
		await prisma.timeTable.delete({
			where: { id },
		});
		return { success: true };
	}

	// - Timing Grade related methods -

	// Create a new timing grade entry
	async createTimeGrade(input: schemas.CreateInput) {
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

	// Delete a timing grade entry by its ID
	async deleteTimeGrade(id: string) {
		await prisma.timingGrade.delete({
			where: { id },
		});
		return { success: true };
	}

	// - Service Log related methods -

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

	// Get service logs by machine ID
	async getServiceLogsByMachineId(machineId: string) {
		return await prisma.serviceLog.findMany({
			where: { machineId },
			include: {
				machine: true,
			},
			orderBy: [{ created_at: "desc" }, { id: "desc" }],
		});
	}

	// Get all service logs
	async getAllServiceLogs() {
		return await prisma.serviceLog.findMany({
			include: {
				machine: true,
			},
			orderBy: [{ created_at: "desc" }, { id: "desc" }],
			take: 50, // Limit to the most recent 50 logs to prevent overload
			skip: 0, // Start from the most recent log
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
 