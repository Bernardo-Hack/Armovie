import { View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useEffect, useState, useMemo } from "react";

import * as styles from "@/assets/styles/stylesheets";
import Header from "@/components/common/Header";
import { GenericList } from "@/components/common/GenericList";
import { GenericCreateModal } from "@/components/common/GenericCreateModal";

import { MachineListRow } from "@/components/pages/machines/MachineListRow";
import { MachineListHeader } from "@/components/pages/machines/MachineListHeader";
import { MachineModalContent } from "@/components/pages/machines/MachineModalContent";

import { Machine } from "@/assets/types/Machine";
import { machineService } from "@/services/machineService";
import { itemService } from "@/services/itemService";
import { contractService } from "@/services/contractService";
import { MachineServicesModal } from "@/components/pages/machines/MachineServicesModal";

type SortKey = keyof Machine | null;
type SortDirection = "asc" | "desc";

const initialState: Machine = {
	id: "",
	name: "",
	model: "",
	observations: "",
	contractId: "",
	fragranceId: "",
	medianConsumption: 0,
	price: 0,
	isPaid: false,
	status: "Disponível",
	created_at: new Date().toString(),
};

export default function ItemsTab() {
	const [machines, setMachines] = useState<Machine[]>([]);
	const [contracts, setContracts] = useState<{ id: string; name: string }[]>(
		[],
	);
	const [fragrances, setFragrances] = useState<
		{ id: string; name: string }[]
	>([]);
	const [sortKey, setSortKey] = useState<SortKey>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [selectedMachine, setSelectedMachine] = useState<Machine | null>(
		null,
	);
	const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);

	const mockContracts: { id: string; name: string }[] = [
		{
			id: "",
			name: "N/A",
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440000",
			name: "Contrato 001 - Shopping Center",
		},
		{
			id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
			name: "Contrato 002 - Rede de Academias",
		},
		{
			id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
			name: "Contrato 003 - Clínicas Médicas",
		},
		{
			id: "a43e4965-7489-4b77-b9c1-5264b9b00a5f",
			name: "Contrato 004 - Escritório Central",
		},
		{
			id: "e9b5f2c4-8c88-4e8c-8f2c-8a4b4c3d2e1f",
			name: "Contrato 005 - Hotel Resort",
		},
	];

	const mockFragrances: { id: string; name: string }[] = [
		{
			id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
			name: "Lavanda Francesa",
		},
		{
			id: "8f56613c-8a22-4a0d-8557-0a1492b45e75",
			name: "Bambu",
		},
		{
			id: "3c734dc6-4f40-410a-8bf8-0951a7199c01",
			name: "Capim Limão",
		},
		{
			id: "1c28c3db-82ad-48b0-8c29-87353f0f7f2f",
			name: "Flor de Laranjeira",
		},
		{
			id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
			name: "Baunilha",
		},
	];

	const sortedItems = useMemo(() => {
		if (!sortKey) return machines;

		const sorted = [...machines].sort((a, b) => {
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
	}, [machines, sortKey, sortDirection]);

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

	const fetchAllData = async () => {
		setLoading(true);

		// Busca de Contratos
		try {
			const contractsData = await contractService.getAllContracts();
			setContracts([
				{ id: "", name: "N/A" },
				...contractsData.map((c) => ({ id: c.id, name: c.clientId })),
			]);
		} catch (error: any) {
			if (
				error.message === "Not Found" ||
				error.message?.includes("404")
			) {
				console.log("Nenhum contrato encontrado!");
				setContracts([{ id: "", name: "N/A" }]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar contratos",
					text2:
						error.message ||
						"Não foi possível buscar os contratos. Tente novamente.",
				});
			}
			setContracts([{ id: "", name: "N/A" }]);
		}

		// Busca de Fragrâncias
		try {
			const itemsData = await itemService.getAllItems();
			setFragrances([
				{ id: "", name: "N/A" },
				...itemsData
					.filter((item) => item.category === "Fragrância")
					.map((item) => ({ id: item.id, name: item.name })),
			]);
		} catch (error: any) {
			if (
				error.message === "Not Found" ||
				error.message?.includes("404")
			) {
				console.log("Nenhuma fragrância encontrada!");
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar fragrâncias",
					text2:
						error.message ||
						"Não foi possível buscar as fragrâncias. Tente novamente.",
				});
			}
			setFragrances([{ id: "", name: "N/A" }]);
		}

		// Busca de Máquinas
		try {
			const machinesData = await machineService.getAllMachines();
			setMachines(machinesData);
		} catch (error: any) {
			if (
				error.message === "Not Found" ||
				error.message?.includes("404")
			) {
				console.log("Nenhuma máquina encontrada!");
				setMachines([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar máquinas",
					text2:
						error.message ||
						"Não foi possível buscar as máquinas. Tente novamente.",
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCreateMachine = async (newMachineData: Machine) => {
		try {
			const { id, status, created_at, ...rawMachineData } =
				newMachineData as Machine;

			const machineToCreate = {
				...rawMachineData,
				contractId: rawMachineData.contractId || null,
				fragranceId: rawMachineData.fragranceId || null,
			};

			await machineService.createMachine(machineToCreate);

			Toast.show({
				type: "success",
				text1: "Máquina criada com sucesso!",
			});

			fetchAllData();
			setIsCreateModalVisible(false);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao criar máquina",
				text2: error.message || "Não foi possível criar a máquina.",
			});
		}
	};

	const handleUpdateItem = async (updatedMachine: Machine) => {
		try {
			// Nulls empty IDs
			const machineToUpdate = {
				...updatedMachine,
				contractId: updatedMachine.contractId || null,
				fragranceId: updatedMachine.fragranceId || null,
			};

			await machineService.updateMachine(
				machineToUpdate.id,
				machineToUpdate,
			);
			Toast.show({
				type: "success",
				text1: "Máquina atualizada com sucesso!",
			});
			fetchAllData();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao atualizar máquina",
				text2: error.message || "Não foi possível atualizar a máquina.",
			});
		}
	};

	const handleDeleteItem = async (id: string) => {
		try {
			await machineService.deleteMachine(id);
			Toast.show({
				type: "success",
				text1: "Máquina excluída com sucesso!",
			});
			fetchAllData();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao excluir máquina",
				text2: error.message || "Não foi possível excluir a máquina.",
			});
		}
	};

	const handleOpenServiceModal = (machine: Machine) => {
		setSelectedMachine(machine);
		setIsServiceModalVisible(true);
	};

	const renderContent = (
		machine: Machine | Partial<Machine>,
		isEditing: boolean,
		handleInputChange: any,
	) => (
		<MachineModalContent
			machine={machine as Machine}
			isEditing={isEditing}
			handleInputChange={handleInputChange}
			contracts={contracts}
			fragrances={fragrances}
		/>
	);

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<View style={styles.page.background}>
			{/* Header */}
			<Header
				pageName="Máquinas"
				subtitle="Controle de Máquinas"
				fetchItems={fetchAllData}
				setIsCreateModalVisible={setIsCreateModalVisible}
			/>

			{/* List */}
			<GenericList
				loading={loading}
				items={sortedItems}
				onSort={handleSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSaveItem={handleUpdateItem}
				onDeleteItem={handleDeleteItem}
				HeaderComponent={MachineListHeader}
				RowComponent={(props: any) => (
					<MachineListRow
						{...props}
						openExtraModal={() =>
							handleOpenServiceModal(props.item)
						}
					/>
				)}
				editModalRenderContent={renderContent}
			/>

			<GenericCreateModal
				initialState={initialState}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={handleCreateMachine}
				renderContent={(c, handle) => renderContent(c, true, handle)}
			/>

			<MachineServicesModal
				machine={selectedMachine}
				visible={isServiceModalVisible}
				onClose={() => {
					setIsServiceModalVisible(false);
					setSelectedMachine(null);
				}}
			/>
		</View>
	);
}
