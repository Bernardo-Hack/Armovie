import { View, Text } from "react-native";
import { Machine } from "@/assets/types/Machine";

import * as styles from "@/assets/styles/stylesheets";

import Button from "../../common/Button";
import { SortableHeader } from "../../common/SortableHeader";
import Ionicons from "@expo/vector-icons/Ionicons";

type SortKey = keyof Machine | null;
type SortDirection = "asc" | "desc";

interface MachineListHeaderProps {
	onSort: (key: keyof Machine | null) => void;
	sortKey: SortKey;
	sortDirection: SortDirection;
}

export function MachineListHeader({
	onSort,
	sortKey,
	sortDirection,
}: MachineListHeaderProps) {
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
					<Ionicons
						name="refresh"
						size={16}
						color={styles.colors.textSecondary}
						onPress={() => onSort(null)}
					/>
				)}
			</View>

			<SortableHeader
				title="Máquina"
				sortKeyName="name"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "20%" }}
			/>
			<SortableHeader
				title="Model"
				sortKeyName="model"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "15%" }}
			/>
			<SortableHeader
				title="fragrância"
				sortKeyName="fragranceId"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "25%" }}
			/>
			<SortableHeader
				title="está paga?"
				sortKeyName="isPaid"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={{ width: "10%" }}
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
