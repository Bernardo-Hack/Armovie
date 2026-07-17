export type AppointmentType = "Manutenção" | "Instalação" | "Retirada" | "Visita";
export type AppointmentStatus =
	| "Pendente"
	| "Confirmado"
	| "Em Andamento"
	| "Concluído"
	| "Cancelado"
	| "Pulado";

export interface Appointment {
	id: string;

	// Cross-service references
	clientId:     string;
	technicianId: string | null;
	machineId:    string | null;

	// Scheduling
	scheduledDate:     string; // ISO string from API
	estimatedDuration: number | null; // minutes

	// Classification
	type:   AppointmentType;
	status: AppointmentStatus;

	// Route context
	routeOrder: number | null;

	// Execution tracking
	startedAt:  string | null; // ISO string
	finishedAt: string | null; // ISO string

	// Extra info
	notes:         string | null;
	nextVisitDate: string | null; // ISO string (date only)

	checklist: ChecklistItem[];

	createdAt: string;
	updatedAt: string;
}

export interface ChecklistItem {
	id:            string;
	appointmentId: string;
	label:         string;
	done:          boolean;
	order:         number;
	createdAt:     string;
	updatedAt:     string;
}

// Omit server-generated fields for create/update payloads
export type AppointmentData = Omit<Appointment, "id" | "checklist" | "createdAt" | "updatedAt">;
export type ChecklistItemData = Omit<ChecklistItem, "id" | "createdAt" | "updatedAt">;
