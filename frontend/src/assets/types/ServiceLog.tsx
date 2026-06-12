export interface ServiceLog {
	id: string;
	machineId: string;
	technicianId: string;
	observation: string;
	daysSinceLastService: number;
	serviceType: string;
	mlConsumed?: number;
	created_at: string;
}
