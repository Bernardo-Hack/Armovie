import { View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useEffect, useState, useMemo } from "react";

import * as styles from "@/assets/styles/stylesheets";
import Header from "@/components/common/Header";
import { GenericList } from "@/components/common/GenericList";
import { GenericCreateModal } from "@/components/common/GenericCreateModal";

import { ClientListHeader } from "@/components/pages/clients/ClientListHeader";
import { ClientListRow } from "@/components/pages/clients/ClientListRow";
import { ClientDetailsContent } from "@/components/pages/clients/ClientModalContent";

import { Client } from "@/assets/types/Client";
import { clientService } from "@/services/clientService";
import { userService } from "@/services/userService";
import { ClientAddressModal } from "@/components/pages/clients/ClientAddressModal";

type SortKey = keyof Client | null;
type SortDirection = "asc" | "desc";

const initialClientState: Client = {
	id: "",
	fullName: "",
	fantasyName: "",
	document: "",
	municipalID: "",
	stateID: "",
	fieldOfActivity: "",
	lead: "Other",
	segment: "Other",
	phone: "",
	whatsapp: "",
	hasIss: false,
	financesEmail: "",
	alertsEmail: "",
	foundingDate: new Date().toISOString(),
	observations: "",
	sellerId: "",
	status: "Em Análise",
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
};

