import {
	Modal,
	View,
	Text,
	ScrollView,
	StyleSheet,
	Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors, text } from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";
import { StatBox, StatusBox } from "@/components/common/Statbox";
import { Machine, ServiceLog } from "@/assets/types/ms-item/Machine";
import { Contract } from "@/assets/types/ms-client/Contract";
import { formatDisplayDate } from "@/utils/utils";
import { machineService } from "@/services/machineService";
import { userService } from "@/services/userService";
import { Toast } from "react-native-toast-message/lib/src/Toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "dados" | "contrato" | "manutencoes";

interface Props {
	machine: Machine;
	visible: boolean;
	onClose: () => void;
	onSave: (updatedMachine: Machine) => void;
	onDelete?: () => void;
	contract?: Contract | null;
	fragrances: { id: string; name: string }[];
	contractsList: { id: string; name: string }[];
	serviceLogs?: ServiceLog[];
}

// ─── Tab Definitions ─────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; icon: string }[] = [
	{ key: "dados", label: "Dados da Máquina", icon: "cube-outline" },
	{ key: "contrato", label: "Contrato", icon: "document-text-outline" },
	{ key: "manutencoes", label: "Manutenções", icon: "build-outline" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function MachineDetailModal({
	machine,
	visible,
	onClose,
	onSave,
	onDelete,
	contract = null,
	fragrances,
	contractsList,
	serviceLogs = [],
}: Props) {
	const [activeTab, setActiveTab] = useState<Tab>("dados");
	const [isEditing, setIsEditing] = useState(false);
	const [editableMachine, setEditableMachine] = useState<Machine>(machine);

	// Sync when machine prop changes
	useEffect(() => {
		setEditableMachine(machine);
		setIsEditing(false);
		setActiveTab("dados");
	}, [machine, visible]);

	const handleInputChange = (field: keyof Machine, value: any) => {
		setEditableMachine((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		onSave(editableMachine);
		setIsEditing(false);
	};

	const handleClose = () => {
		setEditableMachine(machine);
		setIsEditing(false);
		setActiveTab("dados");
		onClose();
	};

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={handleClose}
		>
			<View style={styles.overlay}>
				<View style={styles.container}>
					{/* ── Sidebar ─────────────────────────────── */}
					<View style={styles.sidebar}>
						{/* Machine name badge */}
						<View style={styles.sidebarHeader}>
							<View style={styles.avatarCircle}>
								<Ionicons name="cube" size={28} color="#fff" />
							</View>
							<Text style={styles.sidebarName} numberOfLines={2}>
								{machine.name}
							</Text>
							<StatusBox
								isEditing={false}
								value={machine.status || ""}
							/>
						</View>

						{/* Navigation tabs */}
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

						{/* Spacer */}
						<View style={{ flex: 1 }} />

						{/* ID */}
						<Text style={styles.idText} numberOfLines={1}>
							ID: {machine.id}
						</Text>
					</View>

					{/* ── Main Content ─────────────────────────── */}
					<View style={styles.content}>
						{/* Top bar: title + actions + close */}
						<View style={styles.contentHeader}>
							<Text style={styles.contentTitle}>
								{TABS.find((t) => t.key === activeTab)?.label}
							</Text>
							<View style={{ flex: 1 }} />

							{activeTab === "dados" && (
								<>
									{isEditing ? (
										<Button
											color="#4caf50"
											label="Salvar"
											iconName="save-outline"
											iconSize={16}
											onPress={handleSave}
										/>
									) : (
										<Button
											color={colors.secondary}
											label="Editar"
											iconName="pencil-outline"
											iconSize={16}
											onPress={() => setIsEditing(true)}
										/>
									)}
									{onDelete && (
										<Button
											color="#f44336"
											label="Excluir"
											iconName="trash-outline"
											iconSize={16}
											onPress={onDelete}
										/>
									)}
								</>
							)}

							<Pressable
								onPress={handleClose}
								style={styles.closeBtn}
							>
								<Ionicons
									name="close"
									size={20}
									color={colors.textSecondary}
								/>
							</Pressable>
						</View>

						{/* Tab Content */}
						<ScrollView
							style={{ flex: 1 }}
							contentContainerStyle={styles.scrollContent}
						>
							{activeTab === "dados" && (
								<MachineDataTab
									machine={editableMachine}
									isEditing={isEditing}
									handleInputChange={handleInputChange}
									fragrances={fragrances}
									contractsList={contractsList}
								/>
							)}
							{activeTab === "contrato" && (
								<ContractTab contract={contract} />
							)}
							{activeTab === "manutencoes" && (
								<ServiceLogsTab machineId={machine.id} initialLogs={serviceLogs} />
							)}
						</ScrollView>
					</View>
				</View>
			</View>
		</Modal>
	);
}

// ─── Dados da Máquina Tab ─────────────────────────────────────────────────────

function MachineDataTab({
	machine,
	isEditing,
	handleInputChange,
	fragrances,
	contractsList,
}: {
	machine: Machine;
	isEditing: boolean;
	handleInputChange: (field: keyof Machine, value: any) => void;
	fragrances: { id: string; name: string }[];
	contractsList: { id: string; name: string }[];
}) {
	return (
		<>
			{/* Name */}
			<View style={styles.section}>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("name", v)}
					direction="horizontal"
					label="Nome / Identificação"
					value={machine.name}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("model", v)}
					direction="horizontal"
					label="Modelo"
					value={machine.model}
				/>
			</View>

			{/* Localização */}
			<SectionTitle title="Localização" />
			<View style={styles.grid}>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(v) =>
						handleInputChange("contractId", v as string)
					}
					direction="vertical"
					label="Contrato"
					value={machine.contractId || ""}
					options={contractsList.map((c) => ({
						label: c.name,
						value: c.id,
					}))}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("localInstalled", v)}
					direction="vertical"
					label="Local Instalado"
					value={machine.localInstalled || "—"}
				/>
			</View>

			{/* Fragrância e Consumo */}
			<SectionTitle title="Fragrância e Consumo" />
			<View style={styles.grid}>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(v) =>
						handleInputChange("fragranceId", v as string)
					}
					direction="vertical"
					label="Fragrância"
					value={machine.fragranceId || ""}
					options={fragrances.map((f) => ({
						label: f.name,
						value: f.id,
					}))}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) =>
						handleInputChange("medianConsumption", Number(v))
					}
					direction="vertical"
					label="Consumo Médio"
					value={machine.medianConsumption?.toString() || "0"}
					unit=" ml"
					keyboardType="numeric"
				/>
			</View>

			{/* Financeiro */}
			<SectionTitle title="Financeiro" />
			<View style={styles.grid}>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("price", Number(v))}
					direction="vertical"
					label="Preço / Valor"
					prefix="R$ "
					value={machine.price.toString()}
					keyboardType="numeric"
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("amountPaid", Number(v))}
					direction="vertical"
					label="Valor Pago (Histórico)"
					prefix="R$ "
					value={machine.amountPaid.toString()}
					keyboardType="numeric"
				/>
			</View>

			{/* Misc */}
			<SectionTitle title="Informações Gerais" />
			<View style={styles.section}>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("observations", v)}
					direction="horizontal"
					label="Observações"
					value={machine.observations || "—"}
					isMultiline
				/>
			</View>

			{/* Footer dates + status */}
			<View style={styles.footer}>
				<StatusBox
					isEditing={isEditing}
					value={machine.status || "Disponível"}
					onChange={(v) => handleInputChange("status", v)}
					options={[
						{ label: "Disponível", value: "Disponível" },
						{ label: "Contratada", value: "Contratada" },
						{ label: "Ativa", value: "Ativa" },
						{ label: "Inativa", value: "Inativa" },
						{ label: "Manutenção", value: "Manutenção" },
					]}
				/>
				<View style={{ flex: 1 }} />
				<View
					style={{
						flexDirection: "column",
						gap: 4,
						alignItems: "flex-end",
					}}
				>
					<Text style={styles.dateText}>
						Criada em: {formatDisplayDate(machine.createdAt)}
					</Text>
					<Text style={styles.dateText}>
						Atualizada em: {formatDisplayDate(machine.updatedAt)}
					</Text>
				</View>
			</View>
		</>
	);
}

