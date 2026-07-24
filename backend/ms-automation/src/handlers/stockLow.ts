import { automationLogService } from "../services/automationLogService.js";
import { StockLowPayload } from "../schemas/schemas.js";
import { logger } from "../utils/logger.js";

export async function handleStockLow(payload: StockLowPayload) {
	const log = await automationLogService.create("stock-low", payload);

	// ── Log and alert ─────────────────────────────────────────────────────────
	// Phase 1: persist the alert for the dashboard to surface
	// Phase 2: send push notification / email to manager
	const result = {
		alert: {
			fragranceId:   payload.fragranceId,
			fragranceName: payload.fragranceName,
			currentStock:  payload.currentStock,
			minStock:      payload.minStock,
			deficit:       payload.minStock - payload.currentStock,
		},
	};

	logger.warn(
		`automation: stock-low alert → ${payload.fragranceName} ` +
		`(${payload.currentStock}ml / min ${payload.minStock}ml)`,
	);

	await automationLogService.updateSuccess(log.id, result);
	return { logId: log.id, result };
}
