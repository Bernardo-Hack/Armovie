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
	endDate: string | Date;

	monthlyValue: number;
	payDay: number;
	observations?: string | null;
	status: string;

	createdAt: string | Date;
	updatedAt: string | Date;
}

export const initialContractState: Contract = {
	id: "",
	name: "",
	clientId: "",
	addressId: "",
	templateId: "",
	planId: "",
	type: "Comodato",
	machines: 1,
	fragrance: "",
	endDate: "",
	monthlyValue: 0,
	payDay: 10,
	observations: "",
	status: "Em Análise",
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export interface Plan {
	id: string;
	name: string;
	price: number;
	createdAt: string;
	updatedAt: string;
}

export interface Template {
	id: string;
	name: string;
	description?: string | null;
	content: string;
	createdAt: string;
	updatedAt: string;
}
