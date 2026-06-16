import { View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useEffect, useState, useMemo } from "react";

import * as styles from "@/assets/styles/stylesheets";
import Header from "@/components/common/Header";
import { GenericList } from "@/components/common/GenericList";
import { GenericCreateModal } from "@/components/common/GenericCreateModal";

import { PersonListHeader } from "@/components/pages/persons/PersonListHeader";
import { PersonListRow } from "@/components/pages/persons/PersonListRow";
import { PersonModalContent } from "@/components/pages/persons/PersonModalContent";
import { PersonAddressModal } from "@/components/pages/persons/PersonAddressModal";

import { Person } from "@/assets/types/Person";
import { PersonService } from "@/services/personService";
import { clientService } from "@/services/clientService";

type SortKey = keyof Person | null;
type SortDirection = "asc" | "desc";

const initialPersonState: Person = {
	id: "",
	clientId: "",
	fullName: "",
	document: "",
	birthday: new Date(),
	civilState: "",
	nationality: "",
	doesSign: false,
	isRepresentative: false,
	role: "",
	email: "",
	phone: "",
	observations: "",
	status: "Em Análise",
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
};

export default function PersonsTab() {
	const [persons, setPersons] = useState<Person[]>([]);
	const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
	const [sortKey, setSortKey] = useState<SortKey>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
	const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

	const sortedPersons = useMemo(() => {
		if (!sortKey) return persons;

		const sorted = [...persons].sort((a, b) => {
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
	}, [persons, sortKey, sortDirection]);

	const fetchAllData = async () => {
		setLoading(true);

		// Busca de Clientes
		try {
			const clientsData = await clientService.getAllClients();
			setClients(clientsData.map(c => ({ id: c.id, name: c.fantasyName || c.fullName })));
		} catch (error: any) {
			if (error.message == "Not Found") {
				Toast.show({
					type: "info",
					text1: "Nenhum cliente encontrado!",
				});
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar clientes",
					text2: error.message || "Não foi possível buscar os clientes. Tente novamente.",
				});
			}
			setClients([]);
		}

		// Busca de Pessoas
		try {
			const personsData = await PersonService.getAllPersons();
			setPersons(personsData);
		} catch (error: any) {
			if (error.message === "Not Found" || error.message?.includes("404")) {
				Toast.show({
					type: "info",
					text1: "Nenhuma pessoa encontrada!",
					text2: "Cadastre uma nova pessoa para começar.",
				});
				setPersons([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar pessoas",
					text2: error.message || "Não foi possível buscar as pessoas. Tente novamente.",
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

	const handleOpenAddressModal = (person: Person) => {
		setSelectedPerson(person);
		setIsAddressModalVisible(true);
	};

	const handleCreatePerson = async (newPersonData: Person) => {
		try {
			const { id, status, created_at, updated_at, ...personToCreate } = newPersonData as Person;

			if (!personToCreate.fullName || !personToCreate.document || !personToCreate.clientId || !personToCreate.email) {
				Toast.show({
					type: "error",
					text1: "Dados incompletos",
					text2: "Preencha Nome, Documento, Email e selecione um Cliente.",
				});
				return;
			}

			const payload = {
				...personToCreate,
				observations: personToCreate.observations || undefined,
			};

			await PersonService.createPerson(payload);
			Toast.show({ type: "success", text1: "Pessoa cadastrada com sucesso!" });

			fetchAllData();
			setIsCreateModalVisible(false);
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao criar pessoa", text2: error.message });
		}
	};

	const handleUpdatePerson = async (updatedPerson: Person) => {
		try {
			const { id, created_at, updated_at, ...personToUpdate } = updatedPerson as Person;

			if (!personToUpdate.fullName || !personToUpdate.document || !personToUpdate.clientId || !personToUpdate.email) {
				Toast.show({
					type: "error",
					text1: "Dados incompletos",
					text2: "Preencha Nome, Documento, Email e selecione um Cliente.",
				});
				return;
			}

			const payload = {
				...personToUpdate,
				observations: personToUpdate.observations || undefined,
			};

			await PersonService.updatePerson(updatedPerson.id, payload);
			Toast.show({ type: "success", text1: "Dados atualizados com sucesso!" });
			fetchAllData();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao atualizar", text2: error.message });
		}
	};

	const handleDeletePerson = async (id: string) => {
		try {
			await PersonService.deletePerson(id);
			Toast.show({ type: "success", text1: "Pessoa excluída com sucesso!" });
			fetchAllData();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao excluir", text2: error.message });
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<View style={styles.page.background}>
			<Header pageName="Pessoas" subtitle="Controle de Pessoas" fetchItems={fetchAllData} setIsCreateModalVisible={setIsCreateModalVisible} />

			<GenericList
				loading={loading}
				items={sortedPersons}
				itemTypeName="pessoa"
				onSort={handleSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSaveItem={handleUpdatePerson}
				onDeleteItem={handleDeletePerson}
				HeaderComponent={PersonListHeader}
				RowComponent={(props: any) => <PersonListRow {...props} openExtraModal={() => handleOpenAddressModal(props.item)} />}
				editModalRenderContent={(person, isEditing, handleInputChange) => (
					<PersonModalContent person={person as Person} isEditing={isEditing} handleInputChange={handleInputChange} clients={clients} />
				)}
			/>

			<GenericCreateModal initialState={initialPersonState} visible={isCreateModalVisible} onClose={() => setIsCreateModalVisible(false)} onSave={handleCreatePerson} renderContent={(person, handleInputChange) => <PersonModalContent person={person as Person} isEditing={true} handleInputChange={handleInputChange} clients={clients} />} />

			<PersonAddressModal person={selectedPerson} visible={isAddressModalVisible} onClose={() => { setIsAddressModalVisible(false); setSelectedPerson(null); }} />
		</View>
	);
}
