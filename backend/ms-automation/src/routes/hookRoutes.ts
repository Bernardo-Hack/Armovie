import { FastifyInstance } from "fastify";
import { appointmentCompletedSchema, stockLowSchema } from "../schemas/schemas.js";
import { handleAppointmentCompleted } from "../handlers/appointmentCompleted.js";
import { handleStockLow } from "../handlers/stockLow.js";
import { automationLogService } from "../services/automationLogService.js";
import { genericErrorHandler } from "../errors/index.js";

export async function hookRoutes(app: FastifyInstance) {
	// ── POST /hooks/appointment-completed ──────────────────────────────────────
	app.post("/appointment-completed", async (request, reply) => {
		try {
			const payload = appointmentCompletedSchema.parse(request.body);
			const result = await handleAppointmentCompleted(payload);
			return reply.status(202).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// ── POST /hooks/stock-low ──────────────────────────────────────────────────
	app.post("/stock-low", async (request, reply) => {
		try {
			const payload = stockLowSchema.parse(request.body);
			const result = await handleStockLow(payload);
			return reply.status(202).send(result);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// ── GET /hooks/logs — list recent automation logs ──────────────────────────
	app.get("/logs", async (_request, reply) => {
		try {
			const logs = await automationLogService.getAll();
			return reply.status(200).send(logs);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});

	// ── GET /hooks/logs/:trigger — logs filtered by trigger ───────────────────
	app.get("/logs/:trigger", async (request, reply) => {
		try {
			const { trigger } = request.params as { trigger: string };
			const logs = await automationLogService.getByTrigger(trigger);
			return reply.status(200).send(logs);
		} catch (err: any) {
			genericErrorHandler(err, reply);
		}
	});
}
