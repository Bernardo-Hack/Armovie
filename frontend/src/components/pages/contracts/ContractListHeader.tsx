import { View, Text } from "react-native";
import { Contract } from "@/assets/types/Contract";
import { SortableHeader } from "../../common/SortableHeader";

import Button from "../../common/Button";
import * as styles from "@/assets/styles/stylesheets";

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
				title="CONTRATO"
				sortKeyName="name"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={styles.page.columns}
			/>
			<SortableHeader
				title="CLIENTE"
				sortKeyName="clientId"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={styles.page.columns}
			/>
			<SortableHeader
				title="TIPO"
				sortKeyName="type"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={styles.page.columns}
			/>
			<SortableHeader
				title="MÁQUINAS"
				sortKeyName="machines"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={styles.page.columns}
			/>
			<SortableHeader
				title="STATUS"
				sortKeyName="status"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={styles.page.columns}
			/>

			<View style={styles.page.columns}>
				<Text style={styles.text.headerTextStyle}>AÇÕES</Text>
			</View>
		</View>
	);
}
