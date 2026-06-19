import { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { page, text as globalText, colors } from "@/assets/styles/stylesheets";
import { Machine } from "@/assets/types/ms-item/Machine";
import { Fragrance } from "@/assets/types/ms-item/Fragrance";
import { Client } from "@/assets/types/ms-client/Client";
import { Contract } from "@/assets/types/ms-client/Contract";

import { machineService } from "@/services/machineService";
import { fragranceService } from "@/services/fragranceService";
import { clientService } from "@/services/clientService";
import { contractService } from "@/services/contractService";
import { formatDisplayDate } from "@/utils/utils";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
	const router = useRouter();

	const [loading, setLoading] = useState(true);

	const [machines, setMachines] = useState<Machine[]>([]);
	const [fragrances, setFragrances] = useState<Fragrance[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
	const [contracts, setContracts] = useState<Contract[]>([]);

	const fetchDashboardData = async (): Promise<void> => {
		setLoading(true);
		try {
			// Using Promise.allSettled to avoid failing everything if one service is empty/fails
			const [resMachines, resFragrances, resClients, resContracts] =
				await Promise.allSettled([
					machineService.getAllMachines(),
					fragranceService.getAllFragrances(),
					clientService.getAllClients(),
					contractService.getAllContracts(),
				]);

			setMachines(
				resMachines.status === "fulfilled" &&
					Array.isArray(resMachines.value)
					? resMachines.value
					: [],
			);
			setFragrances(
				resFragrances.status === "fulfilled" &&
					Array.isArray(resFragrances.value)
					? resFragrances.value
					: [],
			);
			setClients(
				resClients.status === "fulfilled" &&
					Array.isArray(resClients.value)
					? resClients.value
					: [],
			);
			setContracts(
				resContracts.status === "fulfilled" &&
					Array.isArray(resContracts.value)
					? resContracts.value
					: [],
			);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

	// --- Calculated Metrics ---
	const machinesInField = machines.filter(
		(m) => m.status === "Contratada" || m.status === "Ativa",
	).length;
	const machinesTotal = machines.length;

	const LOW_STOCK_THRESHOLD = 1000;
	const fragrancesLowStock = fragrances.filter(
		(f) => f.stock < LOW_STOCK_THRESHOLD,
	);
	const fragrancesTotal = fragrances.length;

	const clientsTotal = clients.length;
	const activeContracts = contracts.filter(
		(c) =>
			c.status === "Ativo" ||
			c.status === "Ativa" ||
			c.status === "Contratada",
	).length;

	// Sort contracts by creation date descending, take top 5
	const recentContracts = [...contracts]
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime(),
		)
		.slice(0, 5);

	const getClientName = (clientId: string) => {
		const c = clients.find((cl) => cl.id === clientId);
		return c ? c.fantasyName || c.fullName : "Desconhecido";
	};

	if (loading) {
		return (
			<View style={[page.background, styles.centered]}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: colors.background }}
			contentContainerStyle={styles.container}
		>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.title}>Dashboard</Text>
				<Text style={styles.subtitle}>
					Visão geral do marketing olfativo
				</Text>
			</View>

			{/* Top Cards */}
			<View style={styles.cardsRow}>
				<StatCard
					title="EM CAMPO"
					value={machinesInField}
					subtext={`${machinesTotal} totais`}
					icon="cube-outline"
					color="#e0a96d"
					bg="#fbf6f0"
				/>
				<StatCard
					title="FRAGRÂNCIAS"
					value={fragrancesTotal}
					subtext={`${fragrancesLowStock.length} com alerta`}
					icon="water-outline"
					color="#e0a96d"
					bg="#fbf6f0"
				/>
				<StatCard
					title="CLIENTES"
					value={clientsTotal}
					subtext={``}
					icon="people-outline"
					color="#e0a96d"
					bg="#fbf6f0"
				/>
				<StatCard
					title="CONTRATOS ATIVOS"
					value={activeContracts}
					subtext={``}
					icon="document-text-outline"
					color="#e0a96d"
					bg="#fbf6f0"
				/>
			</View>

			{/* Middle Section: Pending and Alerts */}
			<View style={styles.middleRow}>
				{/* Reposições Pendentes */}
				<View style={styles.sectionCard}>
					<View style={styles.sectionHeader}>
						<Ionicons
							name="time-outline"
							size={20}
							color="#e0a96d"
						/>
						<Text style={styles.sectionTitle}>
							Reposições Pendentes
						</Text>
					</View>

					<View style={styles.sectionBody}>
						<Text style={styles.emptyText}>
							Nenhuma reposição pendente
						</Text>
					</View>

					<Pressable
						onPress={() => router.push("/private/machines")}
						style={styles.linkButton}
					>
						<Text style={styles.linkText}>Ver equipamentos →</Text>
					</Pressable>
				</View>

				{/* Alerta de Estoque */}
				<View style={styles.sectionCard}>
					<View style={styles.sectionHeader}>
						<Ionicons
							name="warning-outline"
							size={20}
							color="#e0a96d"
						/>
						<Text style={styles.sectionTitle}>
							Alerta de Estoque
						</Text>
						<View style={{ flex: 1 }} />
						<View style={styles.badgeAlert}>
							<Text style={styles.badgeAlertText}>
								{fragrancesLowStock.length}
							</Text>
						</View>
					</View>

					<View style={[styles.sectionBody, { paddingVertical: 0 }]}>
						{fragrancesLowStock.length === 0 ? (
							<View style={{ paddingVertical: 20 }}>
								<Text style={styles.emptyText}>
									Nenhuma fragrância com baixo estoque
								</Text>
							</View>
						) : (
							fragrancesLowStock.map((f, i) => (
								<View
									key={f.id}
									style={[
										styles.alertListItem,
										i === 0 && { borderTopWidth: 0 },
									]}
								>
									<View>
										<Text style={styles.alertItemName}>
											{f.name.toUpperCase()}
										</Text>
										<Text style={styles.alertItemSub}>
											Estoque baixo
										</Text>
									</View>
									<Text style={styles.alertItemValue}>
										{f.stock} ml
									</Text>
								</View>
							))
						)}
					</View>

					<Pressable
						onPress={() => router.push("/private/fragrances")}
						style={styles.linkButton}
					>
						<Text style={styles.linkText}>Ver estoque →</Text>
					</Pressable>
				</View>
			</View>

			{/* Bottom Section: Recent Contracts */}
			<View style={styles.sectionCard}>
				<View style={[styles.sectionHeader, { borderBottomWidth: 0 }]}>
					<Text style={styles.sectionTitle}>Contratos Recentes</Text>
					<View style={{ flex: 1 }} />
					<Pressable
						onPress={() => router.push("/private/contracts")}
					>
						<Text style={styles.linkText}>Ver todos</Text>
					</Pressable>
				</View>

				<View style={styles.tableHeaderRow}>
					<Text style={[styles.tableCol, { flex: 1.5 }]}>
						Contrato
					</Text>
					<Text style={[styles.tableCol, { flex: 2 }]}>Cliente</Text>
					<Text style={[styles.tableCol, { flex: 1.5 }]}>Tipo</Text>
					<Text style={[styles.tableCol, { flex: 1 }]}>Início</Text>
					<Text style={[styles.tableCol, { flex: 1 }]}>Status</Text>
				</View>

				{recentContracts.length === 0 ? (
					<View style={{ padding: 20 }}>
						<Text style={styles.emptyText}>
							Nenhum contrato encontrado
						</Text>
					</View>
				) : (
					recentContracts.map((c, i) => (
						<View
							key={c.id}
							style={[
								styles.tableDataRow,
								i % 2 === 0
									? { backgroundColor: "#ffffff" }
									: { backgroundColor: "#fafafa" },
							]}
						>
							<Text
								style={[
									styles.tableDataText,
									{ flex: 1.5, fontWeight: "bold" },
								]}
							>
								{c.name}
							</Text>
							<Text
								style={[styles.tableDataText, { flex: 2 }]}
								numberOfLines={1}
							>
								{getClientName(c.clientId)}
							</Text>
							<View
								style={{ flex: 1.5, alignItems: "flex-start" }}
							>
								<View style={styles.typeBadge}>
									<Text style={styles.typeBadgeText}>
										{c.type}
									</Text>
								</View>
							</View>
							<Text style={[styles.tableDataText, { flex: 1 }]}>
								{formatDisplayDate(c.createdAt as string)}
							</Text>
							<View style={{ flex: 1, alignItems: "flex-start" }}>
								<View
									style={[
										styles.statusBadge,
										c.status === "Ativo" ||
										c.status === "Em Análise"
											? styles.statusBadgeActive
											: styles.statusBadgeInactive,
									]}
								>
									<Text
										style={[
											styles.statusBadgeText,
											c.status === "Ativo" ||
											c.status === "Em Análise"
												? styles.statusBadgeTextActive
												: styles.statusBadgeTextInactive,
										]}
									>
										{c.status}
									</Text>
								</View>
							</View>
						</View>
					))
				)}
			</View>
		</ScrollView>
	);
}

