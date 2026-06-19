import { apiFetch } from "./api";
import { Machine, ServiceLog, TimingGrade, ServiceType, MlSteps } from "@/assets/types/ms-item/Machine";

export type MachineData = Omit<
	Machine,
	"id" | "createdAt" | "updatedAt" | "amountPaid"
> &
	Partial<Pick<Machine, "amountPaid">>;

export type ServiceLogData = Omit<ServiceLog, "id" | "createdAt">;

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
			method: "DELETE",
		});
	},

	// - Service Types -
	createServiceType: async (data: Omit<ServiceType, "id">): Promise<ServiceType> => {
		const payload = { data, table: "serviceType" };
		return apiFetch(`${BASE_URL}service-types`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},
	getAllServiceTypes: async (): Promise<ServiceType[]> => {
		return apiFetch(`${BASE_URL}service-types`, {
			method: "GET",
		});
	},
	updateServiceType: async (id: string, data: Partial<ServiceType>): Promise<ServiceType> => {
		const payload = { data, table: "serviceType" };
		return apiFetch(`${BASE_URL}service-types/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},
	deleteServiceType: async (id: string): Promise<void> => {
		await apiFetch(`${BASE_URL}service-types/${id}`, { method: "DELETE" });
	},

	// - Timing Grades -
	createTimingGrade: async (data: Omit<TimingGrade, "id">): Promise<TimingGrade> => {
		const payload = { data, table: "timingGrade" };
		return apiFetch(`${BASE_URL}timegrades`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},
	getAllTimingGrades: async (): Promise<TimingGrade[]> => {
		return apiFetch(`${BASE_URL}timegrades`, { method: "GET" });
	},
	updateTimingGrade: async (id: string, data: Partial<TimingGrade>): Promise<TimingGrade> => {
		const payload = { data, table: "timingGrade" };
		return apiFetch(`${BASE_URL}timegrades/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},
	deleteTimingGrade: async (id: string): Promise<void> => {
		await apiFetch(`${BASE_URL}timegrades/${id}`, { method: "DELETE" });
	},

	// - MlSteps -
	createMlSteps: async (data: Omit<MlSteps, "id">): Promise<MlSteps> => {
		const payload = { data, table: "mlSteps" };
		return apiFetch(`${BASE_URL}ml-steps`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},
	getAllMlSteps: async (): Promise<MlSteps[]> => {
		return apiFetch(`${BASE_URL}ml-steps`, { method: "GET" });
	},
	updateMlSteps: async (id: string, data: Partial<MlSteps>): Promise<MlSteps> => {
		const payload = { data, table: "mlSteps" };
		return apiFetch(`${BASE_URL}ml-steps/${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},
	deleteMlSteps: async (id: string): Promise<void> => {
		await apiFetch(`${BASE_URL}ml-steps/${id}`, { method: "DELETE" });
	},

	// - Service Logs -

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
