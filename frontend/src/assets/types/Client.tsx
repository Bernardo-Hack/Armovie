export interface Client {
	id: string;

	fullName: string;
	fantasyName?: string;
	document: string;
	municipalID?: string;
	stateID?: string;

	fieldOfActivity?: string;
	lead: string;
	segment: string;

	phone: string;
	whatsapp: string;

	hasIss: boolean;
	financesEmail: string;
	alertsEmail?: string;
	foundingDate: string | Date;
	observations?: string;

	sellerId: string;

	status: string;

	created_at: string;
	updated_at: string;
}
