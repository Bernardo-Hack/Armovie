import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	const adminEmail = "admin@armovie.com";

	// First, ensure the Admin role exists
	const adminRole = await prisma.role.upsert({
		where: { name: "Admin" },
		update: {},
		create: {
			name: "Admin",
			description: "System Administrator",
			permissions: [
				"clients",
				"machines",
				"fragrances",
				"schedules",
				"settings",
				"users",
			],
		},
	});

	// Using upsert ensures that if the admin already exists, this command will not crash.
	const admin = await prisma.user.upsert({
		where: { email: adminEmail },
		update: {}, // no updates if it exists
		create: {
			name: "Administrador",
			email: adminEmail,
			// Hash gerado para a senha "admin123456789"
			passwordHash:
				"$2b$10$4mtsKqYgt9NY1Vb7nmHV1elY7Ne5vA.p61jJEVHbZzS1ATMzzRyV6",
			position: "Diretor",
			roleId: adminRole.id,
			status: "Ativo",
		},
	});

	console.log("✅ Seed: Default admin user ensured ->", admin.email);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