// ─── Contrato Tab ────────────────────────────────────────────────────────────

function ContractTab({ contract }: { contract?: Contract | null }) {
	if (!contract) {
		return (
			<EmptyState
				icon="document-text-outline"
				message="Nenhum contrato vinculado a esta máquina."
			/>
		);
	}

	return (
		<View style={styles.card}>
			<View style={styles.cardHeader}>
				<Text style={styles.cardTitle}>{contract.name}</Text>
				<View
					style={[
						styles.badge,
						{
							backgroundColor:
								contract.status === "Ativo"
									? "#e8f5e9"
									: "#ffebee",
						},
					]}
				>
					<Text
						style={[
							styles.badgeText,
							{
								color:
									contract.status === "Ativo"
										? "#4caf50"
										: "#f44336",
							},
						]}
					>
						{contract.status.toUpperCase()}
					</Text>
				</View>
			</View>
			<View style={styles.cardGrid}>
				<StatBox
					isEditing={false}
					direction="vertical"
					label="Tipo"
					value={contract.type}
				/>
				<StatBox
					isEditing={false}
					direction="vertical"
					label="Máquinas"
					value={contract.machines}
				/>
				<StatBox
					isEditing={false}
					direction="vertical"
					label="Data de Término"
					value={
						contract.endDate
							? formatDisplayDate(contract.endDate)
							: "Não definida"
					}
				/>
				<StatBox
					isEditing={false}
					direction="vertical"
					label="Valor Mensal"
					prefix="R$ "
					value={contract.monthlyValue.toFixed(2)}
				/>
			</View>
			{contract.observations && (
				<StatBox
					isEditing={false}
					direction="horizontal"
					label="Observações"
					value={contract.observations}
				/>
			)}
			<Text style={styles.dateText}>
				Criado em: {formatDisplayDate(String(contract.createdAt))}
			</Text>
		</View>
	);
}

