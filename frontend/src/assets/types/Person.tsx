export interface Person {
	id: string;
	clientId: string;

	fullName: string;
	document: string;

	birthday: Date;
	civilState: string;
	nationality: string;

	doesSign: boolean;
	isRepresentative: boolean;
	role: string;

	email: string;
	phone: string;
	observations?: string;

	status: string;

	created_at: string;
	updated_at: string;
}