// Subcomponents
function StatCard({
	title,
	value,
	subtext,
	icon,
	color,
	bg,
}: {
	title: string;
	value: number;
	subtext: string;
	icon: any;
	color: string;
	bg: string;
}) {
	return (
		<View style={styles.statCard}>
			<View style={styles.statHeader}>
				<Text style={styles.statTitle}>{title}</Text>
				<View style={[styles.iconBox, { backgroundColor: bg }]}>
					<Ionicons name={icon} size={20} color={color} />
				</View>
			</View>
			<Text style={styles.statValue}>{value}</Text>
			{subtext ? <Text style={styles.statSub}>{subtext}</Text> : null}
		</View>
	);
}

// Styles
const styles = StyleSheet.create({
	container: {
		padding: 30,
		gap: 20,
		maxWidth: 1200,
		width: "100%",
		alignSelf: "center",
	},
	centered: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	header: {
		marginBottom: 10,
	},
	title: {
		fontFamily: "Times New Roman",
		fontSize: 28,
		fontWeight: "bold",
		color: colors.textPrimary,
		marginBottom: 5,
	},
	subtitle: {
		fontFamily: "Futura",
		fontSize: 16,
		color: colors.textSecondary,
	},
	cardsRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 20,
		justifyContent: "space-between",
	},
	statCard: {
		flex: 1,
		minWidth: 220,
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 20,
		borderWidth: 1,
		borderColor: "#eee",
		boxShadow: "0px 2px 5px rgba(0,0,0,0.02)",
	},
	statHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 15,
	},
	statTitle: {
		fontFamily: "Futura",
		fontSize: 12,
		fontWeight: "bold",
		color: colors.textSecondary,
		marginTop: 5,
	},
	iconBox: {
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	statValue: {
		fontFamily: "Futura",
		fontSize: 28,
		fontWeight: "bold",
		color: colors.textPrimary,
		marginBottom: 5,
	},
	statSub: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
	},
	middleRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 20,
	},
	sectionCard: {
		flex: 1,
		minWidth: 300,
		backgroundColor: "#fff",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#eee",
		boxShadow: "0px 2px 5px rgba(0,0,0,0.02)",
		overflow: "hidden",
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	sectionTitle: {
		fontFamily: "Futura",
		fontSize: 16,
		fontWeight: "bold",
		color: colors.textPrimary,
	},
	sectionBody: {
		padding: 20,
		minHeight: 150,
	},
	emptyText: {
		fontFamily: "Futura",
		fontSize: 14,
		color: colors.textSecondary,
	},
	linkButton: {
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
	},
	linkText: {
		fontFamily: "Futura",
		fontSize: 14,
		fontWeight: "bold",
		color: "#e0a96d",
	},
	badgeAlert: {
		backgroundColor: "#fbf6f0",
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 12,
	},
	badgeAlertText: {
		fontFamily: "Futura",
		fontSize: 12,
		fontWeight: "bold",
		color: "#e0a96d",
	},
	alertListItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 15,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
	},
	alertItemName: {
		fontFamily: "Futura",
		fontSize: 14,
		fontWeight: "bold",
		color: colors.textPrimary,
		marginBottom: 4,
	},
	alertItemSub: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
	},
	alertItemValue: {
		fontFamily: "Futura",
		fontSize: 14,
		fontWeight: "bold",
		color: "#e0a96d",
	},
	tableHeaderRow: {
		flexDirection: "row",
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: "#fafafa",
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	tableCol: {
		fontFamily: "Futura",
		fontSize: 12,
		fontWeight: "bold",
		color: colors.textSecondary,
	},
	tableDataRow: {
		flexDirection: "row",
		paddingHorizontal: 20,
		paddingVertical: 15,
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	tableDataText: {
		fontFamily: "Futura",
		fontSize: 14,
		color: colors.textPrimary,
	},
	typeBadge: {
		backgroundColor: "#eef2ff",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
	},
	typeBadgeText: {
		fontFamily: "Futura",
		fontSize: 12,
		fontWeight: "bold",
		color: "#4f46e5",
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusBadgeActive: {
		backgroundColor: "#e8f5e9",
	},
	statusBadgeInactive: {
		backgroundColor: "#f5f5f5",
	},
	statusBadgeText: {
		fontFamily: "Futura",
		fontSize: 12,
		fontWeight: "bold",
	},
	statusBadgeTextActive: {
		color: "#2e7d32",
	},
	statusBadgeTextInactive: {
		color: "#757575",
	},
});
