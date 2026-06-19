export interface Machine {
	id: string;
	name: string;
	model: string;
	observations?: string | null;
	contractId?: string | null;
	localInstalled?: string | null;
	fragranceId?: string | null;
	medianConsumption?: number | null;
	price: number;
	amountPaid: number;
	status?: string;
	createdAt: string;
	updatedAt: string;
}

export const initialMachineState: Machine = {
	id: "",
	name: "",
	model: "",
	observations: "",
	contractId: "",
	fragranceId: "",
	medianConsumption: 0,
	price: 0,
	amountPaid: 0,
	status: "Disponível",
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export interface OperatingHours {
	id: string;
	machineId: string;
	contractId?: string;
	timingGradeId: string;
	monday: boolean;
	tuesday: boolean;
	wednesday: boolean;
	thursday: boolean;
	friday: boolean;
	saturday: boolean;
	sunday: boolean;
	startTime: string;
	endTime: string;
	createdAt: string;
}

export interface TimingGrade {
	id: string;
	name: string;
	interval: number;
}

export interface ServiceLog {
	id: string;
	machineId: string;
	technicianId: string;
	serviceId: string;
	description: string;
	machinePayment: number;
	mlBefore?: number | null;
	mlAfter?: number | null;
	fragranceId?: string | null;
	createdAt: string;
}

export interface ServiceType {
	id: string;
	name: string;
	description: string;
}

export interface MlSteps {
	id: string;
	quantity: number;
}
