import { FastifyReply } from "fastify";
import { Prisma } from "@prisma/client";
import * as apiError from "./apiError";

// Utility functions for the client and contract modules

export function genericErrorHandler(err: any, reply: FastifyReply) {
	if (err instanceof apiError.ApiError) {
		return reply.status(err.statusCode).send({ error: err.message });
	}

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		// Not found
		if (err.code === "P2025") {
			const notFoundError = new apiError.NotFoundError(
				"O registro não foi encontrado.",
			);
			return reply
				.status(notFoundError.statusCode)
				.send({ error: notFoundError.message });
		}
		// Unique restraint violation
		if (err.code === "P2002") {
			const target = (err.meta?.target as string[])?.join(", ");
			const badRequestError = new apiError.BadRequestError(
				`O campo ${target} já está em uso.`,
			);
			return reply
				.status(badRequestError.statusCode)
				.send({ error: badRequestError.message });
		}
	}

	// Zod validation error
	if (err.name === "ZodError") {
		const message =
			"Erro de validação: " +
			err.errors
				.map((e: any) => `${e.path.join(".")} - ${e.message}`)
				.join("; ");
		const badRequestError = new apiError.BadRequestError(message);
		return reply
			.status(badRequestError.statusCode)
			.send({ error: badRequestError.message });
	}

	// Generic error
	const genericApiError = new apiError.ApiError(
		"Ocorreu um erro inesperado.",
		500,
	);
	return reply
		.status(genericApiError.statusCode)
		.send({ error: genericApiError.message });
}
