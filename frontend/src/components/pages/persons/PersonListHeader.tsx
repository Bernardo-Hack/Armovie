import { View, Text } from "react-native";
import { Person } from "@/assets/types/Person";

import { colors, page, text } from "@/assets/styles/stylesheets";

import Button from "../../common/Button";
import { SortableHeader } from "../../common/SortableHeader";

type SortKey = keyof Person | null;
type SortDirection = "asc" | "desc";

interface PersonListHeaderProps {
	onSort: (key: keyof Person | null) => void;
	sortKey: SortKey;
	sortDirection: SortDirection;
}

export function PersonListHeader({
	onSort,
	sortKey,
	sortDirection,
}: PersonListHeaderProps) {
	return (
		<View style={page.row}>
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
				title="nome"
				sortKeyName="fullName"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="CLIENTE"
				sortKeyName="clientId"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="ASSINA?"
				sortKeyName="doesSign"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="REPRESENTA?"
				sortKeyName="isRepresentative"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="nacionalidade"
				sortKeyName="nationality"
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
