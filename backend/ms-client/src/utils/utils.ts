import * as schemas from "../schema/schemas";
import { Prisma } from "@prisma/client";

// Utility functions for the client and contract modules

export function formatData(input: schemas.RegisterInput | schemas.UpdateInput) {
	const dataForUse: { [key: string]: any } = {};

	// Build the create object only with provided values
	for (const key in input.data) {
		if (
			Object.prototype.hasOwnProperty.call(input.data, key) &&
			(input.data as any)[key] !== undefined
		) {
			dataForUse[key] = (input.data as any)[key];
		}
	}

	return dataForUse;
}

export function genericErrorHandler(err: any) {
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === "P2002") {
			throw new Error("Unique constraint failed: " + err.meta?.target);
		}
	}

	if (err.name === "ZodError") {
		throw new Error("Validation error: " + err.errors.map((e: any) => e.message).join(", "));
	}

	throw new Error("An unexpected error occurred: " + err.message);
}
