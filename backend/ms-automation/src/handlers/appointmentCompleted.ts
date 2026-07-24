import { automationLogService } from "../services/automationLogService.js";
import { internalPost } from "../http/internalClient.js";
import { AppointmentCompletedPayload } from "../schemas/schemas.js";
import { logger } from "../utils/logger.js";

const MS_ITEM_URL     = process.env.MS_ITEM_URL!;
const MS_SCHEDULE_URL = process.env.MS_SCHEDULE_URL!;

export async function handleAppointmentCompleted(payload: AppointmentCompletedPayload) {
	const log = await automationLogService.create("appointment-completed", payload);
	const result: Record<string, any> = {};
	const errors: string[] = [];

	// ── 1. Create ServiceLog in ms-item ───────────────────────────────────────
	// Only meaningful when there is a machine involved (Manutenção / Instalação / Retirada)
	if (payload.machineId && payload.technicianId) {
		try {
			const serviceLog = await internalPost(`${MS_ITEM_URL}/service-log`, {
				table: "serviceLog",
				data: {
					appointmentId:  payload.appointmentId,
					machineId:      payload.machineId,
					technicianId:   payload.technicianId,
					serviceId:      payload.serviceId,
					description:    payload.description ?? `${payload.type} via agendamento`,
					machinePayment: payload.machinePayment ?? 0,
					mlBefore:       payload.mlBefore,
					mlAfter:        payload.mlAfter,
					fragranceId:    payload.fragranceId,
				},
			});
			result.serviceLog = { id: serviceLog.id, status: "created" };
			logger.info(`automation: serviceLog created → ${serviceLog.id}`);
		} catch (err: any) {
			errors.push(`serviceLog: ${err.message}`);
			logger.error(`automation: failed to create serviceLog → ${err.message}`);
		}
	}

	// ── 2. Auto-schedule next visit ───────────────────────────────────────────
	if (payload.nextVisitDate && payload.clientId) {
		try {
			const nextAppointment = await internalPost(`${MS_SCHEDULE_URL}/appointment`, {
				table: "appointment",
				data: {
					clientId:      payload.clientId,
					technicianId:  payload.technicianId,
					machineId:     payload.machineId,
					scheduledDate: payload.nextVisitDate,
					type:          payload.nextVisitType ?? payload.type,
					status:        "Pendente",
					notes:         `Visita gerada automaticamente a partir do agendamento ${payload.appointmentId}`,
				},
			});
			result.nextAppointment = { id: nextAppointment.id, status: "created" };
			logger.info(`automation: next appointment created → ${nextAppointment.id}`);
		} catch (err: any) {
			errors.push(`nextAppointment: ${err.message}`);
			logger.error(`automation: failed to create next appointment → ${err.message}`);
		}
	}

	// ── 3. Persist final log status ───────────────────────────────────────────
	if (errors.length === 0) {
		await automationLogService.updateSuccess(log.id, result);
	} else if (Object.keys(result).length > 0) {
		await automationLogService.updatePartial(log.id, errors.join(" | "), result);
	} else {
		await automationLogService.updateFailed(log.id, errors.join(" | "), result);
	}

	return { logId: log.id, result, errors };
}
