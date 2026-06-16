import { View, Text } from "react-native";

import { colors, page, text } from "@/assets/styles/stylesheets";
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
		<View style={page.row}>
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
						labelColor={colors.textSecondary}
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

			<View style={page.columns}>
				<Text style={text.headerText}>AÇÕES</Text>
			</View>
		</View>
	);
}
