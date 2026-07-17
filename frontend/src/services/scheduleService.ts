import { apiFetch } from "./api";
import {
	Appointment,
	AppointmentData,
	ChecklistItem,
	ChecklistItemData,
} from "@/assets/types/ms-schedule/Appointment";

const BASE_URL = "/api/schedules";

export const scheduleService = {
	// ─── Appointments ──────────────────────────────────────────────────────────

	createAppointment: async (data: AppointmentData): Promise<Appointment> => {
		return apiFetch(`${BASE_URL}/appointment`, {
			method: "POST",
			body: JSON.stringify({ table: "appointment", data }),
		});
	},

	getAllAppointments: async (): Promise<Appointment[]> => {
		return apiFetch(`${BASE_URL}/appointment`, { method: "GET" });
	},

	getAppointmentById: async (id: string): Promise<Appointment> => {
		return apiFetch(`${BASE_URL}/appointment/${id}`, { method: "GET" });
	},

	getAppointmentsByDate: async (date: string): Promise<Appointment[]> => {
		// date format: YYYY-MM-DD
		return apiFetch(`${BASE_URL}/appointment/by-date?date=${date}`, { method: "GET" });
	},

	getAppointmentsByClient: async (clientId: string): Promise<Appointment[]> => {
		return apiFetch(`${BASE_URL}/appointment/client/${clientId}`, { method: "GET" });
	},

	getAppointmentsByTechnician: async (technicianId: string): Promise<Appointment[]> => {
		return apiFetch(`${BASE_URL}/appointment/technician/${technicianId}`, { method: "GET" });
	},

	updateAppointment: async (
		id: string,
		data: Partial<AppointmentData>,
	): Promise<Appointment> => {
		return apiFetch(`${BASE_URL}/appointment/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ table: "appointment", data }),
		});
	},

	deleteAppointment: async (id: string): Promise<void> => {
		await apiFetch(`${BASE_URL}/appointment/${id}`, { method: "DELETE" });
	},

	// ─── Checklist ─────────────────────────────────────────────────────────────

	getChecklistByAppointment: async (appointmentId: string): Promise<ChecklistItem[]> => {
		return apiFetch(`${BASE_URL}/checklist/appointment/${appointmentId}`, { method: "GET" });
	},

	createChecklistItem: async (data: ChecklistItemData): Promise<ChecklistItem> => {
		return apiFetch(`${BASE_URL}/checklist`, {
			method: "POST",
			body: JSON.stringify({ table: "checklistItem", data }),
		});
	},

	updateChecklistItem: async (
		id: string,
		data: Partial<ChecklistItemData>,
	): Promise<ChecklistItem> => {
		return apiFetch(`${BASE_URL}/checklist/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ table: "checklistItem", data }),
		});
	},

	deleteChecklistItem: async (id: string): Promise<void> => {
		await apiFetch(`${BASE_URL}/checklist/${id}`, { method: "DELETE" });
	},

	// ─── Helpers ───────────────────────────────────────────────────────────────

	/** Convenience: mark a single checklist item as done or undone */
	toggleChecklistItem: async (id: string, done: boolean): Promise<ChecklistItem> => {
		return apiFetch(`${BASE_URL}/checklist/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ table: "checklistItem", data: { done } }),
		});
	},

	/** Convenience: update only the status of an appointment (e.g. "Em Andamento") */
	updateAppointmentStatus: async (
		id: string,
		status: Appointment["status"],
	): Promise<Appointment> => {
		return apiFetch(`${BASE_URL}/appointment/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ table: "appointment", data: { status } }),
		});
	},
};
