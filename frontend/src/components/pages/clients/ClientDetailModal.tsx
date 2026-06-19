import {
	Modal,
	View,
	Text,
	ScrollView,
	StyleSheet,
	Pressable,
	ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import { colors, text } from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";
import { StatBox, StatusBox } from "@/components/common/Statbox";
import { Client } from "@/assets/types/ms-client/Client";
import { Contract } from "@/assets/types/ms-client/Contract";
import { Person } from "@/assets/types/ms-client/Person";
import { addressService } from "@/services/addressService";
import { Address } from "@/assets/types/ms-client/Address";
import { formatDisplayDate } from "@/utils/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "dados" | "contratos" | "pessoas" | "pagamentos" | "enderecos";

interface Props {
	client: Client;
	visible: boolean;
	onClose: () => void;
	onSave: (updatedClient: Client) => void;
	onDelete?: () => void;
	sellers: { id: string; name: string }[];
	contracts?: Contract[];
	persons?: Person[];
}

// ─── Tab Definitions ─────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; icon: string }[] = [
	{ key: "dados", label: "Dados de Cliente", icon: "person-outline" },
	{ key: "contratos", label: "Contratos", icon: "document-text-outline" },
	{ key: "pessoas", label: "Pessoas", icon: "people-outline" },
	{ key: "pagamentos", label: "Pagamentos", icon: "cash-outline" },
	{ key: "enderecos", label: "Endereços", icon: "map-outline" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function ClientDetailModal({
	client,
	visible,
	onClose,
	onSave,
	onDelete,
	sellers,
	contracts = [],
	persons = [],
}: Props) {
	const [activeTab, setActiveTab] = useState<Tab>("dados");
	const [isEditing, setIsEditing] = useState(false);
	const [editableClient, setEditableClient] = useState<Client>(client);

	// Sync when client prop changes
	useState(() => {
		setEditableClient(client);
		setIsEditing(false);
		setActiveTab("dados");
	});

	const handleInputChange = (field: keyof Client, value: any) => {
		setEditableClient((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		onSave(editableClient);
		setIsEditing(false);
	};

	const handleClose = () => {
		setEditableClient(client);
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
						{/* Client name badge */}
						<View style={styles.sidebarHeader}>
							<View style={styles.avatarCircle}>
								<Ionicons
									name="person"
									size={28}
									color="#fff"
								/>
							</View>
							<Text style={styles.sidebarName} numberOfLines={2}>
								{client.fullName}
							</Text>
							<StatusBox
								isEditing={false}
								value={client.status}
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
							ID: {client.id}
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
								<ClientDataTab
									client={editableClient}
									isEditing={isEditing}
									handleInputChange={handleInputChange}
									sellers={sellers}
								/>
							)}
							{activeTab === "contratos" && (
								<ContractsTab contracts={contracts} />
							)}
							{activeTab === "pessoas" && (
								<PersonsTab persons={persons} />
							)}
							{activeTab === "pagamentos" && (
								<PaymentsTab contracts={contracts} />
							)}
							{activeTab === "enderecos" && (
								<AddressesTab
									clientId={client.id}
									visible={
										visible && activeTab === "enderecos"
									}
								/>
							)}
						</ScrollView>
					</View>
				</View>
			</View>
		</Modal>
	);
}

// ─── Dados de Cliente Tab ─────────────────────────────────────────────────────

function ClientDataTab({
	client,
	isEditing,
	handleInputChange,
	sellers,
}: {
	client: Client;
	isEditing: boolean;
	handleInputChange: (field: keyof Client, value: any) => void;
	sellers: { id: string; name: string }[];
}) {
	return (
		<>
			{/* Name */}
			<View style={styles.section}>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("fullName", v)}
					direction="horizontal"
					label="Razão Social / Nome"
					value={client.fullName}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("fantasyName", v)}
					direction="horizontal"
					label="Nome Fantasia"
					value={client.fantasyName || "—"}
				/>
			</View>

			{/* Identification */}
			<SectionTitle title="Identificação" />
			<View style={styles.grid}>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("document", v)}
					direction="vertical"
					label="CNPJ / CPF"
					value={client.document}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("municipalID", v)}
					direction="vertical"
					label="Inscrição Municipal"
					value={client.municipalID || "—"}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("stateID", v)}
					direction="vertical"
					label="Inscrição Estadual"
					value={client.stateID || "—"}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("fieldOfActivity", v)}
					direction="vertical"
					label="Ramo de Atividade"
					value={client.fieldOfActivity || "—"}
				/>
			</View>

			{/* Contacts */}
			<SectionTitle title="Contato" />
			<View style={styles.grid}>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("phone", v)}
					direction="vertical"
					label="Telefone"
					value={client.phone}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("whatsapp", v)}
					direction="vertical"
					label="WhatsApp"
					value={client.whatsapp}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("financesEmail", v)}
					direction="vertical"
					label="Email Financeiro"
					value={client.financesEmail}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("alertsEmail", v)}
					direction="vertical"
					label="Email de Alertas"
					value={client.alertsEmail || "—"}
				/>
			</View>

			{/* Misc */}
			<SectionTitle title="Informações Gerais" />
			<View style={styles.section}>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(v) => handleInputChange("sellerId", v as string)}
					direction="horizontal"
					label="Vendedor"
					value={client.sellerId}
					options={[
						{ label: "Selecione um vendedor...", value: "" },
						...sellers.map((s) => ({ label: s.name, value: s.id })),
					]}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("foundingDate", v)}
					direction="horizontal"
					label="Data de Fundação"
					value={
						client.foundingDate instanceof Date
							? client.foundingDate.toISOString().split("T")[0]
							: client.foundingDate
								? String(client.foundingDate).split("T")[0]
								: ""
					}
				/>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(v) => handleInputChange("hasIss", v === "true")}
					direction="horizontal"
					label="Retém ISS?"
					value={client.hasIss ? "true" : "false"}
					options={[
						{ label: "Sim", value: "true" },
						{ label: "Não", value: "false" },
					]}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(v) => handleInputChange("observations", v)}
					direction="horizontal"
					label="Observações"
					value={client.observations || "—"}
					isMultiline
				/>
			</View>

			{/* Footer dates + status */}
			<View style={styles.footer}>
				<StatusBox
					isEditing={isEditing}
					value={client.status}
					onChange={(v) => handleInputChange("status", v)}
					options={[
						{ label: "Em Análise", value: "Em Análise" },
						{ label: "Ativo", value: "Ativo" },
						{ label: "Inativo", value: "Inativo" },
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
						Criado em: {formatDisplayDate(client.createdAt)}
					</Text>
					<Text style={styles.dateText}>
						Atualizado em: {formatDisplayDate(client.updatedAt)}
					</Text>
				</View>
			</View>
		</>
	);
}

