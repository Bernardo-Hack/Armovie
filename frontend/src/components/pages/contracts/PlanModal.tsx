import {
	Modal,
	View,
	Text,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import { colors, text } from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";
import { Plan } from "@/assets/types/ms-client/Contract";
import { contractService } from "@/services/contractService";
import { StatBox } from "@/components/common/Statbox";

interface Props {
	visible: boolean;
	onClose: () => void;
	onPlansUpdated?: () => void;
}

export function PlanModal({ visible, onClose, onPlansUpdated }: Props) {
	const [plans, setPlans] = useState<Plan[]>([]);
	const [loading, setLoading] = useState(true);
	const [newPlan, setNewPlan] = useState({
		name: "",
		price: "",
	});

	const fetchPlans = async () => {
		setLoading(true);
		try {
			const fetchedPlans = await contractService.getAllPlans();
			setPlans(
				fetchedPlans.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime(),
				),
			);
		} catch (error: any) {
			if (
				error.message.includes("404") ||
				error.message.includes("Not Found")
			) {
				setPlans([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao buscar planos",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (visible) {
			fetchPlans();
		}
	}, [visible]);

	const handleSavePlan = async () => {
		try {
			if (!newPlan.name || !newPlan.price) {
				Toast.show({
					type: "error",
					text1: "Dados incompletos",
					text2: "Preencha o nome e o preço do plano.",
				});
				return;
			}

			const planToCreate = {
				name: newPlan.name,
				price: Number(newPlan.price),
			};

			await contractService.createPlan(planToCreate);
			Toast.show({ type: "success", text1: "Plano salvo com sucesso!" });

			setNewPlan({ name: "", price: "" });
			fetchPlans();
			if (onPlansUpdated) onPlansUpdated();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao criar plano",
				text2: error.message,
			});
		}
	};

	const handleDeletePlan = async (id: string) => {
		try {
			await contractService.deletePlan(id);
			Toast.show({ type: "success", text1: "Plano excluído!" });
			fetchPlans();
			if (onPlansUpdated) onPlansUpdated();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao excluir plano",
				text2: error.message,
			});
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setNewPlan((prev) => ({ ...prev, [field]: value }));
	};

	const renderPlanItem = ({ item }: { item: Plan }) => (
		<View
			style={[
				styles.container,
				{ flexDirection: "row", alignItems: "center" },
			]}
		>
			<View style={{ flex: 1 }}>
				<Text style={styles.description}>{item.name}</Text>
				<Text style={styles.meta}>
					Preço:{" "}
					<Text style={{ fontWeight: "bold", color: "#4caf50" }}>
						R$ {Number(item.price).toFixed(2)}
					</Text>
				</Text>
			</View>
			<TouchableOpacity
				onPress={() => handleDeletePlan(item.id)}
				style={{ padding: 10 }}
			>
				<Ionicons name="trash" size={20} color="#f44336" />
			</TouchableOpacity>
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
						<Text style={styles.title}>Gerenciar Planos</Text>
						<View style={{ flex: 1 }} />
						<Ionicons
							name="close"
							size={24}
							color="#555"
							onPress={onClose}
						/>
					</View>

					{/* Lista de Planos */}
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
								data={plans}
								renderItem={renderPlanItem}
								keyExtractor={(item) => item.id}
								ListEmptyComponent={
									<Text
										style={{
											textAlign: "center",
											marginTop: 20,
										}}
									>
										Nenhum plano cadastrado.
									</Text>
								}
							/>
						)}
					</View>

					{/* Formulário para Adicionar Novo Plano */}
					<View style={{ width: "100%", marginTop: 10 }}>
						<Text style={[styles.title, { textAlign: "center" }]}>
							Adicionar Novo Plano
						</Text>

						<View style={[styles.statsGrid]}>
							<StatBox
								isEditing={true}
								onChange={(text) =>
									handleInputChange("name", text)
								}
								direction="vertical"
								label="Nome do Plano"
								value={newPlan.name}
							/>
							<StatBox
								isEditing={true}
								onChange={(text) =>
									handleInputChange("price", text)
								}
								direction="vertical"
								label="Preço"
								keyboardType="numeric"
								prefix="R$ "
								value={newPlan.price}
							/>
						</View>

						<Button
							color="#4caf50"
							label="Salvar Plano"
							iconName="add-circle"
							iconSize={20}
							onPress={handleSavePlan}
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
});
