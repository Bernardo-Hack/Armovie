import {
	Modal,
	View,
	Text,
	FlatList,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import { colors, text } from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";
import { Machine } from "@/assets/types/ms-item/Machine";
import { ServiceLog } from "@/assets/types/ms-item/Machine";
import { machineService } from "@/services/machineService";
import { userService } from "@/services/userService";
import { StatBox } from "@/components/common/Statbox";
import { formatDisplayDate } from "@/utils/utils";

interface Props {
	machine: Machine | null;
	visible: boolean;
	onClose: () => void;
}

export function MachineServicesModal({ machine, visible, onClose }: Props) {
	const [logs, setLogs] = useState<ServiceLog[]>([]);
	const [technicians, setTechnicians] = useState<
		{ id: string; name: string }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [newLog, setNewLog] = useState({
		// State to hold new log data
		observation: "",
		technicianId: "",
		serviceType: "Limpeza",
		daysSinceLastService: 0,
		mlConsumed: "",
	});

	const serviceTypes: { id: string; name: string }[] = [
		{
			id: "Limpeza",
			name: "Limpeza",
		},
		{
			id: "Lavagem",
			name: "Lavagem",
		},
		{
			id: "Manutenção",
			name: "Manutenção",
		},
		{
			id: "Outros",
			name: "Outros",
		},
	];

	const fetchLogs = async () => {
		if (!machine) return;
		setLoading(true);
		try {
			const fetchedLogs = await machineService.getServiceLogs(machine.id);
			setLogs(
				fetchedLogs.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime(),
				),
			);
		} catch (error: any) {
			// Um 404 significa apenas que não há logs, o que é normal.
			if (
				error.message.includes("404") ||
				error.message.includes("Not Found")
			) {
				setLogs([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao buscar logs de serviço",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const fetchTecnicians = async () => {
		try {
			let fetchTechnicians: { id: string; name: string }[] = [];
			fetchTechnicians.push({ id: "", name: "N/A" });
			const usersData = await userService.getAllUsers();

			for (const user of usersData) {
				if (user.position == "Técnico" || user.position == "Admin") {
					fetchTechnicians.push({
						id: user.id,
						name: user.name,
					});
				}
			}
			setTechnicians(fetchTechnicians);
		} catch (error: any) {
			if (error.message == "Not Found") {
				Toast.show({
					type: "info",
					text1: "Nenhum técnico encontrado!",
				});
				return;
			}

			Toast.show({
				type: "error",
				text1: "Erro ao carregar contratos",
				text2:
					error.message ||
					"Não foi possível buscar os contratos. Tente novamente.",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (visible) {
			fetchLogs();
			fetchTecnicians();
		}
	}, [visible, machine]);

	const handleSaveLog = async () => {
		if (
			!machine ||
			!newLog.observation ||
			!newLog.technicianId ||
			!newLog.serviceType
		) {
			Toast.show({
				type: "error",
				text1: "Campos obrigatórios",
				text2: "Preencha observação, ID do técnico e tipo de serviço.",
			});
			return;
		}

		try {
			const payload = {
				description: newLog.observation,
				technicianId: newLog.technicianId,
				serviceId: newLog.serviceType,
				machinePayment: 0,
			} as any;

			await machineService.createServiceLog(machine.id, payload);

			Toast.show({ type: "success", text1: "Log de serviço salvo!" });

			// Reset form
			setNewLog({
				observation: "",
				technicianId: "",
				serviceType: "Limpeza",
				daysSinceLastService: 0,
				mlConsumed: "",
			});
			fetchLogs(); // Atualiza a lista
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao salvar log",
				text2: error.message,
			});
		}
	};

	const handleInputChange = (field: keyof typeof newLog, value: any) => {
		setNewLog((prev) => ({ ...prev, [field]: value }));
	};

	const renderLogItem = ({ item }: { item: ServiceLog }) => (
		<View style={styles.container}>
			<View style={{ flex: 1 }}>
				<Text style={styles.description}>{item.description}</Text>
				<View style={{ flexDirection: "row", gap: 15, marginTop: 8 }}>
					<Text style={styles.meta}>
						Tipo:{" "}
						<Text style={{ fontWeight: "bold" }}>
							{item.serviceId}
						</Text>
					</Text>
					{item.mlAfter && (
						<Text style={styles.meta}>
							ML Após:{" "}
							<Text style={{ fontWeight: "bold" }}>
								{item.mlAfter}ml
							</Text>
						</Text>
					)}
				</View>
			</View>
			<View style={styles.footer}>
				<Text style={styles.meta}>
					Técnico ID: {item.technicianId.substring(0, 8)}...
				</Text>
				<Text style={styles.meta}>
					{formatDisplayDate(item.createdAt)}
				</Text>
			</View>
		</View>
	);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					{/* Header */}
					<View style={styles.header}>
						<Text style={styles.title}>Logs - {machine?.name}</Text>
						<View style={{ flex: 1 }} />
						<Ionicons
							name="close"
							size={24}
							color="#555"
							onPress={onClose}
						/>
					</View>

					{/* Lista de Logs */}
					<View
						style={{
							flex: 1,
							width: "100%",
							paddingHorizontal: 5,
							paddingVertical: 10,
						}}
					>
						{loading ? (
							<ActivityIndicator
								size="large"
								color={colors.primary}
							/>
						) : (
							<FlatList
								data={logs}
								renderItem={renderLogItem}
								keyExtractor={(item) => item.id}
								ListEmptyComponent={
									<Text
										style={{
											textAlign: "center",
											marginTop: 20,
										}}
									>
										Nenhum log de serviço encontrado.
									</Text>
								}
							/>
						)}
					</View>

					{/* Formulário para Adicionar Novo Log */}
					<View>
						{/* Title */}
						<Text style={[styles.title, { textAlign: "center" }]}>
							Adicionar Novo Log
						</Text>

						{/* Form */}
						<View style={[styles.statsGrid]}>
							{/* Technician */}
							<StatBox
								type="select"
								isEditing={true}
								onChange={(text) =>
									handleInputChange("technicianId", text)
								}
								direction="horizontal"
								label="Técnico"
								value={newLog.technicianId}
								options={technicians.map((t) => ({
									label: t.name,
									value: t.id,
								}))}
							/>

							{/* Service Type */}
							<StatBox
								type="select"
								isEditing={true}
								onChange={(text) =>
									handleInputChange("serviceType", text)
								}
								direction="vertical"
								label="Tipo de Serviço"
								value={newLog.serviceType}
								options={serviceTypes.map((c) => ({
									label: c.name,
									value: c.id,
								}))}
							/>

							{/* Days since last service */}
							<StatBox
								isEditing={true}
								onChange={(text) =>
									handleInputChange(
										"daysSinceLastService",
										text,
									)
								}
								direction="vertical"
								label="Último serviço a"
								keyboardType="numeric"
								value={newLog.daysSinceLastService}
							/>

							{/* Ml Consumed */}
							<StatBox
								isEditing={true}
								onChange={(text) =>
									handleInputChange("mlConsumed", text)
								}
								direction="vertical"
								label="ML Consumidos"
								keyboardType="numeric"
								value={newLog.mlConsumed}
							/>

							{/* Observations */}
							<StatBox
								isEditing={true}
								onChange={(text) =>
									handleInputChange("observation", text)
								}
								direction="vertical"
								isMultiline
								label="Observações"
								value={newLog.observation}
							/>
						</View>

						{/* Save Button */}
						<Button
							color="#4caf50"
							label="Salvar Serviço"
							iconName="checkbox"
							iconSize={20}
							onPress={handleSaveLog}
						/>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.4)",
	},
	modalView: {
		maxWidth: "75%",
		backgroundColor: colors.background,
		borderRadius: 15,
		padding: 20,
		boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
		elevation: 5,
	},
	container: {
		padding: 15,
		backgroundColor: colors.overlayBackground,
		borderRadius: 8,
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: colors.textSecondary,
		flexDirection: "column",
		gap: 10,
	},
	description: {
		...text.rowText,
		textAlign: "left",
		fontWeight: "normal",
	},
	meta: {
		...text.subtitle,
		fontSize: 12,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
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
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
		alignItems: "flex-end",
	},
});