export default function ClientsTab() {
	const [clients, setClients] = useState<Client[]>([]);
	const [sellers, setSellers] = useState<{ id: string; name: string }[]>([]);
	const [sortKey, setSortKey] = useState<SortKey>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [selectedClient, setSelectedClient] = useState<Client | null>(null);
	const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

	const sortedClients = useMemo(() => {
		if (!sortKey) return clients;

		const sorted = [...clients].sort((a, b) => {
			const aValue = a[sortKey];
			const bValue = b[sortKey];

			if (aValue == null) return -1;
			if (bValue == null) return 1;

			if (aValue < bValue) return -1;
			if (aValue > bValue) return 1;
			return 0;
		});

		if (sortDirection === "desc") {
			sorted.reverse();
		}

		return sorted;
	}, [clients, sortKey, sortDirection]);

	const fetchAllData = async () => {
		setLoading(true);

		// Busca de Vendedores
		try {
			const sellersData = await userService.getUsersByPosition("Vendedor");
			setSellers(sellersData);
		} catch (error: any) {
			if (error.message == "Not Found") {
				Toast.show({
					type: "info",
					text1: "Nenhum vendedor encontrado!",
				});
				return [];
			}
			
			Toast.show({
				type: "error",
				text1: "Erro ao carregar vendedores",
				text2: error.message || "Não foi possível buscar os vendedores. Tente novamente.",
			});
			setSellers([]);
		}

		// Busca de Clientes
		try {
			const clientsData = await clientService.getAllClients();
			setClients(clientsData);
		} catch (error: any) {
			if (error.message === "Not Found" || error.message?.includes("404")) {
				Toast.show({
					type: "info",
					text1: "Nenhum cliente encontrado!",
					text2: "Cadastre um novo cliente para começar.",
				});
				setClients([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar clientes",
					text2: error.message || "Não foi possível buscar os clientes. Tente novamente.",
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSort = (key: SortKey) => {
		if (key === null) {
			setSortKey(null);
			setSortDirection("asc");
			return;
		}
		if (sortKey === key) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortDirection("asc");
		}
	};

	const handleOpenAddressModal = (client: Client) => {
		setSelectedClient(client);
		setIsAddressModalVisible(true);
	};

	const handleCreateClient = async (newClientData: Client) => {
		try {
			const { id, status, created_at, updated_at, ...clientToCreate } =
				newClientData as Client;

			if (
				!clientToCreate.fullName ||
				!clientToCreate.document ||
				!clientToCreate.sellerId ||
				!clientToCreate.financesEmail
			) {
				Toast.show({
					type: "error",
					text1: "Dados incompletos",
					text2: "Preencha Nome, Documento, Email Financeiro e selecione um Vendedor.",
				});
				return;
			}

			// Transforma strings vazias em undefined para não quebrar a validação Zod e Unique do Prisma
			const payload = {
				...clientToCreate,
				fantasyName: clientToCreate.fantasyName || undefined,
				municipalID: clientToCreate.municipalID || undefined,
				stateID: clientToCreate.stateID || undefined,
				fieldOfActivity: clientToCreate.fieldOfActivity || undefined,
				alertsEmail: clientToCreate.alertsEmail || undefined,
				observations: clientToCreate.observations || undefined,
			};

			await clientService.createClient(payload);

			Toast.show({
				type: "success",
				text1: "Cliente criado com sucesso!",
			});

			fetchAllData();
			setIsCreateModalVisible(false);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao criar cliente",
				text2: error.message || "Não foi possível criar o cliente.",
			});
		}
	};

	const handleUpdateClient = async (updatedClient: Client) => {
		try {
			const { id, created_at, updated_at, ...clientToUpdate } =
				updatedClient as Client;

			if (
				!clientToUpdate.fullName ||
				!clientToUpdate.document ||
				!clientToUpdate.sellerId ||
				!clientToUpdate.financesEmail
			) {
				Toast.show({
					type: "error",
					text1: "Dados incompletos",
					text2: "Preencha Nome, Documento, Email Financeiro e selecione um Vendedor.",
				});
				return;
			}

			const payload = {
				...clientToUpdate,
				fantasyName: clientToUpdate.fantasyName || undefined,
				municipalID: clientToUpdate.municipalID || undefined,
				stateID: clientToUpdate.stateID || undefined,
				fieldOfActivity: clientToUpdate.fieldOfActivity || undefined,
				alertsEmail: clientToUpdate.alertsEmail || undefined,
				observations: clientToUpdate.observations || undefined,
			};

			await clientService.updateClient(updatedClient.id, payload);
			Toast.show({
				type: "success",
				text1: "Cliente atualizado com sucesso!",
			});
			fetchAllData();
		} catch (error: any) {
			console.error("Error updating client:", error);
			Toast.show({
				type: "error",
				text1: "Erro ao atualizar cliente",
				text2: error.message || "Não foi possível atualizar o cliente.",
			});
		}
	};

	const handleDeleteClient = async (id: string) => {
		try {
			await clientService.deleteClient(id);
			Toast.show({
				type: "success",
				text1: "Cliente excluído com sucesso!",
			});
			fetchAllData();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao excluir cliente",
				text2: error.message || "Não foi possível excluir o cliente.",
			});
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<View style={styles.page.background}>
			{/* Header */}
			<Header
				pageName="Clientes"
				subtitle="Controle de Clientes"
				fetchItems={fetchAllData}
				setIsCreateModalVisible={setIsCreateModalVisible}
			/>

			{/* List */}
			<GenericList
				loading={loading}
				items={sortedClients}
				itemTypeName="cliente"
				onSort={handleSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSaveItem={handleUpdateClient}
				onDeleteItem={handleDeleteClient}
				HeaderComponent={ClientListHeader}
				RowComponent={(props: any) => (
					<ClientListRow
						{...props}
						openExtraModal={() =>
							handleOpenAddressModal(props.item)
						}
					/>
				)}
				editModalRenderContent={(
					client,
					isEditing,
					handleInputChange,
				) => (
					<ClientDetailsContent
						client={client as Client}
						isEditing={isEditing}
						handleInputChange={handleInputChange}
						sellers={sellers}
					/>
				)}
			/>

			<GenericCreateModal
				initialState={initialClientState}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={handleCreateClient}
				renderContent={(client, handleInputChange) => (
					<ClientDetailsContent
						client={client as Client}
						isEditing={true}
						handleInputChange={handleInputChange}
						sellers={sellers}
					/>
				)}
			/>

			<ClientAddressModal
				client={selectedClient}
				visible={isAddressModalVisible}
				onClose={() => {
					setIsAddressModalVisible(false);
					setSelectedClient(null);
				}}
			/>
		</View>
	);
}
