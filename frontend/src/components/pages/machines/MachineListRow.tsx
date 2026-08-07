import { View, Text, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, page, text } from "@/assets/styles/stylesheets";

import { Machine } from "@/assets/types/ms-item/Machine";
import { fragranceService } from "@/services/fragranceService";
import { useEffect, useState } from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";

interface Props {
	item: Machine;
	openItemDetail: () => void;
	openExtraModal: () => void;
}

export function MachineListRow({
	item,
	openItemDetail,
	openExtraModal,
}: Props) {
	return <WebList machine={item} openItemDetail={openItemDetail} openServiceModal={openExtraModal} />;
}

function WebList({
	machine,
	openItemDetail,
	openServiceModal,
}: {
	machine: Machine;
	openItemDetail: () => void;
	openServiceModal: () => void;
}) {
	const { getFragranceById } = fragranceService;
	const [fragrance, setFragrance] = useState("");

	const fetchFagrance = async () => {
		if (!machine.fragranceId) {
			setFragrance("N/A");
			return;
		}

		try {
			const item = await getFragranceById(machine.fragranceId);
			setFragrance(item.name);
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Erro ao buscar fragrância",
				text2: "Não foi possível obter o nome da fragrância.",
			});
			setFragrance("N/A");
		}
	};

	useEffect(() => {
		fetchFagrance();
	}, [machine, getFragranceById]);

	if (!machine) {
		return null;
	}

	return (
		<View style={page.row}>
			<View style={{ width: "2%" }} />

			{/* Name */}
			<View style={page.columns}>
				<Text style={text.rowText}>{machine.name}</Text>
			</View>

			{/* Model */}
			<View style={[page.columns]}>
				<Text style={text.rowText}>{machine.model}</Text>
			</View>

			{/* Fragrance */}
			<View style={page.columns}>
				<Text style={[text.rowText]}>{fragrance}</Text>
			</View>

			{/* Median Consumption */}
			<View style={page.columns}>
				<Text style={[text.rowText]}>
					{machine.medianConsumption?.toLocaleString("pt-BR", {
						minimumFractionDigits: 0,
						maximumFractionDigits: 2,
					})}
					{"ml/mês"}
				</Text>
			</View>

			{/* isPaid */}
			<View style={page.columns}>
				<Ionicons
					name={
						machine.amountPaid >= machine.price ? "cash" : "close"
					}
					size={24}
					color={
						machine.amountPaid >= machine.price
							? "#4caf50"
							: "#f44336"
					}
				/>
			</View>

			{/* Status */}
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
					name={chooseStatusIcon(machine.status || "")}
					size={20}
					color={chooseStatusColor(machine.status || "")}
				/>
				<Text
					style={[
						text.rowText,
						{
							color: chooseStatusColor(machine.status || ""),
						},
					]}
				>
					{machine.status}
				</Text>
			</View>

			{/* Action */}
			<View style={page.columns}>
				<Ionicons
					name="eye"
					size={24}
					color={colors.textPrimary}
					onPress={openItemDetail}
				/>
			</View>
		</View>
	);
}

function mobileList(Machine: Machine, openItemDetail: () => void) {}

function chooseModelIcon(model: string): keyof typeof Ionicons.glyphMap {
	// This can be expanded with more specific models
	return "construct-outline";
}

function chooseModelColor(model: string) {
	// This can be expanded with more specific models
	return "#a0a0a0";
}

function chooseStatusIcon(status: string): keyof typeof Ionicons.glyphMap {
	switch (status) {
		case "Disponível":
			return "checkmark";
		case "Contratada":
			return "checkmark-done";
		case "Em Manutenção":
			return "hammer";
		case "Defeituosa":
			return "trash-bin";
		default:
			return "help";
	}
}

function chooseStatusColor(status: string) {
	switch (status) {
		case "Disponível":
			return "#4caf50";
		case "Contratada":
			return "#00aaff";
		case "Em Manutenção":
			return "#ff9800";
		case "Defeituosa":
			return "#f44336";
		default:
			return "#808080";
	}
}
