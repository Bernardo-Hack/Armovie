import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { apiErr } from "../errors";

// Service class to handle the business logic of the address module

export class addressService {
	async registerAddress(input: schemas.RegisterInput) {
		if (input.table !== "address") {
			throw new apiErr.BadRequestError("Invalid table for this service");
		}

		return await prisma.address.create({
			data: {
				...input.data,
			},
		});
	}

	async getAddressById(id: string) {
		return await prisma.address.findUniqueOrThrow({
			where: { id },
		});
	}

	async getAllAddresses() {
		return await prisma.address.findMany();
	}

	async getAddressesByClientId(clientId: string) {
		return await prisma.address.findMany({
			where: { clientId },
			orderBy: { street: "asc" },
		});
	}

	async getAddressesByPersonId(personId: string) {
		return await prisma.address.findMany({
			where: { personId },
			orderBy: { street: "asc" },
		});
	}

	async updateAddress(addressId: string, input: schemas.UpdateInput) {
		if (input.table !== "address") {
			throw new apiErr.BadRequestError("Invalid table for this service!");
		}

		return await prisma.address.update({
			where: { id: addressId },
			data: input.data,
		});
	}

	async deleteAddress(id: string) {
		await prisma.address.delete({ where: { id } });

		return { success: true };
	}
}
