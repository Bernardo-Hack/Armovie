import { apiFetch } from "./api";
import { Person } from "@/assets/types/Person";

export interface PersonData {
	clientId: string;
	fullName: string;
	document: string;
	birthday: Date | string;
	civilState: string;
	nationality: string;
	doesSign: boolean;
	isRepresentative: boolean;
	role: string;
	email: string;
	phone: string;
	observations?: string;
}

const BASE_URL = "/api/clients/person/";

export const PersonService = {
	createPerson: async (PersonData: PersonData): Promise<Person> => {
		const payload = {
			data: PersonData,
			table: "person",
		};
		return apiFetch(BASE_URL, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	getAllPersons: async (): Promise<Person[]> => {
		return apiFetch(BASE_URL, {
			method: "GET",
		});
	},

	getAllPersonsByClient: async (clientId: string): Promise<Person[]> => {
		return apiFetch(`${BASE_URL}?clientId=${clientId}`, {
			method: "GET",
		});
	},

	getPersonById: async (PersonId: string): Promise<Person> => {
		return apiFetch(`${BASE_URL}${PersonId}`, {
			method: "GET",
		});
	},

	updatePerson: async (
		PersonId: string,
		PersonData: Partial<PersonData>,
	): Promise<Person> => {
		const payload = {
			data: PersonData,
			table: "person",
		};

		return apiFetch(`${BASE_URL}${PersonId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});
	},

	deletePerson: async (PersonId: string): Promise<void> => {
		await apiFetch(`${BASE_URL}${PersonId}`, {
			method: "DELETE",
		});
	},
};
