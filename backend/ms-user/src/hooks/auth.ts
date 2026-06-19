import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
	sub: string;
	roleId: string;
}

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const authHeader = request.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		return reply.status(401).send({ error: "Token não fornecido." });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
		request.user = {
			id: decoded.sub,
			roleId: decoded.roleId,
		};
	} catch {
		return reply.status(401).send({ error: "Token inválido ou expirado." });
	}
}

declare module "fastify" {
	interface FastifyRequest {
		user: {
			id: string;
			roleId: string;
		};
	}
}
