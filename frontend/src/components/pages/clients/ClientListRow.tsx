import { View, Text, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as styles from "@/assets/styles/stylesheets";

import { Client } from "@/assets/types/Client";
import { userService } from "@/services/userService";
import { useEffect, useState } from "react";

interface Props {
	item: Client;
	openItemDetail: () => void;
	openExtraModal: () => void;
}

export function ClientListRow({
	item,
	openItemDetail,
	openExtraModal,
}:Props) {
	// if (Platform.OS === "web") {
	// 	return webList(client, openItemDetail);
	// }
	// return mobileList(client, openItemDetail);

	return webList(item, openItemDetail, openExtraModal);
}

function webList(
	client: Client,
	openItemDetail: () => void,
	openExtraModal: () => void,
) {
	const { getUserById } = userService;
	const [sellerName, setSellerName] = useState("");

	const fetchUser = async () => {
		setSellerName("Placeholder");

		// try {
		// 	const user = await getUserById(client.sellerId);
		// 	setSellerName(user.name);
		// } catch (error) {
		// 	Toast.show({
		// 		type: "error",
		// 		text1: "Erro ao buscar vendedor",
		// 		text2: "Não foi possível obter o nome do vendedor.",
		// 	});
		// 	setSellerName("N/A");
		// }
	};

	useEffect(() => {
		if (!client) return;
		fetchUser();
	}, [client, getUserById]);

	if (!client) {
		return null;
	}

	return (
		<View style={styles.page.row}>
			{/* Column 1: Name */}
			<View style={{ width: "2%" }} />

			<View style={styles.page.columns}>
				<Text style={styles.text.rowText}>{client.fantasyName}</Text>
			</View>

			{/* Column 2: Segment */}
			<View
				style={[
					styles.page.columns,
					{
						flexDirection: "row",
						gap: 4,
						justifyContent: "center",
					},
				]}
			>
				<Ionicons
					name={chooseSegmentIcon(client.segment)}
					size={18}
					color={chooseSegmentColor(client.segment)}
				/>
				<Text
					style={[
						styles.text.rowText,
						{
							fontWeight: "bold",
							fontSize: 14,
							textAlign: "left",
							color: chooseSegmentColor(client.segment),
						},
					]}
				>
					{client.segment}
				</Text>
			</View>

			{/* Column 3: Lead */}
			<View
				style={[
					styles.page.columns,
					{
						flexDirection: "row",
						gap: 4,
						justifyContent: "center",
					},
				]}
			>
				<Ionicons
					name={chooseLeadIcon(client.lead)}
					size={18}
					color={styles.text.rowText.color}
				/>
				<Text
					style={[
						styles.text.rowText,
						{
							fontWeight: "bold",
							fontSize: 14,
							textAlign: "left",
						},
					]}
				>
					{client.lead}
				</Text>
			</View>

			{/* Column 4: Seller */}
			<View style={styles.page.columns}>
				<Text style={[styles.text.rowText, { textAlign: "left" }]}>
					{sellerName}
				</Text>
			</View>

			{/* Column 5: Status */}
			<View style={styles.page.columns}>
				<Text
					style={[
						styles.text.rowText,
						{
							color: chooseStatusColor(client.status),
						},
					]}
				>
					{client.status}
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

				<Ionicons
					name="map-outline"
					size={24}
					color="#fff"
					onPress={openExtraModal}
				/>
			</View>
		</View>
	);
}

// function mobileList(client: Client, openItemDetail: () => void) {
// 	return (
// 		<View style={[styles.list.row, { alignItems: "flex-start" }]}>
// 			{/* Left Side: Name, Category and Supplier */}
// 			<View style={{ flex: 1, gap: 8, alignItems: "flex-start" }}>
// 				{/* Name */}
// 				<Text style={styles.list.rowText}>{client.name}</Text>

// 				{/* Category */}
// 				<View
// 					style={{
// 						flexDirection: "row",
// 						alignItems: "center",
// 						gap: 5,
// 					}}
// 				>
// 					<Ionicons
// 						name={chooseSegmentIcon(client.segment)}
// 						size={16}
// 						color={chooseSegmentColor(client.segment)}
// 					/>
// 					<Text
// 						style={[
// 							styles.list.rowText,
// 							{
// 								color: chooseSegmentColor(client.segment),
// 							},
// 						]}
// 					>
// 						{client.segment}
// 					</Text>
// 				</View>

// 				{/* Supplier */}
// 				<Text style={{ color: "#ccc", fontSize: 12 }}>
// 					{client.supplier}
// 				</Text>
// 			</View>

// 			{/* Right Side: Stock, Status and Action */}
// 			<View style={{ alignItems: "flex-end", gap: 8 }}>
// 				{/* Stock */}
// 				<View style={{ alignItems: "flex-end" }}>
// 					<Text style={[styles.list.rowText, { fontSize: 16 }]}>
// 						{formatNumber(client.stock)}
// 						<Text style={{ fontSize: 12 }}>
// 							{client.category === "Fragrância" ? " ml" : " un"}
// 						</Text>
// 					</Text>

// 					<Text style={{ color: "#9e9e9e", fontSize: 12 }}>
// 						Mín: {formatNumber(client.minStock)}
// 					</Text>
// 				</View>

// 				{/* Status */}
// 				<Text
// 					style={{
// 						color: chooseStatusColor(client.status),
// 						fontWeight: "bold",
// 					}}
// 				>
// 					{client.status}
// 				</Text>

// 				{/* Action */}
// 				<Ionicons
// 					name="eye"
// 					size={24}
// 					color="#fff"
// 					onPress={openItemDetail}
// 				/>
// 			</View>
// 		</View>
// 	);
// }

function chooseSegmentIcon(category: string) {
	switch (category) {
		case "Retail":
			return "file-tray";
		case "Hospitality":
			return "bed";
		case "Healthcare":
			return "medkit";
		case "Gastronomy":
			return "wine";
		case "Other":
			return "apps-sharp";
		default:
			return "help";
	}
}

function chooseSegmentColor(segment: string) {
	switch (segment) {
		case "Retail":
			return "#2196f3";
		case "Hospitality":
			return "#e91e63";
		case "Healthcare":
			return "#ff5722";
		case "Gastronomy":
			return "#5d5d5d";
		case "Other":
			return "#d8a31e";
		default:
			return "#bbbbbb";
	}
}

function chooseLeadIcon(category: string) {
	switch (category) {
		case "Instagram":
			return "logo-instagram";
		case "Google-Ads":
			return "logo-google";
		case "Indication":
			return "logo-facebook";
		case "Other":
			return "reorder-four-sharp";
		default:
			return "help";
	}
}

function chooseStatusColor(status: string) {
	switch (status) {
		case "Ativo":
			return "#4caf50";
		case "Em Análise":
			return "#ff9800";
		case "Inativo":
			return "#f44336";
		default:
			return "#9e9e9e";
	}
}