// ─── Contratos Tab ────────────────────────────────────────────────────────────

function ContractsTab({ contracts }: { contracts: Contract[] }) {
	if (contracts.length === 0) {
		return (
			<EmptyState
				icon="document-text-outline"
				message="Nenhum contrato encontrado para este cliente."
			/>
		);
	}

	return (
		<>
			{contracts.map((contract) => (
				<View key={contract.id} style={styles.card}>
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
						Criado em:{" "}
						{formatDisplayDate(String(contract.createdAt))}
					</Text>
				</View>
			))}
		</>
	);
}

// ─── Pessoas Tab ───────────────────────────────────────────────────────────────

function PersonsTab({ persons }: { persons: Person[] }) {
	if (persons.length === 0) {
		return (
			<EmptyState
				icon="people-outline"
				message="Nenhuma pessoa vinculada a este cliente."
			/>
		);
	}

	return (
		<>
			{persons.map((person) => (
				<View key={person.id} style={styles.card}>
					<View style={styles.cardHeader}>
						<View>
							<Text style={styles.cardTitle}>
								{person.fullName}
							</Text>
							<Text style={styles.cardSubtitle}>
								{person.role}
							</Text>
						</View>
						<View style={{ flexDirection: "row", gap: 8 }}>
							{person.doesSign && (
								<View
									style={[
										styles.badge,
										{ backgroundColor: "#e3f2fd" },
									]}
								>
									<Text
										style={[
											styles.badgeText,
											{ color: "#1e88e5" },
										]}
									>
										ASSINA
									</Text>
								</View>
							)}
							{person.doesRepresent && (
								<View
									style={[
										styles.badge,
										{ backgroundColor: "#f3e5f5" },
									]}
								>
									<Text
										style={[
											styles.badgeText,
											{ color: "#9c27b0" },
										]}
									>
										REPRESENTANTE
									</Text>
								</View>
							)}
						</View>
					</View>
					<View style={styles.cardGrid}>
						<StatBox
							isEditing={false}
							direction="vertical"
							label="Documento"
							value={person.document}
						/>
						<StatBox
							isEditing={false}
							direction="vertical"
							label="Estado Civil"
							value={person.civilState}
						/>
						<StatBox
							isEditing={false}
							direction="vertical"
							label="Telefone"
							value={person.phone}
						/>
						<StatBox
							isEditing={false}
							direction="vertical"
							label="Email"
							value={person.email}
						/>
					</View>
				</View>
			))}
		</>
	);
}

