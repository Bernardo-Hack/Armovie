import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, page, text } from "@/assets/styles/stylesheets";
import { Contract } from "@/assets/types/Contract";
import { clientService } from "@/services/clientService";
import { planService } from "@/services/planService";
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
	const [planName, setPlanName] = useState("Carregando...");

	const fetchClient = async () => {
		try {
			const c = await clientService.getClientById(contract.clientId);
			setClientName(c.fantasyName || c.fullName);
		} catch (error) {
			setClientName("N/A");
		}
	};

	const fetchPlan = async () => {
		try {
			const p = await planService.getPlanById(contract.planId);
			setPlanName(p.name)
		} catch (error) {
			setPlanName("N/A");
		}
	};

	useEffect(() => {
		fetchClient();
		fetchPlan();
	}, [contract.clientId]);

	if (!contract) {
		return null;
	}

	return (
		<View style={page.row}>
			{/* Column 1: Spacer */}
			<View style={{ width: "2%" }} />

			{/* Column 2: Client Name */}
			<View style={page.columns}>
				<Text style={text.rowText}>
					{clientName}
				</Text>
			</View>

			{/* Column 3: Type */}
			<View style={page.columns}>
				<Text style={text.rowText}>{contract.type}</Text>
			</View>

			{/* Column 4: Plan */}
			<View style={page.columns}>
				<Text style={text.rowText}>{planName}</Text>
			</View>

			{/* Column 5: Machines */}
			<View style={page.columns}>
				<Text style={text.rowText}>{contract.machines}</Text>
			</View>

			{/* Column 6: Status */}
			<View style={page.columns}>
				<Text
					style={[
						text.rowText,
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
			<View style={page.columns}>
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
