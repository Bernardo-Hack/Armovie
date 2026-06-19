import {
	Modal,
	View,
	Text,
	ScrollView,
	StyleSheet,
	Pressable,
} from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
	colors,
	text,
	page as defaultPageStyles,
} from "@/assets/styles/stylesheets";
import { GenericList } from "@/components/common/GenericList";
import { GenericCreateModal } from "@/components/common/GenericCreateModal";
import { StatBox } from "@/components/common/Statbox";
import Button from "@/components/common/Button";

import { machineService } from "@/services/machineService";
import { planService } from "@/services/planService";
import { templateService } from "@/services/templateService";

// --- TimingGrade Components ---
const TimingGradeManager = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const res = await machineService.getAllTimingGrades();
			setData(res);
		} catch (error: any) {
			if (
				error.message?.includes("404") ||
				error.message?.includes("Not Found")
			) {
				setData([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View style={innerStyles.headerRow}>
				<Text style={[text.title, { flex: 1, fontSize: 20 }]}>
					Grades de Tempo
				</Text>
				<Button
					label="Nova Grade"
					iconName="add"
					iconSize={16}
					onPress={() => setIsCreateModalVisible(true)}
				/>
			</View>
			<GenericList
				loading={loading}
				items={data}
				itemTypeName="grade de tempo"
				onSaveItem={async (item) => {
					await machineService.updateTimingGrade(item.id, {
						name: item.name,
						interval: Number(item.interval),
					});
					fetchAllData();
				}}
				onDeleteItem={async (id) => {
					await machineService.deleteTimingGrade(id);
					fetchAllData();
				}}
				HeaderComponent={() => (
					<View style={defaultPageStyles.row}>
						<Text style={[text.headerText, { flex: 2, textAlign: "left", paddingLeft: 15 }]}>NOME</Text>
						<Text style={[text.headerText, { flex: 1, textAlign: "left" }]}>INTERVALO (MIN)</Text>
					</View>
				)}
				RowComponent={({ item, openItemDetail }: any) => (
					<Pressable onPress={openItemDetail} style={defaultPageStyles.row}>
						<Text style={[text.rowText, { flex: 2, textAlign: "left", paddingLeft: 15 }]}>{item.name}</Text>
						<Text style={[text.rowText, { flex: 1, textAlign: "left" }]}>{item.interval}</Text>
					</Pressable>
				)}
				editModalRenderContent={(
					item: any,
					isEditing,
					handleInputChange,
				) => (
					<View style={{ gap: 10 }}>
						<StatBox
							label="Nome"
							value={item.name}
							isEditing={isEditing}
							onChange={(v) => handleInputChange("name", v)}
						/>
						<StatBox
							label="Intervalo (min)"
							value={String(item.interval)}
							isEditing={isEditing}
							keyboardType="numeric"
							onChange={(v) => handleInputChange("interval", v)}
						/>
					</View>
				)}
			/>
			<GenericCreateModal
				initialState={{ name: "", interval: "" }}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={async (item) => {
					await machineService.createTimingGrade({
						name: item.name,
						interval: Number(item.interval),
					});
					fetchAllData();
					setIsCreateModalVisible(false);
				}}
				renderContent={(item, handleInputChange) => (
					<View style={{ gap: 10 }}>
						<StatBox
							label="Nome"
							value={item.name}
							isEditing={true}
							onChange={(v) => handleInputChange("name", v)}
						/>
						<StatBox
							label="Intervalo (min)"
							value={item.interval}
							isEditing={true}
							keyboardType="numeric"
							onChange={(v) => handleInputChange("interval", v)}
						/>
					</View>
				)}
			/>
		</View>
	);
};

// --- ServiceType Components ---
const ServiceTypeManager = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const res = await machineService.getAllServiceTypes();
			setData(res);
		} catch (error: any) {
			if (
				error.message?.includes("404") ||
				error.message?.includes("Not Found")
			) {
				setData([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View style={innerStyles.headerRow}>
				<Text style={[text.title, { flex: 1, fontSize: 20 }]}>
					Tipos de Serviço
				</Text>
				<Button
					label="Novo Tipo"
					iconName="add"
					iconSize={16}
					onPress={() => setIsCreateModalVisible(true)}
				/>
			</View>
			<GenericList
				loading={loading}
				items={data}
				itemTypeName="tipo de serviço"
				onSaveItem={async (item) => {
					await machineService.updateServiceType(item.id, {
						name: item.name,
						description: item.description,
					});
					fetchAllData();
				}}
				onDeleteItem={async (id) => {
					await machineService.deleteServiceType(id);
					fetchAllData();
				}}
				HeaderComponent={() => (
					<View style={defaultPageStyles.row}>
						<Text style={[text.headerText, { flex: 1, textAlign: "left", paddingLeft: 15 }]}>NOME</Text>
						<Text style={[text.headerText, { flex: 2, textAlign: "left" }]}>DESCRIÇÃO</Text>
					</View>
				)}
				RowComponent={({ item, openItemDetail }: any) => (
					<Pressable onPress={openItemDetail} style={defaultPageStyles.row}>
						<Text style={[text.rowText, { flex: 1, textAlign: "left", paddingLeft: 15 }]}>{item.name}</Text>
						<Text style={[text.rowText, { flex: 2, textAlign: "left" }]}>{item.description}</Text>
					</Pressable>
				)}
				editModalRenderContent={(
					item: any,
					isEditing,
					handleInputChange,
				) => (
					<View style={{ gap: 10 }}>
						<StatBox
							label="Nome"
							value={item.name}
							isEditing={isEditing}
							onChange={(v) => handleInputChange("name", v)}
						/>
						<StatBox
							label="Descrição"
							value={item.description}
							isEditing={isEditing}
							isMultiline
							onChange={(v) =>
								handleInputChange("description", v)
							}
						/>
					</View>
				)}
			/>
			<GenericCreateModal
				initialState={{ name: "", description: "" }}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={async (item) => {
					await machineService.createServiceType({
						name: item.name,
						description: item.description,
					});
					fetchAllData();
					setIsCreateModalVisible(false);
				}}
				renderContent={(item, handleInputChange) => (
					<View style={{ gap: 10 }}>
						<StatBox
							label="Nome"
							value={item.name}
							isEditing={true}
							onChange={(v) => handleInputChange("name", v)}
						/>
						<StatBox
							label="Descrição"
							value={item.description}
							isEditing={true}
							isMultiline
							onChange={(v) =>
								handleInputChange("description", v)
							}
						/>
					</View>
				)}
			/>
		</View>
	);
};

// --- MlSteps Components ---
const MlStepsManager = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const res = await machineService.getAllMlSteps();
			setData(res);
		} catch (error: any) {
			if (
				error.message?.includes("404") ||
				error.message?.includes("Not Found")
			) {
				setData([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View style={innerStyles.headerRow}>
				<Text style={[text.title, { flex: 1, fontSize: 20 }]}>
					Passos de ML
				</Text>
				<Button
					label="Novo Passo"
					iconName="add"
					iconSize={16}
					onPress={() => setIsCreateModalVisible(true)}
				/>
			</View>
			<GenericList
				loading={loading}
				items={data}
				itemTypeName="passo de ML"
				onSaveItem={async (item) => {
					await machineService.updateMlSteps(item.id, {
						quantity: Number(item.quantity),
					});
					fetchAllData();
				}}
				onDeleteItem={async (id) => {
					await machineService.deleteMlSteps(id);
					fetchAllData();
				}}
				HeaderComponent={() => (
					<View style={defaultPageStyles.row}>
						<Text style={[text.headerText, { flex: 1, textAlign: "left", paddingLeft: 15 }]}>QUANTIDADE (ML)</Text>
					</View>
				)}
				RowComponent={({ item, openItemDetail }: any) => (
					<Pressable onPress={openItemDetail} style={defaultPageStyles.row}>
						<Text style={[text.rowText, { flex: 1, textAlign: "left", paddingLeft: 15 }]}>{item.quantity}</Text>
					</Pressable>
				)}
				editModalRenderContent={(
					item: any,
					isEditing,
					handleInputChange,
				) => (
					<View style={{ gap: 10 }}>
						<StatBox
							label="Quantidade (ml)"
							value={String(item.quantity)}
							isEditing={isEditing}
							keyboardType="numeric"
							onChange={(v) => handleInputChange("quantity", v)}
						/>
					</View>
				)}
			/>
			<GenericCreateModal
				initialState={{ quantity: "" }}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={async (item) => {
					await machineService.createMlSteps({
						quantity: Number(item.quantity),
					});
					fetchAllData();
					setIsCreateModalVisible(false);
				}}
				renderContent={(item, handleInputChange) => (
					<View style={{ gap: 10 }}>
						<StatBox
							label="Quantidade (ml)"
							value={item.quantity}
							isEditing={true}
							keyboardType="numeric"
							onChange={(v) => handleInputChange("quantity", v)}
						/>
					</View>
				)}
			/>
		</View>
	);
};

// --- Plans Components ---
const PlansManager = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const res = await planService.getAllPlans();
			setData(res);
		} catch (error: any) {
			if (
				error.message?.includes("404") ||
				error.message?.includes("Not Found")
			) {
				setData([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View style={innerStyles.headerRow}>
				<Text style={[text.title, { flex: 1, fontSize: 20 }]}>
					Planos
				</Text>
				<Button
					label="Novo Plano"
					iconName="add"
					iconSize={16}
					onPress={() => setIsCreateModalVisible(true)}
				/>
			</View>
			<GenericList
				loading={loading}
				items={data}
				itemTypeName="plano"
				onSaveItem={async (item) => {
					await planService.updatePlan(item.id, {
						name: item.name,
						price: Number(item.price),
					});
					fetchAllData();
				}}
				onDeleteItem={async (id) => {
					await planService.deletePlan(id);
					fetchAllData();
				}}
				HeaderComponent={() => (
					<View style={defaultPageStyles.row}>
						<Text style={[text.headerText, { flex: 2, textAlign: "left", paddingLeft: 15 }]}>NOME</Text>
						<Text style={[text.headerText, { flex: 1, textAlign: "left" }]}>PREÇO (R$)</Text>
					</View>
				)}
				RowComponent={({ item, openItemDetail }: any) => (
					<Pressable onPress={openItemDetail} style={defaultPageStyles.row}>
						<Text style={[text.rowText, { flex: 2, textAlign: "left", paddingLeft: 15 }]}>{item.name}</Text>
						<Text style={[text.rowText, { flex: 1, textAlign: "left" }]}>R$ {Number(item.price).toFixed(2)}</Text>
					</Pressable>
				)}
				editModalRenderContent={(
					item: any,
					isEditing,
					handleInputChange,
				) => (
					<View style={{ gap: 10 }}>
						<StatBox
							label="Nome"
							value={item.name}
							isEditing={isEditing}
							onChange={(v) => handleInputChange("name", v)}
						/>
						<StatBox
							label="Preço (R$)"
							value={String(item.price)}
							isEditing={isEditing}
							keyboardType="numeric"
							onChange={(v) => handleInputChange("price", v)}
						/>
					</View>
				)}
			/>
			<GenericCreateModal
				initialState={{ name: "", price: "" }}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={async (item) => {
					await planService.createPlan({
						name: item.name,
						price: Number(item.price),
					});
					fetchAllData();
					setIsCreateModalVisible(false);
				}}
				renderContent={(item, handleInputChange) => (
					<View style={{ gap: 10 }}>
						<StatBox
							label="Nome"
							value={item.name}
							isEditing={true}
							onChange={(v) => handleInputChange("name", v)}
						/>
						<StatBox
							label="Preço (R$)"
							value={item.price}
							isEditing={true}
							keyboardType="numeric"
							onChange={(v) => handleInputChange("price", v)}
						/>
					</View>
				)}
			/>
		</View>
	);
};

// --- Templates Components ---
const TemplatesManager = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const res = await templateService.getAllTemplates();
			setData(res);
		} catch (error: any) {
			if (
				error.message?.includes("404") ||
				error.message?.includes("Not Found")
			) {
				setData([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View style={innerStyles.headerRow}>
				<Text style={[text.title, { flex: 1, fontSize: 20 }]}>
					Templates de Contrato
				</Text>
				<Button
					label="Novo Template"
					iconName="add"
					iconSize={16}
					onPress={() => setIsCreateModalVisible(true)}
				/>
			</View>
			<GenericList
				loading={loading}
				items={data}
				itemTypeName="template"
				onSaveItem={async (item) => {
					await templateService.updateTemplate(item.id, {
						name: item.name,
						description: item.description,
						content: item.content,
					});
					fetchAllData();
				}}
				onDeleteItem={async (id) => {
					await templateService.deleteTemplate(id);
					fetchAllData();
				}}
				HeaderComponent={() => (
					<View style={defaultPageStyles.row}>
						<Text style={[text.headerText, { flex: 1, textAlign: "left", paddingLeft: 15 }]}>NOME</Text>
						<Text style={[text.headerText, { flex: 2, textAlign: "left" }]}>DESCRIÇÃO</Text>
					</View>
				)}
				RowComponent={({ item, openItemDetail }: any) => (
					<Pressable onPress={openItemDetail} style={defaultPageStyles.row}>
						<Text style={[text.rowText, { flex: 1, textAlign: "left", paddingLeft: 15 }]}>{item.name}</Text>
						<Text style={[text.rowText, { flex: 2, textAlign: "left" }]}>{item.description}</Text>
					</Pressable>
				)}
				editModalRenderContent={(
					item: any,
					isEditing,
					handleInputChange,
				) => (
					<View style={{ gap: 10 }}>
						<StatBox
							label="Nome"
							value={item.name}
							isEditing={isEditing}
							onChange={(v) => handleInputChange("name", v)}
						/>
						<StatBox
							label="Descrição"
							value={item.description || ""}
							isEditing={isEditing}
							isMultiline
							onChange={(v) =>
								handleInputChange("description", v)
							}
						/>
						<StatBox
							label="Conteúdo HTML/Texto"
							value={item.content}
							isEditing={isEditing}
							isMultiline
							onChange={(v) => handleInputChange("content", v)}
						/>
					</View>
				)}
			/>
			<GenericCreateModal
				initialState={{ name: "", description: "", content: "" }}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={async (item) => {
					await templateService.createTemplate({
						name: item.name,
						description: item.description,
						content: item.content,
					});
					fetchAllData();
					setIsCreateModalVisible(false);
				}}
				renderContent={(item, handleInputChange) => (
					<View style={{ gap: 10 }}>
						<StatBox
							label="Nome"
							value={item.name}
							isEditing={true}
							onChange={(v) => handleInputChange("name", v)}
						/>
						<StatBox
							label="Descrição"
							value={item.description}
							isEditing={true}
							isMultiline
							onChange={(v) =>
								handleInputChange("description", v)
							}
						/>
						<StatBox
							label="Conteúdo HTML/Texto"
							value={item.content}
							isEditing={true}
							isMultiline
							onChange={(v) => handleInputChange("content", v)}
						/>
					</View>
				)}
			/>
		</View>
	);
};

// --- Modal Definition ---
type Tab = "timegrades" | "servicetypes" | "mlsteps" | "plans" | "templates";

const TABS: { key: Tab; label: string; icon: string }[] = [
	{ key: "timegrades", label: "Grades de Tempo", icon: "time-outline" },
	{
		key: "servicetypes",
		label: "Tipos de Serviço",
		icon: "construct-outline",
	},
	{ key: "mlsteps", label: "Passos de ML", icon: "color-fill-outline" },
	{ key: "plans", label: "Planos", icon: "card-outline" },
	{ key: "templates", label: "Templates", icon: "document-text-outline" },
];

export function SettingsModal({
	visible,
	onClose,
}: {
	visible: boolean;
	onClose: () => void;
}) {
	const [activeTab, setActiveTab] = useState<Tab>("timegrades");

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<View style={styles.container}>
					{/* Sidebar */}
					<View style={styles.sidebar}>
						<View style={styles.sidebarHeader}>
							<View style={styles.avatarCircle}>
								<Ionicons
									name="settings"
									size={28}
									color="#fff"
								/>
							</View>
							<Text style={styles.sidebarName} numberOfLines={2}>
								Configurações Gerais
							</Text>
						</View>

						<View style={styles.tabList}>
							{TABS.map((tab) => (
								<Button
									color="#ef790c"
									key={tab.key}
									iconName={tab.icon}
									iconSize={16}
									label={tab.label}
									isActive={activeTab === tab.key}
									onPress={() => setActiveTab(tab.key)}
								/>
							))}
						</View>
						<View style={{ flex: 1 }} />
					</View>

					{/* Main Content */}
					<View style={styles.content}>
						<View style={styles.contentHeader}>
							<Text style={styles.contentTitle}>
								{TABS.find((t) => t.key === activeTab)?.label}
							</Text>
							<View style={{ flex: 1 }} />
							<Pressable
								onPress={onClose}
								style={styles.closeBtn}
							>
								<Ionicons
									name="close"
									size={20}
									color={colors.textSecondary}
								/>
							</Pressable>
						</View>

						<ScrollView
							style={{ flex: 1 }}
							contentContainerStyle={styles.scrollContent}
						>
							{activeTab === "timegrades" && (
								<TimingGradeManager />
							)}
							{activeTab === "servicetypes" && (
								<ServiceTypeManager />
							)}
							{activeTab === "mlsteps" && <MlStepsManager />}
							{activeTab === "plans" && <PlansManager />}
							{activeTab === "templates" && <TemplatesManager />}
						</ScrollView>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const innerStyles = StyleSheet.create({
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
});

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flexDirection: "row",
		width: "65%",
		height: "85%",
		borderRadius: 16,
		overflow: "hidden",
		backgroundColor: colors.background,
		boxShadow: "0px 8px 32px rgba(0,0,0,0.3)",
	} as any,
	sidebar: {
		width: 200,
		backgroundColor: colors.overlayBackground,
		paddingVertical: 24,
		paddingHorizontal: 12,
		flexDirection: "column",
		alignItems: "stretch",
		gap: 4,
	},
	sidebarHeader: {
		alignItems: "center",
		gap: 8,
		marginBottom: 20,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.1)",
	},
	avatarCircle: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.secondary,
		justifyContent: "center",
		alignItems: "center",
	},
	sidebarName: {
		...text.subtitle,
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 14,
	},
	tabList: {
		gap: 4,
	},
	content: {
		flex: 1,
		flexDirection: "column",
	},
	contentHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingHorizontal: 24,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.08)",
	},
	contentTitle: {
		...text.title,
		fontSize: 20,
	},
	closeBtn: {
		padding: 4,
		marginLeft: 4,
	},
	scrollContent: {
		padding: 24,
		gap: 8,
	},
});