// ─── Pagamentos Tab ───────────────────────────────────────────────────────────

function PaymentsTab({ contracts }: { contracts: Contract[] }) {
	if (contracts.length === 0) {
		return (
			<EmptyState
				icon="cash-outline"
				message="Nenhum dado de pagamento disponível."
			/>
		);
	}

	const totalMonthly = contracts.reduce(
		(sum, c) => sum + (c.monthlyValue || 0),
		0,
	);

	return (
		<>
			{/* Summary card */}
			<View style={[styles.card, { backgroundColor: colors.secondary }]}>
				<Text
					style={[
						styles.cardTitle,
						{ color: "#fff", marginBottom: 4 },
					]}
				>
					Resumo de Pagamentos
				</Text>
				<Text
					style={{
						color: "rgba(255,255,255,0.7)",
						fontSize: 12,
						marginBottom: 12,
					}}
				>
					Total de {contracts.length} contrato(s) ativo(s)
				</Text>
				<View
					style={{
						flexDirection: "row",
						alignItems: "baseline",
						gap: 4,
					}}
				>
					<Text
						style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}
					>
						Total mensal
					</Text>
					<Text
						style={{
							color: "#fff",
							fontSize: 28,
							fontWeight: "bold",
							fontFamily: "Futura",
						}}
					>
						R$ {totalMonthly.toFixed(2)}
					</Text>
				</View>
			</View>

			{/* Per-contract breakdown */}
			{contracts.map((contract) => (
				<View key={contract.id} style={styles.card}>
					<Text style={styles.cardTitle}>{contract.name}</Text>
					<View style={styles.cardGrid}>
						<StatBox
							isEditing={false}
							direction="vertical"
							label="Valor Mensal"
							prefix="R$ "
							value={contract.monthlyValue.toFixed(2)}
						/>
						<StatBox
							isEditing={false}
							direction="vertical"
							label="Dia de Vencimento"
							value={`Dia ${contract.payDay}`}
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
					</View>
				</View>
			))}
		</>
	);
}

// ─── Endereços Tab ────────────────────────────────────────────────────────────

const EMPTY_ADDRESS = {
	zipCode: "",
	street: "",
	number: "",
	neighborhood: "",
	city: "",
	state: "",
	complement: "",
	observations: "",
};

