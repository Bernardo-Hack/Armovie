import { apiFetch } from "./api";

export interface Role {
	id: string;
	name: string;
	description?: string;
	permissions: string[];
	created_at: string;
	updated_at: string;
}

export interface RoleData {
	name: string;
	description?: string;
	permissions: string[];
}

const BASE_URL = "/api/roles/";

export const roleService = {
	getAllRoles: async (): Promise<Role[]> => {
		return apiFetch(BASE_URL, { method: "GET" });
	},

	getRoleById: async (id: string): Promise<Role> => {
		return apiFetch(`${BASE_URL}${id}`, { method: "GET" });
	},

	createRole: async (data: RoleData): Promise<Role> => {
		const payload = {
			data: data,
			table: "role",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	updateRole: async (id: string, data: Partial<RoleData>): Promise<Role> => {
		const payload = {
			data: data,
			table: "role",
		};
		return apiFetch(`${BASE_URL}${id}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deleteRole: async (id: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${id}`, { method: "DELETE" });
	},
};

// Lista fixa de todas as permissões disponíveis no sistema
export const AVAILABLE_PERMISSIONS: {
	key: string;
	label: string;
	icon: string;
}[] = [
	{ key: "clients", label: "Clientes", icon: "people-outline" },
	{ key: "contracts", label: "Contratos", icon: "document-text-outline" },
	{ key: "machines", label: "Máquinas", icon: "hammer-outline" },
	{ key: "fragrances", label: "Fragrâncias", icon: "flask-outline" },
	{ key: "schedule", label: "Agenda", icon: "calendar-outline" },
	{ key: "users", label: "Usuários", icon: "key-outline" },
	{ key: "settings", label: "Configurações", icon: "settings-outline" },
];
