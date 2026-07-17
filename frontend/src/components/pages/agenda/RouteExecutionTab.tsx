import { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Pressable,
	ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/assets/styles/stylesheets";
import { scheduleService } from "@/services/scheduleService";
import { Appointment, AppointmentStatus } from "@/assets/types/ms-schedule/Appointment";
import { useScheduleContext } from "@/contexts/ScheduleContext";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
	Concluído: { color: "#188038", bg: "#e6f4ea", icon: "checkmark-circle", label: "Concluído" },
	"Em Andamento": { color: "#e65100", bg: "#fff3e0", icon: "time", label: "Em Andamento" },
	Pendente: { color: "#757575", bg: "#f5f5f5", icon: "ellipse-outline", label: "Pendente" },
	Pulado: { color: "#d93025", bg: "#fce8e6", icon: "close-circle", label: "Pulado" },
	Confirmado: { color: "#188038", bg: "#e6f4ea", icon: "checkmark-circle", label: "Confirmado" },
	Cancelado: { color: "#d93025", bg: "#fce8e6", icon: "close-circle", label: "Cancelado" },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
	Manutenção: { bg: "#e8f4fd", text: "#1a73e8" },
	Instalação: { bg: "#e6f4ea", text: "#188038" },
	Retirada: { bg: "#fce8e6", text: "#d93025" },
	Visita: { bg: "#fff3e0", text: "#e65100" },
};

