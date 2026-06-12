import {
	Modal,
	View,
	Text,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import * as styles from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";
import { Machine } from "@/assets/types/Machine";
import { ServiceLog } from "@/assets/types/ServiceLog";
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
	const [technicians, setTechnicians] = useState<{id: string, name: string}[]>([]);
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
	]

	const fetchLogs = async () => {
		if (!machine) return;
		setLoading(true);
		try {
			const fetchedLogs = await machineService.getServiceLogs(machine.id);
			setLogs(
				fetchedLogs.sort(
					(a, b) =>
						new Date(b.created_at).getTime() -
						new Date(a.created_at).getTime(),
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
					if (user.position == 'Técnico' || user.position == 'Admin') {
						fetchTechnicians.push({
							id: user.id,
							name: user.name,
						});
					}
				}
				setTechnicians(fetchTechnicians);
			} catch (error: any) {
	
				if (error.message == 'Not Found') {
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
		}

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
				observation: newLog.observation,
				technicianId: newLog.technicianId,
				serviceType: newLog.serviceType,
				daysSinceLastService: Number(newLog.daysSinceLastService) || 0,
				mlConsumed: newLog.mlConsumed
					? Number(newLog.mlConsumed)
					: undefined,
			};

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

	const handleInputChange = (field: keyof ServiceLog, value: any) => {
		setNewLog((prev) => ({ ...prev, [field]: value }));
	};

	const renderLogItem = ({ item }: { item: ServiceLog }) => (
		<View style={styles.logItem.container}>
			<View style={{ flex: 1 }}>
				<Text style={styles.logItem.description}>
					{item.observation}
				</Text>
				<View style={{ flexDirection: "row", gap: 15, marginTop: 8 }}>
					<Text style={styles.logItem.meta}>
						Tipo:{" "}
						<Text style={{ fontWeight: "bold" }}>
							{item.serviceType}
						</Text>
					</Text>
					{item.mlConsumed && (
						<Text style={styles.logItem.meta}>
							Consumo:{" "}
							<Text style={{ fontWeight: "bold" }}>
								{item.mlConsumed}ml
							</Text>
						</Text>
					)}
				</View>
			</View>
			<View style={styles.logItem.footer}>
				<Text style={styles.logItem.meta}>
					Técnico ID: {item.technicianId.substring(0, 8)}...
				</Text>
				<Text style={styles.logItem.meta}>
					{formatDisplayDate(item.created_at)}
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
			<View style={styles.modalPage.centeredView}>
				<View style={styles.modalPage.modalView}>
					{/* Header */}
					<View style={styles.modalPage.header}>
						<Text style={styles.modalPage.title}>
							Logs - {machine?.name}
						</Text>
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
								color={styles.colors.primary}
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
						<Text
							style={[
								styles.modalPage.title,
								{ textAlign: "center" },
							]}
						>
							Adicionar Novo Log
						</Text>

						{/* Form */}
						<View style={[styles.modalPage.statsGrid]}>
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
								isNumeric
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
								isNumeric
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
