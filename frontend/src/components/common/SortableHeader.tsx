import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { page, text } from "@/assets/styles/stylesheets";

type SortKey<T> = keyof T | null;
type SortDirection = "asc" | "desc";

interface SortableHeaderProps<T> {
	title: string;
	sortKeyName: keyof T;
	onSort: (key: keyof T | null) => void;
	sortKey: SortKey<T>;
	sortDirection: SortDirection;
	style?: object;
}

export function SortableHeader<T>({
	title,
	sortKeyName,
	onSort,
	sortKey,
	sortDirection,
	style,
}: SortableHeaderProps<T>) {
	const isActive = sortKey === sortKeyName;
	const iconName = sortDirection === "asc" ? "arrow-up" : "arrow-down";

	return (
		<Pressable
			style={[page.columns, style, { minHeight: 24 }]}
			onPress={() => onSort(sortKeyName)}
		>
			<View
				style={{ flexDirection: "row", alignItems: "center", gap: 5, minHeight: 20 }}
			>
				<Text style={text.headerText}>{title.toUpperCase()}</Text>
				{/* Shows the icon only if this is the active sort column */}
				{isActive && (
					<Ionicons name={iconName} size={14} color="#6b7280" />
				)}
			</View>
		</Pressable>
	);
}
