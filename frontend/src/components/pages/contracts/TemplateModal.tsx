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
import { StatBox } from "@/components/common/Statbox";
import { templateService } from "@/services/templateService";

// Tipagem baseada no schema.prisma
export interface Template {
	id: string;
	name: string;
	description?: string;
	content: string;
	created_at: string;
	updated_at: string;
}

interface Props {
	visible: boolean;
	onClose: () => void;
	onTemplatesUpdated?: () => void;
}

export function TemplateModal({ visible, onClose, onTemplatesUpdated }: Props) {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [loading, setLoading] = useState(true);
	const [newTemplate, setNewTemplate] = useState({
		name: "",
		description: "",
		content: "",
	});

	const fetchTemplates = async () => {
		setLoading(true);
		try {
			const fetchedTemplates = await templateService.getAllTemplates();
			setTemplates(
				fetchedTemplates.sort(
					(a: Template, b: Template) =>
						new Date(b.created_at).getTime() -
						new Date(a.created_at).getTime(),
				),
			);
		} catch (error: any) {
			if ( error.message === "Not Found" || error.message?.includes("404") ) {
				setTemplates([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao buscar templates",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (visible) {
			fetchTemplates();
		}
	}, [visible]);

	const handleSaveTemplate = async () => {
		try {
			if (!newTemplate.name || !newTemplate.content) {
				Toast.show({
					type: "error",
					text1: "Dados incompletos",
					text2: "Preencha o nome e o conteúdo do template.",
				});
				return;
			}

			const templateToCreate = {
				name: newTemplate.name,
				description: newTemplate.description || undefined,
				content: newTemplate.content,
			};

			await templateService.createTemplate(templateToCreate);
			Toast.show({ type: "success", text1: "Template salvo com sucesso!" });

			setNewTemplate({ name: "", description: "", content: "" });
			fetchTemplates();
			if (onTemplatesUpdated) onTemplatesUpdated();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao criar template",
				text2: error.message,
			});
		}
	};

	const handleDeleteTemplate = async (id: string) => {
		try {
			await templateService.deleteTemplate(id);
			Toast.show({ type: "success", text1: "Template excluído!" });
			fetchTemplates();
			if (onTemplatesUpdated) onTemplatesUpdated();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao excluir template",
				text2: error.message,
			});
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setNewTemplate((prev) => ({ ...prev, [field]: value }));
	};

	const renderTemplateItem = ({ item }: { item: Template }) => (
		<View
			style={[
				styles.container,
				{ flexDirection: "row", alignItems: "center" },
			]}
		>
			<View style={{ flex: 1 }}>
				<Text style={styles.description}>{item.name}</Text>
				{item.description && (
					<Text style={styles.meta} numberOfLines={1}>
						{item.description}
					</Text>
				)}
			</View>
			<TouchableOpacity
				onPress={() => handleDeleteTemplate(item.id)}
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
						<Text style={styles.title}>Gerenciar Templates</Text>
						<View style={{ flex: 1 }} />
						<Ionicons name="close" size={24} color="#555" onPress={onClose} />
					</View>

					{/* Lista de Templates */}
					<View style={{ flex: 1, width: "100%", paddingHorizontal: 5, paddingVertical: 10 }}>
						{loading ? (
							<ActivityIndicator size="large" color={colors.primary} />
						) : (
							<FlatList
								data={templates}
								renderItem={renderTemplateItem}
								keyExtractor={(item) => item.id}
								ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum template cadastrado.</Text>}
							/>
						)}
					</View>

					{/* Formulário para Adicionar Novo Template */}
					<View style={{ width: "100%", marginTop: 10 }}>
						<Text style={[styles.title, { textAlign: "center" }]}>
							Adicionar Novo Template
						</Text>

						<View style={[styles.statsGrid]}>
							<StatBox
								isEditing={true}
								onChange={(text) => handleInputChange("name", text)}
								direction="vertical"
								label="Nome do Template"
								value={newTemplate.name}
							/>
							<StatBox
								isEditing={true}
								onChange={(text) => handleInputChange("description", text)}
								direction="vertical"
								label="Descrição"
								value={newTemplate.description}
							/>
							<StatBox
								isEditing={true}
								onChange={(text) => handleInputChange("content", text)}
								direction="vertical"
								isMultiline={true}
								label="Conteúdo"
								value={newTemplate.content}
							/>
						</View>

						<Button color="#4caf50" label="Salvar Template" iconName="add-circle" iconSize={20} onPress={handleSaveTemplate} />
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.4)" },
	modalView: { maxWidth: "75%", backgroundColor: colors.background, borderRadius: 15, padding: 20, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)", elevation: 5 },
	container: { padding: 15, backgroundColor: colors.overlayBackground, borderRadius: 8, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.textSecondary, flexDirection: "column", gap: 10 },
	description: { ...text.rowText, textAlign: "left", fontWeight: "normal" },
	meta: { ...text.subtitle, fontSize: 12 },
	header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
	title: { ...text.title, fontSize: 28 },
	statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 20, marginBottom: 20 },
});
