export interface Address {
	id: string;
	clientId?: string | null;
	personId?: string | null;

	zipCode: string;
	street: string;
	number: number;
	neighborhood: string;
	city: string;
	state: string;
	complement?: string | null;
	observations?: string | null;
}
