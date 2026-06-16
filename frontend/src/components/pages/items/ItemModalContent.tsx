import { Text, View, TextInput, ScrollView, StyleSheet } from "react-native";
import { Item } from "@/assets/types/Item";
import { text } from "@/assets/styles/stylesheets";
import { StatBox, StatusBox } from "@/components/common/Statbox";
import { formatDisplayDate } from "@/utils/utils";

interface Props {
	item: Item;
	isEditing: boolean;
	handleInputChange: (field: keyof Item, value: any) => void;
	categories: { id: string; name: string }[];
}

export function ItemModalContent({
	item,
	isEditing,
	handleInputChange,
	categories,
}: Props) {
	return (
		<ScrollView style={{ width: "100%" }} contentContainerStyle={{ width: "100%" }}>
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
						value={item.name}
						onChangeText={(text) => handleInputChange("name", text)}
					/>
				</View>
			) : (
				<View style={{ marginBottom: 20 }}>
					<Text style={[styles.title, { marginBottom: 0 }]}>
						{item.name}
					</Text>
				</View>
			)}

			{/* Supplier */}
			<StatBox
				isEditing={isEditing}
				onChange={(text) => handleInputChange("supplier", text)}
				direction="horizontal"
				label="fornecedor"
				value={item.supplier}
			/>

			{/* Category */}
			<StatBox
				type="select"
				isEditing={isEditing}
				onChange={(value) =>
					handleInputChange("category", value as string)
				}
				direction="horizontal"
				label="categoria"
				value={item.category}
				options={categories.map((c) => ({
					label: c.name,
					value: c.id,
				}))}
			/>

			{/* Almost all data */}
			<View style={styles.statsGrid}>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("stock", text)}
					keyboardType="numeric"
					direction="vertical"
					label="estoque"
					value={item.stock}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("minStock", text)}
					keyboardType="numeric"
					direction="vertical"
					label="estoque mínimo"
					value={item.minStock}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("averageCost", text)}
					keyboardType="numeric"
					direction="vertical"
					label="custo médio"
					value={item.averageCost}
				/>
				<StatBox
					isEditing={false}
					onChange={(text) => handleInputChange("averageCost", text)}
					direction="vertical"
					label="valor total"
					value={item.averageCost * item.stock}
					valueColor={"#4caf50"}
					unit="R$"
					prefix="R$ "
				/>
			</View>

			{/* Description */}
			<StatBox
				isEditing={isEditing}
				onChange={(text) => handleInputChange("description", text)}
				direction="horizontal"
				label="descrição"
				value={item.description}
			/>

			{/* Notes */}
			<StatBox
				isEditing={isEditing}
				onChange={(text) => handleInputChange("notes", text)}
				direction="horizontal"
				label="Observações"
				value={item.notes || ""}
			/>

			{/* Status and Date Information */}
			<View
				style={{
					flexDirection: "row",
					gap: 10,
					marginTop: 15,
					justifyContent: "space-between",
				}}
			>
				{/* Status */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "flex-start",
						alignSelf: "center",
						flex: 1,
					}}
				>
					<StatusBox
						isEditing={isEditing}
						value={item.status}
						onChange={(text) => handleInputChange("status", text)}
						options={[
							{ label: "Em Estoque", value: "Em Estoque" },
							{ label: "Baixo Estoque", value: "Baixo Estoque" },
							{ label: "Fora de Estoque", value: "Fora de Estoque" },
						]}
					/>
				</View>

				{/* Date Information */}
				<View style={{ alignSelf: "center", flexDirection: "column", gap: 5 }}>
					<Text style={styles.dateText}>
						Criado em: {formatDisplayDate(item.created_at)}
					</Text>
					<Text style={styles.dateText}>
						Atualizado em: {formatDisplayDate(item.updated_at)}
					</Text>
				</View>
			</View>
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
	dateInfo: {
		marginTop: 20,
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: "#d8dee4",
		alignItems: "center",
	},
	dateText: {
		...text.subtitle,
		color: "#57606a",
		fontSize: 12,
	},
});
