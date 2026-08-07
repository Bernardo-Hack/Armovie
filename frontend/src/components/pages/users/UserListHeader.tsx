import { View, Text } from "react-native";
import { User } from "@/assets/types/ms-user/User";
import { colors, page, text } from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";
import { SortableHeader } from "@/components/common/SortableHeader";

type SortKey = keyof User | null;
type SortDirection = "asc" | "desc";

interface UserListHeaderProps {
	onSort: (key: keyof User | null) => void;
	sortKey: SortKey;
	sortDirection: SortDirection;
}

export function UserListHeader({
	onSort,
	sortKey,
	sortDirection,
}: UserListHeaderProps) {
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
				title="NOME"
				sortKeyName="name"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="EMAIL"
				sortKeyName="email"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="CARGO"
				sortKeyName="position"
				onSort={onSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				style={page.columns}
			/>
			<SortableHeader
				title="NÍVEL"
				sortKeyName="role"
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
