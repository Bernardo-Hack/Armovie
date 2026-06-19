import { apiFetch } from "./api";
import { Person } from "@/assets/types/ms-client/Person";

export type PersonData = Omit<Person, "id" | "createdAt" | "updatedAt">;

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