export function ExecucaoRotaTab() {
	const [visits, setVisits] = useState<Appointment[]>([]);
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [isFetching, setIsFetching] = useState(true);

	const { getClientName, getAddressStr, loading } = useScheduleContext();

	useEffect(() => {
		setIsFetching(true);
		const today = new Date().toISOString().split('T')[0];
		scheduleService.getAppointmentsByDate(today)
			.then(data => {
				const sorted = [...data].sort((a, b) => (a.routeOrder || 999) - (b.routeOrder || 999));
				setVisits(sorted);
				const inProgress = sorted.find(v => v.status === "Em Andamento");
				if (inProgress) setExpandedId(inProgress.id);
			})
			.catch(console.error)
			.finally(() => setIsFetching(false));
	}, []);

	const toggleCheck = async (visitId: string, checkIdx: number) => {
		const visit = visits.find((v) => v.id === visitId);
		if (!visit) return;
		
		const checklistItem = visit.checklist[checkIdx];
		const newDone = !checklistItem.done;

		// Optimistic update
		setVisits((prev) =>
			prev.map((v) =>
				v.id === visitId
					? {
						...v,
						checklist: v.checklist.map((c, i) =>
							i === checkIdx ? { ...c, done: newDone } : c
						),
					}
					: v
			)
		);

		try {
			await scheduleService.toggleChecklistItem(checklistItem.id, newDone);
		} catch (error) {
			console.error("Failed to toggle checklist item", error);
		}
	};

	const markAs = async (visitId: string, status: AppointmentStatus) => {
		// Optimistic update
		setVisits((prev) =>
			prev.map((v) =>
				v.id === visitId ? { ...v, status } : v
			)
		);

		try {
			await scheduleService.updateAppointmentStatus(visitId, status);
		} catch (error) {
			console.error("Failed to update status", error);
		}
	};

	const completed = visits.filter((v) => v.status === "Concluído").length;
	const total = visits.length;
	const progress = Math.round((completed / total) * 100);

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			{/* Progress bar */}
			<View style={styles.progressCard}>
				<View style={styles.progressHeader}>
					<View>
						<Text style={styles.progressTitle}>Progresso da Rota</Text>
						<Text style={styles.progressSub}>
							{completed} de {total} visitas concluídas
						</Text>
					</View>
					<Text style={styles.progressPct}>{progress}%</Text>
				</View>
				<View style={styles.progressBar}>
					<View style={[styles.progressFill, { width: `${progress}%` as any }]} />
				</View>
				<View style={styles.progressLegend}>
					{["Pendente", "Em Andamento", "Concluído", "Pulado"].map((s) => {
						const conf = STATUS_CONFIG[s];
						return (
							<View key={s} style={styles.legendItem}>
								<View style={[styles.legendDot, { backgroundColor: conf?.color || "#666" }]} />
								<Text style={styles.legendText}>
									{visits.filter((v) => v.status === s).length} {conf?.label || s}
								</Text>
							</View>
						);
					})}
				</View>
			</View>

			{/* Visit cards */}
			{loading || isFetching ? (
				<View style={{ padding: 40, alignItems: "center" }}>
					<ActivityIndicator size="large" color={colors.primary} />
					<Text style={{ marginTop: 10, color: colors.textSecondary }}>Carregando agenda...</Text>
				</View>
			) : visits.length === 0 ? (
				<View style={{ padding: 40, alignItems: "center" }}>
					<Ionicons name="navigate-outline" size={36} color="#ccc" />
					<Text style={{ marginTop: 10, color: colors.textSecondary }}>Nenhuma visita para hoje.</Text>
				</View>
			) : visits.map((visit, idx) => {
				const sc = STATUS_CONFIG[visit.status] || { color: "#666", bg: "#f5f5f5", icon: "ellipse", label: visit.status };
				const tc = TYPE_COLORS[visit.type] || { bg: "#f5f5f5", text: "#666" };
				const isExpanded = expandedId === visit.id;
				const checkDone = visit.checklist.filter((c) => c.done).length;
				const checkTotal = visit.checklist.length;
				
				const clientName = getClientName(visit.clientId);
				const address = getAddressStr(visit.clientId);
				const formattedTime = new Date(visit.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
				
				const formatTimeOnly = (iso?: string | null) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
				const startedTime = formatTimeOnly(visit.startedAt);
				const finishedTime = formatTimeOnly(visit.finishedAt);

				return (
					<Pressable
						key={visit.id}
						style={[styles.visitCard, visit.status === "Em Andamento" && styles.visitCardActive]}
						onPress={() => setExpandedId(isExpanded ? null : visit.id)}
					>
						{/* Status indicator stripe */}
						<View style={[styles.statusStripe, { backgroundColor: sc.color }]} />

						<View style={styles.visitContent}>
							{/* Header row */}
							<View style={styles.visitHeader}>
								<View style={styles.visitOrderBadge}>
									<Text style={styles.visitOrderText}>{idx + 1}</Text>
								</View>
								<View style={styles.visitInfo}>
									<Text style={styles.visitClient}>{clientName}</Text>
									<View style={styles.visitMeta}>
										<Ionicons name="location-outline" size={12} color={colors.textSecondary} />
										<Text style={styles.visitMetaText}>{address}</Text>
									</View>
								</View>
								<View style={styles.visitRight}>
									<View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
										<Ionicons name={sc.icon} size={13} color={sc.color} />
										<Text style={[styles.statusBadgeText, { color: sc.color }]}>
											{sc.label}
										</Text>
									</View>
									<Text style={styles.visitTime}>{formattedTime}</Text>
								</View>
							</View>

							{/* Quick stats */}
							<View style={styles.visitQuickStats}>
								<View style={[styles.typePill, { backgroundColor: tc.bg }]}>
									<Text style={[styles.typePillText, { color: tc.text }]}>{visit.type}</Text>
								</View>
								<Text style={styles.checklistProgress}>
									Checklist: {checkDone}/{checkTotal}
								</Text>
								{visit.startedAt && (
									<Text style={styles.timeInfo}>
										Início: {startedTime}
										{visit.finishedAt ? ` · Fim: ${finishedTime}` : ""}
									</Text>
								)}
							</View>

							{/* Expanded checklist */}
							{isExpanded && (
								<View style={styles.checklistSection}>
									<View style={styles.checklistBar}>
										<View style={[styles.checklistFill, {
											width: `${checkTotal > 0 ? (checkDone / checkTotal) * 100 : 0}%` as any,
										}]} />
									</View>
									{visit.checklist.map((item, idx) => (
										<Pressable
											key={idx}
											style={styles.checklistItem}
											onPress={() => toggleCheck(visit.id, idx)}
										>
											<View style={[
												styles.checkbox,
												item.done && styles.checkboxDone,
											]}>
												{item.done && (
													<Ionicons name="checkmark" size={12} color="#fff" />
												)}
											</View>
											<Text style={[
												styles.checklistLabel,
												item.done && styles.checklistLabelDone,
											]}>
												{item.label}
											</Text>
										</Pressable>
									))}

									{/* Action buttons */}
									{visit.status !== "Concluído" && (
										<View style={styles.actionBtns}>
											{visit.status === "Pendente" && (
												<Pressable
													style={[styles.actionBtn, styles.actionBtnStart]}
													onPress={() => markAs(visit.id, "Em Andamento")}
												>
													<Ionicons name="play-outline" size={15} color="#fff" />
													<Text style={styles.actionBtnText}>Iniciar</Text>
												</Pressable>
											)}
											{visit.status === "Em Andamento" && (
												<Pressable
													style={[styles.actionBtn, styles.actionBtnDone]}
													onPress={() => markAs(visit.id, "Concluído")}
												>
													<Ionicons name="checkmark-outline" size={15} color="#fff" />
													<Text style={styles.actionBtnText}>Concluir</Text>
												</Pressable>
											)}
											<Pressable
												style={[styles.actionBtn, styles.actionBtnSkip]}
												onPress={() => markAs(visit.id, "Pulado")}
											>
												<Ionicons name="play-skip-forward-outline" size={15} color="#d93025" />
												<Text style={[styles.actionBtnText, { color: "#d93025" }]}>Pular</Text>
											</Pressable>
										</View>
									)}
								</View>
							)}
						</View>
					</Pressable>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: { padding: 24, gap: 16 },
	// Progress card
	progressCard: {
		backgroundColor: "#fff",
		borderRadius: 14,
		padding: 20,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		gap: 12,
		marginBottom: 4,
	},
	progressHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	progressTitle: {
		fontFamily: "Futura",
		fontSize: 16,
		fontWeight: "bold",
		color: colors.textPrimary,
	},
	progressSub: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textSecondary,
		marginTop: 2,
	},
	progressPct: {
		fontFamily: "Futura",
		fontSize: 28,
		fontWeight: "bold",
		color: colors.secondary,
	},
	progressBar: {
		height: 8,
		backgroundColor: "#f0f0f0",
		borderRadius: 4,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#188038",
		borderRadius: 4,
	},
	progressLegend: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 16,
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	legendDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	legendText: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
	},
	// Visit card
	visitCard: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		overflow: "hidden",
		shadowColor: "#000",
		shadowOpacity: 0.04,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
	},
	visitCardActive: {
		borderColor: "#e65100",
		shadowColor: "#e65100",
		shadowOpacity: 0.1,
	},
	statusStripe: {
		width: 5,
		flexShrink: 0,
	},
	visitContent: {
		flex: 1,
		padding: 14,
		gap: 10,
	},
	visitHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	visitOrderBadge: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
		flexShrink: 0,
	},
	visitOrderText: {
		fontFamily: "Futura",
		fontSize: 13,
		fontWeight: "bold",
		color: colors.textPrimary,
	},
	visitInfo: {
		flex: 1,
		gap: 3,
	},
	visitClient: {
		fontFamily: "Futura",
		fontSize: 14,
		fontWeight: "bold",
		color: colors.textPrimary,
	},
	visitMeta: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	visitMetaText: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
		flex: 1,
	},
	visitRight: {
		alignItems: "flex-end",
		gap: 4,
		flexShrink: 0,
	},
	statusBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
	},
	statusBadgeText: {
		fontFamily: "Futura",
		fontSize: 11,
		fontWeight: "bold",
	},
	visitTime: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
	},
	visitQuickStats: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		flexWrap: "wrap",
	},
	typePill: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 12,
	},
	typePillText: {
		fontFamily: "Futura",
		fontSize: 11,
		fontWeight: "bold",
	},
	checklistProgress: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
	},
	timeInfo: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
	},
	// Checklist
	checklistSection: {
		gap: 8,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
	},
	checklistBar: {
		height: 4,
		backgroundColor: "#f0f0f0",
		borderRadius: 2,
		overflow: "hidden",
		marginBottom: 4,
	},
	checklistFill: {
		height: "100%",
		backgroundColor: "#188038",
		borderRadius: 2,
	},
	checklistItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingVertical: 6,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 5,
		borderWidth: 2,
		borderColor: "#d0d0d0",
		justifyContent: "center",
		alignItems: "center",
		flexShrink: 0,
	},
	checkboxDone: {
		backgroundColor: "#188038",
		borderColor: "#188038",
	},
	checklistLabel: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textPrimary,
		flex: 1,
	},
	checklistLabelDone: {
		color: colors.textSecondary,
		textDecorationLine: "line-through",
	},
	actionBtns: {
		flexDirection: "row",
		gap: 10,
		marginTop: 4,
	},
	actionBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: 16,
		paddingVertical: 9,
		borderRadius: 10,
	},
	actionBtnStart: {
		backgroundColor: colors.secondary,
	},
	actionBtnDone: {
		backgroundColor: "#188038",
	},
	actionBtnSkip: {
		backgroundColor: "#fce8e6",
	},
	actionBtnText: {
		fontFamily: "Futura",
		fontSize: 13,
		fontWeight: "bold",
		color: "#fff",
	},
});
