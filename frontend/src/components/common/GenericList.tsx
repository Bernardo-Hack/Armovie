import {
	Platform,
	View,
	FlatList,
	ActivityIndicator,
	Text,
	StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { colors, text } from "@/assets/styles/stylesheets";
import { GenericEditModal } from "./GenericEditModal";

type SortKey<T> = keyof T | null;
type SortDirection = "asc" | "desc";

interface GenericListProps<T> {
	loading: boolean;
	items: T[];
	itemTypeName?: string;

	onSort?: (key: SortKey<T>) => void;
	sortKey?: SortKey<T>;
	sortDirection?: SortDirection;

	onSaveItem: (item: T) => void;
	onDeleteItem?: (id: string) => void;

	HeaderComponent: React.ElementType;
	RowComponent: React.ElementType;
	editModalRenderContent: (
		item: T,
		isEditing: boolean,
		handleInputChange: (field: keyof T, value: any) => void,
	) => React.ReactNode;
}

export function GenericList<T extends { id: any }>({
	loading,
	items,
	itemTypeName,

	onSort,
	sortKey,
	sortDirection,

	onSaveItem,
	onDeleteItem,

	HeaderComponent,
	RowComponent,
	editModalRenderContent,
}: GenericListProps<T>) {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<T | null>(null);

	const openItemDetail = (item: T) => {
		setSelectedItem(item);
		setIsEditModalOpen(true);
	};

	const closeItemDetail = () => {
		setIsEditModalOpen(false);
		setSelectedItem(null);
	};

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	if (items.length == 0) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "flex-start",
					alignItems: "center",
				}}
			>
				<HeaderComponent
					onSort={onSort}
					sortKey={sortKey}
					sortDirection={sortDirection}
					style={{ width: "100%" }}
				/>
				<Text style={[text.title, { marginTop: 50 }]}>
					Nenhum {`${itemTypeName || "item"}`} encontrado.
				</Text>
			</View>
		);
	}

	return (
		<>
			<FlatList
				style={styles.list}
				data={items}
				renderItem={({ item }) => (
					<RowComponent
						item={item}
						openItemDetail={() => openItemDetail(item)}
					/>
				)}
				keyExtractor={(item) => item.id.toString()}
				ListHeaderComponent={
					Platform.OS === "web" ? (
						<HeaderComponent
							onSort={onSort}
							sortKey={sortKey}
							sortDirection={sortDirection}
						/>
					) : null
				}
				ListFooterComponent={<View style={{ height: 100 }} />}
			/>
			{isEditModalOpen && selectedItem && (
				<GenericEditModal
					item={selectedItem}
					visible={isEditModalOpen}
					onClose={closeItemDetail}
					onSave={onSaveItem}
					onDelete={onDeleteItem ? () => onDeleteItem(selectedItem.id) : undefined}
					renderContent={editModalRenderContent}
				/>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	list: {
		width: "90%",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: colors.textSecondary,
		overflow: "hidden",
	},
});
