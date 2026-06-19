import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, page, text } from "@/assets/styles/stylesheets";

import { Person } from "@/assets/types/ms-client/Person";
import { clientService } from "@/services/clientService";
import { useEffect, useState } from "react";

interface Props {
	item: Person;
	openItemDetail: () => void;
	openExtraModal: () => void;
}

export function PersonListRow({ item, openItemDetail, openExtraModal }: Props) {
	return webList(item, openItemDetail, openExtraModal);
}

function webList(
	person: Person,
	openItemDetail: () => void,
	openExtraModal: () => void,
) {
	const { getClientById } = clientService;
	const [clientName, setClientName] = useState("");

	const fetchClient = async () => {
		if (!person.clientId) return;
		try {
			const client = await getClientById(person.clientId);
			setClientName(client.fantasyName || client.fullName);
		} catch (error: any) {
			setClientName("Desconhecido");
		}
	};

	useEffect(() => {
		if (!person) return;
		fetchClient();
	}, [person, getClientById]);

	if (!person) {
		return null;
	}

	return (
		<View style={page.row}>
			{/* Column 1: Name */}
			<View style={{ width: "2%" }} />

			<View style={page.columns}>
				<Text style={text.rowText}>{person.fullName}</Text>
			</View>

			{/* Column 2: Client */}
			<View style={page.columns}>
				<Text style={text.rowText}>{clientName}</Text>
			</View>

			{/* Column 3: Assina? */}
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
					name={person.doesSign ? "checkmark-circle" : "close-circle"}
					size={18}
					color={person.doesSign ? "#4caf50" : colors.textSecondary}
				/>
				<Text
					style={[
						text.rowText,
						{
							fontWeight: "bold",
							fontSize: 14,
							color: person.doesSign
								? "#4caf50"
								: colors.textSecondary,
						},
					]}
				>
					{person.doesSign ? "Sim" : "Não"}
				</Text>
			</View>

			{/* Column 4: Representante? */}
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
					name={person.doesRepresent ? "star" : "star-outline"}
					size={18}
					color={getRepColor(person.doesRepresent)}
				/>
				<Text
					style={[
						text.rowText,
						{
							fontWeight: "bold",
							fontSize: 14,
							color: getRepColor(person.doesRepresent),
						},
					]}
				>
					{person.doesRepresent ? "Sim" : "Não"}
				</Text>
			</View>

			{/* Column 5: Nationality */}
			<View style={page.columns}>
				<Text style={text.rowText}>{person.nationality}</Text>
			</View>

			{/* Column 6: Action */}
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

function getRepColor(doesRepresent: boolean) {
	return doesRepresent ? "#ffce3b" : colors.textSecondary;
}
