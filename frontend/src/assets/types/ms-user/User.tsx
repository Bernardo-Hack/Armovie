export interface User {
	id: string;
	name: string;
	email: string;
	roleId?: string;
	role?: {
		name: string;
		permissions: string[];
	};
	permissions: string[];
	position?: string;
	password?: string;
	createdAt: string;
	updatedAt: string;
}
export const initialUserState: Omit<User, "id" | "createdAt" | "updatedAt"> & {
	password?: string;
} = {
	name: "",
	email: "",
	password: "",
	permissions: [],
	position: "",
};
