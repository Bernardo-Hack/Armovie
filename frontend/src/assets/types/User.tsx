export interface User {
	id: string,
	name: string,
	email: string,
	password: string,
	position: string,
	role: string,
	resetPasswordToken?: string,
	resetPasswordTokenExpiresAt?: string,
	status?: string,
	created_at: string,
	updated_at: string,
};
