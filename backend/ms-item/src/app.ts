import fastify from "fastify";
import "dotenv/config";
import { fragranceRoutes } from "./routes/fragranceRoutes.js";
import { machineRoutes } from "./routes/machineRoutes.js";
import { logger } from "./utils/logger.js";

const app = fastify({ logger: false });

app.addHook("onRequest", async (req) => {
	(req as any).t0 = Date.now();
});

app.addHook("onResponse", async (req, reply) => {
	const ms = Date.now() - (req as any).t0;
	const method = req.method.padEnd(7);
	const path = req.url.padEnd(45);
	const entry = `${method} ${path} ${reply.statusCode}  ${ms}ms`;
	if (reply.statusCode >= 500) logger.error(entry);
	else if (reply.statusCode >= 400) logger.warn(entry);
	else logger.info(entry);
});

app.register(machineRoutes, { prefix: "/machines" });
app.register(fragranceRoutes, { prefix: "/fragrances" });

app.get("/health", async () => ({
	status: "healthy",
	service: process.env.MS_NAME,
	db: process.env.DB_NAME,
}));

const start = async () => {
	const port = Number(process.env.PORT) || 5002;
	await app.listen({ port, host: "0.0.0.0" });
	logger.info(`listening on port ${port}`);
};

start().catch((err) => {
	logger.error(`startup failed: ${err.message}`);
	process.exit(1);
});