function AddressesTab({
	clientId,
	visible,
}: {
	clientId: string;
	visible: boolean;
}) {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [loading, setLoading] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [newAddress, setNewAddress] = useState(EMPTY_ADDRESS);
	const [saving, setSaving] = useState(false);

	const fetchAddresses = async () => {
		setLoading(true);
		try {
			const data = await addressService.getAddressesByClientId(clientId);
			setAddresses(data);
		} catch (error: any) {
			if (
				error.message?.includes("404") ||
				error.message?.includes("Not Found")
			) {
				setAddresses([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao buscar endereços",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (visible) fetchAddresses();
	}, [visible, clientId]);

	const handleSave = async () => {
		if (
			!newAddress.zipCode ||
			!newAddress.street ||
			!newAddress.number ||
			!newAddress.city ||
			!newAddress.state ||
			!newAddress.neighborhood
		) {
			Toast.show({
				type: "error",
				text1: "Preencha todos os campos obrigatórios.",
			});
			return;
		}
		setSaving(true);
		try {
			await addressService.createAddress({
				clientId,
				zipCode: newAddress.zipCode,
				street: newAddress.street,
				number: Number(newAddress.number),
				neighborhood: newAddress.neighborhood,
				city: newAddress.city,
				state: newAddress.state,
				complement: newAddress.complement || undefined,
				observations: newAddress.observations || undefined,
			});
			Toast.show({
				type: "success",
				text1: "Endereço salvo com sucesso!",
			});
			setNewAddress(EMPTY_ADDRESS);
			setShowForm(false);
			fetchAddresses();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao criar endereço",
				text2: error.message,
			});
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await addressService.deleteAddress(id);
			Toast.show({ type: "success", text1: "Endereço excluído!" });
			fetchAddresses();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao excluir endereço",
				text2: error.message,
			});
		}
	};

	if (loading) {
		return (
			<View style={styles.emptyState}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	return (
		<>
			{/* Address list */}
			{addresses.length === 0 && !showForm ? (
				<EmptyState
					icon="map-outline"
					message="Nenhum endereço cadastrado para este cliente."
				/>
			) : (
				addresses.map((addr) => (
					<View key={addr.id} style={styles.card}>
						<View style={styles.cardHeader}>
							<View style={{ flex: 1 }}>
								<Text style={styles.cardTitle}>
									{addr.street}, {addr.number}
									{addr.complement
										? ` - ${addr.complement}`
										: ""}
								</Text>
								<Text style={styles.cardSubtitle}>
									{addr.neighborhood} · {addr.city} -{" "}
									{addr.state} | CEP: {addr.zipCode}
								</Text>
								{addr.observations ? (
									<Text style={styles.dateText}>
										{addr.observations}
									</Text>
								) : null}
							</View>
							<Button
								iconName="trash-outline"
								iconSize={16}
								color="#f44336"
								labelColor="#fff"
								onPress={() => handleDelete(addr.id)}
							/>
						</View>
					</View>
				))
			)}

			{/* Add button / Form */}
			{showForm ? (
				<View style={[styles.card, { gap: 12 }]}>
					<SectionTitle title="Novo Endereço" />
					<View style={styles.grid}>
						<StatBox
							isEditing
							label="CEP *"
							direction="vertical"
							value={newAddress.zipCode}
							onChange={(v) =>
								setNewAddress((p) => ({
									...p,
									zipCode: String(v),
								}))
							}
						/>
						<StatBox
							isEditing
							label="Rua *"
							direction="vertical"
							value={newAddress.street}
							onChange={(v) =>
								setNewAddress((p) => ({
									...p,
									street: String(v),
								}))
							}
						/>
						<StatBox
							isEditing
							label="Número *"
							direction="vertical"
							keyboardType="numeric"
							value={newAddress.number}
							onChange={(v) =>
								setNewAddress((p) => ({
									...p,
									number: String(v),
								}))
							}
						/>
						<StatBox
							isEditing
							label="Bairro *"
							direction="vertical"
							value={newAddress.neighborhood}
							onChange={(v) =>
								setNewAddress((p) => ({
									...p,
									neighborhood: String(v),
								}))
							}
						/>
						<StatBox
							isEditing
							label="Cidade *"
							direction="vertical"
							value={newAddress.city}
							onChange={(v) =>
								setNewAddress((p) => ({
									...p,
									city: String(v),
								}))
							}
						/>
						<StatBox
							isEditing
							label="Estado *"
							direction="vertical"
							value={newAddress.state}
							onChange={(v) =>
								setNewAddress((p) => ({
									...p,
									state: String(v),
								}))
							}
						/>
						<StatBox
							isEditing
							label="Complemento"
							direction="vertical"
							value={newAddress.complement}
							onChange={(v) =>
								setNewAddress((p) => ({
									...p,
									complement: String(v),
								}))
							}
						/>
						<StatBox
							isEditing
							label="Observações"
							direction="vertical"
							value={newAddress.observations}
							onChange={(v) =>
								setNewAddress((p) => ({
									...p,
									observations: String(v),
								}))
							}
							isMultiline
						/>
					</View>
					<View style={{ flexDirection: "row", gap: 10 }}>
						<Button
							color={colors.secondary}
							label="Cancelar"
							iconName="close-outline"
							iconSize={16}
							labelColor="#fff"
							onPress={() => {
								setShowForm(false);
								setNewAddress(EMPTY_ADDRESS);
							}}
						/>
						<Button
							color="#4caf50"
							label={saving ? "Salvando..." : "Salvar Endereço"}
							iconName="save-outline"
							iconSize={16}
							labelColor="#fff"
							onPress={handleSave}
						/>
					</View>
				</View>
			) : (
				<Button
					color={colors.primary}
					label="Adicionar Endereço"
					iconName="add-circle-outline"
					iconSize={18}
					labelColor="#fff"
					onPress={() => setShowForm(true)}
				/>
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
