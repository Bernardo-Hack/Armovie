import { apiFetch } from "./api";
import { Machine } from "@/assets/types/Machine";
import { ServiceLog } from "@/assets/types/ServiceLog";

export interface MachineData {
	name: string;
	model: string;
	observations?: string;
	contractId?: string | null;
	fragranceId?: string | null;
	medianConsumption?: number;
	price: number;
	isPaid: boolean;
	status?: string;
}

export interface ServiceLogData {
	machineId: string;
	technicianId: string;
	observation: string;
	daysSinceLastService: number;
	serviceType: string;
	mlConsumed?: number;
}

const BASE_URL = "/api/items/machines/";

export const machineService = {
	createMachine: async (MachineData: MachineData): Promise<Machine> => {
		const payload = {
			data: MachineData,
			table: "machine",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllMachines: async (): Promise<Machine[]> => {
		return apiFetch(BASE_URL, {
			method: "GET",
		});
	},

	getMachineById: async (MachineId: string): Promise<Machine> => {
		return apiFetch(`${BASE_URL}${MachineId}`, {
			method: "GET",
		});
	},

	updateMachine: async (
		MachineId: string,
		MachineData: Partial<MachineData>,
	): Promise<Machine> => {
		const payload = {
			data: MachineData,
			table: "machine",
		};

		return apiFetch(`${BASE_URL}${MachineId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deleteMachine: async (MachineId: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${MachineId}`, {
			method: "DELETE"
		});
	},

	// Service Logs
	getServiceLogs: async (machineId: string): Promise<ServiceLog[]> => {
		return apiFetch(`${BASE_URL}${machineId}/service-logs`, {
			method: "GET",
		});
	},

	createServiceLog: async (
		machineId: string,
		logData: Omit<ServiceLogData, "machineId">,
	): Promise<ServiceLog> => {
		const payload = {
			data: { ...logData, machineId },
			table: "serviceLog",
		};
		return apiFetch(`${BASE_URL}${machineId}/service-logs`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},
};
