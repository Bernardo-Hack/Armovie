import { Prisma } from "@prisma/client";
import * as apiError from "../errors/apiError";

// Utility functions for the client and contract modules

export function genericErrorHandler(err: any) {
	if (err instanceof apiError.ApiError) {
		throw err;
	}

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		// Not found
		if (err.code === "P2025") {
			throw new apiError.NotFoundError("O registro não foi encontrado.");
		}
		// Unique restraint violation
		if (err.code === "P2002") {
			const target = (err.meta?.target as string[])?.join(", ");
			throw new apiError.BadRequestError(`O campo ${target} já está em uso.`);
		}
	}

	// Zod validation error
	if (err.name === "ZodError") {
		const message =
			"Erro de validação: " +
			err.errors
				.map((e: any) => `${e.path.join(".")} - ${e.message}`)
				.join("; ");
		throw new apiError.BadRequestError(message);
	}

	// Generic error
	throw new apiError.ApiError("Ocorreu um erro inesperado.", 500);
}
