import { View, Text, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, page, text } from "@/assets/styles/stylesheets";

import { Client } from "@/assets/types/ms-client/Client";
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

	return <WebList client={item} openItemDetail={openItemDetail} />;
}

function WebList({ client, openItemDetail }: { client: Client; openItemDetail: () => void }) {
	const { getUserById } = userService;
	const [sellerName, setSellerName] = useState("");

	const fetchSeller = async () => {
		try {
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

			{/* Column 2: Ramo de Atividade */}
			<View style={page.columns}>
				<Text style={text.rowText}>
					{client.fieldOfActivity || "—"}
				</Text>
			</View>

			{/* Column 3: Telefone */}
			<View style={page.columns}>
				<Text style={text.rowText}>{client.phone}</Text>
			</View>

			{/* Column 4: Seller */}
			<View style={page.columns}>
				<Text style={text.rowText}>{sellerName}</Text>
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
			</View>
		</View>
	);
}

// function mobileList(client: Client, openItemDetail: () => void) {
// 	return ();
// }



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
