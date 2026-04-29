import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
	adapter: adapter,
	log: [
		{ emit: "event", level: "query" },
		{ emit: "stdout", level: "error" },
		{ emit: "stdout", level: "info" },
		{ emit: "stdout", level: "warn" },
	],
});
