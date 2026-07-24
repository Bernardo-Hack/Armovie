import { FastifyReply } from "fastify";
import * as apiError from "./apiError.js";

export function genericErrorHandler(err: any, reply: FastifyReply) {
	if (err instanceof apiError.ApiError) {
		return reply.status(err.statusCode).send({ error: err.message });
	}

	// Zod validation error
	if (err.name === "ZodError") {
		const issues = err.issues || err.errors || [];
		const message =
			"Erro de validação: " +
			issues
				.map((e: any) => `${e.path?.join(".") || "campo"} - ${e.message}`)
				.join("; ");
		return reply.status(400).send({ error: message });
	}

	return reply.status(500).send({ error: "Ocorreu um erro inesperado." });
}

export * as apiErr from "./apiError.js";
export { genericErrorHandler as errorHandler };
