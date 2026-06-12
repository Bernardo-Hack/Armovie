export interface TimeTable {
	id: string;
	machineId: string;
	contractId?: string;
	timingGradeId: string;
	days: string[];
	startTime: string;
	endTime: string;
	created_at: string;
}
