export interface Fragrance {
	id: string;

	name: string;
	family: string;
	description: string;
	
	stock: number;
	unitCost: number;
	supplier: string;

	isActive: boolean;

	createdAt: string;
	updatedAt: string;
}

export const initialFragranceState: Fragrance = {
	id: "",
	name: "",
	family: "Frutal",
	description: "",
	stock: 0,
	unitCost: 0,
	supplier: "",
	isActive: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export interface ConsumptionLog {
	id: string;

	fragranceId: string;
	month: string;
	mlConsumed: number;

	createdAt: string;
}
