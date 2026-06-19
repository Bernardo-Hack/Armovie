// This file defines custom error classes for handling API errors in the user service.

export class ApiError extends Error {
	public readonly statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string) {
		super(message, 404);
	}
}

export class BadRequestError extends ApiError {
	constructor(message: string) {
		super(message, 400);
	}
}

export class JwtError extends ApiError {
	constructor() {
		super("JWT_SECRET not defined in environment variables.", 401);
	}
}

export class InvalidCredentialsError extends ApiError {
	constructor(message: string) {
		super(message, 401);
	}
}
