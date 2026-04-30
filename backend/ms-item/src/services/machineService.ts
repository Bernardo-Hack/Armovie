import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { genericErrorHandler, apiErr } from "../errors";

// Service class to handle the business logic of the machine module

export class machineService {
	// Create a new machine
	async createMachine(input: schemas.CreateInput) {
		try {
			if (input.table !== "machine") {
				throw new apiErr.BadRequestError(
					"Invalid table for this service",
				);
			}

			return await prisma.machine.create({
				data: {
					...input.data,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get a machine by its ID
	async getMachineById(id: string) {
		try {
			return await prisma.machine.findUniqueOrThrow({
				where: { id },
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get all machines
	async getAllMachines() {
		try {
			return await prisma.machine.findMany({});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Update an existing machine
	async updateMachine(machineId: string, input: schemas.UpdateInput) {
		try {
			if (input.table !== "machine") {
				throw new apiErr.BadRequestError(
					"Invalid table for this service!",
				);
			}

			const updatedMachine = await prisma.machine.update({
				where: { id: machineId },
				data: input.data,
			});

			return updatedMachine;
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Delete a machine by its ID
	async deleteMachine(id: string) {
		try {
			await prisma.machine.delete({
				where: { id },
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// - Time Table related methods -
	
	// Create a new time table entry
	async createTimeTable(input: schemas.CreateInput) {
		try {
			if (input.table !== "timeTable") {
				throw new apiErr.BadRequestError(
					"Invalid table for this service",
				);
			}
			
			return await prisma.timeTable.create({
				data: {
					...input.data,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get time table entries by machine ID
	async getTimeTablesByMachineId(machineId: string) {
		try {
			return await prisma.timeTable.findMany({
				where: { machineId },
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get all time table entries
	async getAllTimeTables() {
		try {
			return await prisma.timeTable.findMany({});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Update an existing time table entry
	async updateTimeTable(timeTableId: string, input: schemas.UpdateInput) {
		try {
			if (input.table !== "timeTable") {
				throw new apiErr.BadRequestError(
					"Invalid table for this service!",
				);
			}

			const updatedTimeTable = await prisma.timeTable.update({
				where: { id: timeTableId },
				data: input.data,
			});

			return updatedTimeTable;
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Delete a time table entry by its ID
	async deleteTimeTable(id: string) {
		try {
			await prisma.timeTable.delete({
				where: { id },
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// - Timing Grade related methods -
	
	// Create a new timing grade entry
	async createTimeGrade(input: schemas.CreateInput) {
		try {
			if (input.table !== "timingGrade") {
				throw new apiErr.BadRequestError(
					"Invalid table for this service",
				);
			}
			
			return await prisma.timingGrade.create({
				data: {
					...input.data,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get all timing grade entries
	async getAllTimingGrades() {
		try {
			return await prisma.timingGrade.findMany({});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Delete a timing grade entry by its ID
	async deleteTimeGrade(id: string) {
		try {
			await prisma.timingGrade.delete({
				where: { id },
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// - Service Log related methods -

	// Create a new service log entry
	async createServiceLog(input: schemas.CreateInput) {
		try {
			if (input.table !== "serviceLog") {
				throw new apiErr.BadRequestError(
					"Invalid table for this service",
				);
			}
			
			return await prisma.serviceLog.create({
				data: {
					...input.data,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get service logs by machine ID
	async getServiceLogsByMachineId(machineId: string) {
		try {
			return await prisma.serviceLog.findMany({
				where: { machineId },
				include: {
					machine: true,
				},
				orderBy: {
					date: "desc",
					time: "desc",
					id: "desc",
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Get all service logs
	async getAllServiceLogs() {
		try {
			return await prisma.serviceLog.findMany({
				include: {
					machine: true,
				},
				orderBy: {
					date: "desc",
					time: "desc",
					id: "desc",
				},
				take: 50, // Limit to the most recent 50 logs to prevent overload
				skip: 0, // Start from the most recent log
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	// Delete a service log entry by its ID
	async deleteServiceLog(id: string) {
		try {
			await prisma.serviceLog.delete({
				where: { id },
			});
			return;
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}
}
