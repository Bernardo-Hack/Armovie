import { Text, View, TextInput, ScrollView } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useEffect, useState, useMemo } from "react";

import * as styles from "@/assets/styles/stylesheets";
import Header from "@/components/common/Header";
import { GenericList } from "@/components/common/GenericList";
import { GenericCreateModal } from "@/components/common/GenericCreateModal";

import { ItemListRow } from "@/components/pages/items/ItemListRow";
import { ItemListHeader } from "@/components/pages/items/ItemListHeader";
import { ItemModalContent } from "@/components/pages/items/ItemModalContent";

import { Item } from "@/assets/types/Item";
import { itemService } from "@/services/itemService";

type SortKey = keyof Item | null;
type SortDirection = "asc" | "desc";

const initialState = {
	id: "",
	name: "",
	category: "",
	supplier: "",
	stock: 0,
	minStock: 0,
	averageCost: 0,
	description: "",
	notes: "",
	status: "",
	created_at: "",
	updated_at: "",
};

export default function ItemsTab() {
	const [items, setItems] = useState<Item[]>([]);
	const [sortKey, setSortKey] = useState<SortKey>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	const categories: { id: string; name: string }[] = [
		{ id: "Equipamento", name: "Equipamento" },
		{ id: "Fragrância", name: "Fragrância" },
		{ id: "Insumo", name: "Insumo" },
		{ id: "Peça de Reposição", name: "Peça de Reposição" },
		{ id: "Máquina", name: "Máquina" },
	];

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

	const sortedItems = useMemo(() => {
		if (!sortKey) return items;

		const sorted = [...items].sort((a, b) => {
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
	}, [items, sortKey, sortDirection]);

	const fetchItems = async () => {
		try {
			const itemsData = await itemService.getAllItems();
			setItems(itemsData);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao carregar itens",
				text2:
					error.message ||
					"Não foi possível buscar os itens. Tente novamente.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleCreateItem = async (newItemData: Item) => {
		try {
			const { id, status, created_at, updated_at, ...itemToCreate } =
				newItemData as Item;

			await itemService.createItem(itemToCreate);

			Toast.show({
				type: "success",
				text1: "Item criado com sucesso!",
			});

			fetchItems();
			setIsCreateModalVisible(false);
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao criar item",
				text2: error.message || "Não foi possível criar o item.",
			});
		}
	};

	const handleUpdateItem = async (updatedItem: Item) => {
		try {
			await itemService.updateItem(updatedItem.id, updatedItem);
			Toast.show({
				type: "success",
				text1: "Item atualizado com sucesso!",
			});
			fetchItems();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao atualizar item",
				text2: error.message || "Não foi possível atualizar o item.",
			});
		}
	};

	const handleDeleteItem = async (id: string) => {
		try {
			await itemService.deleteItem(id);
			Toast.show({
				type: "success",
				text1: "Item excluído com sucesso!",
			});
			fetchItems();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao excluir item",
				text2: error.message || "Não foi possível excluir o item.",
			});
		}
	};

	const renderContent = (
			item: Item | Partial<Item>,
			isEditing: boolean,
			handleInputChange: any,
		) => (
			<ItemModalContent
				item={item as Item}
				isEditing={isEditing}
				handleInputChange={handleInputChange}
				categories={categories}
			/>
		);

	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<View style={styles.page.background}>
			{/* Header */}
			<Header
				pageName="Itens"
				subtitle="Controle de Itens"
				fetchItems={fetchItems}
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
				HeaderComponent={ItemListHeader}
				RowComponent={ItemListRow}
				editModalRenderContent={(
					item,
					isEditing,
					handleInputChange,
				) => renderContent(item, isEditing, handleInputChange)
				}
			/>

			<GenericCreateModal
				initialState={initialState}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={handleCreateItem}
				renderContent={(item, handleInputChange) => renderContent(item, true, handleInputChange)}
			/>
		</View>
	);
}
