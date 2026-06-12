export interface Contract {
	id: string;
	name: string;
	clientId: string;
	addressId: string;
	templateId: string;
	planId: string;
	type: string;

	machines: number;
	fragrance: string;
	duration: number;
	
	monthlyValue: number;
	paymentDay: number;
	observations?: string;
	status: string;

	created_at: string | Date;
	updated_at: string | Date;
}
