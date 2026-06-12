import { View, Text, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as styles from "@/assets/styles/stylesheets";
import { Item } from "@/assets/types/Item";

export function ItemListRow({
	item,
	openItemDetail,
}: {
	item: Item;
	openItemDetail: () => void;
}) {
	if (Platform.OS === "web") {
		return webList(item, openItemDetail);
	}
	return mobileList(item, openItemDetail);
}

function webList(item: Item, openItemDetail: () => void) {
	return (
		<View style={styles.page.row}>
			{/* Column 1: Name */}
			<View style={{ width: "2%" }}/>
			
			<View style={styles.page.columns}>
				<Text style={styles.text.rowText}>{item.name}</Text>
			</View>

			{/* Column 2: Category */}
			<View
				style={[
					styles.page.columns,
					{
						flexDirection: "row",
						gap: 4,
						justifyContent: "flex-start",
					},
				]}
			>
				<Ionicons
					name={chooseCategoryIcon(item.category)}
					size={20}
					color={chooseCategoryColor(item.category)}
				/>
				<Text
					style={[
						styles.text.rowText,
						{
							fontWeight: "bold",
							fontSize: 14,
							textAlign: "left",
							color: chooseCategoryColor(item.category),
						},
					]}
				>
					{item.category}
				</Text>
			</View>

			{/* Column 3: Supplier */}
			<View style={styles.page.columns}>
				<Text style={[styles.text.rowText, { textAlign: "left" }]}>
					{item.supplier}
				</Text>
			</View>

			{/* Column 4: Stock */}
			<View style={styles.page.columns}>
				<View style={{ alignItems: "center" }}>
					<Text style={[styles.text.rowText]}>
						{/* Formats the number */}
						{formatNumber(item.stock)}
					</Text>
					<Text
						style={[
							styles.text.rowText,
							{ fontSize: 12, fontWeight: "ultralight" },
						]}
					>
						{/* Adds the unit */}
						{item.category === "Fragrância" ? " ml" : " Unidades"}
					</Text>
					<Text
						style={{
							color: "#9e9e9e",
							fontSize: 12,
						}}
					>
						{/* Minimum Stock */}
						Mín: {formatNumber(item.minStock)}
					</Text>
				</View>
			</View>

			{/* Column 5: Status */}
			<View style={styles.page.columns}>
				<Text
					style={[
						styles.text.rowText,
						{
							color: chooseStatusColor(item.status),
						},
					]}
				>
					{item.status}
				</Text>
			</View>

			{/* Column 6: Action */}
			<View style={styles.page.columns}>
				<Ionicons
					name="eye"
					size={20}
					color="#fff"
					onPress={openItemDetail}
				/>
			</View>
		</View>
	);
}

function mobileList(item: Item, openItemDetail: () => void) {
	return (
		<View style={[styles.page.row, { alignItems: "flex-start" }]}>
			{/* Left Side: Name, Category and Supplier */}
			<View style={{ flex: 1, gap: 8, alignItems: "flex-start" }}>
				{/* Name */}
				<Text style={styles.text.rowText}>
					{item.name}
				</Text>

				{/* Category */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						gap: 5,
					}}
				>
					<Ionicons
						name={chooseCategoryIcon(item.category)}
						size={16}
						color={chooseCategoryColor(item.category)}
					/>
					<Text
						style={[
							styles.text.rowText, 
							{ 
								color: chooseCategoryColor(item.category),
							}
						]}
					>
						{item.category}
					</Text>
				</View>

				{/* Supplier */}
				<Text style={{ color: "#ccc", fontSize: 12 }}>
					{item.supplier}
				</Text>
			</View>

			{/* Right Side: Stock, Status and Action */}
			<View style={{ alignItems: "flex-end", gap: 8 }}>
				{/* Stock */}
				<View style={{ alignItems: "flex-end" }}>
					
					<Text style={[styles.text.rowText, { fontSize: 16 }]}>
						{formatNumber(item.stock)}
						<Text style={{ fontSize: 12 }}>
							{item.category === "Fragrância" ? " ml" : " un"}
						</Text>
					</Text>

					<Text style={{ color: "#9e9e9e", fontSize: 12 }}>
						Mín: {formatNumber(item.minStock)}
					</Text>
				</View>

				{/* Status */}
				<Text
					style={{
						color: chooseStatusColor(item.status),
						fontWeight: "bold",
					}}
				>
					{item.status}
				</Text>

				{/* Action */}
				<Ionicons
					name="eye"
					size={24}
					color="#fff"
					onPress={openItemDetail}
				/>
			</View>
		</View>
	);
}

function chooseCategoryIcon(category: string) {
	switch (category) {
		case "Equipamento":
			return "tv";
		case "Fragrância":
			return "shirt";
		case "Insumo":
			return "fast-food";
		case "Peça de Reposição":
			return "hammer";
		case "Máquina":
			return "construct";
		default:
			return "help";
	}
}

function chooseCategoryColor(category: string) {
	switch (category) {
		case "Equipamento":
			return "#2196f3";
		case "Fragrância":
			return "#e91e63";
		case "Insumo":
			return "#ff5722";
		case "Peça de Reposição":
			return "#5d5d5d";
		case "Máquina":
			return "#d8a31e";
		default:
			return "#bbbbbb";
	}
}

function formatNumber(num: number) {
	return new Intl.NumberFormat("pt-BR").format(num);
}

function chooseStatusColor(status: string) {
	switch (status) {
		case "Em Estoque":
			return "#4caf50";
		case "Baixo Estoque":
			return "#ff9800";
		case "Fora de Estoque":
			return "#f44336";
		default:
			return "#9e9e9e";
	}
}
