export interface Person {
	id: string;
	clientId: string;

	fullName: string;
	document: string;

	birthday: Date;
	civilState: string;
	nationality: string;

	doesSign: boolean;
	doesRepresent: boolean;
	role: string;

	email: string;
	phone: string;
	observations?: string | null;

	createdAt: string;
	updatedAt: string;
}
