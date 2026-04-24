import fastify from "fastify";
import "dotenv/config";
import { routes } from "./routes";

const app = fastify({logger: true});

app.register(routes[0]); // Client routes without prefix
app.register(routes[1], { prefix: "/address" });
app.register(routes[2], { prefix: "/contract" });
app.register(routes[3], { prefix: "/plan" });

app.get("/health", async () => ({
	status: "healthy",
	service: "ms-client",
	db: process.env.DATABASE_URL,
}));

const start = async () => {
	const port = Number(process.env.PORT) || 3001;
	await app.listen({ port, host: "0.0.0.0" });
};

start().catch((err) => {
	app.log.error(err);
	process.exit(1);
});
