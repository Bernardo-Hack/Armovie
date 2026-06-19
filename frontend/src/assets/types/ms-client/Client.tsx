export interface Client {
	id: string;

	fullName: string;
	fantasyName?: string;
	document: string;
	municipalID?: string;
	stateID?: string;

	fieldOfActivity?: string;

	phone: string;
	whatsapp: string;

	hasIss: boolean;
	financesEmail: string;
	alertsEmail?: string;
	foundingDate: string | Date;
	observations?: string;

	sellerId: string;

	status: string;

	createdAt: string;
	updatedAt: string;
}

export const initialClientState: Client = {
	id: "",
	fullName: "",
	fantasyName: "",
	document: "",
	municipalID: "",
	stateID: "",
	fieldOfActivity: "",
	phone: "",
	whatsapp: "",
	hasIss: false,
	financesEmail: "",
	alertsEmail: "",
	foundingDate: new Date().toISOString(),
	observations: "",
	sellerId: "",
	status: "Em Análise",
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};
