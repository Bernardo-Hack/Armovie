import { View, Text, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, page, text } from "@/assets/styles/stylesheets";

import { Client } from "@/assets/types/Client";
import { userService } from "@/services/userService";
import { useEffect, useState } from "react";

interface Props {
	item: Client;
	openItemDetail: () => void;
	openExtraModal: () => void;
}

export function ClientListRow({ item, openItemDetail, openExtraModal }: Props) {
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

	const fetchSeller = async () => {
		try{
			const seller = await getUserById(client.sellerId);
			setSellerName(seller.name);
		} catch (error: any) {
			setSellerName("Placeholder");
		}
	};

	useEffect(() => {
		if (!client) return;
		fetchSeller();
	}, [client, getUserById]);

	if (!client) {
		return null;
	}

	return (
		<View style={page.row}>
			{/* Column 1: Name */}
			<View style={{ width: "2%" }} />

			<View style={page.columns}>
				<Text style={text.rowText}>{client.fantasyName}</Text>
			</View>

			{/* Column 2: Segment */}
			<View
				style={[
					page.columns,
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
						text.rowText,
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
					page.columns,
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
					color={text.rowText.color}
				/>
				<Text
					style={[
						text.rowText,
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
			<View style={page.columns}>
				<Text style={[text.rowText, { textAlign: "left" }]}>
					{sellerName}
				</Text>
			</View>

			{/* Column 5: Status */}
			<View style={page.columns}>
				<Text
					style={[
						text.rowText,
						{
							color: chooseStatusColor(client.status),
						},
					]}
				>
					{client.status}
				</Text>
			</View>

			{/* Column 6: Action */}
			<View
				style={[
					page.columns,
					{
						flexDirection: "row",
						justifyContent: "center",
						gap: 15,
					},
				]}
			>
				<Ionicons
					name="eye"
					size={20}
					color={colors.textPrimary}
					onPress={openItemDetail}
				/>

				<Ionicons
					name="map-outline"
					size={24}
					color={colors.textPrimary}
					onPress={openExtraModal}
				/>
			</View>
		</View>
	);
}

// function mobileList(client: Client, openItemDetail: () => void) {
// 	return ();
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
			return colors.textSecondary;
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
			return colors.textSecondary;
	}
}
