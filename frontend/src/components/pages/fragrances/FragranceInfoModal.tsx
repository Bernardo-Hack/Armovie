import {
	View,
	Text,
	StyleSheet,
	Modal,
	ScrollView,
	Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
	colors,
	text as globalText,
	page as defaultPageStyles,
} from "@/assets/styles/stylesheets";
import { Fragrance, ConsumptionLog } from "@/assets/types/ms-item/Fragrance";
import { fragranceService, FragranceData } from "@/services/fragranceService";
import { StatBox } from "@/components/common/Statbox";
import Button from "@/components/common/Button";
import { formatDisplayDate } from "@/utils/utils";

interface Props {
	fragrance: Fragrance | null;
	visible: boolean;
	onClose: () => void;
	onSave: (id: string, data: Partial<FragranceData>) => Promise<void>;
}

export function FragranceInfoModal({
	fragrance,
	visible,
	onClose,
	onSave,
}: Props) {
	const [activeTab, setActiveTab] = useState<"info" | "history">("info");
	const [isEditing, setIsEditing] = useState(false);
	const [editData, setEditData] = useState<Fragrance | null>(null);

	const [history, setHistory] = useState<ConsumptionLog[]>([]);
	const [loadingHistory, setLoadingHistory] = useState(false);

	const [monthFilter, setMonthFilter] = useState<string>("");

	useEffect(() => {
		if (fragrance) {
			setEditData({ ...fragrance });
			setIsEditing(false);
			setActiveTab("info");
			fetchHistory(fragrance.id);
		}
	}, [fragrance, visible]);

	const fetchHistory = async (id: string) => {
		setLoadingHistory(true);
		try {
			// This method should exist on fragranceService
			const logs =
				await fragranceService.getConsumptionLogsByFragranceId(id);
			setHistory(logs);
		} catch (error) {
			console.error("Error fetching history", error);
		} finally {
			setLoadingHistory(false);
		}
	};

	const handleSave = async () => {
		if (editData && fragrance) {
			await onSave(fragrance.id, editData);
			setIsEditing(false);
		}
	};

	const handleInputChange = (field: keyof Fragrance, value: any) => {
		if (editData) {
			setEditData({ ...editData, [field]: value });
		}
	};

	if (!fragrance || !editData) return null;

	const filteredHistory = history.filter((log) => {
		if (!monthFilter) return true;
		const logDate = new Date(log.createdAt);
		const filterDate = new Date(monthFilter);
		return (
			logDate.getMonth() === filterDate.getMonth() &&
			logDate.getFullYear() === filterDate.getFullYear()
		);
	});

	const uniqueMonths = Array.from(
		new Set(
			history.map((log) => {
				const d = new Date(log.createdAt);
				return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01T00:00:00.000Z`;
			}),
		),
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
					<View style={styles.header}>
						<Text style={globalText.title}>
							{fragrance.name.toUpperCase()}
						</Text>
						<Ionicons
							name="close"
							size={24}
							color="#555"
							onPress={onClose}
						/>
					</View>

					<View style={styles.tabsContainer}>
						<Button
							label="Dados da Fragrância"
							isActive={activeTab === "info"}
							onPress={() => setActiveTab("info")}
							iconName="information-circle-outline"
							iconSize={16}
						/>
						<Button
							label="Histórico de Consumo"
							isActive={activeTab === "history"}
							onPress={() => setActiveTab("history")}
							iconName="time-outline"
							iconSize={16}
						/>
					</View>

					<ScrollView contentContainerStyle={styles.scrollContent}>
						{activeTab === "info" && (
							<View style={{ gap: 10, marginTop: 10 }}>
								{!isEditing ? (
									<>
										<View style={styles.infoGrid}>
											<StatRow
												label="Família Olfativa"
												value={fragrance.family}
											/>
											<StatRow
												label="Estoque Atual"
												value={`${fragrance.stock} ml`}
											/>
											<StatRow
												label="Estoque Mínimo"
												value={`${fragrance.minStock} ml`}
											/>
											<StatRow
												label="Custo Unitário"
												value={`R$ ${fragrance.unitCost.toFixed(2)}`}
											/>
											<StatRow
												label="ID Fornecedor"
												value={
													fragrance.supplierId ||
													"N/A"
												}
											/>
										</View>

										<View style={{ marginTop: 20 }}>
											<Text style={styles.infoLabel}>
												Descrição
											</Text>
											<Text style={styles.infoValue}>
												{fragrance.description ||
													"Nenhuma descrição."}
											</Text>
										</View>

										<View
											style={{
												marginTop: 30,
												alignSelf: "flex-start",
											}}
										>
											<Button
												label="Editar Fragrância"
												iconName="pencil"
												iconSize={20}
												onPress={() =>
													setIsEditing(true)
												}
											/>
										</View>
									</>
								) : (
									<View style={{ gap: 8, width: "100%" }}>
										<StatBox
											isEditing
											direction="horizontal"
											label="Nome"
											value={editData.name}
											onChange={(v) =>
												handleInputChange("name", v)
											}
										/>
										<StatBox
											isEditing
											type="select"
											direction="horizontal"
											label="Família"
											value={editData.family}
											onChange={(v) =>
												handleInputChange("family", v)
											}
											options={[
												"Frutal",
												"Amadeirada",
												"Herbal",
												"Cítrica",
												"Floral",
												"Aquática",
												"Oriental",
												"Gourmand",
											].map((f) => ({
												label: f,
												value: f,
											}))}
										/>
										<StatBox
											isEditing
											direction="horizontal"
											label="Descrição"
											value={editData.description}
											onChange={(v) =>
												handleInputChange(
													"description",
													v,
												)
											}
											isMultiline
										/>
										<StatBox
											isEditing
											direction="horizontal"
											label="Estoque Mínimo (ml)"
											value={String(editData.minStock)}
											keyboardType="numeric"
											onChange={(v) =>
												handleInputChange(
													"minStock",
													Number(v),
												)
											}
										/>
										<StatBox
											isEditing
											direction="horizontal"
											label="Custo unitário (R$)"
											value={String(editData.unitCost)}
											keyboardType="numeric"
											onChange={(v) =>
												handleInputChange(
													"unitCost",
													Number(v),
												)
											}
										/>
										<StatBox
											isEditing
											direction="horizontal"
											label="ID Fornecedor"
											value={editData.supplierId}
											onChange={(v) =>
												handleInputChange(
													"supplierId",
													v,
												)
											}
										/>

										<View
											style={{
												flexDirection: "row",
												gap: 10,
												marginTop: 20,
											}}
										>
											<Button
												label="Cancelar"
												onPress={() => {
													setIsEditing(false);
													setEditData({
														...fragrance,
													});
												}}
												color="#f44336"
												iconName="close"
												iconSize={20}
											/>
											<Button
												label="Salvar Alterações"
												onPress={handleSave}
												color="#4caf50"
												iconName="save-outline"
												iconSize={20}
											/>
										</View>
									</View>
								)}
							</View>
						)}

						{activeTab === "history" && (
							<View style={{ marginTop: 10 }}>
								<View
									style={{ marginBottom: 20, width: "50%" }}
								>
									<StatBox
										label="Filtrar por Mês"
										isEditing
										type="select"
										value={monthFilter}
										onChange={(v) => setMonthFilter(String(v))}
										options={[
											{
												label: "Todos os Meses",
												value: "",
											},
											...uniqueMonths.map((d) => {
												const date = new Date(d);
												return {
													label: `${date.getMonth() + 1}/${date.getFullYear()}`,
													value: d,
												};
											}),
										]}
									/>
								</View>

								{loadingHistory ? (
									<Text style={globalText.rowText}>
										Carregando histórico...
									</Text>
								) : filteredHistory.length === 0 ? (
									<Text style={globalText.rowText}>
										Nenhum registro encontrado para o
										período selecionado.
									</Text>
								) : (
									<View style={{ gap: 10 }}>
										<View style={defaultPageStyles.row}>
											<Text
												style={[
													globalText.headerText,
													{ flex: 2 },
												]}
											>
												DATA DO REGISTRO
											</Text>
											<Text
												style={[
													globalText.headerText,
													{ flex: 1 },
												]}
											>
												VARIAÇÃO (ML)
											</Text>
										</View>
										{filteredHistory.map((log) => {
											const isAddition =
												log.mlConsumed < 0;
											// Note: If mlConsumed > 0, it's a consumption. If you need to represent refill, it could be a different structure or negative value depending on backend logic.
											return (
												<View
													key={log.id}
													style={[
														defaultPageStyles.row,
														{
															paddingVertical: 12,
															backgroundColor:
																colors.overlayBackground,
															borderRadius: 8,
															paddingHorizontal: 15,
														},
													]}
												>
													<Text
														style={[
															globalText.rowText,
															{ flex: 2 },
														]}
													>
														{formatDisplayDate(
															log.createdAt,
														)}
													</Text>
													<Text
														style={[
															globalText.rowText,
															{
																flex: 1,
																color: isAddition
																	? "#4caf50"
																	: "#f44336",
																fontWeight:
																	"bold",
															},
														]}
													>
														{isAddition ? "+" : "-"}
														{Math.abs(
															log.mlConsumed,
														)}{" "}
														ml
													</Text>
												</View>
											);
										})}
									</View>
								)}
							</View>
						)}
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}

function StatRow({ label, value }: { label: string; value: string }) {
	return (
		<View style={styles.statRow}>
			<Text style={styles.infoLabel}>{label}</Text>
			<Text style={styles.infoValue}>{value}</Text>
		</View>
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
		width: "65%",
		maxHeight: "85%",
		backgroundColor: colors.background,
		borderRadius: 15,
		padding: 24,
		boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
	} as any,
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	tabsContainer: {
		flexDirection: "row",
		gap: 10,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
		paddingBottom: 15,
		marginBottom: 10,
	},
	scrollContent: {
		paddingVertical: 10,
	},
	infoGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 20,
	},
	statRow: {
		width: "45%",
		marginBottom: 15,
	},
	infoLabel: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
		marginBottom: 4,
	},
	infoValue: {
		fontFamily: "Futura",
		fontSize: 15,
		color: colors.textPrimary,
		fontWeight: "bold",
	},
});
