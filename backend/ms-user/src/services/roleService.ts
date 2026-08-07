import { prisma } from "../lib/prisma.js";
import * as schemas from "../schemas/schemas.js";

export class RoleService {
	async getAllRoles() {
		return prisma.role.findMany({
			orderBy: { name: "asc" },
		});
	}

	async getRoleById(id: string) {
		return prisma.role.findUnique({ where: { id } });
	}

	async createRole(input: schemas.CreateRoleInput) {
		return prisma.role.create({ data: input });
	}

	async updateRole(id: string, input: schemas.UpdateRoleInput) {
		return prisma.role.update({ where: { id }, data: input });
	}

	async deleteRole(id: string) {
		await prisma.role.delete({ where: { id } });
	}
}
