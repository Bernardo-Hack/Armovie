import { Text, View, TextInput, ScrollView } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useEffect, useState, useMemo } from "react";

import * as styles from "@/assets/styles/stylesheets";
import Header from "@/components/common/Header";
import { GenericList } from "@/components/common/GenericList";
import { GenericCreateModal } from "@/components/common/GenericCreateModal";

import { ItemListRow } from "@/components/pages/items/ItemListRow";
import { ItemListHeader } from "@/components/pages/items/ItemListHeader";

import { Item } from "@/assets/types/Item";
import { itemService } from "@/services/itemService";
import { StatBox } from "@/components/common/Statbox";
import { formatDisplayDate } from "@/utils/utils";

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

function renderItemContent(
	categories: { id: string; name: string }[],
	item: Item,
	isEditing: boolean,
	handleInputChange: (field: keyof Item, value: any) => void,
) {
	return (
		<ScrollView contentContainerStyle={{ width: "100%" }}>
			{/* Name */}
			{isEditing ? (
				<View style={{ marginBottom: 20 }}>
					<TextInput
						style={[
							styles.modalPage.title,
							{
								borderBottomWidth: 1,
								borderColor: "#ddd",
								paddingBottom: 0,
							},
						]}
						value={item.name}
						onChangeText={(text) => handleInputChange("name", text)}
					/>
				</View>
			) : (
				<View style={{ marginBottom: 20 }}>
					<Text style={[styles.modalPage.title, { marginBottom: 0 }]}>
						{item.name}
					</Text>
				</View>
			)}

			{/* Supplier */}
			<StatBox
				isEditing={isEditing}
				onChange={(text) => handleInputChange("supplier", text)}
				direction="horizontal"
				label="fornecedor"
				value={item.supplier}
			/>

			{/* Category */}
			<StatBox
				type="select"
				isEditing={isEditing}
				onChange={(value) =>
					handleInputChange("category", value as string)
				}
				direction="horizontal"
				label="categoria"
				value={item.category}
				options={categories.map((c) => ({
					label: c.name,
					value: c.id,
				}))}
			/>

			{/* Almost all data */}
			<View style={styles.modalPage.statsGrid}>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("stock", text)}
					isNumeric={true}
					direction="vertical"
					label="estoque"
					value={item.stock.toString()}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("minStock", text)}
					isNumeric={true}
					direction="vertical"
					label="estoque mínimo"
					value={item.minStock.toString()}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("averageCost", text)}
					isNumeric={true}
					direction="vertical"
					label="custo médio"
					value={item.averageCost.toString()}
				/>
				<StatBox
					isEditing={false}
					onChange={(text) => handleInputChange("averageCost", text)}
					direction="vertical"
					label="valor total"
					value={item.averageCost * item.stock}
					valueColor={"#4caf50"}
					unit="R$"
					prefix="R$ "
				/>
			</View>

			{/* Description */}
			<StatBox
				isEditing={isEditing}
				onChange={(text) => handleInputChange("description", text)}
				direction="horizontal"
				label="descrição"
				value={item.description}
			/>

			{/* Notes */}
			<StatBox
				isEditing={isEditing}
				onChange={(text) => handleInputChange("notes", text)}
				direction="horizontal"
				label="Observações"
				value={item.notes || ""}
			/>

			{/* Status and Date Information */}
			<View
				style={{
					flexDirection: "row",
					gap: 10,
					marginTop: 15,
					justifyContent: "space-between",
				}}
			>
				{/* Status */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					{isEditing ? (
						<TextInput
							style={[
								styles.modalPage.tag,
								styles.modalPage.tagText,
								{ paddingVertical: 5 },
							]}
							value={item.status}
							onChangeText={(text) =>
								handleInputChange("status", text)
							}
						/>
					) : (
						<View
							style={[
								styles.modalPage.tag,
								{
									backgroundColor: "#e8f5e9",
									borderWidth: 0,
								},
							]}
						>
							<Text
								style={[
									styles.modalPage.tagText,
									{ color: "#4caf50" },
								]}
							>
								{item.status.toUpperCase()}
							</Text>
						</View>
					)}
				</View>

				{/* Date Information */}
				<View style={{ flexDirection: "column", gap: 5 }}>
					<Text style={styles.modalPage.dateText}>
						Criado em: {formatDisplayDate(item.created_at)}
					</Text>
					<Text style={styles.modalPage.dateText}>
						Atualizado em: {formatDisplayDate(item.updated_at)}
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}

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
				) =>
					renderItemContent(
						categories,
						item,
						isEditing,
						handleInputChange,
					)
				}
			/>

			<GenericCreateModal
				initialState={initialState}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={handleCreateItem}
				renderContent={(item, handleInputChange) =>
					renderItemContent(
						categories,
						item as Item,
						true,
						handleInputChange,
					)
				}
			/>
		</View>
	);
}
