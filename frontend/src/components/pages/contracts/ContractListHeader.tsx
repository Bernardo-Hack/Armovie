import { View, Text } from "react-native";
import { Contract } from "@/assets/types/ms-client/Contract";
import { SortableHeader } from "../../common/SortableHeader";

import Button from "../../common/Button";
import { colors, page, text } from "@/assets/styles/stylesheets";

type SortKey = keyof Contract | null;
type SortDirection = "asc" | "desc";

interface ContractListHeaderProps {
	onSort: (key: keyof Contract | null) => void;
	sortKey: SortKey;
	sortDirection: SortDirection;
}

export function ContractListHeader({
	onSort,
	sortKey,
	sortDirection,
}: ContractListHeaderProps) {
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
				title="cliente"
				sortKeyName="clientId"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="tipo"
				sortKeyName="type"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="plano"
				sortKeyName="name"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="máquinas"
				sortKeyName="machines"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="status"
				sortKeyName="status"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>

			<View style={page.columns}>
				<Text style={text.headerText}>AÇÕES</Text>
			</View>
		</View>
	);
}
