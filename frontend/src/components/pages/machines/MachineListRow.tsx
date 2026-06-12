import { View, Text, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as styles from "@/assets/styles/stylesheets";

import { Machine } from "@/assets/types/Machine";
import { itemService } from "@/services/itemService";
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
	return webList(item, openItemDetail, openExtraModal);
}

function webList(
	machine: Machine,
	openItemDetail: () => void,
	openServiceModal: () => void,
) {
	const { getItemById } = itemService;
	const [fragrance, setFragrance] = useState("");

	const fetchFagrance = async () => {
		if (!machine.fragranceId) {
			setFragrance("N/A");
			return;
		}

		try {
			const item = await getItemById(machine.fragranceId);
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
	}, [machine, getItemById]);

	if (!machine) {
		return null;
	}

	return (
		<View style={styles.page.row}>
			<View style={{ width: "2%" }} />

			{/* Name */}
			<View style={styles.page.columns}>
				<Text style={styles.text.rowText}>{machine.name}</Text>
			</View>

			{/* Model */}
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
					name={chooseModelIcon(machine.model)}
					size={18}
					color={chooseModelColor(machine.model)}
				/>
				<Text
					style={[
						styles.text.rowText,
						{
							fontWeight: "bold",
							fontSize: 14,
							textAlign: "left",
							color: chooseModelColor(machine.model),
						},
					]}
				>
					{machine.model}
				</Text>
			</View>

			{/* Fragrance */}
			<View style={styles.page.columns}>
				<Text
					style={[
						styles.text.rowText,
						{
							fontWeight: "condensedBold",
							fontSize: 14,
						},
					]}
				>
					{fragrance}
				</Text>
			</View>

			{/* isPaid */}
			<View style={styles.page.columns}>
				<Ionicons
					name={machine.isPaid ? "cash" : "close"}
					size={32}
					color={machine.isPaid ? "#4caf50" : "#f44336"}
				/>
			</View>

			{/* Status */}
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
					name={chooseStatusIcon(machine.status)}
					size={20}
					color={chooseStatusColor(machine.status)}
				/>
				<Text
					style={[
						styles.text.rowText,
						{
							color: chooseStatusColor(machine.status),
						},
					]}
				>
					{machine.status}
				</Text>
			</View>

			{/* Action */}
			<View
				style={[
					styles.page.columns,
					{
						flexDirection: "row",
						gap: 20,
						justifyContent: "center",
					},
				]}
			>
				<Ionicons
					name="list-outline"
					size={24}
					color="#fff"
					onPress={openItemDetail}
				/>
				<Ionicons
					name="albums-outline"
					size={24}
					color="#fff"
					onPress={openServiceModal}
				/>
			</View>
		</View>
	);
}

function mobileList(Machine: Machine, openItemDetail: () => void) {
	
}

function chooseModelIcon(model: string): keyof typeof Ionicons.glyphMap {
	// This can be expanded with more specific models
	return "construct-outline";
}

function chooseModelColor(model: string) {
	// This can be expanded with more specific models
	return "#a0a0a0";
}

function chooseStatusIcon(
	status: string,
): keyof typeof Ionicons.glyphMap {
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
