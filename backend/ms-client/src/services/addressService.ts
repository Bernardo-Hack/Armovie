import * as schemas from "../schemas/schemas";
import { prisma } from "../lib/prisma";
import { genericErrorHandler, apiErr } from "../errors";

// Service class to handle the business logic of the address module

export class addressService {
	async registerAddress(input: schemas.RegisterInput) {
		try {
			if (input.table !== "address") {
				throw new apiErr.BadRequestError("Invalid table for this service");
			}

			return await prisma.address.create({
				data: {
					...input.data,
				},
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async getAddressById(id: string) {
		try {
			return await prisma.address.findUniqueOrThrow({
				where: { id },
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async getAllAddresses() {
		try {
			return await prisma.address.findMany();
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async updateAddress(addressId: string, input: schemas.UpdateInput) {
		try {
			if (input.table !== "address") {
				throw new apiErr.BadRequestError("Invalid table for this service!");
			}

			return await prisma.address.update({
				where: { id: addressId },
				data: input.data,
			});
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}

	async deleteAddress(id: string) {
		try{
			await prisma.address.delete({ where: { id } });

			return;
		} catch (err: any) {
			genericErrorHandler(err);
		}
	}
}
