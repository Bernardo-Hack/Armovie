import { View, Text } from "react-native";
import { Client } from "@/assets/types/Client";

import * as styles from "@/assets/styles/stylesheets";

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
				title="CLIENTE"
				sortKeyName="name"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "20%" }}
			/>
			<SortableHeader
				title="SEGMENTO"
				sortKeyName="segment"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "15%" }}
			/>
			<SortableHeader
				title="LEAD"
				sortKeyName="lead"
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

			<View style={styles.page.columns}>
				<Text style={styles.text.headerTextStyle}>AÇÕES</Text>
			</View>
		</View>
	);
}
