import { View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useEffect, useState, useMemo } from "react";

import * as styles from "@/assets/styles/stylesheets";
import Header from "@/components/common/Header";
import { GenericList } from "@/components/common/GenericList";
import { GenericCreateModal } from "@/components/common/GenericCreateModal";

import { ContractListHeader } from "@/components/pages/contracts/ContractListHeader";
import { ContractListRow } from "@/components/pages/contracts/ContractListRow";
import { ContractModalContent } from "@/components/pages/contracts/ContractModalContent";

import { Contract } from "@/assets/types/Contract";
import { contractService } from "@/services/contractService";
import { itemService } from "@/services/itemService";
import { clientService } from "@/services/clientService";
import { planService } from "@/services/planService";
import { PlanModal } from "@/components/pages/contracts/PlanModal";

type SortKey = keyof Contract | null;
type SortDirection = "asc" | "desc";

const initialContractState: Contract = {
	id: "",
	name: "",
	clientId: "",
	addressId: "",
	templateId: "",
	planId: "",
	type: "Comodato",
	machines: 1,
	fragrance: "",
	duration: 12,
	monthlyValue: 0,
	paymentDay: 10,
	observations: "",
	status: "Em Análise",
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
};

export default function ContractsTab() {
	const [contracts, setContracts] = useState<Contract[]>([]);
	const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
	const [fragrances, setFragrances] = useState<
		{ id: string; name: string }[]
	>([]);
	const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);

	// Mocks temporários para relacionamentos que possam ainda não ter serviços
	const [templates, setTemplates] = useState<{ id: string; name: string }[]>([
		{ id: "temp-1", name: "Template Padrão" },
	]);
	const [addresses, setAddresses] = useState<{ id: string; name: string }[]>([
		{ id: "addr-1", name: "Endereço Principal" },
	]);

	const [sortKey, setSortKey] = useState<SortKey>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);

	const sortedContracts = useMemo(() => {
		if (!sortKey) return contracts;
		const sorted = [...contracts].sort((a, b) => {
			const aValue = a[sortKey];
			const bValue = b[sortKey];
			if (aValue == null) return -1;
			if (bValue == null) return 1;
			if (aValue < bValue) return -1;
			if (aValue > bValue) return 1;
			return 0;
		});
		if (sortDirection === "desc") sorted.reverse();
		return sorted;
	}, [contracts, sortKey, sortDirection]);

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

	const fetchPlansData = async () => {
		try {
			const plansData = await planService.getAllPlans();
			setPlans(plansData.map((p) => ({ id: p.id, name: p.name })));
		} catch (error: any) {
			if (error.message === "Not Found" || error.message?.includes("404")) {
				setPlans([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar planos",
					text2: error.message || "Não foi possível buscar os planos.",
				});
			}
		}
	};

	const fetchAllData = async () => {
		setLoading(true);

		// Busca de Contratos
		try {
			const contractsData = await contractService.getAllContracts();
			setContracts(contractsData);
		} catch (error: any) {
			if (error.message === "Not Found" || error.message?.includes("404")) {
				Toast.show({
					type: "info",
					text1: "Nenhum contrato encontrado!",
					text2: "Cadastre um novo contrato para começar.",
				});
				setContracts([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar contratos",
					text2: error.message || "Não foi possível buscar os contratos. Tente novamente.",
				});
			}
		}

		// Busca de Clientes
		try {
			const clientsData = await clientService.getAllClients();
			setClients(
				clientsData.map((c) => ({ id: c.id, name: c.fullName })),
			);
		} catch (error: any) {
			if (error.message === "Not Found" || error.message?.includes("404")) {
				Toast.show({
					type: "info",
					text1: "Nenhum cliente encontrado!",
				});
				setClients([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar clientes",
					text2: error.message || "Não foi possível buscar os clientes. Tente novamente.",
				});
			}
		}

		// Busca de Fragrâncias
		try {
			const itemsData = await itemService.getAllItems();
			setFragrances(
				itemsData
					.filter((i) => i.category === "Fragrância")
					.map((i) => ({ id: i.id, name: i.name })),
			);
		} catch (error: any) {
			if (error.message === "Not Found" || error.message?.includes("404")) {
				Toast.show({
					type: "info",
					text1: "Nenhuma fragrância encontrada!",
				});
				setFragrances([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar fragrâncias",
					text2: error.message || "Não foi possível buscar as fragrâncias. Tente novamente.",
				});
			}
		}

		// Busca de Planos
		await fetchPlansData();
		setLoading(false);
	};

	const handleCreateContract = async (newContractData: Contract) => {
		try {
			const { id, status, created_at, updated_at, ...contractToCreate } =
				newContractData;
			await contractService.createContract(contractToCreate);
			Toast.show({
				type: "success",
				text1: "Contrato criado com sucesso!",
			});
			fetchAllData();
			setIsCreateModalVisible(false);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao criar contrato",
				text2: error.message,
			});
		}
	};

	const handleUpdateContract = async (updatedContract: Contract) => {
		try {
			const { id, created_at, updated_at, ...contractToUpdate } =
				updatedContract;
			await contractService.updateContract(
				updatedContract.id,
				contractToUpdate,
			);
			Toast.show({
				type: "success",
				text1: "Contrato atualizado com sucesso!",
			});
			fetchAllData();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao atualizar contrato",
				text2: error.message,
			});
		}
	};

	const handleDeleteContract = async (id: string) => {
		try {
			await contractService.deleteContract(id);
			Toast.show({
				type: "success",
				text1: "Contrato excluído com sucesso!",
			});
			fetchAllData();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao excluir contrato",
				text2: error.message,
			});
		}
	};

	const renderContent = (
		contract: Contract | Partial<Contract>,
		isEditing: boolean,
		handleInputChange: any,
	) => (
		<ContractModalContent
			contract={contract as Contract}
			isEditing={isEditing}
			handleInputChange={handleInputChange}
			clients={clients}
			plans={plans}
			templates={templates}
			addresses={addresses}
			fragrances={fragrances}
		/>
	);

	useEffect(() => {
		fetchAllData();
	}, []);


	return (
		<View style={styles.page.background}>
			<Header
				pageName="Contratos"
				subtitle="Controle de Contratos"
				fetchItems={fetchAllData}
				setIsCreateModalVisible={setIsCreateModalVisible}
				extraButtonLabel="Planos"
				extraButtonIcon="list-outline"
				setIsExtraModalVisible={setIsPlanModalVisible}
			/>

			<GenericList
				loading={loading}
				items={sortedContracts}
				itemTypeName="contrato"
				onSort={handleSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSaveItem={handleUpdateContract}
				onDeleteItem={handleDeleteContract}
				HeaderComponent={ContractListHeader}
				RowComponent={ContractListRow}
				editModalRenderContent={renderContent}
			/>
			<GenericCreateModal
				initialState={initialContractState}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={handleCreateContract}
				renderContent={(c, handle) => renderContent(c, true, handle)}
			/>

			<PlanModal
				visible={isPlanModalVisible}
				onClose={() => setIsPlanModalVisible(false)}
				onPlansUpdated={fetchPlansData}
			/>
		</View>
	);
}
