import { apiFetch } from "./api";
import { User } from "@/assets/types/User";
import storageUtil from "@/utils/storage";

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	name: string;
	email: string;
	password: string;
	roleId: number;
}

// Keys of SecureStore
const ACCESS_TOKEN_KEY = "system_access_token";
const REFRESH_TOKEN_KEY = "system_refresh_token";
const USER_KEY = "system_user";

export const authService = {
	login: async (credentials: LoginCredentials) => {
		const data = await apiFetch("/api/users/login", {
			method: "POST",
			body: JSON.stringify(credentials),
		});

		// Saves tokens and user data if the response is valid
		if (data && data.accessToken && data.user) {
			await storageUtil.setItem(ACCESS_TOKEN_KEY, data.accessToken);

			if (data.refreshToken) {
				await storageUtil.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
			}

			await storageUtil.setItem(USER_KEY, JSON.stringify(data.user));
		}

		return data;
	},

	register: async (credentials: RegisterCredentials) => {
		const data = await apiFetch("/api/users/register", {
			method: "POST",
			body: JSON.stringify(credentials),
		});

		if (data && data.accessToken && data.user) {
			await storageUtil.setItem(ACCESS_TOKEN_KEY, data.accessToken);

			if (data.refreshToken) {
				await storageUtil.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
			}

			await storageUtil.setItem(USER_KEY, JSON.stringify(data.user));
		}

		return data;
	},

	logout: async () => {
		const accessToken = await storageUtil.getItem(ACCESS_TOKEN_KEY);
		const refreshToken = await storageUtil.getItem(REFRESH_TOKEN_KEY);

		if (accessToken) {
			await apiFetch("/api/users/logout", {
				method: "POST",
				headers: { Authorization: `Bearer ${accessToken}` },
			});
		} else if (refreshToken) {
			await apiFetch("/api/users/logout", {
				method: "POST",
				headers: { Authorization: `Bearer ${refreshToken}` },
			});
		}

		await storageUtil.deleteItem(ACCESS_TOKEN_KEY);
		await storageUtil.deleteItem(REFRESH_TOKEN_KEY);
		await storageUtil.deleteItem(USER_KEY);
	},

	deleteUser: async (userId: string) => {
		await apiFetch(`/api/users/profile/${userId}`, {
			method: "DELETE",
		});
		// Logs out the user after deleting the account to clear local data
		await authService.logout();
	},

	getUser: async () => {
		return apiFetch("/api/users/profile", {
			method: "GET",
		});
	},

	getLoggedUser: async (): Promise<User | null> => {
		const userJson = await storageUtil.getItem(USER_KEY);
		if (userJson) {
			return JSON.parse(userJson) as User;
		}
		return null;
	},
};