// ─── Service Logs Tab ─────────────────────────────────────────────────────────

function ServiceLogsTab({ machineId, initialLogs }: { machineId: string, initialLogs: ServiceLog[] }) {
	const [logs, setLogs] = useState<ServiceLog[]>(initialLogs);
	const [isCreatingLog, setIsCreatingLog] = useState(false);
	const [technicians, setTechnicians] = useState<{ id: string; name: string }[]>([]);
	const [newLog, setNewLog] = useState({
		description: "",
		technicianId: "",
		serviceId: "",
		machinePayment: "",
		mlBefore: "",
		mlAfter: "",
	});
	const [serviceTypes, setServiceTypes] = useState<{ id: string; name: string }[]>([]);

	useEffect(() => {
		setLogs(initialLogs);
	}, [initialLogs]);

	useEffect(() => {
		if (isCreatingLog) {
			if (technicians.length === 0) {
				const fetchTechnicians = async () => {
					try {
						let techList = [{ id: "", name: "Selecione um técnico..." }];
						const usersData = await userService.getAllUsers();
						for (const user of usersData) {
							if (user.position === "Técnico" || user.position === "Admin") {
								techList.push({ id: user.id, name: user.name });
							}
						}
						setTechnicians(techList);
					} catch (error) {
						console.log(error);
					}
				};
				fetchTechnicians();
			}

			if (serviceTypes.length === 0) {
				const fetchServiceTypes = async () => {
					try {
						let typeList = [{ id: "", name: "Selecione o tipo..." }];
						const typesData = await machineService.getAllServiceTypes();
						for (const t of typesData) {
							typeList.push({ id: t.id, name: t.name });
						}
						setServiceTypes(typeList);
					} catch (error) {
						console.log(error);
					}
				};
				fetchServiceTypes();
			}
		}
	}, [isCreatingLog]);

	const handleSaveLog = async () => {
		if (!newLog.description || !newLog.technicianId || !newLog.serviceId) {
			Toast.show({ type: "error", text1: "Preencha a descrição, técnico e tipo de serviço." });
			return;
		}

		try {
			const payload = {
				description: newLog.description,
				technicianId: newLog.technicianId,
				serviceId: newLog.serviceId,
				machinePayment: Number(newLog.machinePayment) || 0,
				mlBefore: newLog.mlBefore ? Number(newLog.mlBefore) : undefined,
				mlAfter: newLog.mlAfter ? Number(newLog.mlAfter) : undefined,
			};

			await machineService.createServiceLog(machineId, payload);
			Toast.show({ type: "success", text1: "Log de serviço salvo!" });

			setNewLog({
				description: "",
				technicianId: "",
				serviceId: "",
				machinePayment: "",
				mlBefore: "",
				mlAfter: "",
			});
			setIsCreatingLog(false);

			const updatedLogs = await machineService.getServiceLogs(machineId);
			setLogs(updatedLogs);
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao salvar log", text2: error.message });
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setNewLog((prev) => ({ ...prev, [field]: value }));
	};

	if (isCreatingLog) {
		return (
			<View>
				<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
					<Text style={[text.title, { fontSize: 20 }]}>Adicionar Novo Log</Text>
					<Button
						color={colors.textSecondary}
						label="Voltar"
						iconName="arrow-back"
						iconSize={16}
						onPress={() => setIsCreatingLog(false)}
					/>
				</View>
				
				<View style={styles.grid}>
					<StatBox
						type="select"
						isEditing={true}
						onChange={(v) => handleInputChange("technicianId", v)}
						direction="vertical"
						label="Técnico"
						value={newLog.technicianId}
						options={technicians.map((t) => ({ label: t.name, value: t.id }))}
					/>
					<StatBox
						type="select"
						isEditing={true}
						onChange={(v) => handleInputChange("serviceId", v)}
						direction="vertical"
						label="Tipo de Serviço"
						value={newLog.serviceId}
						options={serviceTypes.map((c) => ({ label: c.name, value: c.id }))}
					/>
					<StatBox
						isEditing={true}
						onChange={(v) => handleInputChange("machinePayment", v)}
						direction="vertical"
						label="Valor Cobrado (R$)"
						keyboardType="numeric"
						value={newLog.machinePayment}
					/>
					<StatBox
						isEditing={true}
						onChange={(v) => handleInputChange("mlBefore", v)}
						direction="vertical"
						label="Nível Antes (ML)"
						keyboardType="numeric"
						value={newLog.mlBefore}
					/>
					<StatBox
						isEditing={true}
						onChange={(v) => handleInputChange("mlAfter", v)}
						direction="vertical"
						label="Nível Depois (ML)"
						keyboardType="numeric"
						value={newLog.mlAfter}
					/>
					<StatBox
						isEditing={true}
						onChange={(v) => handleInputChange("description", v)}
						direction="horizontal"
						isMultiline
						label="Descrição do Serviço"
						value={newLog.description}
					/>
				</View>
				
				<View style={{ marginTop: 16, alignItems: "flex-end" }}>
					<Button
						color="#4caf50"
						label="Salvar Serviço"
						iconName="checkbox"
						iconSize={16}
						onPress={handleSaveLog}
					/>
				</View>
			</View>
		);
	}

	return (
		<>
			<View style={{ marginBottom: 16, alignItems: "flex-end" }}>
				<Button
					color="#4caf50"
					label="Nova Manutenção"
					iconName="add"
					iconSize={16}
					onPress={() => setIsCreatingLog(true)}
				/>
			</View>

			{logs.length === 0 ? (
				<EmptyState
					icon="build-outline"
					message="Nenhuma manutenção ou recarga registrada."
				/>
			) : (
				logs.map((log) => (
					<View key={log.id} style={styles.card}>
						<View style={styles.cardHeader}>
							<View>
								<Text style={styles.cardTitle}>
									{log.description}
								</Text>
								<Text style={styles.cardSubtitle}>
									Técnico: {log.technicianId}
								</Text>
							</View>
							<Text style={styles.dateText}>
								{formatDisplayDate(log.createdAt)}
							</Text>
						</View>
						<View style={styles.cardGrid}>
							{log.mlBefore != null && log.mlAfter != null && (
								<>
									<StatBox
										isEditing={false}
										direction="vertical"
										label="Nível Antes"
										value={log.mlBefore}
										unit=" ml"
									/>
									<StatBox
										isEditing={false}
										direction="vertical"
										label="Nível Depois"
										value={log.mlAfter}
										unit=" ml"
									/>
								</>
							)}
							{log.machinePayment > 0 && (
								<StatBox
									isEditing={false}
									direction="vertical"
									label="Valor Cobrado"
									prefix="R$ "
									value={log.machinePayment.toFixed(2)}
								/>
							)}
						</View>
					</View>
				))
			)}
		</>
	);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
	return (
		<View style={styles.sectionTitle}>
			<Text style={styles.sectionTitleText}>{title}</Text>
			<View style={styles.sectionTitleLine} />
		</View>
	);
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
	return (
		<View style={styles.emptyState}>
			<Ionicons
				name={icon as any}
				size={48}
				color={colors.textSecondary}
				style={{ opacity: 0.4 }}
			/>
			<Text style={styles.emptyText}>{message}</Text>
		</View>
	);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flexDirection: "row",
		width: "80%",
		height: "85%",
		borderRadius: 16,
		overflow: "hidden",
		backgroundColor: colors.background,
		boxShadow: "0px 8px 32px rgba(0,0,0,0.3)",
	} as any,

	// ── Sidebar ────────────────────────────────
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
	idText: {
		...text.subtitle,
		fontSize: 10,
		color: colors.textSecondary,
		opacity: 0.5,
		textAlign: "center",
	},

	// ── Content ────────────────────────────────
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

	// ── Section ────────────────────────────────
	section: {
		gap: 4,
		marginBottom: 8,
	},
	sectionTitle: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginTop: 16,
		marginBottom: 8,
	},
	sectionTitleText: {
		...text.subtitle,
		fontSize: 11,
		fontWeight: "bold",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	sectionTitleLine: {
		flex: 1,
		height: 1,
		backgroundColor: "rgba(0,0,0,0.08)",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 4,
		marginBottom: 8,
	},
	footer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: "rgba(0,0,0,0.08)",
	},
	dateText: {
		...text.subtitle,
		fontSize: 11,
		color: colors.textSecondary,
		opacity: 0.7,
	},

	// ── Card ───────────────────────────────────
	card: {
		backgroundColor: colors.overlayBackground,
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		gap: 8,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	cardTitle: {
		...text.subtitle,
		fontWeight: "bold",
		fontSize: 16,
		color: colors.textPrimary,
	},
	cardSubtitle: {
		...text.subtitle,
		fontSize: 12,
		color: colors.textSecondary,
	},
	cardGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 4,
	},
	badge: {
		borderRadius: 4,
		paddingHorizontal: 6,
		paddingVertical: 2,
	},
	badgeText: {
		fontSize: 10,
		fontWeight: "bold",
	},

	// ── Empty State ────────────────────────────
	emptyState: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 12,
		paddingVertical: 60,
	},
	emptyText: {
		...text.subtitle,
		textAlign: "center",
		color: colors.textSecondary,
		opacity: 0.6,
	},
});
