import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Client } from "@/assets/types/ms-client/Client";
import { Address } from "@/assets/types/ms-client/Address";
import { User } from "@/assets/types/User";
import { clientService } from "@/services/clientService";
import { addressService } from "@/services/addressService";
import { userService } from "@/services/userService";

interface ScheduleContextData {
	clients: Client[];
	addresses: Address[];
	technicians: User[];
	loading: boolean;
	getClientName: (id: string) => string;
	getAddressStr: (clientId: string) => string;
	getTechnicianName: (id: string | null | undefined) => string;
	refreshData: () => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextData>({} as ScheduleContextData);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [clients, setClients] = useState<Client[]>([]);
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [technicians, setTechnicians] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const [fetchedClients, fetchedAddresses, fetchedTechnicians] = await Promise.all([
				clientService.getAllClients(),
				addressService.getAllAddresses(),
				userService.getUsersByRole("Technician"), // or fetch all users and filter
			]);
			setClients(fetchedClients);
			setAddresses(fetchedAddresses);
			setTechnicians(fetchedTechnicians);
		} catch (error) {
			console.error("Failed to fetch schedule reference data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	// Memos for fast lookup
	const clientMap = useMemo(() => {
		const map = new Map<string, Client>();
		clients.forEach((c) => map.set(c.id, c));
		return map;
	}, [clients]);

	const addressMap = useMemo(() => {
		// Maps clientId to their first/primary address
		const map = new Map<string, Address>();
		addresses.forEach((a) => {
			if (a.clientId && !map.has(a.clientId)) {
				map.set(a.clientId, a);
			}
		});
		return map;
	}, [addresses]);

	const technicianMap = useMemo(() => {
		const map = new Map<string, User>();
		technicians.forEach((t) => map.set(t.id, t));
		return map;
	}, [technicians]);

	// Helpers
	const getClientName = (id: string) => {
		return clientMap.get(id)?.fullName || "Cliente Desconhecido";
	};

	const getAddressStr = (clientId: string) => {
		const addr = addressMap.get(clientId);
		if (!addr) return "Endereço não cadastrado";
		return `${addr.street}, ${addr.number} - ${addr.neighborhood}`;
	};

	const getTechnicianName = (id: string | null | undefined) => {
		if (!id) return "Não atribuído";
		return technicianMap.get(id)?.name || "Técnico Desconhecido";
	};

	return (
		<ScheduleContext.Provider
			value={{
				clients,
				addresses,
				technicians,
				loading,
				getClientName,
				getAddressStr,
				getTechnicianName,
				refreshData: fetchData,
			}}
		>
			{children}
		</ScheduleContext.Provider>
	);
};

export const useScheduleContext = () => useContext(ScheduleContext);
