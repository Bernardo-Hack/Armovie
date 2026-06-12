import { apiFetch } from "./api";
import { User } from "@/assets/types/User";

export interface UserData {
	name: string;
	email: string;
	password: string;
	position: string;
	role: string;
	resetPasswordToken?: string;
	resetPasswordTokenExpiresAt?: string;
	status?: string;
}

const BASE_URL = "/api/users/";

export const userService = {
	createUser: async (userData: UserData): Promise<User> => {
		const payload = {
			data: userData,
			table: "user",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllUsers: async (): Promise<User[]> => {
		return apiFetch(BASE_URL, {
			method: "GET",
		});
	},

	getUserById: async (userId: string): Promise<User> => {
		return apiFetch(`${BASE_URL}${userId}`, {
			method: "GET",
		});
	},

	getUsersByPosition: async (position: string): Promise<User[]> => {
		// O valor é passado na URL, ex: /api/users/?position=Técnico
		return apiFetch(
			`${BASE_URL}?position=${encodeURIComponent(position)}`,
			{
				method: "GET",
			},
		);
	},

	updateUser: async (
		userId: string,
		userData: Partial<UserData>,
	): Promise<User> => {
		const payload = {
			data: userData,
			table: "user",
		};

		return apiFetch(`${BASE_URL}${userId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deleteUser: async (userId: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${userId}`, {
			method: "DELETE",
		});
	},
};
