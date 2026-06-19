import { View, Text } from "react-native";
import { Client } from "@/assets/types/ms-client/Client";

import { colors, page, text } from "@/assets/styles/stylesheets";

import Button from "../../common/Button";
import { SortableHeader } from "../../common/SortableHeader";

type SortKey = keyof Client | null;
type SortDirection = "asc" | "desc";

interface ClientListHeaderProps {
	onSort: (key: keyof Client | null) => void;
	sortKey: SortKey;
	sortDirection: SortDirection;
}

export function ClientListHeader({
	onSort,
	sortKey,
	sortDirection,
}: ClientListHeaderProps) {
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
				title="CLIENTE"
				sortKeyName="fullName"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "20%" }}
			/>
			<SortableHeader
				title="RAMO"
				sortKeyName="fieldOfActivity"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "15%" }}
			/>
			<SortableHeader
				title="TELEFONE"
				sortKeyName="phone"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "15%" }}
			/>
			<SortableHeader
				title="VENDEDOR"
				sortKeyName="sellerId"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "20%" }}
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
