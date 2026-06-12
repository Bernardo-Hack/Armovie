import { Modal, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import * as styles from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";
import { Plan } from "@/assets/types/Plan";
import { planService } from "@/services/planService";
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
			const fetchedPlans = await planService.getAllPlans();
			setPlans(
				fetchedPlans.sort(
					(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
				),
			);
		} catch (error: any) {
			if (error.message.includes("404") || error.message.includes("Not Found")) {
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

			await planService.createPlan(planToCreate);
			Toast.show({ type: "success", text1: "Plano salvo com sucesso!" });

			setNewPlan({ name: "", price: "" });
			fetchPlans();
			if (onPlansUpdated) onPlansUpdated();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao criar plano", text2: error.message });
		}
	};

	const handleDeletePlan = async (id: string) => {
		try {
			await planService.deletePlan(id);
			Toast.show({ type: "success", text1: "Plano excluído!" });
			fetchPlans();
			if (onPlansUpdated) onPlansUpdated();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao excluir plano", text2: error.message });
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setNewPlan((prev) => ({ ...prev, [field]: value }));
	};

	const renderPlanItem = ({ item }: { item: Plan }) => (
		<View style={[styles.logItem.container, { flexDirection: "row", alignItems: "center" }]}>
			<View style={{ flex: 1 }}>
				<Text style={styles.logItem.description}>{item.name}</Text>
				<Text style={styles.logItem.meta}>
					Preço: <Text style={{ fontWeight: "bold", color: "#4caf50" }}>R$ {Number(item.price).toFixed(2)}</Text>
				</Text>
			</View>
			<TouchableOpacity onPress={() => handleDeletePlan(item.id)} style={{ padding: 10 }}>
				<Ionicons name="trash" size={20} color="#f44336" />
			</TouchableOpacity>
		</View>
	);

	return (
		<Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
			<View style={styles.modalPage.centeredView}>
				<View style={styles.modalPage.modalView}>
					{/* Header */}
					<View style={styles.modalPage.header}>
						<Text style={styles.modalPage.title}>Gerenciar Planos</Text>
						<View style={{ flex: 1 }} />
						<Ionicons name="close" size={24} color="#555" onPress={onClose} />
					</View>

					{/* Lista de Planos */}
					<View style={{ flex: 1, width: "100%", paddingHorizontal: 5, paddingVertical: 10 }}>
						{loading ? (
							<ActivityIndicator size="large" color={styles.colors.primary} />
						) : (
							<FlatList
								data={plans}
								renderItem={renderPlanItem}
								keyExtractor={(item) => item.id}
								ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum plano cadastrado.</Text>}
							/>
						)}
					</View>

					{/* Formulário para Adicionar Novo Plano */}
					<View style={{ width: "100%", marginTop: 10 }}>
						<Text style={[styles.modalPage.title, { textAlign: "center" }]}>Adicionar Novo Plano</Text>

						<View style={[styles.modalPage.statsGrid]}>
							<StatBox
								isEditing={true}
								onChange={(text) => handleInputChange("name", text)}
								direction="vertical"
								label="Nome do Plano"
								value={newPlan.name}
							/>
							<StatBox isEditing={true} onChange={(text) => handleInputChange("price", text)} direction="vertical" label="Preço" isNumeric prefix="R$ " value={newPlan.price} />
						</View>

						<Button color="#4caf50" label="Salvar Plano" iconName="add-circle" iconSize={20} onPress={handleSavePlan} />
					</View>
				</View>
			</View>
		</Modal>
	);
}
