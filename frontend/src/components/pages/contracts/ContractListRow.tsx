import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as styles from "@/assets/styles/stylesheets";
import { Contract } from "@/assets/types/Contract";
import { clientService } from "@/services/clientService";
import { useEffect, useState } from "react";

export function ContractListRow({
	item,
	openItemDetail,
}: {
	item: Contract;
	openItemDetail: () => void;
}) {
	return webList(item, openItemDetail);
}

function webList(contract: Contract, openItemDetail: () => void) {
	const [clientName, setClientName] = useState("Carregando...");

	useEffect(() => {
		const fetchClient = async () => {
			if (!contract.clientId) {
				setClientName("N/A");
				return;
			}
			try {
				const c = await clientService.getClientById(contract.clientId);
				setClientName(c.fantasyName || c.fullName);
			} catch (error) {
				setClientName("N/A");
			}
		};
		fetchClient();
	}, [contract.clientId]);

	if (!contract) {
		return null;
	}

	return (
		<View style={styles.page.row}>
			{/* Column 1: Spacer */}
			<View style={{ width: "2%" }} />

			{/* Column 2: Contract Name */}
			<View style={styles.page.columns}>
				<Text style={styles.text.rowText}>{contract.name}</Text>
			</View>

			{/* Column 3: Client Name */}
			<View style={styles.page.columns}>
				<Text style={[styles.text.rowText, { textAlign: "left" }]}>
					{clientName}
				</Text>
			</View>

			{/* Column 4: Type */}
			<View style={styles.page.columns}>
				<Text style={styles.text.rowText}>{contract.type}</Text>
			</View>

			{/* Column 5: Machines */}
			<View style={styles.page.columns}>
				<Text style={styles.text.rowText}>{contract.machines}</Text>
			</View>

			{/* Column 6: Status */}
			<View style={styles.page.columns}>
				<Text
					style={[
						styles.text.rowText,
						{
							color: chooseStatusColor(contract.status),
							fontWeight: "bold",
						},
					]}
				>
					{contract.status}
				</Text>
			</View>

			{/* Column 7: Action */}
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
