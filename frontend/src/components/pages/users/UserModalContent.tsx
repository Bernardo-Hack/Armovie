import { View, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { User } from "@/assets/types/User";
import { text } from "@/assets/styles/stylesheets";
import { StatBox } from "@/components/common/Statbox";
import { formatDisplayDate } from "@/utils/utils";

interface Props {
	user: User & { password?: string };
	isEditing: boolean;
	isCreating?: boolean;
	handleInputChange: (field: keyof (User & { password?: string }), value: any) => void;
}

export function UserModalContent({ user, isEditing, isCreating = false, handleInputChange }: Props) {
	const roles = [
		{ label: "Usuário", value: "User" },
		{ label: "Administrador", value: "Admin" },
		{ label: "Vendedor", value: "Seller" },
		{ label: "Técnico", value: "Technician"},
		{ label: "Financeiro", value: "Financeiro" },
		{ label: "Outro", value: "Outro" },
	];

	return (
		<ScrollView contentContainerStyle={{ width: "100%" }}>
			{/* Name */}
			{isEditing ? (
				<View style={{ marginBottom: 20 }}>
					<TextInput
						style={[
							styles.title,
							{
								borderBottomWidth: 1,
								borderColor: "#ddd",
								paddingBottom: 0,
							},
						]}
						value={user.name}
						onChangeText={(text) => handleInputChange("name", text)}
					/>
				</View>
			) : (
				<View style={{ marginBottom: 20 }}>
					<Text style={[styles.title, { marginBottom: 0 }]}>
						{user.name}
					</Text>
				</View>
			)}

			<View style={styles.statsGrid}>
				<StatBox
					isEditing={isEditing}
					onChange={(value) => handleInputChange("email", value)}
					direction="vertical"
					label="Email"
					value={user.email}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(value) => handleInputChange("position", value)}
					direction="vertical"
					label="Cargo"
					value={user.position}
				/>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(value) => handleInputChange("role", value)}
					direction="vertical"
					label="Nível de Acesso"
					value={user.role}
					options={roles}
				/>
			</View>

			{!isCreating && (
				<View style={{ flexDirection: "column", gap: 5, marginTop: 20, alignItems: "center" }}>
					<Text style={styles.dateText}>
						Criado em: {formatDisplayDate(user.createdAt)}
					</Text>
					<Text style={styles.dateText}>
						Atualizado em: {formatDisplayDate(user.updatedAt)}
					</Text>
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	title: {
		...text.title,
		fontSize: 28,
	},
	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginTop: 20,
		marginBottom: 20,
	},
	dateText: {
		...text.subtitle,
		color: "#57606a",
		fontSize: 12,
	},
});
