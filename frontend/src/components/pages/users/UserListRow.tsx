import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, page, text } from "@/assets/styles/stylesheets";
import { User } from "@/assets/types/ms-user/User";

interface Props {
	item: User;
	openItemDetail: () => void;
}

export function UserListRow({ item, openItemDetail }: Props) {
	if (!item) {
		return null;
	}

	return (
		<View style={page.row}>
			<View style={{ width: "2%" }} />

			<View style={page.columns}>
				<Text style={text.rowText}>{item.name}</Text>
			</View>

			<View style={page.columns}>
				<Text style={text.rowText}>{item.email}</Text>
			</View>

			<View style={page.columns}>
				<Text style={text.rowText}>{item.position}</Text>
			</View>

			<View style={page.columns}>
				<Text
					style={[
						text.rowText,
						{
							color: getRoleColor(item.role?.name),
							fontWeight: "bold",
						},
					]}
				>
					{item.role?.name || "Sem perfil"}
				</Text>
			</View>

			<View
				style={[
					page.columns,
					{ flexDirection: "row", justifyContent: "center", gap: 15 },
				]}
			>
				<Ionicons
					name="eye"
					size={20}
					color={colors.textPrimary}
					onPress={openItemDetail}
				/>
			</View>
		</View>
	);
}

function getRoleColor(role?: string) {
	switch (role) {
		case "Admin":
			return colors.primary;
		case "User":
			return colors.secondary;
		default:
			return colors.textSecondary;
	}
}
