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

import {
	Contract,
	initialContractState,
} from "@/assets/types/ms-client/Contract";
import { contractService } from "@/services/contractService";
import { clientService } from "@/services/clientService";
import { PlanModal } from "@/components/pages/contracts/PlanModal";
import { Template } from "@/assets/types/ms-client/Contract";
import { TemplateModal } from "@/components/pages/contracts/TemplateModal";
import { fragranceService } from "@/services/fragranceService";

type SortKey = keyof Contract | null;
type SortDirection = "asc" | "desc";

export default function ContractsTab() {
	const [contracts, setContracts] = useState<Contract[]>([]);
	const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
	const [fragrances, setFragrances] = useState<
		{ id: string; name: string }[]
	>([]);
	const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);

	const [templates, setTemplates] = useState<Template[]>([]);

	const [sortKey, setSortKey] = useState<SortKey>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [isPlanModalVisible, setIsPlanModalVisible] = useState(false);
	const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);

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
			const plansData = await contractService.getAllPlans();
			setPlans(plansData.map((p) => ({ id: p.id, name: p.name })));
		} catch (error: any) {
			if (
				error.message === "Not Found" ||
				error.message?.includes("404")
			) {
				setPlans([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar planos",
					text2:
						error.message || "Não foi possível buscar os planos.",
				});
			}
		}
	};

	const fetchTemplates = async () => {
		try {
			const templatesData = await contractService.getAllTemplates();
			setTemplates(templatesData);
		} catch (error: any) {
			if (
				error.message === "Not Found" ||
				error.message?.includes("404")
			) {
				setTemplates([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar templates",
					text2:
						error.message ||
						"Não foi possível buscar os templates.",
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
			if (
				error.message === "Not Found" ||
				error.message?.includes("404")
			) {
				console.log("Nenhum contrato encontrado!");
				setContracts([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar contratos",
					text2:
						error.message ||
						"Não foi possível buscar os contratos. Tente novamente.",
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
			if (
				error.message === "Not Found" ||
				error.message?.includes("404")
			) {
				Toast.show({
					type: "info",
					text1: "Nenhum cliente encontrado!",
				});
				setClients([{ id: "", name: "N/A" }]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar clientes",
					text2:
						error.message ||
						"Não foi possível buscar os clientes. Tente novamente.",
				});
			}
		}

		// Busca de Fragrâncias
		try {
			const itemsData = await fragranceService.getAllFragrances();
			setFragrances(itemsData);
		} catch (error: any) {
			if (
				error.message === "Not Found" ||
				error.message?.includes("404")
			) {
				Toast.show({
					type: "info",
					text1: "Nenhuma fragrância encontrada!",
				});
				setFragrances([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar fragrâncias",
					text2:
						error.message ||
						"Não foi possível buscar as fragrâncias. Tente novamente.",
				});
			}
		}

		// Busca de Planos
		await fetchPlansData();
		await fetchTemplates();
		setLoading(false);
	};

	const handleCreateContract = async (newContractData: Contract) => {
		try {
			const { id, status, createdAt, updatedAt, ...contractToCreate } =
				newContractData;

			if (!contractToCreate.clientId || !contractToCreate.planId) {
				Toast.show({
					type: "error",
					text1: "Dados incompletos",
					text2: "Preencha ao menos o Cliente e o Plano.",
				});
				return;
			}

			const payload = {
				...contractToCreate,
				clientId: contractToCreate.clientId || undefined,
				planId: contractToCreate.planId || undefined,
				addressId: contractToCreate.addressId || undefined,
				templateId: contractToCreate.templateId || undefined,
				fragrance: contractToCreate.fragrance || undefined,
			};

			await contractService.createContract(payload as any);
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
			const { id, createdAt, updatedAt, ...contractToUpdate } =
				updatedContract;

			const payload = {
				...contractToUpdate,
				clientId: contractToUpdate.clientId || undefined,
				planId: contractToUpdate.planId || undefined,
				addressId: contractToUpdate.addressId || undefined,
				templateId: contractToUpdate.templateId || undefined,
				fragrance: contractToUpdate.fragrance || undefined,
			};

			await contractService.updateContract(
				updatedContract.id,
				payload as any,
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
				secondButtonLabel="Planos"
				secondButtonIcon="list-outline"
				setIsFirstModalVisible={setIsPlanModalVisible}
				thirdButtonLabel="Templates"
				thirdButtonIcon="clipboard-outline"
				setIsSecondModalVisible={setIsTemplateModalVisible}
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

			<TemplateModal
				visible={isTemplateModalVisible}
				onClose={() => setIsTemplateModalVisible(false)}
				onTemplatesUpdated={fetchTemplates}
			/>
		</View>
	);
}
