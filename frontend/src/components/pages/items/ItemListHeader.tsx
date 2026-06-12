import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import * as styles from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";
import { SortableHeader } from "@/components/common/SortableHeader";

import { Item } from "@/assets/types/Item";

type SortKey = keyof Item | null;
type SortDirection = "asc" | "desc";

interface ItemListHeaderProps {
	onSort: (key: keyof Item | null) => void;
	sortKey: SortKey;
	sortDirection: SortDirection;
}

export function ItemListHeader({
	onSort,
	sortKey,
	sortDirection,
}: ItemListHeaderProps) {
	return (
		<View style={styles.page.row}>
			{/* Refresh Button */}
			<View
				style={{
					width: "2%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{sortKey && (
					<Button
						labelColor={styles.colors.textSecondary}
						iconName="refresh"
						iconSize={14}
						onPress={() => onSort(null)}
					/>
				)}
			</View>

			<SortableHeader
				title="PRODUTO"
				sortKeyName="name"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "20%" }}
			/>
			<SortableHeader
				title="CATEGORIA"
				sortKeyName="category"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "15%" }}
			/>
			<SortableHeader
				title="FORNECEDOR"
				sortKeyName="supplier"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "20%" }}
			/>
			<SortableHeader
				title="ESTOQUE ATUAL"
				sortKeyName="stock"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "15%" }}
			/>
			<SortableHeader
				title="STATUS"
				sortKeyName="status"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "15%" }}
			/>

			<View style={styles.page.columns}>
				<Text style={styles.text.headerTextStyle}>AÇÕES</Text>
			</View>
		</View>
	);
}
